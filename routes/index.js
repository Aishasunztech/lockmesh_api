
// middlewares
var authMiddleware = require('../config/auth');
var agentAuthMiddleware = require('../config/agentAuth');

// routes
// var authRoutes = require('./auth');
var userRoutes = require('./users');
var mobileRoutes = require('./mobile');
var authRoutes = require('./auth');
var nonVerifyRoutes = require('./nonVerify');
var agentRoutes = require('./agents');
// var userController = require('../app/controllers/user');
var agentAuth = require('./agentAuth');

module.exports = function (app) {

	app.use('/mobile', mobileRoutes);

	// app.use('/users', authRoutes);
	// app.use('/users', nonVerifyRoutes);

	// app.use('/users',
	// 	authMiddleware,
	// 	userRoutes);

	app.group('/users', function (router) {
		router.use(authRoutes);
		router.use(nonVerifyRoutes);

		router.use(
			authMiddleware,
			userRoutes);
	})
	app.group('/api/v1', function (router) {
		router.use('/agent', agentAuth);
		router.use('/agent', agentAuthMiddleware, agentRoutes);
	});
}