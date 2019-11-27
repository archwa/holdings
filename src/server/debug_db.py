from pprint import pprint
import pymongo
from db import db as db_module

db_name = 'filings'
db_client = db_module().client
db = db_client[db_name]

def search(q):
  pipeline = [
    {
      '$match': {
        '$text': { '$search': str(q) }
      }
    },
    {
      '$group': {
        '_id': '$cusip6',
        'names': {
          '$addToSet': '$issuer'
        },
      }
    },
    {
      '$addFields': {
        'cusip6': '$_id'
      }
    }
  ]

  results = db.securities.aggregate(pipeline)
  for doc in iter(results):
    pprint(doc)

metadata = {
  '$set': {
    'data_sources': {
      'sec_ticker_text': {
        'lastModified': '?'
      },
      'sec_company_ticker_json': {
        'lastModified': '?'
      },
      'nasdaq_self_listed_ticker_csv': {
        'lastModified': '?'
      },
      'nasdaq_other_listed_ticker_csv': {
        'lastModified': '?'
      },
    }
  },
  '$currentDate': {
    'created_at': { '$type': 'date' },
    'updated_at': { '$type': 'date' },
  },
}

#db.metadata.update_one({}, metadata, upsert=True)
