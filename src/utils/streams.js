const path = require('path');
const dirPath = `${path.dirname(__dirname)}/data/`;
const helper = require('./helper').default;
const fs = require('fs');

class Util {
    constructor() {
        console.log(`Util class`);
        const actionNameArg = 1;
        const fileNameArg = 3;
        const pathArg = 3;
        const helpArg = 1;

        this.actionName = helper.getValueByIndex('--action', actionNameArg) || helper.getValueByIndex('-a', actionNameArg);
        this.fileName = helper.getValueByIndex('--file', fileNameArg) || helper.getValueByIndex('-f', fileNameArg);
        //this.filePath = `${dirPath}${this.fileName }`;
        this.helpFlag = helper.isHelpNeed(helpArg);
        this.path = helper.getValueByIndex('--path', helpArg) || helper.getValueByIndex('-p', helpArg);

        console.log('Params:');
        console.log('Action name: ' + this.actionName);
        console.log('File name: ' + this.fileName);
        console.log('File path: ' + this.path);
        //console.log('File filePath: ' + this.filePath);
        console.log('Is Help: ' + this.helpFlag);
    }

    _csv2json(data) {
        console.log(data);
        let jsonObj = [];
        let bufferString = data.toString();
        let arr = bufferString.split('\n');
        let headers = arr[0].split(',');
        for (let i = 1; i < arr.length; i++) {
            let data = arr[i].split(',');
            let obj = {};
            for (let j = 0; j < data.length; j++) {
                obj[headers[j].trim()] = data[j].trim();
            }
            jsonObj.push(obj);
        }

        return JSON.stringify(jsonObj);
    }

    performAction(){
        if (this.helpFlag) {
            this.outputFile('help.txt');
            return;
        }

        if (this.actionName){
            if (typeof this[this.actionName] === 'function') {
                this[this.actionName](this.fileName || this.path);
            }
            else {
                throw new Error(`Action ${this.actionName} not supported`);
            }
        }
        else {
            throw new Error(`Action not exist`);
        }
    }

    reverse() {
        process.stdin.setEncoding('utf8');

        process.stdout.write('Please, input data values separated by blanks: ');

        process.stdin.on('readable', () => {
            const chunk = process.stdin.read();
            if (chunk !== null) {
                let reverseStr = chunk.toString().split(' ').reverse().join(' ');
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

    transform() {
        const through = require('through2');

        process.stdout.write('Please, input text: ');

        let tr =function write(str, encoding, next) {
            this.push(str.toString().toUpperCase());
            next();
        }
        process.stdin.pipe(through(tr)).pipe(process.stdout);

        process.on('SIGINT', function(){
            process.stdout.write('\n end \n');
            process.exit();
        });
    }

    outputFile(fileName) {
        const filePath = `${dirPath}${fileName}`;

        let readStream = fs.createReadStream(filePath);
        readStream.on('open', function () {
            readStream.pipe(process.stdout);
        });
        readStream.on('error', function (err) {
            console.log(err);
        });
    }

    convertFromFile(fileName) {

        const util = require('util');
        const Transform = require('stream').Transform;

        let parser = new Transform();
        let _this = this;
        parser._transform = function (chunk, enc, cb) {
            let transformChunk = _this._csv2json(chunk);
            this.push(transformChunk);
            cb();
        };

        const filePath = `${dirPath}${fileName}`;
        let readStream = fs.createReadStream(filePath);
        readStream.on('open', function () {
            readStream.pipe(parser).pipe(process.stdout);
        });
        readStream.on('error', function (err) {
            console.log(err);
        });

    }

    convertToFile(fileName) {
        const util = require('util');
        const Transform = require('stream').Transform;

        const filePath = `${dirPath}${fileName}`;
        let namePart, ext = ( namePart = fileName.split(".") ).length > 1 ? namePart.pop() : "";
        const fileNameToWtite =`${namePart}.json `;
        const filePathToWtite = `${dirPath}${fileNameToWtite}`;

        let parser = new Transform();
        let _this = this;
        parser._transform = function (chunk, enc, cb) {
            let transformChunk = _this._csv2json(chunk);
            this.push(transformChunk);
            cb();
        };

        let readStream = fs.createReadStream(filePath);
        let writeStream = fs.createWriteStream(filePathToWtite);
        readStream.on('open', function () {
            readStream.pipe(parser).pipe(writeStream);
        })
            .on('error', function (err) {
            console.log(err);
        });
        writeStream.on('error', function (err) {
            console.log(err);
        })
            .on('finish', function() {
            console.log('Done!');
        });
    }



}

exports.default = Util;





