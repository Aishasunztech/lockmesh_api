const { check, body, param } = require('express-validator');
const { isObject } = require('../validators/commonValidators/validation_helpers');
const { DEVICE_ID_PATTERN } = require('../../constants/validation');


exports.getPolicies = [ // nn

];

exports.getEnabledPolicies = [ // nn 

];

exports.checkPolicyName = [
    body('name')
        .notEmpty()
        .isString(),

    // policy_id
];

exports.changePolicyStatus = [
    body('id')
        .isInt({min: 1}),

    // value

    body('key')
        .notEmpty()
        .isString()
];

exports.savePolicy = [
    body('data')
        .custom(v => isObject(v))
];

exports.savePolicyChanges = [
    body('id')
        .isInt({min: 1}),
];

exports.applyPolicy = [
    param('device_id')
        .matches(DEVICE_ID_PATTERN),
    
    body('deviceId')
        .matches(DEVICE_ID_PATTERN),
    
    body('policyId')
        .isInt({min: 1}),

    body('userAccId')
        .isInt({min: 1})
];

exports.setDefaultPolicy = [
    body('policy_id')
        .isInt({min: 1})

];
