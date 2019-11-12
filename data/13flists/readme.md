# 13F Lists

Within this directory are CSV-formatted 13F lists, which list SEC-sanctioned securities per quarter.

Sub-directories are given as year, then quarter (ex. `2019/q3/13flist2019q3.csv`).  Using these lists, reliable issuer-to-CUSIP(6|8|9) mappings can be derived.

*NOTE: In this context, by "security" we mean any type/class of a particular security, and NOT an instance or position of such a security.*

## Method of extraction

1. Lists in PDF format are accessed from the [Official List of Section 13(f) Securities](https://www.sec.gov/divisions/investment/13flists.htm) on https://www.sec.gov
2. Data is extracted and formatted using [Tabula](https://github.com/tabulapdf/tabula)
