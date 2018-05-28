function reverse() {
    process.stdin.setEncoding('utf8');

    process.stdout.write('Please, input data values separated by blanks: ');

    process.stdin.on('readable', () => {
        const chunk = process.stdin.read();
        if (chunk !== null) {
            var reverseStr = chunk.toString().split(' ').reverse().join(' ');
            if (reverseStr.length > 0) {
                process.stdout.write(`reverse data: ${reverseStr}`);
            }
        }
    });
    process.on('SIGINT', function(){
        process.stdout.write('\n end \n');
        process.exit();
    });
}

function transform(str) {
    var through = require('through2');

    process.stdout.write('Please, input text: ');

    var tr =function write(str, encoding, next) {
        this.push(str.toString().toUpperCase());
        next();
    }
    process.stdin.pipe(through(tr)).pipe(process.stdout);

    process.on('SIGINT', function(){
        process.stdout.write('\n end \n');
        process.exit();
    });
}

function outputFile(filePath) {
    var fs = require('fs');
    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function () {
        readStream.pipe(process.stdout);
    });
    readStream.on('error', function(){
        console.log('Error: file not found');
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

    var util = require('util')
        , Transform = require('stream').Transform;

    var parser = new Transform();
    parser._transform = function(chunk, encoding, done) {
        this.push(csv2json(chunk.toString()));
        return done();
    };

    var fs = require('fs');
    var readStream = fs.createReadStream(filePath);
    readStream.pipe(parser).pipe(process.stdout);
}

function convertToFile(filePath) { /* ... */ }

exports.default = {
    reverse: reverse,
    transform: transform,
    outputFile: outputFile,
    convertFromFile: convertFromFile
};
