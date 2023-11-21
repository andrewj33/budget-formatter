/** Directions:
 * 
 * node formatter.js <filename>
 * 
 * 
 * 1) Read data from a file
 *      - fs.readFile()
 *      - path object
 * 2) Sanitize the that data to fit the format I want for output
 *      - turn data string into array of strings split via \n
 *      - split each array element by '"', get the middle element, remove all commas
 *      - rejoin the subarray elements 
 * 3) Process that data into a data structure that I can use to 
 *    manipulate the data
 *      - take the array of row items and split them by ',' to create a table
 * 4) Manipulate the data
 *      - reassign the credit columns to the debit columns for my preferred format
 *      - filter out all but the amount, date, and description columns
 *      - format the new array to have a third empty column for category tags
 *      - create handling to search transaction descriptions and assign a tag
 *      - rejoin every subarray element by ',', and every main array string by '\n'
 * 5) Write the data to a file
 *      - file validation and handling logic using existSync
 *      - fs.close handling for this
 *      - writeFile or appendFile depending if the file exists
 */

const { clear } = require('console');
const fs = require('fs');
const path = require('path');
const { processTag, dateHandler} = require('./utils/helpers');
const { stopHere } = require('./utils/debug');
const { nextTick } = require('process');
const filters = ['venmo', 'capital one', 'citi', 'cme'];
const results = `${__dirname}/csv/results.csv`;
const files = [
    'capitalone',
    'citi',
    'cme',
    'veridian',
]

for(let fileName of files){
    let path = `${__dirname}/csv/${fileName}.csv`
    fs.readFile(path, 'utf8', (err, data) => {

        if(err){
            console.log(err);
            process.exit(2);
        }

        if(data && data.length){
            if(data.includes("NESPRESSO")) {
                data = data.replace(/USA,/gm,"USA")
            }
            if (data.includes("ONLINE PAYMENT, THANK YOU")) {
                data = data.replace(/ONLINE PAYMENT,/gm, "ONLINE PAYMENT");
            }

            // strips first row of column headers
            data = data.split('\n')
                    .filter(a => a.length > 0)
                    .filter((_,i)=> i !== 0)
                    .filter(line => !filters.some(el => line.toLowerCase().includes(el)));

            // processes bassed on which accountType 
            const purchaseList = (() => {
                if(fileName === 'capitalone'){
                    return data.map(purchaseItem => {
                        [ buyDate,,,description,,price ] = purchaseItem.split(',');
                        let tag = processTag(description);
                        return [ tag, Math.abs(price), dateHandler(buyDate,fileName), description, fileName ];
                    });
                } else if(fileName === 'veridian') {
                    return data.map(purchaseItem => {
                        [ ,,buyDate,,price,,,description, ...rest ] = purchaseItem.split('","');
                        let tag = processTag(description);
                        return [ tag, Math.abs(price), dateHandler(buyDate,fileName), description, fileName ];
                    });
                } else if(fileName === 'citi') { 
                    return data.map(purchaseItem => {
                        [ ,buyDate,description,price, ...rest ] = purchaseItem.split(',');
                        let tag = processTag(description);
                        return [ tag, Math.abs(price), dateHandler(buyDate,fileName), description, fileName ];
                    });
                } else if(fileName === 'cme') { 
                    return data.map(purchaseItem => {
                        [ ,buyDate,price,,,description, ...rest ] = purchaseItem.split(',');
                        let tag = processTag(description);
                        let modPrice = Math.abs(price.replace(/[\)\(]/gm, ''))
                        return [ tag, modPrice, dateHandler(buyDate,fileName), description, fileName ];
                    });
                }
            })()


            // reset data string
            data = purchaseList.map((purchase) => purchase.join(',')).join('\n');

            // if filename doesn't exist, create one, otherwise append data
            if(!fs.existsSync(results)){
                // fs.close(2, (err) => { if (err) throw err; });
                fs.writeFile(results, data, (err) => {
                    if (err) throw err;
                    console.log(`Data from ${fileName} written successfully`);
                });
            }
            else {
                // fs.close(2, (err) => { if (err) throw err; });
                fs.readFile(results, 'utf8', (err, existingData) => {
                    if(err){
                        console.log(err);
                        process.exit(2);
                    }
                    data = [existingData, data].join('\n');
                    fs.writeFile(results, data, (err) => {
                        if (err) throw err;
                        console.log(`Data from ${fileName} appended successfully.`);
                    });
                });
            }
        };
    });
}