var express = require('express');
var router = express.Router();
var agentAuthController = require('../app/controllers/agentAuth')

/**
 * This function comment is parsed by doctrine
 * @route POST /api/v1/agent/login
 * @group Agent Dashboard - Operations about Dealer Agents
 * @param {string} email - username or email
 * @param {string} password - 
 * @param {string} dealer_pin -
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 */

router.post("/login", agentAuthController.login)

module.exports = router;