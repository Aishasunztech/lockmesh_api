var express = require('express');
var router = express.Router();

const signalController = require('../app/controllers/signal');
router.post('/validate_chat_id', signalController.validate_chat_id);
module.exports = router;