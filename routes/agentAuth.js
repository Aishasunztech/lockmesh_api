var express = require('express');
var router = express.Router();
var agentAuthController = require('../app/controllers/agentAuth')

router.post("/login", agentAuthController.login)

module.exports = router;