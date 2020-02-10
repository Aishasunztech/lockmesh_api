const { check } = require('express-validator');
var validator = require('validator');


exports.loginValidation = [
    check('demail').isEmail(),
    check('pwd').notEmpty()
    // .withMessage('incorect password')
    // .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    // check('mac_address').isMACAddress,
];

exports.systemLogin = [

];

exports.linkDevice = []

exports.deviceStatus = []

exports.stopLinking = []

exports.installAppList = []

exports.checkForUpdate = []

exports.getUpdate = []

exports.IMEIChanged = []

exports.adminSMAppList = []

exports.SMAppList = []