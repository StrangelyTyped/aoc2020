#!/bin/sh

echo "Part 1"
cat 5.txt | tr 'FLBR' '0011' | sed -re 's/^/ibase=2;/' | bc | sort -n | tail -n 1
echo "Part 2"
cat 5.txt | tr 'FLBR' '0011' | sed -re 's/^/ibase=2;/' | bc | sort -n | awk 'p&&$1!=p+1{print p+1}{p=$1}'
