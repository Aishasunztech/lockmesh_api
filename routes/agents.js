var express = require('express');
var router = express.Router();


router.get("/testing", function(req, res){
    
    res.send("hello testing");

})

module.exports = router;