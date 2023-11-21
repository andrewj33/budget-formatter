const { getTags } = require("./tags");
const tagList = getTags();
const monthNames = ["January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

function pathBuilder(accountType, date) {
    if(accountType === "capitalOne") {
        return `2022-${date}_transaction_download.csv`;
    } else if(accountType === "veridian") {
        return "ExportedTransactions.csv";
    }
}

function processTag(description) {
    for(category of tagList) {
        for(vendor of category.desc) {
            let desc = description?.toLowerCase();
            let bool = desc?.includes(vendor);
            if(bool){
                return category.tag;
            }
        };
    };
    return 'misc';
}

function dateHandler(str, type) {
    const delimiter = type === 'capitalone' ? '-' : '/';
    const monthIndex = type === 'capitalone' ? 1 : 0;
    const monthNum = Number(str.split(delimiter)[monthIndex]) - 1;
    const result = monthNames[monthNum];
    return result;
}

/**
 * Adds existing file data to newly processed file data
 * then creates a set to remove duplicates,
 */ 
function duplicatesHandler (data1, data2) {
    return Array.from(new Set((data1 + '\n' + data2).split('\n'))).join('\n');
}

module.exports = {
    processTag, 
    dateHandler, 
    duplicatesHandler,
    pathBuilder,
}