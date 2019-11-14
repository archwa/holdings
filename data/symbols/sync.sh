#!/bin/sh

printf "Synchronizing listed symbols data ...\n"

printf "\nDownloading http://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs to spec.html ...\n"
curl -o 'spec.html' 'http://www.nasdaqtrader.com/trader.aspx?id=symboldirdefs'

printf "\nDownloading ftp://ftp.nasdaqtrader.com/symboldirectory/nasdaqlisted.txt to nasdaq.txt ...\n"
curl -o 'nasdaq.txt' 'ftp://ftp.nasdaqtrader.com/symboldirectory/nasdaqlisted.txt'

printf "\nDownloading ftp://ftp.nasdaqtrader.com/symboldirectory/otherlisted.txt to other.txt ...\n"
curl -o 'other.txt' 'ftp://ftp.nasdaqtrader.com/symboldirectory/otherlisted.txt'
