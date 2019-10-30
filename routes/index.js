
// middlewares
var authMiddleware = require('../middlewares/auth');
var agentAuthMiddleware = require('../middlewares/agentAuth');

// routes
// var authRoutes = require('./auth');
var userRoutes = require('./users');
var mobileRoutes = require('./mobile');
var signalRoutes = require('./signal');
var authRoutes = require('./auth');
var nonVerifyRoutes = require('./nonVerify');
var agentRoutes = require('./agents');
// var userController = require('../app/controllers/user');
var agentAuth = require('./agentAuth');

module.exports = function (app) {

	app.use('/mobile', mobileRoutes);
	app.use('/signal', signalRoutes);

	app.use('/users', authRoutes);
	app.use('/users', nonVerifyRoutes);

	app.use('/users',
		authMiddleware,
		userRoutes);

	app.group('/api/v1', function (router) {
		router.use('/mobile', mobileRoutes);

		router.use('/agent', agentAuth);
		router.use('/agent', agentAuthMiddleware, agentRoutes);
	});
}