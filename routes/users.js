// ====== libraries
var express = require("express");
var router = express.Router();
var md5 = require("md5");
var empty = require("is-empty");

var multipart = require('connect-multiparty');
var multipartMiddleware = multipart();


// ========= Helper =============
const { sql } = require("../config/database");
// const sockets = require('../routes/sockets');

// var config = require('../helper/config.js');

var Constants = require("../constants/Application");
var MsgConstants = require("../constants/MsgConstants");
var app_constants = require("../config/constants");

var helpers = require("../helper/general_helper.js");
const device_helpers = require("../helper/device_helpers.js");

//=========== Custom Libraries =========
const constants = require("../config/constants");
const { sendEmail } = require("../lib/email");

// ========== Controllers ========
const userController = require('../app/controllers/user');
const authController = require('../app/controllers/auth');
const aclController = require('../app/controllers/acl');
const deviceController = require('../app/controllers/device');
const bulkDevicesController = require('../app/controllers/bulkDevices');
const dealerController = require('../app/controllers/dealer');
const policyController = require('../app/controllers/policy');
const accountController = require('../app/controllers/account');
const apkController = require('../app/controllers/apk');
const billingController = require('../app/controllers/billing');
const backupController = require('../app/controllers/backup');
const appController = require('../app/controllers/app');
const languageController = require('../app/controllers/language');
const simController = require('../app/controllers/sim');
const agentController = require('../app/controllers/agent');

const dashboardController = require('../app/controllers/dashboard');


// constants
const AUTO_UPDATE_ADMIN = "auto_update_admin";

// enable or disable two factor auth
router.post("/two_factor_auth", dealerController.twoFactorAuth);

/**
 * This function comment is parsed by doctrine
 * @route GET /users/get_allowed_components
 * @group ACL - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.get('/get_allowed_components', aclController.getAllowedComponents);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/check_component
 * @group ACL - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/check_component', aclController.checkComponent);


/**
 * @route GET /users/is_admin
 * @group ACL - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/** is_admin **/
router.get("/is_admin", aclController.isAdmin);

/**
 * @route GET /users/user_type
 * @group ACL - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/** get_user_type **/
router.get("/user_type", aclController.getUserType);

// ============== Devices ============ //

/**
 * @route GET /users/devices
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/**GET all the devices**/
router.get("/devices", deviceController.devices);

/**
 * @route PUT /users/new/device
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

// add new device
router.put("/new/device", deviceController.acceptDevice);

/**
 * @route GET /users/new/devices
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
/**GET New the devices**/
router.get("/new/devices", deviceController.newDevices);

/**
 * @route POST /users/create/device_profile
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/***Add devices (not using) ***/
// router.post('/create/device_profile', deviceController.createPreactivations);
router.post("/create/device_profile", deviceController.createDeviceProfile);


// TRANSFER MODULE

/**
 * @route POST /users/transfer/device_profile
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post("/transfer/device_profile", deviceController.transferDeviceProfile);



/**
 * @route POST /users/transfer/user
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post("/transfer/user", deviceController.transferUser);

router.get("/transfer/history/:device_id", deviceController.transferHistory);


/**UPDATE Device details**/
router.put("/edit/devices", deviceController.editDevices);

/**Devices record delete**/
router.put("/delete/:device_id", deviceController.deleteDevice);

/** Unlink Device  **/
router.post("/unlink/:id", deviceController.unlinkDevice);

/** Suspend Account Devices / client **/
router.post("/suspend/:id", deviceController.suspendAccountDevices);

/** Activate Device **/
router.post("/activate/:id", deviceController.activateDevice);

router.post("/wipe/:id", deviceController.wipeDevice);

router.post("/UnflagDevice/:id", deviceController.unflagDevice);

router.post("/flagDevice/:id", deviceController.flagDevice);

/**
 * This function comment is parsed by doctrine
 * @route GET /users/connect/{device_id}
 * @group Device - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/** Get Device Details of Dealers (Connect Page) **/
router.get("/connect/:device_id", deviceController.connectDevice);

/** Get get App Job Queue  (Connect Page) **/
router.get(
	"/getAppJobQueue/:device_id",
	deviceController.getAppJobQueueOfDevice
);
// resync device
router.patch("/sync-device", deviceController.resyncDevice);

/** Get Device Details of Dealers (Connect Page) **/
router.get("/get_apps/:device_id", deviceController.getAppsOfDevice);

router.put("/deleteUnlinkDevice", deviceController.deleteUnlinkDevice);

// ====================== Dangerous API ==================== //
// one time useage - menual end point // mi3afzal

// Update all existing Device IDs
// http://localhost:3000/users/devices/update_device_ids
router.get("/devices/update_device_ids", deviceController.updateDeviceIDs);

// Update all existing Dealer PINs
// http://localhost:3000/users/dealer/update_dealer_pins
router.get("/dealer/update_dealer_pins", dealerController.updateDealerPins);


// ====================== Dangerous API ==================== //
// one time useage - menual end point // mi3afzal

// Update all existing Device IDs
// http://localhost:3000/users/devices/update_device_ids
router.get("/devices/update_device_ids", deviceController.updateDeviceIDs);

// Update all existing Dealer PINs
// http://localhost:3000/users/dealer/update_dealer_pins
router.get("/dealer/update_dealer_pins", dealerController.updateDealerPins);




// ====================== Users ==================== //

/**
 * This function comment is parsed by doctrine
 * @route POST /users/add/user
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/*** Add User ***/
router.post("/add/user", userController.addUser);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/edit/user
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Edit User ***/
router.post('/edit/user', userController.editUser);

/**
 * This function comment is parsed by doctrine
 * @route PUT /users/delete_user/
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/*** DELETE User ***/
router.put("/delete_user/:user_id", userController.deleteUser);

/**
 * This function comment is parsed by doctrine
 * @route PUT /undo_delete_user/
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/***UNDO DELETE User ***/
router.put('/undo_delete_user/:user_id', userController.undoDeleteUser);

/**
 * This function comment is parsed by doctrine
 * @route PUT /users/updateProfile/{id}
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/**UPDATE Profile details  **/
router.put('/updateProfile/:id', userController.updateProfile);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/resetpwd
 * @group Dealer User - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */


/** Reset password dealers (Admin Panel) **/
router.post("/resetpwd", dealerController.resetPwd);


// =================== Dealers ================= //

/**
 * This function comment is parsed by doctrine
 * @route GET /users/dealers
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*Get All Dealers */
router.get("/dealers", dealerController.getAllDealers);

/**
 * This function comment is parsed by doctrine
 * @route GET /users/dealers/{pagename}
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*Get dealers*/
router.get("/dealers/:pageName", dealerController.getDealers);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/add/dealer
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Add Dealer ***/
router.post("/add/dealer", dealerController.addDealer);

/**
 * This function comment is parsed by doctrine
 * @route PUT /users/edit/dealer
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Edit Dealer (Admin panel) **/
router.put("/edit/dealers", dealerController.editDealers);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/dealer/delete
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Delete Dealer from admin Panel**/
router.post("/dealer/delete/", dealerController.deleteDealer);

/** Undo Dealer / S-Dealer **/
router.post("/dealer/undo", dealerController.undoDealer);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/dealer/suspend
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Suspend Dealer **/
router.post("/dealer/suspend", dealerController.suspendDealer);

/**
 * This function comment is parsed by doctrine
 * @route POST /users/dealer/activate
 * @group Dealer - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Activate Dealer **/
router.post("/dealer/activate", dealerController.activateDealer);

/** Get Dropdown Selected Items **/
router.get(
	"/dealer/gtdropdown/:dropdownType",
	dealerController.getDropdownSelectedItems
);

router.post("/dealer/dropdown", dealerController.dropDown);

router.get(
	"/dealer/getPagination/:dropdownType",
	dealerController.getPagination
);

router.post("/dealer/postPagination", dealerController.postPagination);

/** Dealer and S Dealer Info **/
router.get("/getinfo", dealerController.getInfo);

/** Get logged in Dealer permitted apps  **/

router.get('/get_dealer_apps', dealerController.getLoggedDealerApps);

router.get('/get_usr_acc_id/:device_id', async function (req, res) {
	var verify = req.decoded;

	// if (verify.status !== undefined && verify.status == true) {
	if (verify) {
		//console.log('id is the ', req.params);
		let query = "select usr_acc.id from usr_acc left join devices on devices.id=usr_acc.device_id where devices.device_id='" + req.params.device_id + "'";

		await sql.query(query, async (error, rslt) => {
			// console.log(query, 'rslt id ', rslt)
			res.send({
				status: true,
				user_acount_id: rslt[0].id,
			});
		})
	}
})

router.get('/get_app_permissions', appController.getAppPermissions);


// =========== Policy ============= //

// policy name should be unique
/**
 * @route GET /users/get_policies
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get_policies', policyController.getPolicies);

/**
 * @route POST /users/change_policy_status
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/change_policy_status', policyController.changePolicyStatus);

/**
 * @route PUT /users/save_policy_changes
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/save_policy_changes', policyController.savePolicyChanges);

/**
 * @route POST /users/check_policy_name
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/check_policy_name', policyController.checkPolicyName);

/**
 * @route POST /users/save_policy
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/save_policy', policyController.savePolicy);

/**
 * @route POST /users/apply_policy/:device_id
 * @group Policy - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/apply_policy/:device_id', policyController.applyPolicy);


router.get("/get_usr_acc_id/:device_id", async function (req, res) {
	var verify = req.decoded;

	// if (verify.status !== undefined && verify.status == true) {
	if (verify) {
		//console.log('id is the ', req.params);
		let query =
			"select usr_acc.id from usr_acc left join devices on devices.id=usr_acc.device_id where devices.device_id='" +
			req.params.device_id +
			"'";

		await sql.query(query, async (error, rslt) => {
			// console.log(query, 'rslt id ', rslt)
			res.send({
				status: true,
				user_acount_id: rslt[0].id
			});
		});
	}
});

router.get("/get_app_permissions", appController.getAppPermissions);


// policy name should be unique


router.post("/save/profile", accountController.saveProfile);

router.post("/apply_settings/:device_id", deviceController.applySettings);

router.post("/apply_pushapps/:device_id", deviceController.applyPushApps);

router.post("/apply_pullapps/:device_id", deviceController.applyPullApps);

router.post("/get_profiles", accountController.getProfiles);

router.post("/get_device_history", deviceController.getDeviceHistory);

router.post("/save_new_data", accountController.saveNewData);

// import sims
router.post("/import/:fieldName", accountController.importIDs);

router.get("/export/:fieldName", accountController.exportIDs);

router.get("/get_sim_ids", accountController.getSimIDs);

router.get("/get_all_sim_ids", accountController.getAllSimIDs);

router.get("/resync_ids", accountController.getAllSimIDs);

// router.get('/get_used_sim_ids', accountController.getUsedSimIDs);

router.get("/get_chat_ids", accountController.getChatIDs);

router.get("/get_all_chat_ids", accountController.getAllChatIDs);

router.get("/get_used_chat_ids", accountController.getUsedChatIDs);

router.get("/get_pgp_emails", accountController.getPGPEmails);

router.get("/get_all_pgp_emails", accountController.getAllPGPEmails);

router.get("/get_used_pgp_emails", accountController.getUsedPGPEmails);

router.get("/get_used_sim_ids", accountController.getUsedSimIDs);

// router.get('/get_packages', accountController.getPackages);

router.post("/delete_CSV_ids/:fieldName", accountController.deleteCSV);

/**
 * @route GET /users/apklist
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get Apk List Admin Panel **/
router.get('/apklist', apkController.apkList);

/** Get Apk List Admin Panel **/
/**
 * @route POST /users/upload
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// upload test apk
router.post('/upload', multipartMiddleware, apkController.upload);


/**
 * @route POST /users/checkApkName
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

// add apk. endpoints name should be changed
router.post("/checkApkName", apkController.checkApkName);

/**
 * @route POST /users/addApk
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// add apk. endpoints name should be changed
router.post("/addApk", apkController.addApk);

/**
 * @route POST /users/edit/apk
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Edit Apk (Admin panel) **/
router.post("/edit/apk", apkController.editApk);

/**
 * @route POST /users/apk/delete
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/**Delete Apk**/
router.post("/apk/delete", apkController.deleteApk);

/**
 * @route POST /users/toggle
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Toggle Apk Admin Panel (On / Off) **/
router.post("/toggle", apkController.toggle);

/**
 * @route POST /users/save_apk_permissions
 * @group APK - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Save apk Permissions**/
router.post("/save_apk_permissions", apkController.saveApkPermission);

// Purchase credits_CASH
router.post("/purchase_credits", accountController.purchaseCredits);

// Purchase credits form Credit card
router.post("/purchase_credits_CC", accountController.purchaseCredits_CC);

/** Save Policy Permission **/
router.post('/save_policy_permissions', apkController.savePolicyPermissions);

/**
 * @route POST /users/login_history
 * @group Dealer Profile - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

//GET logion history
router.get("/login_history", async function (req, res) {
	try {
		var verify = req.decoded;

		// if (verify.status !== undefined && verify.status == true) {
		if (verify) {
			let id = verify.user.id;
			let data = {};
			let query =
				"SELECT * from login_history where dealer_id = '" +
				id +
				"' AND type = 'token' order by created_at desc";
			// console.log(query);
			sql.query(query, async function (err, result) {
				if (err) {
					console.log(err);
				}
				if (result.length) {
					data = {
						status: true,
						data: result
					};
					res.send(data);
				} else {
					data = {
						status: false,
						data: []
					};
					res.send(data);
				}
			});
		}
	} catch (error) {
		console.log(error);
	}
});

router.delete("/delete_profile/:profile_id", userController.checkProfile);

/**
 * @route POST /users/check_pass
 * @group Dealer Profile - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

// check prviouse password
router.post("/check_pass", userController.checkPrevPass);

// Get Imei history
router.get("/get_imei_history/:device_id", deviceController.getIMEI_History);

/*Get All users */
router.get("/userList", userController.getAllUsers);

/*Transfer Apps to secure market */
router.post("/transferApps", appController.trasnferApps);

/** Get Market app List **/

router.get("/marketApplist", appController.marketApplist);

// Change unistall app restriction for Secure market apps
router.put("/handleUninstall/:apk_id", apkController.handleUninstallApk);

// Write IMEI on device
router.post("/writeImei/:device_id", deviceController.writeIMEI);

// get activities
router.get("/get_activities/:device_id", deviceController.getActivities);

// set default for w.r.t dealer
router.post("/set_default_policy", policyController.setDefaultPolicy);

router.put("/force_update", async function (req, res) {
	var verify = req.decoded;

	// if (verify['status'] !== undefined && verify.status === true) {
	if (verify) {
		let device_id = req.body.device_id;
		let dealer_id = verify.user.id;
		if (!empty(device_id)) {
			let deviceQ =
				"SELECT * FROM devices WHERE device_id='" + device_id + "'";
			let device = await sql.query(deviceQ);
			if (device.length) {
				if (device[0].online === Constants.DEVICE_ONLINE) {
					// require('../bin/www').forceCheckUpdate(device[0].device_id);
					require("../bin/www").forceCheckUpdate(device[0].device_id);
					data = {
						status: true,
						msg: await helpers.convertToLang(
							req.translation[
							MsgConstants.FORCE_UPDATE_HAS_BEEN_APPLIED
							],
							"force update has been applied"
						) // "force update has been applied"
					};
					res.send(data);
				} else {
					let usr_acc = await device_helpers.getUserAccByDeviceId(
						device_id
					);
					let historyQ =
						"INSERT INTO device_history (device_id, dealer_id, user_acc_id, type) VALUES ('" +
						device_id +
						"', " +
						dealer_id +
						", " +
						usr_acc.id +
						", '" +
						Constants.DEVICE_HISTORY_FORCE_UPDATE +
						"')";
					sql.query(historyQ, async function (error, resp) {
						if (error) {
							console.log(error);
						}
						data = {
							status: true,
							msg: await helpers.convertToLang(
								req.translation[
								MsgConstants.FORCE_UPDATE_WILL_APPLY
								],
								"force update will apply when device will come online"
							) // "force update will apply when device will come online"
						};
						res.send(data);
					});
				}
			} else {
				data = {
					status: false,
					msg: await helpers.convertToLang(
						req.translation[MsgConstants.DEVICE_NOT_FOUND],
						"Device not Found"
					) // "Device not Found"
				};
				res.send(data);
			}
		} else {
			data = {
				status: false,
				msg: await helpers.convertToLang(
					req.translation[MsgConstants.DEVICE_NOT_FOUND],
					"Device not Found"
				) // "Device not Found"
			};
			res.send(data);
		}
	}
});

/*****AUTHENTICATE UPDATE USER*****/
router.post("/authenticate_update_user", async function (req, res) {
	var email = req.body.email;
	var pwd = req.body.pwd;
	console.log(pwd);
	var enc_pwd = md5(pwd);
	var data = "";
	var userType = await helpers.getDealerTypeIdByName(AUTO_UPDATE_ADMIN);
	var verify = req.decoded;

	if (verify) {
		// console.log("select * from dealers where type = '" + userType + "' and dealer_email='" + email + "' and password='" + enc_pwd + "'");
		let query_res = await sql.query(
			"select * from dealers where type = '" +
			userType +
			"' and dealer_email='" +
			email +
			"' and password='" +
			enc_pwd +
			"'"
		);
		if (query_res.length) {
			data = {
				status: true,
				matched: true,
				msg: "" // await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], ""),
			};
			res.send(data);
			return;
		} else {
			data = {
				status: false,
				matched: false,
				msg: "" // await helpers.convertToLang(req.translation[MsgConstants.DEVICE_NOT_FOUND], ""),
			};
			res.send(data);
			return;
		}
	} else {
		data = {
			status: false,
			matched: false,
			msg: await helpers.convertToLang(
				req.translation[MsgConstants.INVALID_EMAIL_OR_PASSWORD],
				"Invalid email or password. Please try again"
			) // Invalid email or password. Please try again
		};
		res.send(data);
		return;
	}
});

// *****************************  SET AND GET => PRICES & PAKAGES   **************************
router.patch("/save-prices", billingController.savePrices);

router.post("/save-package", billingController.savePackage);

router.get("/get-language", languageController.getLanguage);

router.patch("/save-language", languageController.saveLanguage);

router.get("/get-prices", billingController.getPrices);

router.get("/get-packages", billingController.getPackages);

router.get("/get-parent-packages", billingController.getParentPackages);

router.patch("/check-package-name", billingController.checkPackageName);

router.post("/update_credit", billingController.updateCredit);

router.get("/newRequests", billingController.newRequests);

router.get("/get_user_credits", billingController.getUserCredits);

router.put("/delete_request/:id", billingController.deleteRequest);

router.put("/accept_request/:id", billingController.acceptRequest);

/*** Create Backup ***/
router.post("/create_backup_DB", backupController.createBackupDB);

router.get("/get_csv_ids", async (req, res) => {
	var verify = req.decoded;
	if (verify) {
		let pgp_query = "select * from pgp_emails";
		let pgp_emails = await sql.query(pgp_query);
		let chat_query = "select * from chat_ids";
		let chat_ids = await sql.query(chat_query);
		let sim_query = "select * from sim_ids";
		let sim_ids = await sql.query(sim_query);

		res.send({
			status: true,
			pgp_emails,
			chat_ids,
			sim_ids
		});
		return;
	} else {
		res.send({
			status: false
		});
		return;
	}
});

// Sim Module at connect device
router.post("/sim-register", simController.simRegister);
router.put("/sim-update", simController.simUpdate);
router.post("/sim-delete", simController.simDelete);
router.get("/get-sims/:device_id", simController.getSims);
router.get("/sim-history/:device_id", simController.simHistory);

// Agents

/**
 * @route GET /users/agents
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/agents', agentController.getAgentList);

/**
 * @route POST /users/agents
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/agents', agentController.addAgent);

/**
 * @route PUT /users/agents/{agentID}
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID', agentController.updateAgent);

/**
 * @route PUT /users/agents/{agentID}/status
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID/status', agentController.changeStatus);

/**
 * @route PUT /users/agents/{agentID}/reset-pwd
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID/reset-pwd', agentController.resetPwd);

/**
 * @route DELETE /users/agents
 * @group Agents - Operations about Dealer Agents
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.delete('/agents/:agentID', agentController.deleteAgent);

// Dashboard

/**
 * @route GET /users/dashboard-data
 * @group Dashboard - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/dashboard-data', dashboardController.getDashboardData);



// Filtered Bulk Devices

/**
 * @route POST /users/filtered-bulkDevices
 * @group BulkDevices - Operations about BulkDevices
 * @returns {object} 200 - An array of BulkDevices items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/filtered-bulkDevices', bulkDevicesController.getFilteredBulkDevices);


/** Suspend Account Devices / client **/
router.post("/suspend", bulkDevicesController.suspendBulkAccountDevices);

// /** Activate Device **/
// router.post("/activate/:id", bulkDevicesController.activateDevice);

// /** Unlink Device  **/
// router.post("/unlink/:id", bulkDevicesController.unlinkDevice);

// router.post("/wipe/:id", bulkDevicesController.wipeDevice);


module.exports = router;
