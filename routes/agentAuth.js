var express = require('express');
var router = express.Router();
var agentAuthController = require('../app/controllers/agentAuth')


/**
 * @typedef AgentLogin
 * @property {string} emai.required - agent login email
 * @property {string} password.required - agent login password
 * @property {string} dealer_pin.required - agent login
 */

/**
 * SecurePanel dashboard login
 * @route POST /api/v1/agent/login
 * @group Agent Dashboard - Operations about Dealer Agents
 * @param {string} email.formData.required - agent email
 * @param {string} password.formData.required - agent email
 * @param {string} dealer_pin.formData.required - agent email
 * @returns {object} 200 - An array of agents info
 * #returns {Response.model} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

router.post("/login", agentAuthController.login);


module.exports = router;