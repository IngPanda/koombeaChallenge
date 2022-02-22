const fs = require('fs'); 
const parse = require('csv-parse');
const path = require('path');
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

module.exports = { readCsv, deleteFile };