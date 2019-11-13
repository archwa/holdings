#!/bin/sh

YR_START=2004
YR_CUR=`date +"%Y"`
QTR_CUR=$(((`date +%-m`-1)/3+1))

# TODO : check that CUSIP is valid (checksum)

success=true

for I in `seq ${YR_START} ${YR_CUR}`; do
  for J in `seq 1 4`; do
    if [ ${I} != ${YR_CUR} ] || [ ${J} != ${QTR_CUR} ]; then
      # load claimed number of valid datapoints
      claimed=`cat ${I}/q${J}/count`

      # record actual number of valid datapoints
      actual=`cat ${I}/q${J}/13flist${I}q${J}.csv | grep -v -E "^cusip,options,issuer,description,status" | grep -E "[^,]{6}\s*[^,]{2}\s*[^,]{1},[*]?,[^,]*,[^,]*,(ADDED|DELETED)?$" | wc -l`

      # perform validation; display offending lines (if any)
      if [ $claimed -ne $actual ]; then
        success=false
        printf "FAIL: ${I}/q${J}/13flist${I}q${J}.csv claimed $claimed != actual $actual - see offending lines:\n"
        cat ${I}/q${J}/13flist${I}q${J}.csv | \
        grep -v -E "^cusip,options,issuer,description,status" | \
        grep -n -v -E "[^,]{6}\s*[^,]{2}\s*[^,]{1},[*]?,[^,]*,[^,]*,(ADDED|DELETED)?$"
      fi
    fi
  done
done

if $success; then
  printf "\nValidation completed with SUCCESS. All files are valid.\n\n"
else
  printf "\nValidation completed with FAILURE. See above for offending files.\n\n"
fi
