const { check } = require('express-validator');

exports.addAclModule = [
    check('title')
        .exists()
        .notEmpty()
        .isString(),

    check('componentName')
        .exists()
        .notEmpty()
        .isString(),

    check('uri')
        .exists()
        .notEmpty()
        .isString(),

    check('admin')
        .exists()
        .notEmpty()
        .isBoolean(),

    check('dealer')
        .exists()
        .notEmpty()
        .isBoolean(),

    check('sdealer')
        .exists()
        .notEmpty()
        .isBoolean()

];

exports.getAllowedComponents = [ // nn

];

exports.checkComponent = [
    check('ComponentUri')
        .exists()
        .notEmpty(),
];

exports.isAdmin = [ // nn

];

exports.getUserType = [ // nn

];
