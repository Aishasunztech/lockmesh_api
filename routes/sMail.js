var express = require('express');
var router = express.Router();

const sMailController = require('../app/controllers/sMail');
router.post('/validate', sMailController.validatePgpEmail);
module.exports = router;