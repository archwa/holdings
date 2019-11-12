#!/bin/bash

YR_START=1996
YR_CUR=`date +"%Y"`
QTR_CUR=$(((`date +%-m`-1)/3+1))

for I in `seq ${YR_START} ${YR_CUR}`; do
  for J in `seq 1 4`; do
    if [ ${I} -ne ${YR_CUR} ] || [ ${J} -ne ${QTR_CUR} ]; then
      echo "Creating directory ${I}/q${J} (if none exists) ..."
      mkdir -p ${I}/q${J}
      echo "Downloading \"https://www.sec.gov/divisions/investment/13f/13flist${I}q${J}.pdf\" to \"${I}/q${J}/13flist${I}q${J}.pdf\" ..."
      curl -o "${I}/q${J}/13flist${I}q${J}.pdf" "https://www.sec.gov/divisions/investment/13f/13flist${I}q${J}.pdf"
      printf "\n"
    fi
  done
done
