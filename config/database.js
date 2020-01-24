const Sequelize = require('sequelize')
const mysql = require('mysql');
var util = require('util');
const MySQLEvents = require('@rodrigogs/mysql-events');

const constants = require('./constants');

// sequelize_connection


const sqlPool = mysql.createPool({
    //connectionLimit: 1000,
    //connectTimeout: 60 * 60 * 1000,
    //aquireTimeout: 60 * 60 * 1000,
    //timeout: 60 * 60 * 1000,

    host: constants.DB_HOST,
    user: constants.DB_USERNAME,
    password: constants.DB_PASSWORD,
    database: constants.DB_NAME,

    // timezone: 'utc',// 'UTC+0', // constants.TIME_ZONE,
    supportBigNumbers: true,
    bigNumberStrings: true,
    dateStrings: true
});

sqlPool.query(`SET time_zone = '${constants.TIME_ZONE_OFFSET}'`); // '+0:00'
sqlPool.query(`SET @@global.time_zone = '${constants.TIME_ZONE_OFFSET}'`); // '+0:00'

const DBEvents = new MySQLEvents(sqlPool, {
    startAtEnd: true,
    excludedSchemas: {
        mysql: true,
    },
});


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


const sequelize_conn = new Sequelize(constants.DB_NAME, constants.DB_USERNAME, constants.DB_PASSWORD, {
    host: constants.DB_HOST,
    dialect: 'mysql',
    pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
})

sequelize_conn
    .authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch(err => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = {
    sequelize_conn: sequelize_conn,
    sql: sqlPool,
    DBEvents: DBEvents
}