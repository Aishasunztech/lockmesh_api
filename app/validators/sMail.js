const { check, body } = require('express-validator');
const { DEVICE_ID_PATTERN, CHAT_ID } = require('../../constants/validation');


exports.validatePgpEmail = [
    body('device_id')
        .matches(DEVICE_ID_PATTERN),

    body('pgp_email')
        .isEmail()
]