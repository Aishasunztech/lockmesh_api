const { check, custom } = require('express-validator');

exports.arrayOfObjectWithKeys = function(value, obj = []){
    if(!Array.isArray(value)){
        throw new Error('array required');
    } else if(value.length){
        value.map(item =>{
            obj.map(k => {
                if(!Object.keys(item).includes(k.index)){
                    throw new Error(`object must have the following key: ${k.index}`)
                } else {
                    let current = item[k.index];
                    if(k.type === 'number'){
                        let n = parseInt(current);
                        if(isNaN(n)){
                            throw new Error(`${k.index} must be of the following type: ${k.type}`);
                        }
                    } else if(k.type === 'float'){
                        let n2 = parseFloat(current);
                        if(isNaN(n2)){
                            throw new Error(`${k.index} must be of the following type: ${k.type}`);
                        }
                    } else if(typeof current !== k.type){
                        throw new Error(`${k.index} must be of the following type: ${k.type}`);
                    }
                }
            })
        })
    } else {
        throw new Error('empty array is not allowed');
    }
}