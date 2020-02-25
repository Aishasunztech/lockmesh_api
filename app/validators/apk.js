const { check, query, param, body, header } = require('express-validator');

exports.apkList = [ // nn

];

exports.checkApkName = [
    body('apk_id')
        .optional({ checkFalsy: true, nullable: true })
        .isInt(),

    body('name')
        .notEmpty()
        .isAlphanumeric(),


];

exports.uploadApk = [
    // query
    query('fieldName')
        .notEmpty(),

    // query('screen')
    //     .exists()
    //     .notEmpty(),


    //***** no need to validate file data */ 

    // // headers
    // header('id')
    //     .exists()
    //     .notEmpty(),

    // header('featured')
    //     .exists()
    //     .notEmpty(),



    // // files
    // check('logo')
    //     .exists()
    //     .notEmpty(),

    // check('apk')
    //     .exists()
    //     .notEmpty(),

];

exports.addApk = [
    body('logo')
        .notEmpty()
        .isString(),

    body('apk')
        .notEmpty()
        .isString(),

    body('name')
        .notEmpty()
        .isString()
];

exports.editApk = [
    body('apk_id')
        .notEmpty()
        .isNumeric(),

    body('logo')
        .notEmpty()
        .isString(),

    body('apk')
        .notEmpty()
        .isString(),

    body('name')
        .notEmpty()
        .isString()
];

exports.deleteApk = [
    body('apk_id')
        .notEmpty()
        .isNumeric(),
];

exports.toggle = [
    body('apk_id')
        .notEmpty()
        .isNumeric(),

    body('status')
        .notEmpty()
        .isAlpha()
        .isIn(['off', 'On']),
];

exports.saveApkPermission = [
    // body('action')
    //     .notEmpty(),

    // body('apkId')
    //     .notEmpty(),

    // body('dealers')
    //     .notEmpty(),
];

exports.savePolicyPermissions = [
    // check('action')
    //     .notEmpty(),

    // check('policyId')
    //     .notEmpty(),

    // check('dealers')
    //     .notEmpty(),
];

// secure market apps uninstal
exports.handleUninstallApk = [
    // param
    param('apk_id')
        .notEmpty()
        .isNumeric(),

    body('spaceType')
        .notEmpty()
        .isAlpha()
        .isIn(['guest', 'encrypted']),

    // body('value')
    //     .notEmpty(),
];
