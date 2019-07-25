require("dotenv").config();
require("stackify-node-apm");

var app = require("../app");
var debug = require("debug")("webportalbackend:server");
var http = require("http");
var Constants = require("../constants/Application");
const { sql } = require("../config/database");

var port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

/**
 * Create HTTP server.
 */
var server = http.createServer(app);

let io = require("../routes/sockets").listen(server);

require("../crons/index");
/**
 * Listen on provided port, on all network interfaces.
 */
server.listen(port);

server.on("error", onError);
server.on("listening", onListening);

// servers.listen(port);
// servers.on('error', onError);
// servers.on('listening', onListening);
/**
 * Normalize a port into a number, string, or false.
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

// =======================================Socket======================================= //
