var express = require('express');
var router = express.Router();

// controllers
const AgentDashboardController = require('../app/controllers/agentDashboard');

/**
 * @route GET /api/v1/agent/devices
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/devices", AgentDashboardController.devices)

/**
 * @route PUT /api/v1/agent/edit-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/**UPDATE Device details**/
router.put('/edit-device', AgentDashboardController.editDevices);

/**
 * @route PUT /api/v1/agent/activate-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Activate Device **/
router.put('/activate-device/:id', AgentDashboardController.activateDevice);

/**
 * @route PUT /api/v1/agent/suspend-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Suspend Account Devices / client **/
router.put('/suspend-device/:id', AgentDashboardController.suspendDevice);


/**
 * SecurePanel dashboard login
 * @route PUT /api/v1/agent/reset-pwd
 * @group Agent Dashboard - Operations about Dealer Agents
 * @param {string} email.formData.required - agent email
 * @param {string} dealer_pin.formData.required - agent email
 * @returns {object} 200 - An array of agents info
 * #returns {Response.model} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.put('/reset-pwd', AgentDashboardController.resetPwd);

/**
 * SecurePanel dashboard login
 * @route GET /api/v1/agent/get-status
 * @group Agent Dashboard - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * #returns {Response.model} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/get-status', AgentDashboardController.getStatus);

module.exports = router;