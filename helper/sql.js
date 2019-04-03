"use strict"
const mysql = require('mysql');
var util = require('util');
const sqlPool = mysql.createPool({
    //connectionLimit: 1000,
    //connectTimeout: 60 * 60 * 1000,
    //aquireTimeout: 60 * 60 * 1000,
    //timeout: 60 * 60 * 1000,
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'lokmesh',
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings : true
});
/*let sql = function() {}
exports.Query = function(sql) {
    return new Promise(function(fulfill, reject) { // Create Promise
        con.getConnection(function(err, connection) {
            if (err) {
                // connection.release();
                console.error(err);
                reject(err);
            } else {
                connection.query(sql, function(err, rows, fields) {
                    connection.release();
                    if (!err) {
                        fulfill(rows);
                    } else {
                        reject(err);
                        //console.log(err);
                    }
                });
            }
        });
    });
} */

sqlPool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('Database connection was closed.')
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('Database has too many connections.')
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('Database connection was refused.')
        }
    }
    if (connection) connection.release()
    return
});



sqlPool.query = util.promisify(sqlPool.query); // Magic happens here.
module.exports = sqlPool;