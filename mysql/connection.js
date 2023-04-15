const mysql = require('mysql')
const dotenv = require('dotenv').config()

const mysqlPool  = mysql.createPool({
    connectionLimit : 10,
    host            : process.env.DB_HOST,
    user            : process.env.DB_USER,
    password        : process.env.DB_PASS,
    database        : process.env.DB
});

module.exports = mysqlPool