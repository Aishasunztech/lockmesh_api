const { check, body, param } = require('express-validator');
const { USER_ID_PATTERN } = require('../../constants/validation');


exports.getAllUsers = [ // nn

];

exports.getDealerUsers = [
    body('dealerId')
        .isInt({min:1})
];

exports.addUser = [
    body('name')
        .notEmpty()
        .isString(),
    
    body('email')
        .isEmail()
];

exports.editUser = [
    body('user_id')
        .matches(USER_ID_PATTERN),

    body('name')
        .notEmpty()
        .isString(),

    body('email')
        .isEmail()
];

exports.deleteUser = [
    param('user_id')
        .matches(USER_ID_PATTERN)
];

exports.undoDeleteUser = [ // nn
    param('user_id')
        .matches(USER_ID_PATTERN)
];

exports.updateProfile = [
    param('id')
        .isInt({min: 1}),

    body('name')
        .isString(),
    
    body('company_name')
        .isString(),

    body('company_address')
        .isString(),
    
    body('city')
        .isString(),

    body('state')
        .isString(),

    body('country')
        .isString(),
    
    body('postal_code')
        .isString(),

    body('tel_no')
        .isMobilePhone(),

    body('website')
        .isFQDN(),

    body('dealerId')
        .isInt({min: 1})
];

exports.checkProfile = [ // nn

];

exports.checkPrevPass = [
    body('user.password')
        .notEmpty()
        .isString()
];

exports.getInvoiceId = [ // nn

];

