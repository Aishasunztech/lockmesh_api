const { check, query, param, body, header } = require('express-validator');

exports.apkList = [ // nn

];

exports.checkApkName = [
    // check('apk_id')
    //     .exists()
    //     .notEmpty(),

    check('name')
        .exists()
        .notEmpty()
        .isAlphanumeric(),


];

exports.uploadApk = [
    // query
    query('fieldName')
        .exists()
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
        .exists()
        .notEmpty()
        .isString(),

    body('apk')
        .exists()
        .notEmpty()
        .isString(),

    body('name')
        .exists()
        .notEmpty()
        .isString()
];

exports.editApk = [
    body('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('logo')
        .exists()
        .notEmpty()
        .isString(),

    body('apk')
        .exists()
        .notEmpty()
        .isString(),

    body('name')
        .exists()
        .notEmpty()
        .isString()
];

exports.deleteApk = [
    body('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),
];

exports.toggle = [
    body('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('status')
        .exists()
        .notEmpty()
        .isAlpha()
        .isIn(['off', 'On']),
];

exports.saveApkPermission = [
    // body('action')
    //     .exists()
    //     .notEmpty(),

    // body('apkId')
    //     .exists()
    //     .notEmpty(),

    // body('dealers')
    //     .exists()
    //     .notEmpty(),
];

exports.savePolicyPermissions = [
    // check('action')
    //     .exists()
    //     .notEmpty(),

    // check('policyId')
    //     .exists()
    //     .notEmpty(),

    // check('dealers')
    //     .exists()
    //     .notEmpty(),
];

// secure market apps uninstal
exports.handleUninstallApk = [
    // param
    param('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),

    body('spaceType')
        .exists()
        .notEmpty()
        .isAlpha()
        .isIn(['guest', 'encrypted']),

    // body('value')
    //     .exists()
    //     .notEmpty(),
];
