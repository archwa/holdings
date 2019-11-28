import env
from pprint import pprint
from db import db as db_module
import pymongo

db_client = db_module().client
db = db_client[env.vars['FILINGS_DB']]
