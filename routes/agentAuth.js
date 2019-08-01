var express = require('express');
var router = express.Router();
var agentAuthController = require('../app/controllers/agentAuth')

/**
 * This function comment is parsed by doctrine
 * @route POST /agents/login
 * @group Agent Dashboard - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 */

router.post("/login", agentAuthController.login)

module.exports = router;