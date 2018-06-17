import Util from './utils/streams.js';

let util = new Util();

try {
    util.performAction();
} catch (e) {
    console.log(`Failed with ${e}`);
}
