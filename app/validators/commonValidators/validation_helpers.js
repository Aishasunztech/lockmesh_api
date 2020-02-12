const { check, custom } = require('express-validator');

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
                    if(k.type === 'number'){
                        let n = parseInt(current);
                        if(isNaN(n)){
                            errors.push(`${k.index} has invalid value ${current}, ${k.type} required`);
                        }
                    } else if(k.type === 'float'){
                        let n2 = parseFloat(current);
                        if(isNaN(n2)){
                            errors.push(`${k.index} has invalid value ${current}, ${k.type} requried`);
                        }
                    } else if(typeof current !== k.type){
                        errors.push(`${k.index} has invalid value ${current}, ${k.type} required`);
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


// exports.arrayOfObjectWithKeys = function(value){
//     if(typeof value !== 'string'){
//         throw new Error('string required');
//     }
//     // return true;
// }