import os
import pandas as pd
from pprint import pprint
import pymongo
import re
from db import db as db_module

db_name = 'filings'
data_directory = '../../data/13flists/'

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

warning_message = str(input('WARNING: This script uses data that has been pre-processed and stored in the project data directory.  PLEASE DOUBLE-CHECK BEFORE RUNNING THIS SCRIPT!\n\nType YES (case-sensitive) to continue running the script: ')).strip()

if warning_message != 'YES':
  print('\nScript aborted.')
else:
  for ddir in sorted(os.listdir(data_directory)):
    year_re = re.compile('[0-9]{4}');
    if year_re.match(ddir):
      year = ddir

      for qtr in sorted(os.listdir(data_directory+ddir)):
        csv_path = data_directory+year+'/'+qtr+'/13flist'+year+qtr+'.csv'
        df = pd.read_csv(csv_path, na_values='')

        # progress
        print(f'Working on {year}{qtr} ...')

        for idx, row in df.iterrows():
          status = str(row['status']).strip().lower()
          status = 'none' if status != 'deleted' and status != 'added' else status

          # only insert deltas after 2003q4 (for now)
          if status != 'none' or (int(year) == 2003 and int(qtr[1]) == 4):
            cusip = ''.join(str(row['cusip']).split())
            options = True if str(row['options']).strip() == '*' else False
            gc = int(cusip[8])
            issuer = str(row['issuer']).strip()
            description = str(row['description']).strip()

            obj = {
              'year': int(year),
              'quarter': int(qtr[1]),
              'cusip6': cusip[0:6],
              'cusip8': cusip[0:8],
              'cusip9': cusip[0:9],
              'issue': cusip[6:8],
              'has_options': options,
              'issuer': issuer,
              'description': description,
              'status': status,
              'given_checksum': gc,
              'computed_checksum': cusip_checksum(cusip[0:8]),
            }

            securities_search = db.securities.find({
              'cusip9': obj['cusip9'],
            })

            # delta checks: is this a valid insertion?
            latest_year = 0
            latest_quarter = 0
            latest_status = 0
            duplicate = False

            for security in securities_search:
              obj2 = {
                'year': security['year'],
                'quarter': security['quarter'],
                'cusip6': security['cusip6'],
                'cusip8': security['cusip8'],
                'cusip9': security['cusip9'],
                'issue': security['issue'],
                'has_options': security['has_options'],
                'issuer': security['issuer'],
                'description': security['description'],
                'status': security['status'],
                'given_checksum': security['given_checksum'],
                'computed_checksum': security['computed_checksum'],
              }
              
              if obj == obj2:
                duplicate = True
                break
              if security['year'] > latest_year:
                latest_year = security['year']
                latest_quarter = security['quarter']
                latest_status = security['status']
              elif security['year'] == latest_year:
                if security['quarter'] > latest_quarter:
                  latest_quarter = security['quarter']
                  latest_status = security['status']
                elif security['quarter'] == latest_quarter:
                  latest_status = security['status']

            # do not insert duplicate records
            if duplicate:
              continue
            
            if obj['year'] > latest_year and (obj['status'] == 'deleted' and latest_status != 'deleted' or obj['status'] == 'added' and latest_status == 'deleted' or latest_status == 0):
              db.securities.insert_one(obj)
            elif obj['year'] == latest_year:
              if obj['quarter'] > latest_quarter and (obj['status'] == 'deleted' and latest_status != 'deleted' or obj['status'] == 'added' and latest_status == 'deleted'):
                db.securities.insert_one(obj)
              elif obj['quarter'] == latest_quarter and (obj['status'] == 'deleted' and latest_status == 'added' or obj['status'] == 'added' and latest_status == 'deleted'):
                db.securities.insert_one(obj)
