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

exports.ObjectOfObjectWithKeys = function (value, obj = [], allowEmptyObject = false) { // 1st: data (array of objects), 2nd: required data, 3rd: handle null array of data
    // console.log(value);
    if (typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('object required');
    } else if (Object.keys(value).length > 0) {
        let errors = [];
        Object.keys(value).map((key) => {
            let item = value[key];
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
        if (allowEmptyObject) {
            return true;
        }
        throw new Error('empty object is not allowed');
    }
}

exports.atLeastOneTrueRequired = function(value){
    let broken = false;
    for(let key in value){
        if(/^(true)$/.test(value[key])){
            broken = true;
            break;
        }
    }
    if(broken){
        return true;
    }
    throw new Error('al least on boolean value required in object');
}

exports.ObjectWithKeys = function(value, data = [], empty = false){
    if(typeof value !== 'object' || Array.isArray(value)){
        throw new Error('object required');
    } else if(Object.keys(value).length > 0){
        let errors = [];
        let keys = Object.keys(value);
        keys.map(key => {
            let item = value[key];
            return data.filter(k => {
                if(typeof k === 'string'){
                    if(!keys.includes(k)){
                        errors.push(`object must have the following key: ${k}`);
                    }
                } else if(!keys.includes(k.index)){
                    errors.push(`object must have the following key: ${k.index}`)
                } else {
                    let type = typeof item;
                    if (k.type === 'number' && key === k.index) {
                        if (!(/^\d+$/.test(item))) {
                            errors.push(`${k.index} has invalid value ${item} of type ${type}, ${k.type} required 1`);
                        }
                    } else if (k.type === 'float' && key === k.index) {
                        if (!(/^[+-]?([0-9]*[.])?[0-9]+$/.test(item))) {
                            errors.push(`${k.index} has invalid value ${item} of type ${type}, ${k.type} requried 2`);
                        }
                    } else if(k.type === 'boolean' && key === k.index) {
                        if(!(/^(true|false)$/.test(item))){
                            errors.push(`${k.index} has invalid value ${item} of type ${type}, ${k.type} requried 3`)
                        }
                    } else if (type !== k.type && key === k.index) {
                        errors.push(`${k.index} has invalid value ${item} of type ${type}, ${k.type} required 4`);
                    }
                }
            });
        });
        if(errors.length){
            throw new Error(errors.join());
        } else {
            return true;
        }
    } else if(empty){
        return true;
    } else {
        throw new Error('empty object not allowed');
    }
}

exports.isObject = function (value, empty = false) {
    return (!Array.isArray(value) && typeof value === 'object' && (empty || Object.keys(value).length > 0));
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