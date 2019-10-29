from pymongo import MongoClient
import env

class db:
  def __init__(self):
    __connection_string = ''.join([
      env.vars['MONGODB_PROTOCOL'],
      "://",
      env.vars['MONGODB_USER'],
      ":",
      env.vars['MONGODB_PASS'],
      "@",
      env.vars['MONGODB_HOST']
    ])
    self.client = MongoClient(__connection_string)
