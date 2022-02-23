const fs = require('fs'); 
const parse = require('csv-parse');
const path = require('path');

var CryptoJS = require("crypto-js");

const secretKey = 'vOVH6sdmpNWjRRIqCc7rdxs01lwHzfr3';


const deleteFile = (filePath) => {
    fs.stat(filePath, function (err, stats) {
        console.log(stats);//here we got all information of file in stats variable
     
        if (err) {
            return console.error(err);
        }
     
        fs.unlink(filePath,function(err){
             if(err) return console.log(err);
             console.log('file deleted successfully');
        });  
     });
};
const readCsv = (filePath) => {
    let data = [];
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
            .on('error', error => {
                reject(error);
            })
            .pipe(parse.parse({delimiter: ','}))
            .on('data', (row) => {
                data.push(row);
            })
            .on('end', () => {
                resolve(data);
            });
    });
}

const encrypt = (text) => {

    return CryptoJS.AES.encrypt(text,secretKey).toString();

};

const decrypt = (hash) => {

    var bytes  = CryptoJS.AES.decrypt(hash, secretKey);
    return  bytes.toString(CryptoJS.enc.Utf8);
};


module.exports = { readCsv, deleteFile, encrypt, decrypt };