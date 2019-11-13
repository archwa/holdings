import os
import pandas as pd
from pprint import pprint
import pymongo
import re
from db import db as db_module

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
    else:
      exit()

    if i & 1:
      v = v * 2
    
    s = s + v // 10 + v % 10
  return (10 - (s % 10)) % 10

data_directory = '../../data/13flists/'

for ddir in os.listdir(data_directory):
  year_re = re.compile('[0-9]{4}');
  if year_re.match(ddir):
    year = ddir

    for qtr in os.listdir(data_directory+ddir):
      csv_path = data_directory+year+'/'+qtr+'/13flist'+year+qtr+'.csv'
      df = pd.read_csv(csv_path, na_values='')

      for idx, row in df.iterrows():
        status = str(row['status']).strip().lower()
        status = 'none' if status != 'deleted' and status != 'added' else status

        # only include updates after 2003q4
        if status != 'none' or (int(year) == 2003 and int(qtr[1]) == 4):
          cusip = ''.join(str(row['cusip']).split())
          options = True if str(row['options']).strip() == '*' else False
          gc = int(cusip[8])
          issuer = str(row['issuer']).strip()
          description = str(row['description']).strip()

          # composite, unique identifier:  year, quarter, cusip9
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

          pprint(obj)
