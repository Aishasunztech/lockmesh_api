
// middlewares
var authMiddleware = require('../middlewares/auth');
var agentAuthMiddleware = require('../middlewares/agentAuth');

// routes
// var authRoutes = require('./auth');
var userRoutes = require('./users');
var MircroServiceAuthentication = require('./MircroServiceAuthentication');
var MircroServiceSocketAuthentication = require('./MircroServiceSocketAuthentication');
var mobileRoutes = require('./mobile');
var signalRoutes = require('./signal');
var mobileV2Routes = require('./mobile_v2');
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

	app.use('/microservice-authentication',
		authMiddleware,
		MircroServiceAuthentication);

	app.use('/microservice-socket-authentication',
		MircroServiceSocketAuthentication);

	app.use('/users',
		authMiddleware,
		userRoutes);

	app.group('/api/v1', function (router) {
		router.use('/mobile', mobileRoutes);

		router.use('/agent', agentAuth);
		router.use('/agent', agentAuthMiddleware, agentRoutes);
	});

	app.group('/api/v2', function (router) {
		router.use('/mobile', mobileV2Routes);
		
		router.use('/agent', agentAuth);
		router.use('/agent', agentAuthMiddleware, agentRoutes);
	});

}