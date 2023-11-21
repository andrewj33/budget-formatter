#!/bin/bash
rm -rf /home/andrew/dev/budget-formatter/csv/results.csv;
node formatter.js $1;