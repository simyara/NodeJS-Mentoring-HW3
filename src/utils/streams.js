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
        this.helpFlag = helper.isHelpNeed(helpArg);
        this.path = helper.getValueByIndex('--path', pathArg) || helper.getValueByIndex('-p', pathArg);

        console.log('Params:');
        console.log('Action name: ' + this.actionName);
        console.log('File name: ' + this.fileName);
        console.log('File path: ' + this.path);
        console.log('Is Help: ' + this.helpFlag);
    }

    _csv2json(data) {
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
                try {
                    this[this.actionName]();
                } catch (e) {
                    console.log(`Failed with ${e}`);
                }

            }
            else {
                throw new Error(`Action ${this.actionName} is not supported`);
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

    outputFile() {
        if (!this.fileName) {
            throw new Error(`File name not exist`);
        }

        const filePath = `${dirPath}${this.fileName}`;

        let readStream = fs.createReadStream(filePath);
        readStream.on('open', function () {
            readStream.pipe(process.stdout);
        });
        readStream.on('error', function (err) {
            console.log(err);
        });
    }

    convertFromFile() {
        if (!this.fileName) {
            throw new Error(`File name not exist`);
        }

        const util = require('util');
        const Transform = require('stream').Transform;

        let parser = new Transform();
        let _this = this;
        parser._transform = function (chunk, enc, cb) {
            let transformChunk = _this._csv2json(chunk);
            this.push(transformChunk);
            cb();
        };

        const filePath = `${dirPath}${this.fileName}`;
        let readStream = fs.createReadStream(filePath);
        readStream.on('open', function () {
            readStream.pipe(parser).pipe(process.stdout);
        });
        readStream.on('error', function (err) {
            console.log(err);
        });

    }

    convertToFile() {

        if (!this.fileName) {
            throw new Error(`File name not exist`);
        }

        const util = require('util');
        const Transform = require('stream').Transform;

        const filePath = `${dirPath}${this.fileName}`;
        let namePart, ext = ( namePart = this.fileName.split(".") ).length > 1 ? namePart.pop() : "";
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

    cssBundler(){
        if (!this.path) {
            throw new Error(`Path name not exist`);
        }

        const path = `${dirPath}${this.path}/`;
        const fileNameToWtite =`bundle.css`;
        const filePathToWtite =  `${path}${fileNameToWtite}`;

        const readline = require('readline');

        let promises = [];

        let downloadFile = function () {
            return new Promise(function (resolve, reject) {
                const  https = require('https');

                let file = fs.createWriteStream(`${path}nodejs-homework3.css`);
                let request = https.get("https://doc-0g-0s-docs.googleusercontent.com/docs/securesc/ha0ro937gcuc7l7deffksulhg5h7mbp1/jsn8uecejvi98hj4v1vl2t1p830iaq44/1528106400000/05195043963524607236/*/1tCm9Xb4mok4Egy2WjGqdYYkrGia0eh7X?e=download", function(response) {
                    response.pipe(file);
                    response.on('end', function() {
                        resolve();
                    });
                });
            });
        };

        let readDir = function (path) {
            fs.readdir(path, function (err, files) {
                for (let i = 0; i < files.length; i++) {
                    promises.push(readFile(path + files[i]));

                    if (i == (files.length - 1)) {
                        let results = Promise.all(promises);

                        results.then(writeFile)
                            .catch(function (err) {
                            console.log(err)
                        });
                    }

                }
            });
        };

        let readFile = function (file) {
            return new Promise(function (resolve, reject) {
                let lines = [];
                let rl    = readline.createInterface({
                    input: fs.createReadStream(file)
                });

                rl.on('line', function (line) {
                    // Split line on comma and remove quotes
                    let columns = line
                        .replace(/"/g, '')
                        .split(',');

                    lines.push(line);
                });

                rl.on('close', function () {
                    // Add newlines to lines
                    lines = lines.join("\n");
                    resolve(lines)
                });
            });
        };

        let writeFile = function (data) {
            return new Promise(function (resolve, reject) {
                fs.appendFile(filePathToWtite, data, 'utf8', function (err) {
                    if (err) {
                        resolve('Error!');
                    } else {
                        reject('Succeeded!');
                    }
                });
            });
        };

        downloadFile().then(function () {
                console.log('Downloaded!');
                readDir(path);
            }).catch(function (err) {
                console.log(err)
        });
    }
}

exports.default = Util;





