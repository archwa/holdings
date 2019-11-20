from db import db as db_module
from pprint import pprint
from datetime import datetime
from dateutil.parser import parse as parse_date
from io import StringIO
import pandas as pd
import pytz
import json
import requests
import re
from tqdm import tqdm

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]

nasdaq_self_listed_ticker_csv_url = 'ftp://ftp.nasdaqtrader.com/symboldirectory/nasdaqlisted.txt'
nasdaq_other_listed_ticker_csv_url = 'ftp://ftp.nasdaqtrader.com/symboldirectory/otherlisted.txt'

market_category_map = {
  'Q': 'NASDAQ Global Select Market',
  'G': 'NASDAQ Global Market',
  'S': 'NASDAQ Capital Market'
}

financial_status_map = {
  'D': 'Deficient',
  'E': 'Delinquent',
  'Q': 'Bankrupt',
  'N': 'Normal',
  'G': 'Deficient and Bankrupt',
  'H': 'Deficient and Delinquent',
  'J': 'Delinquent and Bankrupt',
  'K': 'Deficient, Delinquent, and Bankrupt'
}

exchange_map = {
  'A': 'NYSE MKT',
  'N': 'New York Stock Exchange (NYSE)',
  'P': 'NYSE ARCA',
  'Z': 'BATS Global Markets (BATS)',
  'V': 'Investors\' Exchange, LLC (IEXG)'
}

def process_nasdaq_self_listed_ticker_csv():
  # download NASDAQ self-listed tickers CSV file
  response = requests.get(nasdaq_self_listed_ticker_csv_url)
  data = response.text
  data_stream = StringIO(data)

  df = pd.read_csv(data_stream, sep="|")
  pprint(df)


def process_sec_ticker_text():
  # download SEC ticker file
  response = requests.get(sec_ticker_data_url)
  data = response.text

  all_lines = data.splitlines()
  no_matches = []

  print('Processing SEC ticker data ...')

  with tqdm(total=len(all_lines)) as pbar:
    for line in iter(all_lines):
      pbar.update(1)
      ticker_entry = sec_ticker_re.match(line)
      
      if ticker_entry:
        ticker_name = ticker_entry.group(1).strip().upper()
        cik = ticker_entry.group(2).zfill(10)

        ticker_search = db.symbols.find_one({ 'symbol': ticker_name })

        if not ticker_search:
          symbol_query = {
            '$set': {
              'ciks': [ cik ],
              'symbol': ticker_name,
            },
            '$currentDate': {
              'created_at': { '$type': 'date' },
              'updated_at': { '$type': 'date' },
            },
          }
          db.symbols.update_one({ 'symbol': ticker_name }, symbol_query, upsert=True)

        else:
          ciks = ticker_search.get('ciks', [])
          
          if cik not in ciks:
            ciks.append(cik)
            new_ciks = sorted(ciks)
            update_new_ciks_query = {
              '$set': { 'ciks': new_ciks },
              '$currentDate': {
                'updated_at': { '$type': 'date' }
              }
            }
          
            db.symbols.update_one({ 'symbol': ticker_name }, update_new_ciks_query)
      
      # otherwise, no match
      else:
        no_matches.append(line)

  # sanity check
  if len(no_matches):
    print(f'Some lines did not match the search.  See beow:')
    for line in no_matches:
      pprint(line)
  else:
    print('Success! Imported all SEC ticker data.')


def process_sec_company_ticker_json():
  # download SEC company ticker JSON data
  response = requests.get(sec_company_ticker_json_data_url)
  data = response.text
  data = json.loads(data)

  empty_data = []

  print('\nProcessing SEC company ticker JSON data')

  with tqdm(total=len(data.items())) as pbar:
    for key, entry in data.items():
      pbar.update(1)
      ticker_name = entry['ticker'].strip().upper()
      cik = str(entry['cik_str']).zfill(10)
      company_name = entry['title'].strip()

      # validate the above variables ...
      if ticker_name != '' or company_name != '' or entry['cik_str'] != '':
        ticker_search = db.symbols.find_one({ 'symbol': ticker_name })

        if not ticker_search:
          symbol_query = {
            '$set': {
              'ciks': [ cik ],
              'symbol': ticker_name,
              'names': [ company_name ]
            },
            '$currentDate': {
              'created_at': { '$type': 'date' },
              'updated_at': { '$type': 'date' },
            },
          }
          
          db.symbols.update_one({ 'symbol': ticker_name }, symbol_query, upsert=True)

        else:
          names = ticker_search.get('names', [])
          ciks = ticker_search.get('ciks', [])

          if company_name not in names:
            names.append(company_name) # add new name
            new_names = sorted(names)
            update_new_names_query = {
              '$set': { 'names': new_names },
              '$currentDate': {
                'updated_at': { '$type': 'date' },
              },
            }

            db.symbols.update_one({ 'symbol': ticker_name }, update_new_names_query)

          if cik not in ciks:
            ciks.append(cik)
            new_ciks = sorted(ciks)
            update_new_ciks_query = {
              '$set': { 'ciks': new_ciks },
              '$currentDate': {
                'updated_at': { '$type': 'date' }
              }
            }
          
            db.symbols.update_one({ 'symbol': ticker_name }, update_new_ciks_query)

      # at least one important variable is empty; including would be pointless
      else:
        empty_data.append(entry)

  # sanity check
  if len(no_matches):
    print(f'Some entries provided no data.  See beow:')
    for entry in empty_data:
      pprint(entry)
  else:
    print('Success! Imported all SEC company ticker JSON data.')


'''
response = requests.head(sec_ticker_data_url)
last_modified_text = response.headers['last-modified']
last_modified = parse_date(last_modified_text).replace(tzinfo=pytz.UTC)

# get metadata (data sources last updated information)
metadata = db.metadata.find_one({ 'data_sources': { '$exists': True }})
if not metadata:
  dummy_date = datetime(1970, 1, 1).replace(tzinfo=pytz.UTC)
  metadata = {
    '$set': {
      'data_sources': {
        'sec_ticker_text': {
          'lastModified': dummy_date
        },
        'sec_company_ticker_json': {
          'lastModified': dummy_date
        },
        'nasdaq_self_listed_ticker_csv': {
          'lastModified': dummy_date
        },
        'nasdaq_other_listed_ticker_csv': {
          'lastModified': dummy_date
        },
      }
    },
    '$currentDate': {
      'created_at': { '$type': 'date' },
      'updated_at': { '$type': 'date' },
    },
  }
  db.metadata.update_one({}, metadata, upsert=True)
  metadata = db.metadata.find_one({ 'data_sources': { '$exists': True }})

db_last_modified = metadata['data_sources']['sec_ticker_text']['lastModified'].replace(tzinfo=pytz.UTC)

if last_modified > db_last_modified:
  process_sec_ticker_text()
  db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
    '$set': { 'data_sources.sec_ticker_text.lastModified': last_modified },
    '$currentDate': {
      'updated_at': { '$type': 'date' },
    },
  })

response = requests.head(sec_company_ticker_json_data_url)
last_modified_text = response.headers['last-modified']
last_modified = parse_date(last_modified_text).replace(tzinfo=pytz.UTC)
db_last_modified = metadata['data_sources']['sec_company_ticker_json']['lastModified'].replace(tzinfo=pytz.UTC)

if last_modified > db_last_modified:
  process_sec_company_ticker_json()
  db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
    '$set': { 'data_sources.sec_company_ticker_json.lastModified': last_modified },
    '$currentDate': {
      'updated_at': { '$type': 'date' },
    },
  })
'''
