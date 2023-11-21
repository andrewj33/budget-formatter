const columns = 'bcdefghijklm';

const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

[,, month, columnNum] = process.argv;

const types = [
    // "Rent", "Gas&Elec Util", "Water Util", "Internet", "Phone", "Auto Loan",
    // "Auto Insurance", "Auto Maintenance", "Gasoline", "Groceries", "Restaurant",
    // "Fast Food", "Entertainment", "Merchandise", "Supplies", "Magic", "Video Games",
    // "Misc", "Living Expenses", "Food Expenses", "Discretionary Expenses", "Salary",
    // "Deposits", "Total Spent", "Surplus/Deficit", "Account Total"
    'Gas Util', 'Electric Util',
];

// const results = month.map(type => {
    
//     const defaultFormula = `=sumifs('data feed'!C:C, 'data feed'!B:B, "${type}", 'data feed'!D:D, "${month}")`;
//     const livingExpenses = `=sum(${columns[columnNum]}2:${columns[columnNum]}7)`;
//     const foodExpenses = `=sum(${columns[columnNum]}11:${columns[columnNum]}13)`;
//     const discretionaryExpenses = `=sum(${columns[columnNum]}14:${columns[columnNum]}19)`;
//     const totalSpent = `=sum(${columns[columnNum]}2:${columns[columnNum]}19)`;
//     const surplusDeficit = `=${columns[columnNum]}23+${columns[columnNum]}24-${columns[columnNum]}25`;
//     const accountTotal = `=${month === "January" ? 0 : columns[columnNum - 1]}27+${columns[columnNum]}26`;

//     switch(type) {
//         case "Living Expenses":
//             return livingExpenses;
//         case "Food Expenses":
//             return foodExpenses;
//         case "Discretionary Expenses":
//             return discretionaryExpenses;
//         case "Total Spent":
//             return totalSpent;
//         case "Surplus/Deficit":
//             return surplusDeficit;
//         case "Account Total":
//             return accountTotal;
//         default:
//             return defaultFormula;
//     }
// }).join('\n');

//console.log(results);


const results = types.map(type => {
    return months.map((month) => {
        return `=sumifs('Data Feed'!B:B, 'Data Feed'!A:A, "${type}", 'Data Feed'!C:C, "${month}")`;
    }).join('.')
}).join('\n')
console.log('\n' + results);