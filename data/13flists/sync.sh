#!/bin/bash

YR_START=1996
YR_CUR=`date +"%Y"`
QTR_CUR=$(((`date +%-m`-1)/3+1))

for I in `seq ${YR_START} ${YR_CUR}`; do
  for J in `seq 1 4`; do
    if [ ${I} = "1997" ] && [ ${J} = "4" ]; then
      # do nothing; 1997q4 has no CUSIP list (yet)
      echo "NOTE: 13F list for 1997q4 does not exist (yet)."
      printf "\n"
    elif [ ${I} = "2004" ] && [ ${J} = "1" ]; then
      # special case; 2004q1 has a remote path that does not adhere to the pattern '.../13f/13flistYYYYqQ.pdf'
      echo "Creating directory ${I}/q${J} (if none exists) ..."
      mkdir -p ${I}/q${J}
      echo "Downloading \"https://www.sec.gov/divisions/investment/13f-list.pdf\" to \"${I}/q${J}/13flist${I}q${J}.pdf\" ..."
      curl -o "${I}/q${J}/13flist${I}q${J}.pdf" "https://www.sec.gov/divisions/investment/13f-list.pdf"
      printf "\n"
    elif [ ${I} != ${YR_CUR} ] || [ ${J} != ${QTR_CUR} ]; then
      echo "Creating directory ${I}/q${J} (if none exists) ..."
      mkdir -p ${I}/q${J}
      echo "Downloading \"https://www.sec.gov/divisions/investment/13f/13flist${I}q${J}.pdf\" to \"${I}/q${J}/13flist${I}q${J}.pdf\" ..."
      curl -o "${I}/q${J}/13flist${I}q${J}.pdf" "https://www.sec.gov/divisions/investment/13f/13flist${I}q${J}.pdf"
      printf "\n"
    fi
  done
done
