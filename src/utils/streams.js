function reverse() {
    process.stdin.setEncoding('utf8');

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            var reverseStr = chunk.toString().split(' ').reverse().join(' ');
            if (reverseStr.length > 0) {
                process.stdout.write(`reverse data: ${reverseStr}`);
            }
        }
    });

    process.stdin.on('end', () => {
        process.stdout.write('end');
    });


}
function transform(str) {
    var through = require('through2');

    var tr =function write(str, encoding, next) {
        this.push(str.toString().toUpperCase());
        next();
    }
    process.stdin.pipe(through(tr)).pipe(process.stdout);
}
function outputFile(filePath) {
    var fs = require('fs');
    console.log(filePath);
    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function () {
        readStream.pipe(process.stdout);
    });
}


function convertFromFile(filePath) {
    function csv2json(data) {
        var jsonObj = [];
        var bufferString = data.toString();
        var arr = bufferString.split('\n');
        var headers = arr[0].split(',');
        for (var i = 1; i < arr.length; i++) {
            var data = arr[i].split(',');
            var obj = {};
            for (var j = 0; j < data.length; j++) {
                obj[headers[j].trim()] = data[j].trim();
            }
            jsonObj.push(obj);
        }
        return jsonObj;
    }
}
function convertToFile(filePath) { /* ... */ }

exports.default = {
    reverse: reverse,
    transform: transform,
    outputFile: outputFile
};
