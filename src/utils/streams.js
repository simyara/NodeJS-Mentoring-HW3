const path = require('path');
const dirPath = `${path.dirname(__dirname)}/data/`;

function csv2json(data) {
    console.log(data);
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

    return JSON.stringify(jsonObj);
}

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

function outputFile(fileName) {
    const filePath = `${dirPath}${fileName}`;
    var fs = require('fs');
    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function () {
        readStream.pipe(process.stdout);
    });
    readStream.on('error', function(){
        console.log('Error: file not found');
    });
}

function convertFromFile(fileName) {
    const filePath = `${dirPath}${fileName}`;
    var util = require('util')
        , Transform = require('stream').Transform;

    var parser = new Transform();
    parser._transform = function (chunk, enc, cb) {
        var transformChunk = csv2json(chunk);
        this.push(transformChunk);
        cb();
    };

    var fs = require('fs');
    var readStream = fs.createReadStream(filePath);
    readStream.on('open', function () {
        readStream.pipe(parser).pipe(process.stdout);
    });
    readStream.on('error', function(){
        console.log('Error: file not found');
    });

}

function convertToFile(fileName) {
    var util = require('util')
        , Transform = require('stream').Transform;

    const filePath = `${dirPath}${fileName}`;
    var namePart, ext = ( namePart = fileName.split(".") ).length > 1 ? namePart.pop() : "";
    const fileNameToWtite =`${namePart}.json `;
    const filePathToWtite = `${dirPath}${fileNameToWtite}`;
    var parser = new Transform();
    parser._transform = function (chunk, enc, cb) {
        var transformChunk = csv2json(chunk);
        this.push(transformChunk);
        cb();
    };

    var fs = require('fs');
    var readStream = fs.createReadStream(filePath);
    var writeStream = fs.createWriteStream(filePathToWtite);
    readStream.on('open', function () {
        readStream.pipe(parser).pipe(writeStream);
    });
    readStream.on('error', function(){
        console.log('Error: file not found');
    });
}

exports.default = {
    reverse: reverse,
    transform: transform,
    outputFile: outputFile,
    convertFromFile: convertFromFile,
    convertToFile: convertToFile
};
