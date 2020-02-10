const { check } = require('express-validator');
const { validationResult } = require('express-validator');


// send response of error messages
exports.responsValidationResults = async function (req, res, next) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(422).json({ status: false, errors: errors.array() })
    }
    next();
}


exports.testCommon = [
    // check('email').isEmail(),
    // check('pwd').notEmpty()
];

exports.login = [
    check('demail').isEmail(),
    check('pwd').notEmpty()
    // .withMessage('incorect password')
    // .isLength({ min: 5 }).withMessage('must be at least 5 chars long')
    // check('mac_address').isMACAddress,
];