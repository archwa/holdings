import pymongo
from db import db
from pprint import pprint

client = db().client
db_names = client.list_database_names()

db_excludes = ['local', 'admin']

for db_name in db_names:
  
  if db_name not in db_excludes:
    # print all collections in db_name
    print(f'Existing collections in \'{db_name}\' db:')
    col_names = client[db_name].list_collection_names()
    pprint(col_names)

    # print 5 examples for each collection
    for name in col_names:
      print(f'\n\n> Collection name: \'{name}\'')
      doc_cursor = client[db_name][name].find().limit(5)
      print('> Document examples (limit 5):')

      try:
        for doc in doc_cursor:
          pprint(doc)

      # ignore errors with exploring cursor
      except:
        pass
