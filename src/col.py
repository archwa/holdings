import pymongo
from db import db
from pprint import pprint

client = db().client
test_db = client['test']

# print collections in test_db
print('Collections in `test` db :')
col_names = test_db.list_collection_names()

pprint(col_names)

for name in col_names:
  print('\n\n> Collection name: {}'.format(name))
  if name == 'periods':
    doc_cursor = test_db[name].find().sort('quarters', pymongo.DESCENDING) .limit(5)
  else:
    doc_cursor = test_db[name].find().limit(5)
    
  print('> Doc examples (limit 5):')
  for doc in doc_cursor:
    pprint(doc)

doc_cursor = test_db['periods'].find({ 'cusip': '478160104' }).sort('quarters', pymongo.DESCENDING).limit(5)
for doc in doc_cursor:
  pprint(doc)
