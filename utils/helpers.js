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
            const desc = description?.toLowerCase();
            const bool = desc?.includes(vendor);
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

module.exports = {
    processTag, 
    dateHandler, 
    pathBuilder,
}