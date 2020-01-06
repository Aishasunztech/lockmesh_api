// libraries
require("dotenv").config();
require("stackify-node-apm");
var momentTz = require("moment-timezone");
var moment = require('moment');
var debug = require("debug")("webportalbackend:server");
var http = require("http");
let socket = require('socket.io');
var datetime = require("node-datetime");

// custom libraries
var app = require("../app");
require("../config/database");
var events = require('../crons/db_events');
let socketRoutes = require('../routes/sockets');
require("../crons/index");

// constants
const constants = require('../config/constants');

// ======================Configurations================== //

// => Set timezone for moment Library
momentTz.tz.setDefault(constants.TIME_ZONE);
let d = moment().format('YYYY-MM-DD H:m:s');
console.log("Moment Date Time:",d)

// => set timezone for dateTime Library
var today_date = datetime.create();

// => set timezone for default date function

// => set timezone for database

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);
/**
 * Create HTTP server.
 */
var server = http.createServer(app);
// io.attach(server, {
//     // pingInterval: 60000,
//     // pingTimeout: 120000,
//     // cookie: false
// });
let io= socket();
io.set('origins', '*:*');
io.attach(server);
socketRoutes.baseSocket(io);

// let dealerIo = socket({
// 	path: '/dealer'
// })
// dealerIo.attach(server);
// socketRoutes.dealerSocket(dealerIo);

// events.deviceQueue()

/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

// events.deviceQueue()
// 	.then(() => console.log('Waiting for database events...'))
// 	.catch(console.error);

/**
 * Normalizing Port with correct Number.
 */
function normalizePort(val) {
	var port = parseInt(val, 10);

	if (isNaN(port)) {
		// named pipe
		return val;
	}

	if (port >= 0) {
		// port number
		return port;
	}

	return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
	if (error.syscall !== "listen") {
		throw error;
	}

	var bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

	// handle specific listen errors with friendly messages
	switch (error.code) {
		case "EACCES":
			console.error(bind + " requires elevated privileges");
			process.exit(1);
			break;
		case "EADDRINUSE":
			console.error(bind + " is already in use");
			process.exit(1);
			break;
		default:
			throw error;
	}
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
	var addr = server.address();
	var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
	debug("Listening on " + bind);
	console.log("Listening on " + bind);
}

