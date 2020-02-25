const { check, body } = require('express-validator');

exports.addAclModule = [
    body('title')
        .notEmpty()
        .isString(),

    body('componentName')
        .notEmpty()
        .isString(),

    body('uri')
        .notEmpty()
        .isString(),

    body('admin')
        .isBoolean(),

    body('dealer')
        .isBoolean(),

    body('sdealer')
        .isBoolean()

];

exports.getAllowedComponents = [ // nn

];

exports.checkComponent = [
    body('ComponentUri')
        .isIn(['/connect-device/', '/connect-dealer/', '/connect-sim/'])
];

exports.isAdmin = [ // nn

];

exports.getUserType = [ // nn

];
