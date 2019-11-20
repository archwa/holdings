from db import db as db_module
from pprint import pprint
from datetime import datetime
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

all_lines = data.splitlines()
no_matches = []

# process each line in the filer data
with tqdm(total=len(all_lines)) as pbar:
  for line in iter(all_lines):
    pbar.update(1)
    filer_entry = filer_re.match(line)

    if filer_entry:
      conformed_name = re.sub(r'\s+', ' ', filer_entry.group(1)).strip()
      cik = re.sub(r'\s+', ' ', filer_entry.group(2)).strip()

      filer_search = db.filers.find_one({ 'cik': cik })

      if filer_search:
        names = filer_search['names']

        if conformed_name not in names:
          names.append(conformed_name) # add new name
          new_names = sorted(names)
          update_new_names_query = {
            '$set': { 'names': new_names },
            '$currentDate': {
              'updated_at': { '$type': 'date' }
            }
          }

          db.filers.update_one({ 'cik': cik }, update_new_names_query)

      else:
        # if we can't find the document, create a new one
        filer_query = {
          '$set': {
            'cik': cik,
            'names': [ conformed_name ],
          },
          '$currentDate': {
            'created_at': { '$type': 'date' },
            'updated_at': { '$type': 'date' },
          },
        }

        db.filers.update_one({ 'cik': cik }, filer_query, upsert=True)

    # otherwise, no match
    else:
      no_matches.append(line)


# sanity check
if len(no_matches):
  print(f'Some lines did not match the search.  See beow:')
  for line in no_matches:
    pprint(line)
else:
  print('Success! Imported all filers.')
