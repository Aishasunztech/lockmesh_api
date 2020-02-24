const { check } = require('express-validator');
const { validationResult } = require('express-validator');


// send response of error messages
exports.responsValidationResults = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        console.log({ status: false, msg: 'Data not validated', errors: errors.array() })
        return res.status(422).json({ status: false, msg: 'Data not validated', errors: errors.array() })
    }
    next();
}


exports.login = [
    check('demail').isEmail(),
    check('pwd').notEmpty()
    // .withMessage('incorect password')
    // .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    // check('mac_address').isMACAddress,
];