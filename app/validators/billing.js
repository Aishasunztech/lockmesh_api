const { check, param, body } = require('express-validator');
const { ObjectOfObjectWithKeys, ObjectWithKeys, atLeastOneTrueRequired } = require('../validators/commonValidators/validation_helpers');
const { BOOLEAN_REGEX } = require('../../constants/validation');

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

    body('data.dealer_id')
        .isInt({min: 1}),

    body('data.package_id')
        .isInt({min: 1}),

    body('data.retail_price')
        .optional()
        .isInt({min: 0})
];

exports.saveSaPackage = [
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

    body('data.package_type')
        .notEmpty()
        .isIn(['services', 'data_plan', 'Standalone Sim'])
];

exports.saveSaHardware = [

    body('data.hardwareName')
        .notEmpty()
        .isString(),
    
    body('data.hardwarePrice')
        .isInt({min: 1})
];

exports.deletePackage = [
    param('id')
        .isInt({min: 1})
];

exports.modifyItemPrice = [
    param('id')
        .isInt({min: 1}),

    body('price')
        .isInt({min:0}),

    body('isModify')
        .matches(BOOLEAN_REGEX),

    body('type')
        .notEmpty()
        .isString(),

    body('retail_price')
        .isInt({min: 0})
];

exports.getPrices = [ // nn

];

exports.getPackages = [ // nn

];

exports.getHardwares = [ // nn

];

exports.getParentPackages = [ // nn

];

exports.getProductPrices = [ // nn

];

exports.getHardwarePrices = [ // nn

];

exports.checkPackageName = [ // nn

];

exports.newRequests = [ // nn

];

exports.getUserCredits = [ // nn

];

exports.deleteRequest = [
    param('id')
        .isInt({min: 1})
];

exports.deleteSaPackage = [
    body('data.pkg_name')
        .notEmpty()
        .isString()
];

exports.deleteSaHardware = [
    body('data.name')
        .notEmpty()
        .isString()
];

exports.editSaHardware = [
    body('data.name')
        .notEmpty()
        .isString(),
    
    body('data.new_name')
        .notEmpty()
        .isString(),

    body('data.new_price')
        .isInt({min: 1})

];

exports.getCancelServiceRequests = [ // nn

];
