var express = require('express');
var router = express.Router();

// controllers
const AgentDashboardController = require('../app/controllers/agentDashboard');

/**
 * @route GET api/v1/agent/devices
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/devices", AgentDashboardController.devices)

/**
 * @route PUT api/v1/agent/edit-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/**UPDATE Device details**/
router.put('/edit-device', AgentDashboardController.editDevices);

/**
 * @route PUT api/v1/agent/activate-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Activate Device **/
router.put('/activate-device/:id', AgentDashboardController.activateDevice);

/**
 * @route PUT api/v1/agent/suspend-device
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Suspend Account Devices / client **/
router.put('/suspend-device/:id', AgentDashboardController.suspendDevice);

/**
 * @route DELETE api/v1/agent/devices/reject
 * @group Agent Dashboard - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.delete('/reject-device', AgentDashboardController.deleteDevice)

module.exports = router;