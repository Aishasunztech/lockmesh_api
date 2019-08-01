var express = require('express');
var router = express.Router();

// controllers
const AgentDashboard = require('../app/controllers/agentDashboard');


router.get("/devices", AgentDashboard.devices)

module.exports = router;