function reverse(str) {
    var reverseStr = str.split(' ').reverse().join(' ');
    if (reverseStr.length > 0) {
        process.stdout.write(`reverse data: ${reverseStr}`);
    }
}
function transform(str) {
    var through2 = require("./through2.js");

    var tr =function write(buffer,encoding, next) {
        this.push(buffer.toString().toUpperCase());
        next();
    }
    process.stdin.pipe(through(tr)).pipe(process.stdout);


}
function outputFile(filePath) { /* ... */ }
function convertFromFile(filePath) { /* ... */ }
function convertToFile(filePath) { /* ... */ }

exports.default = {
    reverse: reverse,
    transform: transform
};
