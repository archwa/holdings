from db import db as db_module
from pprint import pprint
from datetime import datetime
from dateutil.parser import parse as parse_date
import pytz
import json
import requests
import re
from tqdm import tqdm

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]


def process_sec_ticker_text(url):
  # download SEC ticker file
  response = requests.get(url)
  data = response.text

  sec_ticker_re = re.compile(r'^(.+)\s+([0-9]+)')

  all_lines = data.splitlines()
  no_matches = []

  print('Processing SEC ticker text data ...')

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
    print(f'Some lines did not match the search.  See below:')
    for line in no_matches:
      pprint(line)
  else:
    print('Success! Imported all SEC ticker data.\n')


def process_sec_company_ticker_json(url):
  # download SEC company ticker JSON data
  response = requests.get(url)
  data = response.text
  data = json.loads(data)

  empty_data = []

  print('Processing SEC company ticker JSON data ...')

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
  if len(empty_data):
    print(f'Some entries provided no data.  See below:')
    for entry in empty_data:
      pprint(entry)
  else:
    print('Success! Imported all SEC company ticker JSON data.')

def check_and_update_sec_ticker_text(metadata):
  sec_ticker_text_data_url = 'https://www.sec.gov/include/ticker.txt'
  response = requests.head(sec_ticker_text_data_url)
  last_modified_text = response.headers['last-modified']
  last_modified = parse_date(last_modified_text).replace(tzinfo=pytz.UTC)
  db_last_modified = metadata['data_sources']['sec_ticker_text']['lastModified'].replace(tzinfo=pytz.UTC)

  if last_modified > db_last_modified:
    process_sec_ticker_text(sec_ticker_text_data_url)
    db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
      '$set': { 'data_sources.sec_ticker_text.lastModified': last_modified },
      '$currentDate': {
        'updated_at': { '$type': 'date' },
      },
    })
  else:
    print('Ignoring SEC ticker text data (already up to date).\n')

def check_and_update_sec_company_ticker_json(metadata):
  sec_company_ticker_json_data_url = 'https://www.sec.gov/files/company_tickers.json'
  response = requests.head(sec_company_ticker_json_data_url)
  last_modified_text = response.headers['last-modified']
  last_modified = parse_date(last_modified_text).replace(tzinfo=pytz.UTC)
  db_last_modified = metadata['data_sources']['sec_company_ticker_json']['lastModified'].replace(tzinfo=pytz.UTC)

  if last_modified > db_last_modified:
    process_sec_company_ticker_json(sec_company_ticker_json_data_url)
    db.metadata.update_one({ 'data_sources': { '$exists': True }}, {
      '$set': { 'data_sources.sec_company_ticker_json.lastModified': last_modified },
      '$currentDate': {
        'updated_at': { '$type': 'date' },
      },
    })
  else:
    print('Ignoring SEC company ticker JSON data (already up to date).\n')
