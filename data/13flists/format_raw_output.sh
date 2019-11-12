#!/bin/sh

YR_START=2004
YR_CUR=`date +"%Y"`
QTR_CUR=$(((`date +%-m`-1)/3+1))

for I in `seq ${YR_START} ${YR_CUR}`; do
  for J in `seq 1 4`; do
    if [ ${I} != ${YR_CUR} ] || [ ${J} != ${QTR_CUR} ]; then
      # remove lines containing field info; strip carriage returns; remove last line with total count info
      # TODO : perform a check to make sure that the number of lines in the file matches the number on the final line
      sed -e '/^CUSIP NO.*$/d' -e 's/\r//' -e '$ d' raw_output/tabula-13flist${I}q${J}.csv > inter-13flist${I}q${J}.csv

      # insert line containing standardized field info
      sed -i '1s/^/cusip,options,issuer,description,status\n/' inter-13flist${I}q${J}.csv

      # insert commas on lacking lines
      cat inter-13flist${I}q${J}.csv | \
      perl -ne 's/^([^,]*,[^,]*,[^,]*,[^,]*)(ADDED|DELETED)$/\1,\2/g; print;' | \
      perl -ne 's/^([^,]*,[^,]*,[^,]*,[^,\n]*)$/\1,/; print;' > 13flist${I}q${J}.csv

      # remove intermediate output
      rm inter-13flist${I}q${J}.csv 

      # move formatted output to its corresponding directory
      mv 13flist${I}q${J}.csv ${I}/q${J}/13flist${I}q${J}.csv
    fi
  done
done
