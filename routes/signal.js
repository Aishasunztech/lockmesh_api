var express = require('express');
var router = express.Router();

const signalController = require('../app/controllers/signal');
const signalValidator = require('../app/validators/signal');
const commonValidators = require('../app/validators/commonValidators');
var errorMsgs = commonValidators.responsValidationResults;

router.post('/validate_chat_id', [signalValidator.validate_chat_id, errorMsgs], signalController.validate_chat_id);
module.exports = router;