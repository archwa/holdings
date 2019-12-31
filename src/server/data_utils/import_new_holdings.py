import sys
import pymongo
from db import db as db_module
from import_sec_symbols import check_and_update_sec_ticker_text, check_and_update_sec_company_ticker_json
from import_nasdaq_symbols import process_nasdaq_self_listed_ticker_csv, process_nasdaq_other_listed_ticker_csv
from pprint import pprint
from datetime import datetime, timedelta
from dateutil.parser import parse
import pytz
import requests
import re
from tqdm import tqdm

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]

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

# process 13f holdings report
def process_form_13f_hr(options):
  data, headers, metadata = options.values()

  amendment = metadata['amendment']

  # step one: orient ourselves
  lines = data.splitlines()

  cusip_re = re.compile(r'.*([0-9]{3}[a-zA-Z0-9]{2}[a-zA-Z0-9*@#]{3}[0-9]?).*')
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

  for line in lines:
    period_match = period_re.match(line)
    cusip_match = cusip_re.match(line)

    if period_match:
      date = period_match.group(1)
      year = int(date[0:4])
      quarter = (int(date[4:6]) - 1) // 3 + 1

    if cusip_match:
      cusip_text = cusip_match.group(1)
      cusip_text = cusip_text.ljust(9, '0').upper() # make 9 digit cusip

      ent = {
        'cik': cik,
        'cusip6': cusip_text[0:6],
      }

      existing_holdings = db.holdings.find(ent)

      found = 0
      updated = False
      cur_q = { 'year': year, 'quarter': quarter }

      for holding in existing_holdings:
        # increment number of documents found
        found += 1

        min_q = pick_quarter('min', holding['from'], cur_q)
        max_q = pick_quarter('max', holding['to'], cur_q)

        # if year/quarter is within an existing date range, do nothing and exit loop
        if min_q == holding['from'] and max_q == holding['to']:
          break

        # if adjacent and outside of range, update holding in db
        elif quarters_are_adjacent(holding['from'], cur_q):
          update_query = { '$set': { 'from': cur_q, 'ownership_length': holding['ownership_length'] + 1 } }
          print('Updating holding data')
          pprint(holding)
          print('as:')
          pprint(update_query)
          db.holdings.find_one_and_update(holding, update_query)
          updated = True
          break

        # if adjacent and outside of range, update holding in db
        elif quarters_are_adjacent(holding['to'], cur_q):
          update_query = { '$set': { 'to': cur_q, 'ownership_length': holding['ownership_length'] + 1 } }
          print('Updating holding data')
          pprint(holding)
          print('as:')
          pprint(update_query)
          db.holdings.find_one_and_update(holding, update_query)
          updated = True
          break

      if not found or not updated:
        # insert holding info
        holding = {
          'cik': cik,
          'cusip6': cusip_text[0:6],
          'cusip9': cusip_text[0:9],
          'ownership_length': 1,
          'to': cur_q,
          'from': cur_q,
        }

        print('Inserting holding data:')
        pprint(holding)
        db.holdings.insert_one(holding)

# process form with type
def process_form(form_type, options):
  if form_type == '13F-HR':
    process_form_13f_hr(options)

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

def process_index_holdings_at_url(url):
  print(f'Checking filings listed at {url} ...')
  response = requests.get(url)
  data = response.text
  
  # exit early if status not OK
  if response.status_code != 200:
    return

  #root_dir_re   = re.compile(r'^Cloud HTTP:\s+([^\s]+)$')
  line_entry_re = re.compile('^' + r'\|'.join([r'([^\|]+)']*5) + '$')
  
  line_entry_matched = False
  root_dir = 'https://www.sec.gov/Archives/'

  lines = []

  # for any single index, get relevant lines
  for line in iter(data.splitlines()):
    line_entry = line_entry_re.match(line)

    # match index entries
    if line_entry and line_entry_matched:
      lines.append(line)

    # ignore column headings for entries
    elif line_entry:
      line_entry_matched = True

    # extract root directory from master index
    #else:
    #  root_dir_match = root_dir_re.match(line)
    #  if root_dir_match:
    #    root_dir = root_dir_match.group(1)

  # for progress
  for line in tqdm(lines):
    line_entry = line_entry_re.match(line)

    entry = line_entry.group(1, 2, 3, 4, 5)
    process_entry(entry, root_dir)
  

def create_weekday_list(start, end):
  delta = end - start
  days = delta.days

  date_list = [ end - timedelta(days=d) for d in reversed(range(days)) ]
  weekday_list = list(filter((lambda d: d.isoweekday() in range(1, 6)), date_list))

  return weekday_list

# check daily index for every week day from date of last update up until the current date
def update_holdings_data(metadata):
  holdings_last_modified = metadata['data_sources'].get('13f_daily_index', {}).get('lastModified')
  current_date = datetime.utcnow().replace(tzinfo=pytz.UTC)

  if not holdings_last_modified:
    # check for today only
    date_str = current_date.strftime('%Y%m%d')
    year = current_date.year
    quarter = int(current_date.month - 1) // 3 + 1
    url = f"https://www.sec.gov/Archives/edgar/daily-index/{year}/QTR{quarter}/master.{date_str}.idx"
    process_index_holdings_at_url(url)

    # update holdings last modified date
    db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
      '$set': { 'data_sources.13f_daily_index.lastModified': current_date },
      '$currentDate': {
        'updated_at': { '$type': 'date' },
      },
    })

  elif current_date > (holdings_last_modified + timedelta(hours=18)).replace(tzinfo=pytz.UTC):
    # create a list of all weekdays strings
    start = holdings_last_modified.replace(tzinfo=pytz.UTC)
    end = current_date
    weekday_list = create_weekday_list(start, end)

    for day in weekday_list:
      date_str = day.strftime('%Y%m%d')
      year = day.year
      quarter = int(day.month - 1) // 3 + 1
      url = f"https://www.sec.gov/Archives/edgar/daily-index/{year}/QTR{quarter}/master.{date_str}.idx"
      process_index_holdings_at_url(url)

    # update holdings last modified date
    db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
      '$set': { 'data_sources.13f_daily_index.lastModified': current_date },
      '$currentDate': {
        'updated_at': { '$type': 'date' },
      },
    })

  # else, do nothing
