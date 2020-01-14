var express = require('express');
var router  = express.Router();

router.post('/', (req, res) => {
    let verify = req.decoded;
    res.send(verify)
});

module.exports = router;