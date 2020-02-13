const { check, body } = require('express-validator');



exports.getPolicies = [ // nn

];

exports.getEnabledPolicies = [ // nn 

];

exports.checkPolicyName = [
    body('name')
        .exists()
        .notEmpty(),

    // policy_id
];

exports.changePolicyStatus = [
    body('id')
        .exists()
        .notEmpty()
        .isNumeric(),

    // value

    body('key')
        .exists()
        .notEmpty(),
];

exports.savePolicy = [
    // body('data')
    //     .exists()
    //     .notEmpty()
];

exports.savePolicyChanges = [
    // body('id')
    //     .exists()
    //     .notEmpty(),
];

exports.applyPolicy = [

];

exports.setDefaultPolicy = [

];
