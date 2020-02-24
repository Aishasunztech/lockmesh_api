const { check, body } = require('express-validator');
const { ObjectWithKeys } = require('../validators/commonValidators/validation_helpers')
const { SIM_ID_PATTERN } = require('../../constants/validation')


exports.createServiceProduct = [
    body('user_acc_id')
        .isOptional({checkFalsy: true})
        .isInt({min: 1}),

    body('dealer_id')
        .isOptional({checkFalsy: true})
        .isInt({min: 1}),
    
    body('product_data')
        .optional({checkFalsy: true})
        .custom(v => ObjectWithKeys(v, ['username', 'domain']))
];

exports.generateRandomUsername = [ // nn

];

exports.checkUniquePgp = [
    body('pgp_email')
        .notEmpty()
        .isString()
];

exports.validateSimId = [ // nn
    body('sim_id')
        .optional({checkFalsy: true})
        .matches(SIM_ID_PATTERN)

];

exports.addDataLimitsPlans = [ // nn

];
