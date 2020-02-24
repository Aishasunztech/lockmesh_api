const { check, body } = require('express-validator');
const { DEVICE_ID_PATTERN, CHAT_ID } = require('../../constants/validation');


exports.validate_chat_id = [
    body('device_id')
        .matches(DEVICE_ID_PATTERN),

    body('chat_id')
        .matches(CHAT_ID),

    body('ts')
        .notEmpty()

]