import os
import pymongo
from db import db as db_module
from pprint import pprint
import requests
import re

db_name = 'filings'

db_client = db_module().client
db = db_client[db_name]

year_range = [1996, 2019] # inclusive
quarter_range = [1, 4]    # inclusive

root_dir_re   = re.compile(r'^Cloud HTTP:\s+([^\s]+)$')
line_entry_re = re.compile('^' + r'\|'.join([r'([^\|]+)']*5) + '$')

# process 13f holdings report
def process_form_13f_hr(data):
  print(data)

# process form with type
def process_form(form_type, data):
  if form_type == '13F-HR':
    process_form_13f_hr(data)

# process an entry for a form
def process_entry(entry, root_dir):
  cik = str(entry[0]).strip().zfill(10) # make 10 digit cik
  company_name = str(entry[1]).strip()
  form_type = str(entry[2]).strip()
  date_filed = str(entry[3]).strip()
  filename = str(entry[4]).strip()

  form_url = root_dir + filename

  # distinguish 13F 'HR' (holdings report) from 'NT' (notice)
  if form_type[0:6] == '13F-HR':
    print(f'{company_name} ({cik}): 13F (holdings report) located at {form_url}')
    
    # download form
    response = requests.get(form_url)
    data = response.text

    # process the form
    process_form('13F-HR', data)

# for each year and quarter, process master indices
for year in range(year_range[0], year_range[1] + 1):
  for quarter in range(quarter_range[0], quarter_range[1] + 1):
    print(year, quarter)
    target_url = f'https://www.sec.gov/Archives/edgar/full-index/{year}/QTR{quarter}/master.idx'
    response = requests.get(target_url)
    data = response.text

    line_entry_matched = False
    root_dir = None

    # for any single master.idx :
    for line in iter(data.splitlines()):
      line_entry = line_entry_re.match(line)

      # match index entries
      if line_entry and line_entry_matched:
        entry = line_entry.group(1, 2, 3, 4, 5)
        process_entry(entry, root_dir)

      # ignore column headings for entries
      elif line_entry:
        line_entry_matched = True

      # extract root directory from master index
      else:
        root_dir_match = root_dir_re.match(line)
        if root_dir_match:
          root_dir = root_dir_match.group(1)
