var { DBEvents } = require('../config/database');
const MySQLEvents = require('@rodrigogs/mysql-events');
const constants = require('../config/constants');
// const sockets = require('../routes/sockets');

exports.deviceQueue = async function () {
    await DBEvents.start();

    DBEvents.addTrigger({
        name: 'device_queue',
        expression: `${constants.DB_NAME}.device_history`,
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => { // You will receive the events here
            // console.log('queue: ', event.affectedRows);
            // console.log('socket:', sockets);

        },
    });

    DBEvents.addTrigger({
        name: 'check_device_online',
        expression: `${constants.DB_NAME}.devices`,
        statement: MySQLEvents.STATEMENTS.UPDATE,
        // type: 'UPDATE',
        onEvent: (event) => {
            if(event.type === 'UPDATE' && event.affectedColumns.includes('online')){
                // console.log(sockets);
            }
        }
    });
    DBEvents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    DBEvents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
}
