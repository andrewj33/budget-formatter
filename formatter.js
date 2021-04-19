/**
 * Directions:
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
const moment = require('moment');
moment().format();


const tags = [
    {tag: 'Deposit', desc: ['spotix', 'deposit']},
    {tag: 'Rent', desc: ['ronald']},
    {tag: 'Electric Util', desc: ['alliant']},
    {tag: 'Gas Util', desc: ['midamerican']},
    {tag: 'Water Util', desc: ['city of cedar']},
    {tag: 'Internet', desc: ['mediacom']},
    {tag: 'Phone', desc: ['verizon']},
    {tag: 'Credit Card', desc: ['capital one']},
    {tag: 'Gasoline', desc: ['caseys','kum & go', 'kum&go', 'pilot']},
    {tag: 'Groceries', desc: ['aldi', 'hyvee', 'hy-vee', 'hy vee']},
    {tag: 'Merchandise', desc: ['walmart', 'wal-mart', 'target', 'amazon']},
    {
        tag: 'Restaurant',
        desc: [
            'breakfast house',
            'wig & pen',
            'long xing',
            'saucy fococcia',
            'tin roost'
        ]
    },
    {
        tag: 'Fast Food', 
        desc: [
            'mcdonald',
            'starbucks',
            'taco bell',
            'culvers',
            'dairy queen',
            'dominos',
            'jimmy johns',
            'pancheros',
            'chicagogrill',
            'chicago grill',
            'subway',
            'popeyes',
            'hardees'
        ]
    },
    {
        tag: 'Video Games',
        desc: ['mihoyo', 'niantic']
    }
]

if (process.argv.length <= 2)
{
  console.error('You must enter a file name.');
  process.exit(1);
}

// filepath provided in commandline 
const filePath = path.join(__dirname, process.argv[2]);
fs.readFile(filePath, 'utf8', (err, data) => {
    
    if(err){
        console.log(err);
        process.exit(2);
    }

    const docuArr = data.split('\n').filter(a => a.length > 0);
    const baseArr = docuArr.map(a => {
        // tests which type of file
        // transaction download files are capitalone
        // numbers-only files are linn area cu
        // LACU files have additional desc commas that
        // need to be stripped first
        if(!filePath.includes('transaction_download')) {
            // handles description commas
            let desc = a.split('"');
            if(desc[1]){
                desc[1] = desc[1].replace(/,/ig, '');
            }
            a = desc.join('');
        }
        
        // turns each line into a subarray, removes trailing
        // space after some commas
        a = a.replace(/, /ig, ',')
                .split(',');
        return a;
    });

    // Maps new array which is removes headers and empty trailing subarry, 
    // and filters all columns except for date, desc, credit, and debit
    let mapArr;
    if(!filePath.includes('transaction_download')) { // LACU formatting
        mapArr = baseArr.map((a,i) => {
            return a.filter((a,i) => i === 1 || i === 4 || i === 6 || i === 7)  
        }).splice(1, baseArr.length - 1);
    } else {                                        // CapitalOne formatting
        mapArr = baseArr.map((a,i) => { 
            return a.filter((a,i) => i === 0 || i === 3 || i === 5 || i === 6)  
        }).splice(1, baseArr.length - 1);
    }
    
    // merge credit and debit columns
    // format dates if credit card
    mapArr.forEach(b => {
        if (b[2] === ''){
            b[2] = b[3];
        }
        if (filePath.includes('transaction_download')) {
            // reformat date string
            b[0] = b[0].split('-');
            b[0] = [b[0][1], b[0][2], b[0][0]].join('/');
            // add subtag to desc
            b[1] += ' [CC]';
        }
        
    });
    
    // rebuilds the subarray structure as
    // amount, date, description
    mapArr = mapArr.map(x => {
        
        // number->toString is to strip out escape
        // chars easily
        return [
            '',                      // category tags will go here
            Number(x[2]).toFixed(2), // amount formatted goes here 
            x[0],                    // formatted date goes here
            x[1]                     // Description goes here
        ]
    });

    /**
     * Tag handling: needs to comb through descriptions,
     * set a tag for each item that matches
     */
    
    // get an array of all item descriptions, need to set
    // to lower case for easy matching.
    let itemDescList = mapArr.map(a => a[3].toLowerCase());
    
    // needs to go through each description
    itemDescList.forEach((a, i) => {
        // for each item description, it needs to comb through each
        // set of tag descriptions
        tags.forEach((b) => {
            // if a match is found via some method, the empty subarray index
            // zero is set to the tag value associated with that description 
            if(b.desc.some(c => a.includes(c))) {
                mapArr[i][0] = b.tag;
            }
        });

        // negates the credit card payment from the credit union withdrawal
        // on LACU it will be a positive number, on CO card it will be negative 
        if(!filePath.includes('transaction_download')){
            if(mapArr[i][3].toLowerCase().includes('capital one')) {
                mapArr[i][1] = '-' + mapArr[i][1];
            }
        }

        // if no tag is found, tag it as misc
        if(mapArr[i][0] === '') {
            mapArr[i][0] = 'Misc';
        }
    });

    // reset data string
    data = mapArr.join('\n');

    // create a name for the outfile based on the current month
    let outfileName = moment().format('MMMM') + '.csv'; //
    dateSortHandler(data);
    console.log("Today is " + Date.now());

    // if filename doesn't exist, create one, otherwise append data
    if(!fs.existsSync(outfileName)){
        fs.close(2, (err) => { if (err) throw err; });
        fs.writeFile(outfileName, data, (err) => {
            if (err) throw err;
            console.log("Data Written Successfully.");
        });
    } else {
        fs.close(2, (err) => { if (err) throw err; });
        fs.readFile(outfileName, 'utf8', (err, existingData) => {
            if(err){
                console.log(err);
                process.exit(2);
            }
            data = duplicatesHandler(existingData, data);
            fs.writeFile(outfileName, data, (err) => {
                if (err) throw err;
                console.log("Data Appended Successfully.");
            });
        });
    }

    function dateSortHandler(str) {
        return str.split('\n')
                  .map(x => x.split(','))
                  .sort((a,b) => moment(a[2], 'MM-DD-YYYY').valueOf() - moment(b[2], 'MM-DD-YYYY').valueOf())
                  .map(y => y.join(','))
                  .join('\n');
    }

    /**
     * Adds existing file data to newly processed file data
     * then creates a set to remove duplicates,
     */ 
    function duplicatesHandler (data1, data2) {
        let arr = Array.from(new Set((data1 + '\n' + data2).split('\n'))).join('\n');
        return (dateSortHandler(arr));

    }
});