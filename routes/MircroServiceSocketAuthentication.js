let express             = require('express');
let router              = express.Router();
const device_helpers    = require('../helper/device_helpers.js');
var jwt                 = require('jsonwebtoken');
const app_constants     = require('../config/constants');

router.post('/', (req, res) => {
    let token = req.body.token;

    if (device_helpers.checkNotNull(token)) {

        return jwt.verify(token.replace(/['"]+/g, ''), app_constants.SECRET, function (err, decoded) {
            if (err) {
                res.send({
                    status: false
                })
            } else {
                res.send({
                    status: true
                })
            }
        });
    } else {
        res.send({
            status: false
        })
    }
});

module.exports = router;