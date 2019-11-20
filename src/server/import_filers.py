import os
from db import db as db_module
import pandas as pd
from pprint import pprint
from copy import deepcopy
import pymongo
import requests
import re
from tqdm import tqdm

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]

filer_re = re.compile(r'^([^:]+):([0-9]{10}):')

cik_lookup_data_url = 'https://www.sec.gov/Archives/edgar/cik-lookup-data.txt'

# download filer data 
response = requests.get(cik_lookup_data_url)
data = response.text

match_count = 0
no_matches = []

all_lines = data.splitlines()

# process each line in the filer data
with tqdm(total=len(all_lines)) as pbar:
  for line in iter(all_lines):
    pbar.update(1)
    filer_entry = filer_re.match(line)

    if filer_entry:
      match_count += 1
      conformed_name = re.sub(' +', ' ', filer_entry.group(1)).strip()
      cik = re.sub(' +', ' ', filer_entry.group(2)).strip()

      filer_search = db.filers.find_one({ 'cik': cik })

      if filer_search:
        names = deepcopy(filer_search['names'])

        if conformed_name not in names:
          names.append(conformed_name) # add new name
          new_names = sorted(names)
          update_new_names_query = { '$set': { 'names': new_names } }
          pprint(new_names)

          db.filers.update_one({ 'cik': cik }, update_new_names_query)

      else:
        # if we can't find the document, create a new one
        filer = {
          'cik': cik,
          'names': [ conformed_name ]
        }
        pprint(filer)

        db.filers.insert_one(filer)

    # otherwise, no match
    else:
      no_matches.append(line)


# sanity check
if len(all_lines) == match_count:
  print('Success! Imported all filers.')
else:
  print(f'Something\'s not right ... len(all_lines) {len(all_lines)} != match_count {match_count}')
  print('See below for offending lines:')
  for line in no_matches:
    pprint(line)
