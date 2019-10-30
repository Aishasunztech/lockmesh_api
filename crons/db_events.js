var { DBEvents } = require('../config/database');
const MySQLEvents = require('@rodrigogs/mysql-events');

const constants = require('../config/constants');

const sockets = require("../routes/sockets");

// helpers
const { sql } = require("../config/database");
const socket_helpers = require("../helper/socket_helper");


exports.deviceQueue = async function () {
    await DBEvents.start();

    DBEvents.addTrigger({
        name: 'device_queue',
        expression: `${constants.DB_NAME}.device_history`,
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => { 
            if(event.type === 'INSERT'){
                socket_helpers.sendJobToPanel(sockets.baseIo, event.affectedRows[0].after);
            } else if (event.type === 'UPDATE'){
                console.log('device_history updated:', event);
                console.log('after:', event.affectedRows)
            }
            
        },
    });

    // DBEvents.addTrigger({
    //     name: 'check_device_online',
    //     expression: `${constants.DB_NAME}.devices`,
    //     statement: MySQLEvents.STATEMENTS.UPDATE,
    //     // type: 'UPDATE',
    //     onEvent: (event) => {
    //         if(event.type === 'UPDATE' && event.affectedColumns.includes('online')){
    //             // console.log(sockets);
    //         }
    //     }
    // });
    DBEvents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    DBEvents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
}
