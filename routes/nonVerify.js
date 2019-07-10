



var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var backupController = require('../app/controllers/backup')
const helpers = require('../helper/general_helper');
var MsgConstants = require('../constants/MsgConstants');


/** Get back up DB File **/
router.get("/getBackupFile/:file", backupController.getBackupFiles);
/** Get image logo **/
router.get("/getFile/:file", async function (req, res) {
    // var loggedInuid = req.decoded.user.id;
    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.file))) {
        let file = path.join(__dirname, "../uploads/" + req.params.file);
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        res.set('Content-Type', fileMimeType); // mimeType eg. 'image/bmp'
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
        // } else {
        //     res.send({
        //         "status": false,
        //         "msg": await helpers.convertToLang(req.translation[MsgConstants.DEALER_ACTIV_SUCC], MsgConstants.DEALER_ACTIV_SUCC), // file not found"
        //     })
        // }
    } else {
        data = {
            "status": false,
            "msg": "file not found", //  await helpers.convertToLang(req.translation[MsgConstants.FILE_NOT_FOUND], MsgConstants.FILE_NOT_FOUND),
        }
        res.send(data)
    }

});


module.exports = router;
