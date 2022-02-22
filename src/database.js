const mariadb = require('mariadb');
const { database } = require('./keys');

const pool = mariadb.createPool(
    {
        host: database.host,
        user: database.user,
        database: database.database,
        password: database.password,
         connectionLimit: 5
    });

// Expose a method to establish connection with MariaDB SkySQL
module.exports = Object.freeze({
    pool: pool
});