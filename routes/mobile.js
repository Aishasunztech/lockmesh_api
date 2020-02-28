var express = require('express');
var router = express.Router();

//***************** Validations **********************/ 
const commonValidators = require('../app/validators/commonValidators');
const mobileValidators = require('../app/validators/mobile');

var errorMsgs = commonValidators.responsValidationResults;

// ========== Controllers ========
const mobileController = require('../app/controllers/mobile');
// const mobileValidator = require('../app/validators/mobileValidations');


/* Client Login with Link Code MDM without token */
router.post('/login', [mobileValidators.login, errorMsgs], mobileController.login);

// system control login, secure market login
router.post('/systemlogin', [mobileValidators.systemLogin, errorMsgs], mobileController.systemLogin);

/** Link Device MDM **/
router.post('/linkdevice', [mobileValidators.linkDevice, errorMsgs], mobileController.linkDevice);

/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', [mobileValidators.getStatus, errorMsgs], mobileController.getStatus);

/** Stop linking Device / Delete device MDM **/

router.delete('/unlink/:macAddr/:serialNo', [mobileValidators.stopLinking, errorMsgs], mobileController.stopLinking);


/* Screen Lock Get Status of Apk  */
router.get('/apklist', [mobileValidators.installAppList, errorMsgs], mobileController.installAppList);


router.get('/getUpdate/:version/:packageName/:label', [mobileValidators.checkForUpdate, errorMsgs], mobileController.checkForUpdate);

/** Get Apk **/
router.get("/getApk/:apk", [mobileValidators.getUpdate, errorMsgs], mobileController.getUpdate);

/** New API MDM Client App (11th.Oct.2018) **/

/** Get status of device (active,expired,inactive) **/
router.post('/device_status', [mobileValidators.deviceStatus, errorMsgs], mobileController.deviceStatus);

router.post('/imeiChanged', [mobileValidators.IMEIChanged, errorMsgs], mobileController.IMEIChanged);

router.get('/admin/marketApplist', [mobileValidators.adminSMAppList, errorMsgs], mobileController.adminSMAppList);

router.get('/marketApplist/:linkCode', [mobileValidators.SMAppList, errorMsgs], mobileController.SMAppList);

module.exports = router;