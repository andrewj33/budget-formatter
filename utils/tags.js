const tags = [
    {tag: 'Andy Salary', desc: ['alchemy']},
    {tag: 'Emerald Salary', desc: ['nationwide']},
    {tag: 'Deposits', desc: ['dividends', 'mobile deposits']},
    {tag: 'CCPayment', desc: ['capital one', 'bank of america', 'online payment', 'citi']},
    {tag: 'Rent', desc: ['murlin']},
    {tag: 'Electric Util', desc: ['amer elect pwr']},
    {tag: 'Gas Util', desc: ['columbia gas']},
    {tag: 'Water Util', desc: ['city of cedar']},
    {tag: 'Internet', desc: ['spectrum']},
    {tag: 'Phone', desc: ['verizon']},
    {tag: 'Auto Maintenance', desc: ['off campus', 'moo moo', 'autozone']},
    {tag: 'Auto Insurance', desc: ['state farm insurance']},
    {tag: 'Auto Loan', desc: ['honda']},
    {tag: 'Gasoline', desc: ['caseys','kum & go', 'kum&go', 'pilot', 'bp#', 'kwik trip', 'road ranger', 'costco gas', 'shell oil']},
    {tag: 'Student Loans', desc: ['dept education']},
    { // Health
        tag: 'Health',
        desc: [
            'clarkson', //eye care
            'red hawk', // dental Iowa
            'carroll family dental', // dental columbus
            'great clips',
        ]
    },
    { // Groceries
        tag: 'Groceries', 
        desc: [
            'aldi', 
            'hyvee', 
            'hy-vee', 
            'hy vee', 
            'wholefds', 
            'costco', 
            'nespresso', 
            'trader joe', 
            'wm supercenter',
            'cvs',
            'walgreens'
        ]
    },
    { // Merchandise
        tag: 'Merchandise', 
        desc: [
            'walmart', 
            'wal-mart', 
            'target', 
            'amazon', 
            'amzn mktp',
            'kohl\'s',
        ]
    },
    { // Fast Food
        tag: 'Fast Food', 
        desc: [
            'mcdonald',
            'starbucks',
            'taco bell',
            'culvers',
            'dairy queen',
            'domino',
            'jimmy johns',
            'pancheros',
            'subway',
            'popeyes',
            'hardees',
            'arby\'s',
            'burger king',
            'panera',
            'wendy\'s',
            'taco johns',
            'rally\'s',
            'chick\-fil\-a',
            'hunan king'
        ]
    },
    { // Restaurant
        tag: 'Restaurant',
        desc: [
            'breakfast house',
            'wig & pen',
            'long xing',
            'saucy fococcia',
            'tin roost',
            'donnelly',
            'reds alehouse',
            'red\'s alehouse',
            'pat and franny',
            'tribute',
            'basta',
            'tailgators',
            'big grove',
            'iowa river power',
            'cup and the scone',
            'texas roadhouse',
            'orchard green',
            'cedar ridge',
            'azul',
            'bendi',
            'tulipan',
            'three bites bakery',
            'high bank distillery',
            'bob evans',
            'hangovereasy',
            'acresinn',
            'forno',
            'katzingers',
            'wario',
            'the barn',
            'local cantina'
        ]
    },
    { // Gaming
        tag: 'Video Games',
        desc: [
            'mihoyo', 
            'niantic',
            'steam',
            'valve',
            'nintendo',
            'play-asia',
            'google pokemon',
            'gamestop',
            'cognosphere',
            'tcgplayer',
            'the warp gate',
            'thewarpgate',
            'daybreak',
            'cardhoarder'
        ]
    },
    { // Entertainment
        tag: 'Entertainment',
        desc: [
            'patreon',
            'youtubepremium',
            'hbomax',
            'marcus',
            'netflix',
            'prime video',
            'southwes'
        ]
    }
]

exports.getTags = () => {
    return tags;
}