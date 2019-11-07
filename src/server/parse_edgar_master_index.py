import sys
import csv
import re

master_index_path = 'master.idx'
csv_path = 'master_index.csv'
  line_match = re.compile('')

try:
  file_in = open(master_index_path, 'r')
  file_out = open(csv_path, 'w')
except:
  print('Unexpected error: ', sys.exc_info()[0])
else:
  with open(csv_path, 'w', newline='') as csv_file:
    csv_writer = csv.writer(csv_file)

    for line in f: # handle each line in the file
      
  f.close()
