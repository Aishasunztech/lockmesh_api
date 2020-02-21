const { check, body, param } = require('express-validator');
const { ObjectWithKeys } = require('./commonValidators/validation_helpers');
const { ALPHA_NUMERIC, DEVICE_ID_PATTERN, NUMERIC_BOOLEAN_REGEX } = require('../../constants/validation');

const simRegisterSchema = [
    { index: 'iccid', type: 'regex', pattern: ALPHA_NUMERIC },
    { index: 'name', type: 'string' },
    { index: 'note', type: 'string' },
    { index: 'guest', type: 'regex', pattern: NUMERIC_BOOLEAN_REGEX },
    { index: 'encrypt', type: 'regex', pattern: NUMERIC_BOOLEAN_REGEX },
    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN },
    { index: 'status', type: 'isIn', data: ['Disabled', 'Not Inserted', 'Active', undefined, null, ''], notRequired: true }
];

exports.getStandAloneSims = [

];

exports.changeSimStatus = [

];

exports.simRegister = [
    body('data')
        .custom(v => ObjectWithKeys(v, simRegisterSchema)),
];

exports.simUpdate = [

];

exports.simDelete = [

];

exports.getSims = [

];

exports.simHistory = [

];

exports.getUnRegisterSims = [

];

exports.addStandAloneSim = [

];
