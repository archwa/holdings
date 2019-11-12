# 13F Lists

Within this directory are CSV-formatted 13F lists, which list SEC-sanctioned securities per quarter.

Sub-directories are given as year, then quarter (ex. `2019/q3/13flist2019q3.csv`).  Using these lists, reliable issuer-to-CUSIP(6|8|9) mappings can be derived.

*NOTE: In this context, by "security" we mean any type/class of a particular security, and NOT an instance or position of such a security.*

## Method of extraction

1. Lists in PDF format are accessed from the [Official List of Section 13(f) Securities](https://www.sec.gov/divisions/investment/13flists.htm) on https://www.sec.gov.
2. Data is extracted and formatted using [Tabula](https://github.com/tabulapdf/tabula).

## Notes

When using Tabula, I've found that the best way to group the tables is to always include field names in the selection.
The field names can be removed at a later time.
Field names should be added to the first line of the CSVs to indicate meaning of the data listed.

---

Tabula sometimes incorrectly groups the `Issuer Description` and `Status` fields into one single field.
To fix this, make sure that the number of commas in each CSV entry is equal to the number of fields minus 1.
If this is not the case, we know that the number of commas is less than the number of fields minus 1.
**Solution:** Place a comma between any whitespace and words "DELETED" or "ADDED".
If there is no word "DELETED" or "ADDED", simply append a comma to the 

---

To preprocess the CSV files, remove leading and trailing whitespace from every entry.

---

It seems that PDF data from before 2004 does not offer text-defined CUSIPs, meaning that the CUSIPs cannot be extracted easily from the PDF using Tabula.
The earliest we can go is 2003q4, after applying deltas specified in 2004q1. (All non-"ADDED" entries indicate the previous quarter.)
In order to get the CUSIPs before 2004, either OCR or manual data entry is necessary.  Both are painful.
