from pprint import pprint
from tqdm import tqdm
from datetime import datetime
import re
MASTER = {
  '0003248780': {
    '083982372': {
      '2016': {
        '4': 'yes'
      },
      '2017': {
        '1': 'yes',
        '2': 'yes',
        '3': 'yes',
        '4': 'yes'
      },
      '2018': {
        '1': 'test',
        '3': 'oh',
        '4': 'oh'
      }
    },
    '293812354': {
      '2005': {
        '3': 'test',
        '4': 'test'
      },
      '2006': {
        '1': 'test',
        '2': 'test'
      }
    }
  },
  
  '0318392100': {
    '838292849': {
      '2007': {
        '1': 'yes',
        '2': 'yes',
        '3': 'yes',
        '4': 'yes'
      }
    }
  }

}

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


def act():
  print('Uploading all holding data ...')
  # process MASTER (has all data in it)
  for cik, cusip_object in tqdm(MASTER.items(), position=0):
    for cusip, year_object in tqdm(cusip_object.items(), position=1):
      periods_held = []

      for year, quarter_object in year_object.items():
        year = int(year)
        for quarter, data in quarter_object.items():
          quarter = int(quarter)

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
              'filer_names': { data },
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
                periods_held[i]['filer_names'] = set.union(periods_held[i]['filer_names'], { data })
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
                'filer_names': { data },
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


act()
