const { body } = require('express-validator');
const { SIM_ID_PATTERN, EMAIL_REGEX, CHAT_ID } = require('../../../constants/validation');

exports.arrayOfObjectWithKeys = function(value, obj = []){
    // console.log(obj);
    if(!Array.isArray(value)){
        throw new Error('array required');
    } else if(value.length > 0){
        let errors = [];
        value.map((item) =>{
            return obj.filter(k => {
                if(typeof k === 'string'){
                    if(!Object.keys(item).includes(k)){
                        errors.push(`object must have the following key: ${k}`);
                    }
                } else if(!Object.keys(item).includes(k.index)){
                    errors.push(`object must have the following key: ${k.index}`);
                } else {
                    let current = item[k.index];
                    let valType = typeof current;
                    if(k.type === 'number'){
                        if(!(/^\d+$/.test(current))){
                            errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} required`);
                        }
                    } else if(k.type === 'float'){
                        if(!(/^[+-]?([0-9]*[.])?[0-9]+$/.test(current))){
                            errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} requried`);
                        }
                    } else if(typeof current !== k.type){
                        errors.push(`${k.index} has invalid value ${current} of type ${valType}, ${k.type} required`);
                    }
                }
            });
        });
        if(errors.length){
            throw new Error(errors.join())
        } else {
             return true;
        }
    } else {
        throw new Error('empty array is not allowed');
    }
}

exports.isObject = function(value){
    return (!Array.isArray(value) && Object.keys(value).length > 0);
}

exports.validateSimId = function(value){
    if(["", null, "N/A"].includes(value)){
        return true;
    } else if(SIM_ID_PATTERN.test(value)){
        return true;
    }
    throw new Error('Invalid value');
}

exports.validatePGPEmail = function(value, key){
    if(["", null, "N/A"].includes(value)){
        return true;
    } else if(EMAIL_REGEX.test(value)){
        return true;
    }
    throw new Error('Invalid value');
}

exports.validateChatId = function(value){
    if(["", null, "N/A"].includes(value)){
        return true;
    } else if(CHAT_ID.test(value)){
        return true;
    }
    throw new Error('Invalid value');
}