import os
import pymongo
import db.db as db_module
from pprint import pprint

db_name = 'test'

db_client = db_module().client
db = db_client[db_name]

# create data directory if none exists
os.system('mkdir -p data');

# create dictionary from master index, reading one line at a time
