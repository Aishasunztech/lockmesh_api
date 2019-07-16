var express = require('express');
var router = express.Router();
var authController = require('../app/controllers/auth')


router.post('/super_admin_login', authController.superAdminLogin)


/*****User Login*****/
router.post('/login', authController.login);

router.post('/verify_code', authController.verifyCode);

module.exports = router;