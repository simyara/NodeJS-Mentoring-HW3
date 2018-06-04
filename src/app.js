let Util = require('./utils/streams.js').default;

let util = new Util();

try {
    util.performAction();
} catch (e) {
    console.log(`Failed with ${e}`);
}
