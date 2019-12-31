from db import db as db_module
from pprint import pprint
from datetime import datetime
from dateutil.parser import parse as parse_date
from io import StringIO
import pandas as pd
import pytz
import json
import urllib.request
import re
from tqdm import tqdm

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]


market_category_map = {
  'Q': 'NASDAQ Global Select Market',
  'G': 'NASDAQ Global Market',
  'S': 'NASDAQ Capital Market',
  '': None
}

financial_status_map = {
  'D': 'Deficient',
  'E': 'Delinquent',
  'Q': 'Bankrupt',
  'N': 'Normal',
  'G': 'Deficient and Bankrupt',
  'H': 'Deficient and Delinquent',
  'J': 'Delinquent and Bankrupt',
  'K': 'Deficient, Delinquent, and Bankrupt',
  '': None
}

exchange_map = {
  'A': 'NYSE MKT',
  'N': 'New York Stock Exchange (NYSE)',
  'P': 'NYSE ARCA',
  'Z': 'BATS Global Markets (BATS)',
  'V': 'Investors\' Exchange, LLC (IEXG)',
  '': None
}

etf_map = {
  'Y': True,
  'N': False,
  '': None
}

def process_nasdaq_other_listed_ticker_csv():
  nasdaq_other_listed_ticker_csv_url = 'ftp://ftp.nasdaqtrader.com/symboldirectory/otherlisted.txt'
  req = urllib.request.Request(nasdaq_other_listed_ticker_csv_url)
  with urllib.request.urlopen(req) as response:
    data = response.read().decode("utf-8")
    data_stream = StringIO(data)

  print('Processing NASDAQ other-listed ticker data ...')
  
  df = pd.read_csv(data_stream, sep="|")
  df = df.fillna('')

  for index, row in tqdm(df[:-1].iterrows(), total=df[:-1].shape[0]):
    obj = {
      'symbol': row['ACT Symbol'].strip().upper(),
      'name': row['Security Name'],
      'exchange': exchange_map[row['Exchange']],
      'etf': etf_map[row['ETF']],
    }

    symbol_search = db.symbols.find_one({ 'symbol': obj['symbol'] })

    if not symbol_search:
      symbol_query = {
        '$set': {
          'symbol': obj['symbol'],
          'names': [ obj['name'] ],
          'exchange': obj['exchange'],
          'is_etf': obj['etf']
        },
        '$currentDate': {
          'created_at': { '$type': 'date' },
          'updated_at': { '$type': 'date' },
        },
      }
      db.symbols.update_one({ 'symbol': obj['symbol'] }, symbol_query, upsert=True)

    else:
      names = symbol_search.get('names', [])

      if obj['name'] not in names:
        names.append(obj['name']) # add new name
        new_names = sorted(names)
        update_new_names_query = {
          '$set': { 
            'names': new_names,
            'exchange': obj['exchange'],
            'is_etf': obj['etf']
          },
          '$currentDate': {
            'updated_at': { '$type': 'date' },
          },
        }

        db.symbols.update_one({ 'symbol': obj['symbol'] }, update_new_names_query)

  print('All done!')



def process_nasdaq_self_listed_ticker_csv():
  nasdaq_self_listed_ticker_csv_url = 'ftp://ftp.nasdaqtrader.com/symboldirectory/nasdaqlisted.txt'
  req = urllib.request.Request(nasdaq_self_listed_ticker_csv_url)
  with urllib.request.urlopen(req) as response:
    data = response.read().decode("utf-8")
    data_stream = StringIO(data)

  print('Processing NASDAQ self-listed ticker data ...')
  
  df = pd.read_csv(data_stream, sep="|")
  df = df.fillna('')

  for index, row in tqdm(df[:-1].iterrows(), total=df[:-1].shape[0]):
    obj = {
      'symbol': row['Symbol'].strip().upper(),
      'name': row['Security Name'],
      'exchange': 'NASDAQ',
      'market_category': market_category_map[row['Market Category']],
      'financial_status': financial_status_map[row['Financial Status']],
      'etf': etf_map[row['ETF']],
    }

    symbol_search = db.symbols.find_one({ 'symbol': obj['symbol'] })

    if not symbol_search:
      symbol_query = {
        '$set': {
          'symbol': obj['symbol'],
          'names': [ obj['name'] ],
          'exchange': obj['exchange'],
          'market_category': obj['market_category'],
          'financial_status': obj['financial_status'],
          'is_etf': obj['etf']
        },
        '$currentDate': {
          'created_at': { '$type': 'date' },
          'updated_at': { '$type': 'date' },
        },
      }
      db.symbols.update_one({ 'symbol': obj['symbol'] }, symbol_query, upsert=True)

    else:
      names = symbol_search.get('names', [])

      if obj['name'] not in names:
        names.append(obj['name']) # add new name
        new_names = sorted(names)
        update_new_names_query = {
          '$set': { 
            'names': new_names,
            'exchange': obj['exchange'],
            'market_category': obj['market_category'],
            'financial_status': obj['financial_status'],
            'is_etf': obj['etf']
          },
          '$currentDate': {
            'updated_at': { '$type': 'date' },
          },
        }

        db.symbols.update_one({ 'symbol': obj['symbol'] }, update_new_names_query)

  print('All done!')
