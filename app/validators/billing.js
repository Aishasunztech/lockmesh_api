const { check, param, body } = require('express-validator');
const { ObjectOfObjectWithKeys, ObjectWithKeys, atLeastOneTrueRequired } = require('../validators/commonValidators/validation_helpers');

const savePricesSchema = [
    {index: '6 month', type: 'number'},
    {index: '1 month', type: 'number'},
    {index: '3 month', type: 'number'},
    {index: '12 month', type: 'number'}
]

const savePackageSchema = [
    {index: 'chat_id', type: 'boolean'},
    {index: 'sim_id', type: 'boolean'},
    {index: 'sim_id2', type: 'boolean'},
    {index: 'pgp_email', type: 'boolean'},
    {index: 'vpn', type: 'boolean'}
];


exports.acceptRequest = [ // nn

];

exports.acceptServiceRequest = [
    param('id')
        .notEmpty()
        .isInt({min: 1}),
    
    body('user_acc_id')
        .notEmpty()
        .isInt({min: 1})

];

exports.deleteServiceRequest = [
    param('id')
        .notEmpty()
        .isInt({min: 1})
];

exports.savePrices = [
    body('data')
        .custom(v => ObjectOfObjectWithKeys(v, savePricesSchema)),

    body('dealer_id')
        .notEmpty()
        .isInt({min: 1})

];

exports.saveSaPrices = [
    body('data')
        .custom(v => ObjectOfObjectWithKeys(v, savePricesSchema)),
];

exports.savePackage = [
    body('data.pkgName')
        .notEmpty()
        .isString(),

    body('data.pkgTerm')
        .notEmpty()
        .isString(),

    body('data.pkgPrice')
        .notEmpty()
        .isInt({min: 1}),

    body('data.pkgFeatures')
        .custom(v => ObjectWithKeys(v, savePackageSchema))
        .custom(v => atLeastOneTrueRequired(v))
];

exports.editPackage = [
    body('data.pkgName')
        .notEmpty()
        .isString(),

    body('data.pkgTerm')
        .notEmpty()
        .isString(),

    body('data.pkgPrice')
        .notEmpty()
        .isInt({min: 1}),

    body('data.pkgFeatures')
        .custom(v => ObjectWithKeys(v, savePackageSchema))
        .custom(v => atLeastOneTrueRequired(v)),

    body('dealer_id')
        .notEmpty()
        .isInt({min: 1}),

    body('package_id')
        .notEmpty()
        .isInt({min: 1}),

    body('retail_price')
        .optional()
        .isInt({min: 0})
];

exports.saveSaPackage = [

];

exports.saveSaHardware = [

];

exports.deletePackage = [

];

exports.modifyItemPrice = [

];

exports.getPrices = [

];

exports.getPackages = [

];

exports.getHardwares = [

];

exports.getParentPackages = [

];

exports.getProductPrices = [

];

exports.getHardwarePrices = [

];

exports.checkPackageName = [

];

exports.newRequests = [

];

exports.getUserCredits = [

];

exports.deleteRequest = [

];

exports.deleteSaPackage = [

];

exports.deleteSaHardware = [

];

exports.editSaHardware = [

];

exports.getCancelServiceRequests = [

];
