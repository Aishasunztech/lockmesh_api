
// middlewares
var authMiddleware = require('../config/auth');

// routes
// var authRoutes = require('./auth');
var userRoutes = require('./users');
var mobileRoutes = require('./mobile');
var authRoutes = require('./auth');
var nonVerifyRoutes = require('./nonVerify');

// var userController = require('../app/controllers/user');

module.exports = function (app) {

  app.use('/mobile', mobileRoutes);
  
  app.use('/users', authRoutes);
  app.use('/users', nonVerifyRoutes);

  app.use('/users',
    authMiddleware,
    userRoutes);


}