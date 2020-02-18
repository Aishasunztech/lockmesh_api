// libraries
require("dotenv").config();
require("stackify-node-apm");
var fs = require('fs');
var momentTz = require("moment-timezone");
var moment = require('moment');
var debug = require("debug")("webportalbackend:server");
var http = require("http");
// var https = require('https');
let socket = require('socket.io');

var datetime = require("node-datetime");

// custom libraries
var app = require("../app");
require("../config/database");
// let socketRoutes = require('../routes/sockets');

// constants
const constants = require('../config/constants');

// ======================================== App Configurations================== //

// => Set timezone for moment Library
momentTz.tz.setDefault(constants.TIME_ZONE);
let d = moment().format('YYYY-MM-DD H:m:s');
console.log("Moment Date Time:", d)

// => set timezone for dateTime Library
// var today_date = datetime.create();

// => set timezone for default date function

// => set timezone for database

// ============================================Server Configurations ========================= //
var port = normalizePort(process.env.PORT || constants.PORT);
app.set("port", port);

// if(constants.APP_ENV === 'local'){
var server = http.createServer(app);
// } else {

// var server = https.createServer({ 
// 	// key: fs.readFileSync('privateKey.pem'),
// 	// cert: fs.readFileSync('fullChain.pem') 
//  },app);
// }

// ============================================Socket Configurations ========================= //
const socketRoutes = require('../routes/sockets');
// io.attach(server, {
//     // pingInterval: 60000,
//     // pingTimeout: 120000,
//     // cookie: false
// });

// Base socket
let io = socket();
// origin all commented
// io.set('origins', '*:*');
io.attach(server);
socketRoutes.baseSocket(io);


// Socket for device
let deviceIo = socket({
	path: '/device/socket'
});
deviceIo.attach(server);
socketRoutes.deviceSocket(deviceIo);

// Socket for panel
let webIo = socket({
	path: '/web/socket'
});
// Promise.all()

webIo.attach(server);
socketRoutes.webSocket(webIo);

// Promise.all([socketRoutes.webSocket(webIo), socketRoutes.deviceSocket(deviceIo)]);

// let dealerIo = socket({
// 	path: '/dealer'
// })
// dealerIo.attach(server);
// socketRoutes.dealerSocket(dealerIo);

// ============================================ Cron Jobs ========================= //
require("../crons/index");

// ============================================ Events ========================= //
// var events = require('../crons/db_events');
// events.deviceQueue()
// events.deviceQueue()
// 	.then(() => console.log('Waiting for database events...'))
// 	.catch(console.error);


// ============================================ Route Configurations ========================= //


require("../routes/index.js")(app);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
	res.status(404).send({ msg: 'Not Found' })
});

// error handler
app.use(function (err, req, res, next) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get('env') === 'development' ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.send(err);
});


/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);


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
	var bind = typeof addr === "string" ? "pipe: " + addr : "port: " + addr.port;
	debug("Listening on " + bind);
	console.log("Listening on " + bind);
}

