const { check, query, param, header } = require('express-validator');

exports.apkList = [ // nn

];

exports.checkApkName = [
    check('apk_id')
        .exists()
        .notEmpty(),

    check('name')
        .exists()
        .notEmpty()
        .isString(),


];

exports.uploadApk = [
    // query
    query('fieldName')
        .exists()
        .notEmpty(),

    query('screen')
        .exists()
        .notEmpty(),


    // headers
    header('id')
        .exists()
        .notEmpty(),

    header('featured')
        .exists()
        .notEmpty(),


    // files
    check('logo')
        .exists()
        .notEmpty(),

    check('apk')
        .exists()
        .notEmpty(),

];

exports.addApk = [
    check('logo')
        .exists()
        .notEmpty(),

    check('apk')
        .exists()
        .notEmpty(),

    check('name')
        .exists()
        .notEmpty(),
];

exports.editApk = [
    check('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),

    check('logo')
        .exists()
        .notEmpty()
        .isString(),

    check('apk')
        .exists()
        .notEmpty()
        .isString(),

    check('name')
        .exists()
        .notEmpty()
        .isString()
];

exports.deleteApk = [
    check('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),
];

exports.toggle = [
    check('apk_id')
        .exists()
        .notEmpty()
        .isNumeric(),

    check('status')
        .exists()
        .notEmpty()
        .isAlpha()
        .isIn(['off', 'On']),
];

exports.saveApkPermission = [
    check('action')
        .exists()
        .notEmpty(),

    check('apkId')
        .exists()
        .notEmpty(),

    check('dealers')
        .exists()
        .notEmpty(),
];

exports.savePolicyPermissions = [
    check('action')
        .exists()
        .notEmpty(),

    check('policyId')
        .exists()
        .notEmpty(),

    check('dealers')
        .exists()
        .notEmpty(),
];

exports.handleUninstallApk = [
    // param
    check('apk_id')
        .exists()
        .notEmpty(),

    // body
    check('spaceType')
        .exists()
        .notEmpty(),

    check('value')
        .exists()
        .notEmpty(),
];
