var express = require('express');
var router = express.Router();

const sMailController = require('../app/controllers/sMail');
const sMailValidator = require('../app/validators/sMail');
const commonValidators = require('../app/validators/commonValidators');
var errorMsgs = commonValidators.responsValidationResults;


router.post('/validate', [sMailValidator.validatePgpEmail, errorMsgs], sMailController.validatePgpEmail);
module.exports = router;