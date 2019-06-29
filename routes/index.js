
// middlewares
var authMiddleware = require('../config/auth');
// var multipart = require('connect-multiparty');
// var multipartMiddleware = multipart();
var moment = require('moment-strftime');

var crypto = require("crypto");
var md5 = require('md5');

// routes
// var authRoutes = require('./auth');
var userRoutes = require('./users');
var mobileRoutes = require('./mobile');
// var pub = require('./pub');


module.exports = function (app) {
  app.get('/', async function (req, res) {

    res.send("Express Js");
  });
  app.use('/mobile', mobileRoutes);
  app.use('/users', userRoutes);
  
  // app.group('/', function (router) {
  //   router.use('/mobile', mobileRoutes);
  //   router.use('/users', userRoutes);
  // });

}