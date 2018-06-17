export default {
    getValue(flag) {
        const index = process.argv.indexOf(flag);
        return (index > -1) ? process.argv[index + 1] : null;
    },

    getValueByIndex(flag, index) {
        const indx = process.argv.indexOf(flag);
        return (indx === index + 1) ? process.argv[indx + 1] : null;
    },

    isHelpNeed(helpArg) {
        const index = (process.argv.indexOf('--help') > -1) ? process.argv.indexOf('--help') : process.argv.indexOf('-h');
        //console.log('help' + ' ' +index);
        return (index === helpArg + 1) ? true : false;
    }
}
