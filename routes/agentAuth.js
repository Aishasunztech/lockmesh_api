var express = require('express');
var router = express.Router();
var agentAuthController = require('../app/controllers/agentAuth')

/**
 * @typedef AgentLoginRes
 * @property {string} status - agent login email
 * @property {string} msg - agent login password
 */

/**
 * SecurePanel dashboard login
 * @route POST /api/v1/agent/login
 * @group Agent Dashboard - Operations about Dealer Agents
 * @param {string} email.formData.required  agent email
 * @param {string} password.formData.required - agent password
 * @param {string} dealer_pin.formData.required - dealer pin
 * @returns {AgentLoginRes.model} 200 - send status and message back to client
 * @returns {Error}  default - Unexpected error
 */

router.post("/login", agentAuthController.login);


module.exports = router;