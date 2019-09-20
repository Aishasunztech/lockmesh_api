var { DBEvents } = require('../config/database');
const MySQLEvents = require('@rodrigogs/mysql-events');

exports.deviceQueue = async function () {
    await DBEvents.start();
    DBEvents.addTrigger({
        name: 'TEST',
        expression: '*',
        statement: MySQLEvents.STATEMENTS.ALL,
        onEvent: (event) => { // You will receive the events here
            console.log(event);
        },
    });
    DBEvents.on(MySQLEvents.EVENTS.CONNECTION_ERROR, console.error);
    DBEvents.on(MySQLEvents.EVENTS.ZONGJI_ERROR, console.error);
}