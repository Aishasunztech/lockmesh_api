const { check } = require('express-validator');
var validator = require('validator');


exports.login = [
    // check('mac_address').isMACAddress,
];

exports.systemLogin = [

];

exports.linkDevice = []

exports.deviceStatus = []

exports.stopLinking = [
    check('macAddr').custom(value => {
        console.log("isValid MacAddress: ", value, ' ' , validator.isMACAddress(value))
        if(validator.isMACAddress(value)){
            return true;
        } else {
            return Promise.reject('Invalid Mac Address')
        }
    }),
    check('serialNo').isLength({ min: 5 })
]

exports.installAppList = []

exports.checkForUpdate = []

exports.getUpdate = []

exports.IMEIChanged = []

exports.adminSMAppList = []

exports.SMAppList = []