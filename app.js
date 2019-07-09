require('express-group-routes');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var bodyParser = require('body-parser');

var swaggerUi = require('swagger-ui-express'),
swaggerDocument = require('./swagger.json');

var app = express();
app.disable('etag');
app.options('*', cors());

// url logging
app.use(logger('dev'));

// app.use(bodyParser.json({limit: "1000gb"}));
// app.use(bodyParser.urlencoded({limit: "1000gb", extended: false, parameterLimit:100000000}));

app.use(express.json({ limit: "1000gb" }));
app.use(express.urlencoded({ limit: "1000gb", extended: false, parameterLimit: 100000000 }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors("*"));
app.use(function (req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Accept-Encoding', 'gzip,sdch');
	if (req.method === 'OPTIONS') {
		res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
		res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH');
		return res.status(200).json({});
	};

	next();
});

// routes
app.get('/', function(req, res){
	res.send("Express");
})
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
require('./routes/index.js')(app);


module.exports = app;
