const { body } = require('express-validator');
const { SIM_ID_PATTERN, EMAIL_REGEX, CHAT_ID } = require('../../../constants/validation');

exports.arrayOfObjectWithKeys = function (value, obj = [], allowEmptyArray = false) { // 1st: data (array of objects), 2nd: required data, 3rd: handle null array of data
    // console.log(value);
    if (!Array.isArray(value)) {
        throw new Error('array required');
    } else if (value.length > 0) {
        let errors = [];
        value.map((item) => {
            return obj.filter(k => {
                if (typeof k === 'string') {
                    if (!Object.keys(item).includes(k)) {
                        errors.push(`object must have the following key: ${k}`);
                    }
                } else if (!Object.keys(item).includes(k.index)) {
                    errors.push(`object must have the following key: ${k.index}`);
                } else {
                    let current = item[k.index];
                    let valType = typeof current;
                    if (k.type === 'number') {
                        if (!(/^\d+$/.test(current))) {
                            errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} required`);
                        }
                    } else if (k.type === 'float') {
                        if (!(/^[+-]?([0-9]*[.])?[0-9]+$/.test(current))) {
                            errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} requried`);
                        }
                    } else if (typeof current !== k.type) {
                        errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} required`);
                    }
                }
            });
        });
        if (errors.length) {
            throw new Error(errors.join())
        } else {
            return true;
        }
    } else {
        if (allowEmptyArray) {
            return true;
        }
        throw new Error('empty array is not allowed');
    }
}

exports.isObject = function (value) {
    return (!Array.isArray(value) && typeof value === 'object' && Object.keys(value).length > 0);
}

exports.isValidTimeZone = function (tz, nullable = true) {
    // if (!Intl || !Intl.DateTimeFormat().resolvedOptions().timeZone) {
    //     throw 'Time zones are not available in this environment';
    // }
    if (nullable && tz === '') return true;

    try {
        Intl.DateTimeFormat(undefined, { timeZone: tz });
        return true;
    }
    catch (ex) {
        return false;
    }

}

exports.validateSimId = function (value) {
    if (["", null, "N/A"].includes(value)) {
        return true;
    } else if (SIM_ID_PATTERN.test(value)) {
        return true;
    }
    throw new Error('Invalid value');
}

exports.validatePGPEmail = function (value, key) {
    if (["", null, "N/A"].includes(value)) {
        return true;
    } else if (EMAIL_REGEX.test(value)) {
        return true;
    }
    throw new Error('Invalid value');
}

exports.validateChatId = function (value) {
    if (["", null, "N/A"].includes(value)) {
        return true;
    } else if (CHAT_ID.test(value)) {
        return true;
    }
    throw new Error('Invalid value');
}