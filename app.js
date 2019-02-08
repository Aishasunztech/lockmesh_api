var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var mobileRouter = require('./routes/mobile');

var app = express();
app.disable('etag');
app.options('*', cors());

// url logging
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(cors("*"));
app.use(function(req, res, next) {
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

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/mobile', mobileRouter);

module.exports = app;
