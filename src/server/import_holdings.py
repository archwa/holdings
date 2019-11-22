import sys
import pymongo
from db import db as db_module
from pprint import pprint
from datetime import datetime
from dateutil.parser import parse
import pytz
import requests
import re
from tqdm import tqdm


MASTER = {}

db_name = 'filings'

db_client = db_module().client
db = db_client[db_name]

year_range = [2004, 2004] # inclusive
quarter_range = [1, 4]    # inclusive

root_dir_re   = re.compile(r'^Cloud HTTP:\s+([^\s]+)$')
line_entry_re = re.compile('^' + r'\|'.join([r'([^\|]+)']*5) + '$')

def cusip_checksum(cusip):
  digit_re = re.compile('[0-9]{1}')
  letter_re = re.compile('[A-Z]{1}')
  s = 0

  for i in range(0, 8):
    char = cusip[i].upper()

    if digit_re.match(char):
      v = int(char)
    elif letter_re.match(char):
      v = ord(char) - 55
    elif char == '*':
      v = 36
    elif char == '@':
      v = 37
    elif char == '#':
      v = 38

    if i & 1:
      v = v * 2
    
    s = s + v // 10 + v % 10
  return (10 - (s % 10)) % 10


###############################################################################

# process 13f holdings report
def process_form_13f_hr(options):
  data, headers, metadata = options.values()

  amendment = metadata['amendment']

  # step one: orient ourselves
  lines = data.splitlines()

  cusip_re = re.compile(r'.*([0-9]{3}[a-zA-Z0-9]{2}[a-zA-Z0-9*@#]{3}[0-9]).*')
  period_re = re.compile(r'^CONFORMED PERIOD OF REPORT:\s+([0-9]{8})')
  pdf_re = re.compile(r'^<PDF>$')
  xml_re = re.compile(r'^<XML>$')

  filer_name = metadata['filer_name']
  cik = metadata['cik']
  form_url = metadata['form_url']
  form_type = metadata['form_type']
  file_name = metadata['file_name']
  date_filed = metadata['date_filed']

  cusip_list = []
    
  year = 0
  quarter = 0

  # step two: act to findings
  for line in lines:
    period_match = period_re.match(line)
    cusip_match = cusip_re.match(line)

    if period_match:
      date = period_match.group(1)
      year = int(date[0:4])
      quarter = (int(date[4:6]) - 1) // 3 + 1

      if year > 2003:
        print(f'{year}q{quarter} :: {filer_name} ({cik}): Processing {form_type} (holdings report) ...')
        print(f' > Located at {form_url}')
      
    if year > 2003:
      if cusip_match:
        cusip_text = cusip_match.group(1)

        # ignore false positive
        if cusip_text != cik[1:]:
          '''
          gc = int(cusip_text[8])
          cusip = {
            'cusip6': cusip_text[0:6],
            'cusip8': cusip_text[0:8],
            'cusip9': cusip_text[0:9],
            'issue': cusip_text[6:8],
            'given_checksum': gc,
            'computed_checksum': cusip_checksum(cusip_text[0:8]),
          }
          '''

          # too much memory, so just use full cusip
          cusip_list.append(cusip_text[0:9])

  if year > 2003:
    # update filer info in `filers` (list of quarters 13F was filed)
    # include: filer name (add to names), create new filer if not found, add quarters the 13F was filed (remember: unique CIK)

    # does CIK exist? if not, create it
    if not MASTER.get(cik, None):
      MASTER[cik] = {}

    for cusip in cusip_list:
      if not MASTER.get(f'{cik}.{cusip}', None):
        MASTER[cik][cusip] = {
          year: {
            quarter: {
              #'form_id': file_name,
              'filer_name': filer_name,
              #'date_filed': date_filed,
            }
          }
        }

      else:
        if not MASTER.get(f'{cik}.{cusip}.{year}', None):
          MASTER[cik][cusip][year] = {
            quarter: {
              #'form_id': file_name,
              'filer_name': filer_name,
              #'date_filed': date_filed,
            }
          }

        else:
          if not MASTER.get(f'{cik}.{cusip}.{year}.{quarter}', None):
            MASTER[cik][cusip][year][quarter] = {
              #'form_id': file_name,
              'filer_name': filer_name,
              #'date_filed': date_filed,
            }
        
###############################################################################

# process form with type
def process_form(form_type, options):
  if form_type == '13F-HR':
    process_form_13f_hr(options)

# process an entry for a form
def process_entry(entry, root_dir):
  cik = str(entry[0]).strip().zfill(10) # make 10 digit cik
  company_name = str(entry[1]).strip()
  form_type = str(entry[2]).strip()
  date_filed = str(entry[3]).strip()
  file_name = str(entry[4]).strip()

  file_dir_re = re.compile(r'(.*)/([^/]+)\.(.*)')
  file_dir_match = file_dir_re.match(file_name)
  prefix, file_name, extension = file_dir_match.group(1, 2, 3)
  file_dir = prefix + '/' + file_name.replace('-', '') + '/'
  file_extension = '.' + extension

  form_url = root_dir + file_dir + file_name + file_extension

  # distinguish 13F 'HR' (holdings report) from 'NT' (notice)
  if form_type[0:6] == '13F-HR':
    amendment = len(form_type) >= 8 and form_type[6:8] == '/A'
    
    # download form
    response = requests.get(form_url)
    data = response.text
    headers = response.headers

    metadata = {
      'cik': cik,
      'filer_name': company_name,
      'form_type': form_type,
      'date_filed': parse(date_filed).replace(tzinfo=pytz.UTC),
      'form_url': form_url,
      'file_extension': file_extension,
      'file_name': file_name,
      'file_dir': file_dir,
      'root_dir': root_dir,
      'amendment': amendment # whether this 13F is an amendment
    }

    options = {
      'data': data,
      'headers': headers,
      'metadata': metadata
    }

    # process the form
    process_form('13F-HR', options)


def quarters_are_adjacent(q1, q2):
  year_dist = abs(q1['year'] - q2['year']) 
  quarter_dist = abs(q1['quarter'] - q2['quarter']) 
  
  if year_dist > 1:
    return False

  elif year_dist:
    if not quarter_dist == 3:
      return False

    case1 = q1['year'] > q2['year'] and q1['quarter'] < q2['quarter']
    case2 = q1['year'] < q2['year'] and q1['quarter'] > q2['quarter']

    return case1 or case2
    
  else:
    return not quarter_dist > 1

def pick_quarter(extreme, q1, q2):
  if extreme == 'min':
    year_diff = q2['year'] - q1['year']
    quarter_diff = q2['quarter'] - q1['quarter']

  elif extreme == 'max':
    year_diff = q1['year'] - q2['year']
    quarter_diff = q1['quarter'] - q2['quarter']

  if year_diff > 0:
    return q1

  elif year_diff < 0:
    return q2
    
  else:
    if quarter_diff > 0:
      return q1

    return q2

def calc_period_diff(q1, q2):
  start = pick_quarter('min', q1, q2)
  end = pick_quarter('max', q1, q2)

  year_diff = end['year'] - start['year']
  quarter_diff = end['quarter'] - start['quarter'] + 1
  return 4*max(0, year_diff) + quarter_diff

print('Gathering all holding data ...', file=sys.stderr)

# for each year and quarter, process master indices
for year in range(year_range[0], year_range[1] + 1):
  for quarter in range(quarter_range[0], quarter_range[1] + 1):
    if (year == 2004 and quarter > 1) or year > 2004:
      print(f'Processing filers in FULL-INDEX/{year}/QTR{quarter} ...', file=sys.stderr)
      target_url = f'https://www.sec.gov/Archives/edgar/full-index/{year}/QTR{quarter}/master.idx'
      response = requests.get(target_url)
      data = response.text

      line_entry_matched = False
      root_dir = None

      lines = []

      # for any single master.idx : get relevant lines
      for line in iter(data.splitlines()):
        line_entry = line_entry_re.match(line)

        # match index entries
        if line_entry and line_entry_matched:
          lines.append(line)

        # ignore column headings for entries
        elif line_entry:
          line_entry_matched = True

        # extract root directory from master index
        else:
          root_dir_match = root_dir_re.match(line)
          if root_dir_match:
            root_dir = root_dir_match.group(1)

      # for progress
      for line in tqdm(lines):
        line_entry = line_entry_re.match(line)

        entry = line_entry.group(1, 2, 3, 4, 5)
        process_entry(entry, root_dir)
  

#####################################################################

print('Processing all holding data for upload ...')
# process MASTER (has all data in it)
for cik, cusip_object in tqdm(MASTER.items(), position=0):
  for cusip, year_object in tqdm(cusip_object.items(), position=1):
    periods_held = []

    for year, quarter_object in year_object.items():
      for quarter, data in quarter_object.items():

        if not len(periods_held):
          periods_held = [{
            'start': {
              'year': year,
              'quarter': quarter,
            },
            'end': {
              'year': year,
              'quarter': quarter,
            },
            'filer_names': { data['filer_name'] },
          }]

        else:
          cur_qtr = {
            'year': year,
            'quarter': quarter,
          }

          inserted = False

          for i in range(len(periods_held)):
            start = periods_held[i]['start']
            end = periods_held[i]['end']

            if quarters_are_adjacent(start, cur_qtr) or quarters_are_adjacent(end, cur_qtr):
              periods_held[i]['start'] = pick_quarter('min', start, cur_qtr)
              periods_held[i]['end'] = pick_quarter('max', end, cur_qtr)
              periods_held[i]['filer_names'] = set.union(periods_held[i]['filer_names'], { data['filer_name'] })
              inserted = True
              break
          
          if not inserted:
            periods_held.append({
              'start': {
                'year': year,
                'quarter': quarter,
              },
              'end': {
                'year': year,
                'quarter': quarter,
              },
              'filer_names': { data['filer_name'] },
            })
            inserted = True

    docs = []
              
    for period in periods_held:
      ownership_length = calc_period_diff(period['start'], period['end'])

      obj = {
        'cik': cik,
        'cusip6': cusip[0:6],
        'cusip8': cusip[0:8],
        'cusip9': cusip[0:9],
        'issue': cusip[6:8],
        'given_checksum': int(cusip[8]),
        'computed_checksum': cusip_checksum(cusip[0:8]),
        'start': period['start'],
        'end': period['end'],
        'ownership_length': ownership_length,
        'filer_names': list(period['filer_names']),
        'created_at': datetime.utcnow(),
        'updated_at': datetime.utcnow(),
      }

      docs.append(obj)

  pprint(docs)

  print('Uploading holdings for CIK {cik} ...', file=sys.stderr)
  # upload docs per cik
  try:
    db.holdings.insert_many(docs, ordered=False)
  except pymongo.errors.BulkWriteError as bwe:
    pprint(bwe.details, stream=sys.stderr)
