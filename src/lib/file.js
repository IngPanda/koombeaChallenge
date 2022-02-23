const db = require('../database');
/**
 * record file data in database
 * @param {*} filename 
 * @param {*} path 
 * @param {*} userId 
 */
const registerFile = async(filename,path,userId) => {
    await db.pool.query('INSERT INTO files (path,nameFile,user_id) VALUES (?,?,?) ',
    [path,filename,userId]);
};
/**
 * query list of files in database
 * @param {*} userId 
 * @returns 
 */
const getFileList = async (userId) => {
    let files = await db.pool.query("select * from files where user_id = ?",[userId]);
    files = files.filter((data, index) => index !== 'meta');
    files = files.map(
        f=>{ 
            return { 
                id: f.id, 
                nameFile: f.nameFile, 
                status: f.status,
                nameButton: f.status === 'On hold' ? 'Procesar': 'Ver lista',
                pathButton: f.status === 'On hold' ? '/contact/process/'+f.id: '/contacts/list/'+f.id,
            }; 
        }
    );
    return files;
};

module.exports = { registerFile, getFileList };