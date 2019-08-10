var express = require('express');
var router = express.Router();
var authController = require('../app/controllers/auth')


router.post('/super_admin_login', authController.superAdminLogin)


/*****User Login*****/

/**
 * @route POST /users/login
 * @group Auth - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/login', authController.login);

/**
 * @route POST /users/verify_code
 * @group Auth - Operations about user
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/verify_code', authController.verifyCode);

module.exports = router;