
function stopHere(...args) {
    args.forEach((item, i) => {
        console.log(`Arg ${1}: `, item);
    })
    process.exit(2);
}

module.exports = {
    stopHere
}