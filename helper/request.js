'use strict'
const request = require('request-promise');
exports.getRequest = function getRequest(urlAPI) {
    return new Promise(function (fulfill, reject) {
        var options = {
            uri: urlAPI,
        };
        request(options).then(function (body) {
            try {
                let current = JSON.parse(body);
                fulfill(current);
            } catch (e) {
                //logger.info(body);
                //logger.info("Error parsing JSON");
                //logger.error(e);
				console.log("Error parsing JSON");
                reject(e);
            }
        }).catch(function (err) {
            reject(err);
            //logger.info("Error from Request Call");
            //logger.error(err);
			console.log("Error from Request Call");
        })
    })
}