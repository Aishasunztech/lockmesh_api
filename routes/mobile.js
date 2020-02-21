var express = require('express');
var router = express.Router();


const mobileController = require('../app/controllers/mobile');
// const mobileValidator = require('../app/validators/mobileValidations');



/* Client Login with Link Code MDM without token */
router.post('/login', mobileController.login);

// system control login, secure market login
router.post('/systemlogin', mobileController.systemLogin);

/** Link Device MDM **/
router.post('/linkdevice', mobileController.linkDevice);

/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', mobileController.getStatus);

/** Stop linking Device / Delete device MDM **/

router.delete('/unlink/:macAddr/:serialNo', mobileController.stopLinking);


/* Screen Lock Get Status of Apk  */
router.get('/apklist', mobileController.installAppList);


router.get('/getUpdate/:version/:packageName/:label', mobileController.checkForUpdate);

/** Get Apk **/
router.get("/getApk/:apk", mobileController.getUpdate);

/** New API MDM Client App (11th.Oct.2018) **/

/** Get status of device (active,expired,inactive) **/
router.post('/device_status', mobileController.deviceStatus);

router.post('/imeiChanged', mobileController.IMEIChanged);

router.get('/admin/marketApplist', mobileController.adminSMAppList);

router.get('/marketApplist/:linkCode', mobileController.SMAppList);

module.exports = router;