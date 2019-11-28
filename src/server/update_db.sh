#!/bin/bash

# TODO : implement logging

# load environment
source ~/holdings/activate #place exact path for cron
export PYTHON=python3
export PYTHONPATH=..

# import symbols (SEC, NASDAQ)
$PYTHON data_utils/import_sec_symbols.py
$PYTHON data_utils/import_nasdaq_symbols.py

# import securities
$PYTHON data_utils/import_securities.py

# import holdings
$PYTHON data_utils/import_holdings.py
