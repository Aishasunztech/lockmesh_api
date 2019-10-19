var express = require('express');
var router = express.Router();

const mobileController = require('../app/controllers/mobile');
const mobileValidator = require('../app/validators/mobile_validators');


/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/systemlogin
 * @group Mobile - Mobile APIs Actions
 * @param {string} imei1.formData.required -
 * @param {string} imei2.formData.required -
 * @param {string} simNo1.formData.required -
 * @param {string} simNo2.formData.required -
 * @param {string} serial_number.formData.required -
 * @param {string} ip.formData.required -
 * @param {string} mac_address.formData.required -
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** system control login, secure market login **/
router.post('/systemlogin', mobileController.systemLogin);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/login
 * @group Mobile - Mobile APIs Actions
 * @param {string} imei1.formData.required -
 * @param {string} imei2.formData.required -
 * @param {string} simNo1.formData.required -
 * @param {string} simNo2.formData.required -
 * @param {string} serial_number.formData.required -
 * @param {string} ip.formData.required -
 * @param {string} mac_address.formData.required -
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Client Login with Link Code MDM without token **/
router.post('/login', mobileController.login);


/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Link Device MDM **/
router.post('/linkdevice', mobileController.linkDevice);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/getstatus
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Device status (Added Device or not) api  MDM **/
router.post('/getstatus', mobileController.getStatus);

/**
 * This function comment is parsed by doctrine
 * @route DELETE /mobile/unlink/{macAddr}/{serialNo}
 * @group Mobile - Mobile APIs Actions
 * @param {string} macAddr.path.required - 
 * @param {string} serialNo.path.required - 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Stop linking Device / Delete device MDM **/
router.delete('/unlink/:macAddr/:serialNo', mobileValidator.stopLinking, mobileController.stopLinking);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/* Screen Lock Get Status of Apk  */
router.get('/apklist', mobileController.installAppList);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/getUpdate/:version/:packageName/:label', mobileController.checkForUpdate);

/** Get Apk **/
router.get("/getApk/:apk", mobileController.getUpdate);

/** New API MDM Client App (11th.Oct.2018) **/

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Get status of device (active,expired,inactive) **/
router.post('/device_status', mobileController.deviceStatus);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** IMEI changed API **/
router.post('/imeiChanged', mobileController.IMEIChanged);

/**
 * This function comment is parsed by doctrine
 * @route GET /mobile/admin/marketApplist
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Secure Market AppList for Admin **/
router.get('/admin/marketApplist', mobileController.adminSMAppList);

/**
 * This function comment is parsed by doctrine
 * @route POST /mobile/linkdevice
 * @group Mobile - Mobile APIs Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/** Secure Market AppList for dealers **/
router.get('/marketApplist/:linkCode', mobileController.SMAppList);

module.exports = router;