const fs = require('fs'); 
const parse = require('csv-parse');
const path = require('path');


const readCsv = (filePath) => {
    var csvData=[];
    fs.createReadStream(filePath)
        .pipe(parse.parse({delimiter: ','}))
        .on('data', function(csvrow) {
            console.log(csvrow);
            csvData.push(csvrow);        
        })
        .on('end',function() {
          console.log(csvData);
    });
};

module.exports = { readCsv };