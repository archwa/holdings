import pymongo
from db import db
from pprint import pprint

client = db().client
test_db = client['test']

# print all collections in test_db
print('Existing collections in `test` db:')
col_names = test_db.list_collection_names()
pprint(col_names)

# print 5 examples for each collection
for name in col_names:
  print('\n\n> Collection name: {}'.format(name))
  doc_cursor = test_db[name].find().limit(5)
  print('> Document examples (limit 5):')
  for doc in doc_cursor:
    pprint(doc)
