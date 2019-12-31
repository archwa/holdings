import sys
import pymongo
from db import db as db_module
from import_sec_symbols import check_and_update_sec_ticker_text, check_and_update_sec_company_ticker_json
from import_nasdaq_symbols import process_nasdaq_self_listed_ticker_csv, process_nasdaq_other_listed_ticker_csv
from import_new_holdings import update_holdings_data
from datetime import datetime, timedelta
from dateutil.parser import parse
import pytz
import re

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]

def run_db_update():
  filings_metadata = db.metadata.find_one({})
  filings_last_modified = filings_metadata['updated_at']
  current_date = datetime.utcnow().replace(tzinfo=pytz.UTC)

  if current_date > (filings_last_modified + timedelta(hours=18)).replace(tzinfo=pytz.UTC):
    # update SEC ticker data
    check_and_update_sec_ticker_text(filings_metadata)
    check_and_update_sec_company_ticker_json(filings_metadata)

    # update NASDAQ ticker data (occurs no matter what)
    process_nasdaq_self_listed_ticker_csv()
    process_nasdaq_other_listed_ticker_csv()

    # update holdings data
    update_holdings_data(filings_metadata)

  else:
    print('No update necessary.  Last updated less than 18 hours ago.')
