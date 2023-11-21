#!/bin/bash
dlPath=/mnt/c/Users/third/Downloads
csvPath=/home/andrew/dev/budget-formatter/csv
files=$(ls $dlPath)


for fileName in $files; do
    if [[ $fileName == *"transaction_download"* ]]; then
        cp -r "$dlPath/$fileName" "$csvPath/capitalone.csv"
        echo "CapitalOne $fileName copied"
    fi
    if [[ $fileName == "transactions.csv" ]]; then
        cp -r "$dlPath/$fileName" "$csvPath/cme.csv"
        echo "CME $fileName copied"
    fi
    if [[ $fileName == "ExportedTransactions.csv" ]]; then
        cp -r "$dlPath/$fileName" "$csvPath/veridian.csv"
        echo "Veridian $fileName copied"
    fi
    if [[ $fileName == *"range"* ]]; then
        cp -r "$dlPath/Date range.CSV" "$csvPath/citi.csv"
        echo "Citi Date range.csv copied"
    fi
done

#   if [[ $file == *"partial_name"* ]]; then

#     mv "$file" "${file%"$partial_name"}"
#   fi