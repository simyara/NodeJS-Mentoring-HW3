let stream = require('./utils/streams.js').default;

function getValue(flag) {
    const index = process.argv.indexOf(flag);
    return (index > -1) ? process.argv[index + 1] : null;
}

function getValueByIndex(flag, index) {
    const indx = process.argv.indexOf(flag);
    return (indx === index + 1) ? process.argv[indx + 1] : null;
}

function isHelpNeed() {
    const index = (process.argv.indexOf('--help') > -1) ? process.argv.indexOf('--help') : process.argv.indexOf('-h');
    console.log('help' + ' ' +index);
    return (index === 2) ? true : false;
}

const actionNameArg = 1;
const fileNameArg = 3;

let actionName = getValueByIndex('--action', actionNameArg) || getValueByIndex('-a', actionNameArg);
let fileName = getValueByIndex('--file', fileNameArg) || getValueByIndex('-f', fileNameArg);
let filePath = `${__dirname}/data/${fileName}`;
let helpFlag = isHelpNeed();

console.log('Params:');
console.log('Action name: ' + actionName);
console.log('File name: ' + fileName);
console.log('Is Help: ' + helpFlag);

if (actionName && stream.hasOwnProperty(actionName)){
    stream[actionName](filePath);
}




