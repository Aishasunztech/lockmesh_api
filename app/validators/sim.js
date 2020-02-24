const { check, body, param } = require('express-validator');
const { ObjectWithKeys } = require('./commonValidators/validation_helpers');
const { ALPHA_NUMERIC_ICC_ID, DEVICE_ID_PATTERN, NUMERIC_BOOLEAN_REGEX, SIM_ID_PATTERN } = require('../../constants/validation');


// *********************************************** SCHEMAS ********************************************

// common use schema for sim register and sim update
const simSchema = [
    { index: 'iccid', type: 'regex', pattern: ALPHA_NUMERIC_ICC_ID },
    { index: 'name', type: 'string' },
    { index: 'note', type: 'string' },
    { index: 'guest', type: 'regex', pattern: NUMERIC_BOOLEAN_REGEX },
    { index: 'encrypt', type: 'regex', pattern: NUMERIC_BOOLEAN_REGEX },
    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN },
    { index: 'status', type: 'isIn', data: ['Disabled', 'Not Inserted', 'Active', undefined, null, ''], notRequired: true }
];

const simRegisterSchema = [
    { index: 'status', type: 'isIn', data: ['Disabled', 'Not Inserted', 'Active', undefined, null, ''], notRequired: true }
];

const simUpdateUnrAllSchema = [
    { index: 'label', type: 'isIn', data: ['unrGuest', 'unrEncrypt'] },
    { index: 'value', type: 'boolean' },
];


const simUpdateSingleRecordSchema = [
    { index: 'id', type: 'number' },
    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN },
];


const simUpdateLabelValueSchema = [
    { index: 'label', type: 'isIn', data: ['encrypt', 'guest'] },
    { index: 'value', type: 'boolean' },
];





exports.getStandAloneSims = [ // nn

];

exports.addStandAloneSim = [
    body('iccid')
        .matches(SIM_ID_PATTERN),

    body('name')
        .optional({ nullable: true })
        .isString(),

    body('email')
        .optional({ nullable: true, checkFalsy: true })
        .isEmail(),

    body('package')
        .notEmpty()
        .isInt({ min: 1 }),


    body('note')
        .optional({ nullable: true })
        .isString(),

    body('data_plan')
        .optional({ nullable: true })
        .isString(),

    body('pay_now')
        .isBoolean(),

    body('total_price')
        .isInt({ min: 0 }),

    body('paid_by_user')
        .isIn(['PAID', 'UNPAID']),

];


exports.changeSimStatus = [
    body('id')
        .isInt({ min: 1 }),

    body('type')
        .notEmpty()
        .isIn(['activate', 'suspend', 'reset'])
];

exports.simRegister = [
    body('data')
        .custom(v => ObjectWithKeys(v, [...simSchema, ...simRegisterSchema])),
];

exports.simUpdate = [
    body()
        .custom(body => { // body = req.body
            // console.log("body into validation ", body);
            let updateType = body.obj.id;

            if (updateType === "unrAll") {  // all un-register setting update using toggle
                ObjectWithKeys(body.obj, [
                    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN }
                ]);
                ObjectWithKeys(body, simUpdateUnrAllSchema); //  check label and value 
            }
            else if (updateType === "all") { // all records update using toggle
                ObjectWithKeys(body.obj, [
                    { index: 'device_id', type: 'regex', pattern: DEVICE_ID_PATTERN }
                ]);
                ObjectWithKeys(body, simUpdateLabelValueSchema); //  check label and value 
            }
            else if (updateType) { // single record update using toggle
                ObjectWithKeys(body.obj, simUpdateSingleRecordSchema); // check only id
                ObjectWithKeys(body, simUpdateLabelValueSchema); //  check label and value 
            }
            else { // single record update using edit button
                ObjectWithKeys(body.obj, simSchema);
            }
            return true
        })
];

exports.simDelete = [
    body('id')
        .notEmpty()
        .isInt({ min: 1 }),

    body('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN),

    body('iccid')
        .notEmpty()
        .matches(ALPHA_NUMERIC_ICC_ID)

];

exports.getSims = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.simHistory = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];

exports.getUnRegisterSims = [
    param('device_id')
        .notEmpty()
        .matches(DEVICE_ID_PATTERN)
];