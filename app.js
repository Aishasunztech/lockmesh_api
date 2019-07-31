require("express-group-routes");
var express = require("express");
var app = express();

var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var cors = require("cors");
var stackify = require("stackify-logger");
// var bodyParser = require("body-parser");

const swaggerOptions = require('./config/swaggerOptions');

// var swaggerUi = require("swagger-ui-express"),
// swaggerDocument = require("./swagger.json");
const expressSwagger = require('express-swagger-generator')(app);

expressSwagger(swaggerOptions.options);

app.disable("etag");
app.options("*", cors());

var serverEnv = "localhost";
if (process.env.HOST_NAME) serverEnv = process.env.HOST_NAME;
stackify.start({
	apiKey: "8Yl8Cw1Cv4Df8Tl3Jk3Ne1Yf1Qz7Sm2Mn0Aj6An",
	appName: "LockMesh",
	env: serverEnv
});
app.use(stackify.expressExceptionHandler);

// url logging
app.use(logger("dev"));

// app.use(bodyParser.json({limit: "1000gb"}));
// app.use(bodyParser.urlencoded({limit: "1000gb", extended: false, parameterLimit:100000000}));

app.use(express.json({ limit: "1000gb" }));
app.use(
	express.urlencoded({
		limit: "1000gb",
		extended: false,
		parameterLimit: 100000000
	})
);
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(cors("*"));
app.use(function(req, res, next) {
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

// routes
app.get("/", function(req, res) {
	res.send("Express");
});

app.get("/itest", function(req, res) {
	console.log("iTest failed successfully!!");
	stackify.log("info", "hey! - iTest failed successfully!!");
	throw new Error("throw new Error - iTest failed successfully!!");
	res.send("iTest failed successfully!!");
});

// app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

require("./routes/index.js")(app);

module.exports = app;
