#!/bin/sh

YR_START=2004
YR_CUR=`date +"%Y"`
QTR_CUR=$(((`date +%-m`-1)/3+1))

for I in `seq ${YR_START} ${YR_CUR}`; do
  for J in `seq 1 4`; do
    if [ ${I} != ${YR_CUR} ] || [ ${J} != ${QTR_CUR} ]; then
      # record claimed number of valid data points
      claimed=`tail -n1 raw_output/tabula-13flist${I}q${J}.csv | sed -E -e 's/.*([0-9]{2}),?([0-9]{3}).*/\1\2/'`

      # remove lines containing field info; strip carriage returns; remove last line with total count info
      sed -E -e '/^CUSIP NO.*$/d' -e 's/\r//' -e '$ d' raw_output/tabula-13flist${I}q${J}.csv > inter-13flist${I}q${J}.csv

      # insert line containing standardized field info
      sed -E -i '1s/^/cusip,options,issuer,description,status\n/' inter-13flist${I}q${J}.csv

      # emphasize asterisk for options
      sed -E -i 's/^([^,]{6}\s*[^,]{2}\s*[^,]{1})[ ,]{1}([*]?)\s*,?/\1,\2,/' inter-13flist${I}q${J}.csv

      # convert to space the extra comma that sometimes appears after issuer name
      sed -E -i 's/^([^,]*,[^,]*,[^,]*),([^,]*,)([^,]*,[^,]*)$/\1 \2\3/' inter-13flist${I}q${J}.csv
      
      # remove incorrect whitespace after first letter of ADDED and DELETED
      sed -E -i 's/,A\s+DDED/,ADDED/' inter-13flist${I}q${J}.csv
      sed -E -i 's/,D\s+ELETED/,DELETED/' inter-13flist${I}q${J}.csv

      # insert commas on lacking lines - TODO : try to switch to just sed if possible
      cat inter-13flist${I}q${J}.csv | \
      perl -ne 's/^([^,]*,[^,]*,[^,]*,[^,]*)(ADDED|DELETED)$/\1,\2/g; print;' | \
      perl -ne 's/^([^,]*,[^,]*,[^,]*,[^,\n]*)$/\1,/; print;' > 13flist${I}q${J}.csv

      # remove intermediate output
      rm inter-13flist${I}q${J}.csv 

      # move formatted output to its corresponding directory
      mv 13flist${I}q${J}.csv ${I}/q${J}/13flist${I}q${J}.csv

      # record actual number of valid datapoints
      actual=`cat ${I}/q${J}/13flist${I}q${J}.csv | grep -v -E "^cusip,options,issuer,description,status" | grep -E "[^,]{6}\s*[^,]{2}\s*[^,]{1},[*]?,[^,]*,[^,]*,(ADDED|DELETED)?$" | wc -l`

      # store claimed number of valid datapoints
      echo $claimed > ${I}/q${J}/count

      # perform validation; display offending lines (if any)
      if [ $claimed -ne $actual ]; then
        printf "WARNING: ${I}/q${J}/13flist${I}q${J}.csv claimed $claimed != actual $actual - see offending lines:\n"
        cat ${I}/q${J}/13flist${I}q${J}.csv | \
        grep -v -E "^cusip,options,issuer,description,status" | \
        grep -n -v -E "[^,]{6}\s*[^,]{2}\s*[^,]{1},[*]?,[^,]*,[^,]*,(ADDED|DELETED)?$"
      fi
    fi
  done
done
