// express modules
require("express-group-routes");
var express = require("express");
var app = express();

// libraries
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var stackify = require("stackify-logger");
var auth = require('http-auth');
const expressSwagger = require('express-swagger-generator')(app);
// var io = require('socket.io')();

// Application Constants
const swaggerOptions = require('./config/swaggerOptions');
const constants = require('./config/constants');



app.disable("etag");


var serverEnv = "localhost";
if (process.env.HOST_NAME) serverEnv = process.env.HOST_NAME;
stackify.start({
	apiKey: "8Yl8Cw1Cv4Df8Tl3Jk3Ne1Yf1Qz7Sm2Mn0Aj6An",
	appName: "LockMesh",
	env: serverEnv
});

// cors enable
app.options("*", cors());
app.use(cors("*"));

// Stackify Exception Handler
app.use(stackify.expressExceptionHandler);

// url logging
app.use(logger("dev"));

// file uploading max length
app.use(express.json({ limit: "1000gb" }));
app.use(
	express.urlencoded({
		limit: "1000gb",
		extended: false,
		parameterLimit: 100000000
	})
);

// cookie Parser
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
	res.header("Accept-Encoding", "gzip,sdch");
	if (req.method === "OPTIONS") {
		res.header(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept, Authorization"
		);
		res.header(
			"Access-Control-Allow-Methods",
			"GET, POST, PUT, DELETE, PATCH"
		);
		return res.status(200).json({});
	}

	next();
});


var basic = auth.basic({
	realm: "API Documentation"
}, (username, password, callback) => {
	// Custom authentication
	// Use callback(error) if you want to throw async error.
	callback(username === constants.BASIC_AUTH_USER && password === constants.BASIC_AUTH_PASSWORD);
}
);

app.use('/api-docs', auth.connect(basic), function (req, res, next) {
	next();
})

expressSwagger(swaggerOptions.options);

// routes
app.get("/", function (req, res) {
	res.send("Express");
});

app.get("/itest", function (req, res) {
	console.log("iTest failed successfully!!");
	stackify.log("info", "hey! - iTest failed successfully!!");

});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
require("./routes/index.js")(app);

module.exports = app;
