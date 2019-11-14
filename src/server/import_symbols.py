import os
import pymongo
import db.db as db_module
from pprint import pprint
import requests
import re

# 1. download NASDAQ symbols, then insert data after some cleaning and formatting
# 2. download other symbols, then insert data after some cleaning and formatting
# 3. somehow figure out how to map 

# see symbol look-up / directory data fields definitions at http://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs for field mappings

#curl -o 'nasdaq.txt' 'ftp://ftp.nasdaqtrader.com/symboldirectory/nasdaqlisted.txt'
#curl -o 'other.txt' 'ftp://ftp.nasdaqtrader.com/symboldirectory/otherlisted.txt'
