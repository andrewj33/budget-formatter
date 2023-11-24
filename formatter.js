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
    console.log(`Starting ${fileName}...`);
    let path = `${__dirname}/csv/${fileName}.csv`;
    let data = fs.readFileSync(path, 'utf-8');

    if(data && data.length){
        if(data.includes("NESPRESSO")) {
            data = data.replace(/USA,/gm,"USA")
        }
        if (data.includes("ONLINE PAYMENT, THANK YOU")) {
            data = data.replace(/ONLINE PAYMENT,/gm, "ONLINE PAYMENT");
        }

        data = data.toLowerCase().split('\n')
                   .filter(x => x !== '')
        data.shift()

        // processes bassed on which accountType 
        const purchaseList = (() => {
            if(fileName === 'capitalone'){
                return data.map(purchaseItem => {
                    const [ buyDate,,,description,,price, credit ] = purchaseItem.split(',');
                    const amount = Math.abs(price) || Math.abs(credit) || 0;
                    const tag = processTag(description)
                    const date = dateHandler(buyDate, fileName);
                    return [ tag, amount, date, description, fileName ];
                });
            } else if(fileName === 'veridian') {
                return data.map(purchaseItem => {
                    [ ,,buyDate,,price,,,description, ...rest ] = purchaseItem.split('","');
                    const amount = Math.abs(price);
                    const tag = processTag(description);
                    const date = dateHandler(buyDate, fileName);
                    return [ tag, amount, date, description, fileName ];
                });
            } else if(fileName === 'citi') { 
                return data.map(purchaseItem => {
                    [ ,buyDate,description,price, credit, ...rest ] = purchaseItem.split(',');
                    const amount = Math.abs(price) || Math.abs(credit) || 0;
                    const tag = processTag(description)
                    const date = dateHandler(buyDate, fileName);
                    return [ tag, amount, date, description, fileName ];
                });
            } else if(fileName === 'cme') { 
                return data.map(purchaseItem => {
                    [ ,buyDate,price,,,description, ...rest ] = purchaseItem.split(',');
                    const amount = Math.abs(price.replace(/[\(\)]/gm, ""));
                    const tag = processTag(description);
                    const date = dateHandler(buyDate, fileName);
                    return [ tag, amount, date, description, fileName ];
                });
            }
        })()

        // reset data string
        data = purchaseList.map((purchase) => purchase.join(',')).join('\n');

        // if filename doesn't exist, create one, otherwise append data
        if(!fs.existsSync(results)){
            fs.writeFileSync(results, data);
            console.log(`Done`);
        }
        else {
            const existingData = fs.readFileSync(results, 'utf-8');
            const combinedData = [existingData, data].join('\n');
            fs.writeFileSync(results, combinedData);
            console.log(`Done`);
        }
    };
}