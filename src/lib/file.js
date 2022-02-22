const db = require('../database');
const reegisterFile = async(filename,path,userId) => {
    await db.pool.query('INSERT INTO files (path,nameFile,user_id) VALUES (?,?,?) ',
    [path,filename,userId]);
};

module.exports = { reegisterFile };