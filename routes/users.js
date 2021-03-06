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
// var app_constants = require("../config/constants");

var helpers = require("../helper/general_helper.js");
const device_helpers = require("../helper/device_helpers.js");

//=========== Custom Libraries =========
// const constants = require("../config/constants");
// const { sendEmail } = require("../lib/email");

// ========== Controllers ========
const userController = require('../app/controllers/user');
const bulkDevicesController = require('../app/controllers/bulkDevices');
// const authController = require('../app/controllers/auth');
const aclController = require('../app/controllers/acl');
const deviceController = require('../app/controllers/device');
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
const reportingController = require('../app/controllers/reports');
const dashboardController = require('../app/controllers/dashboard');
const NotificationController = require('../app/controllers/notification');
const ServicesController = require('../app/controllers/services');



// constants
// const AUTO_UPDATE_ADMIN = "auto_update_admin";

// enable or disable two factor auth
router.post("/two_factor_auth", dealerController.twoFactorAuth);

/**
 * @route GET /users/get_allowed_components
 * @group ACL - Admin Control List Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get_allowed_components', aclController.getAllowedComponents);

/**
 * @route POST /users/check_component
 * @group ACL - Admin Control List Actions
 * @param {string} ComponentUri.formData.required - component url
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */
router.post('/check_component', aclController.checkComponent);


/**
 * @route GET /users/is_admin
 * @group ACL - Admin Control List Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/** is_admin **/
router.get("/is_admin", aclController.isAdmin);

/**
 * @route GET /users/user_type
 * @group ACL - Admin Control List Actions
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 */

/** get_user_type **/
router.get("/user_type", aclController.getUserType);

// ============== Devices ============ //

/**
 * @route GET /users/devices
 * @group Device - Operation about Devices
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/**GET all the devices**/
router.get("/devices", deviceController.devices);
router.get("/get-devices-for-report", deviceController.getDevicesForReport);

/**
 * @route PUT /users/new/device
 * @group Device - Operation about Devices
 * @param {string} user_id.formData.required - user id
 * @param {string} device_id.formData.required - device id
 * @param {string} client_id.formData.required - client id
 * @param {string} model.formData - model
 * @param {integer} dealer_id.formData.required - dealer id
 * @param {string} connected_dealer.formData.required - connected dealer
 * @param {string} usr_acc_id.formData.required - user account id
 * @param {string} usr_device_id.formData.required - user device id
 * @param {string} policy_id.formData - policy id
 * @param {string} sim_id.formData - sim id
 * @param {string} chat_id.formData - chat id
 * @param {string} pgp_email.formData - pgp email
 * @param {integer} expiry_date.formData.required - expiry date
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

// add new device
router.put("/new/device", deviceController.acceptDevice);

/**
 * @route GET /users/new/devices
 * @group Device - Operation about Devices
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/**GET New the devices**/
router.get("/new/devices", deviceController.newDevices);



/***Add devices (not using) ***/
/**
 * @route POST /users/create/device_profile
 * @group Device - Operation about Devices
 * @param {string} client_id.formData.required - client id
 * @param {string} chat_id.formData - chat id
 * @param {string} model.formData - model
 * @param {string} user_id.formData.required - user id
 * @param {Date} start_date.formData.required - Start date
 * @param {string} pgp_email.formData.required - pgp email
 * @param {string} note.formData - note
 * @param {string} validity.formData.required - validity day
 * @param {number} duplicate.formData -  No of duplicate devices
 * @param {string} expiry_date.formData.required - expiry date
 * @param {string} sim_id.formData.required - sim id
 * @param {string} policy_id.formData - policy id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/create/device_profile", deviceController.createDeviceProfile);


// TRANSFER MODULE

/**
 * @route POST /users/transfer/device_profile
 * @group Device - Operation about Devices
 * @param {object} flagged_device.formData.required - flaged device
 * @param {object} reqDevice.formData.required - device on which flaged device will be transfered 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/transfer/device_profile", deviceController.transferDeviceProfile);



/**
 * @route POST /users/transfer/user
 * @group Device - Operation about Devices
 * @param {object} NewUser.formData.required - new user
 * @param {object} OldUser.formData.required - old user
 * @param {string} OldUsr_device_id.formData.required - old user device id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/transfer/user", deviceController.transferUser);

router.get("/transfer/history/:device_id", deviceController.transferHistory);

router.get("/getServicesHistory/:usr_acc_id", deviceController.getServicesHistory);


/**UPDATE Device details**/
router.put("/edit/devices", deviceController.editDevice);

/**EXTEND SERVICE**/
router.put("/edit-device/extendServices", deviceController.extendServices);

/**CANCEL EXTEND SERVICE**/
router.put("/cancel-extended-services", deviceController.cancelExtendedServices);

/**UPDATE Device details**/
router.post('/check-service-refund-credits', deviceController.getServiceRefund);

/**Devices record delete**/
router.put("/delete/:device_id", deviceController.deleteDevice);

/** Unlink Device  **/
router.post("/unlink/:id", deviceController.unlinkDevice);

/** Relink Device  **/
router.put("/relink-device/:id", deviceController.relinkDevice);

/** Suspend Account Devices / client **/
router.post("/suspend/:id", deviceController.suspendAccountDevices);

/** Activate Device **/
router.post("/activate/:id", deviceController.activateDevice);

router.post("/wipe/:id", deviceController.wipeDevice);

router.post("/UnflagDevice/:id", deviceController.unflagDevice);

router.post("/flagDevice/:id", deviceController.flagDevice);

/**
 * @route GET /users/connect/{device_id}
 * @group Device - Operation about Devices
 * @param {string} device_id.path.required - agent email
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get Devices (Connect Page) **/
router.get("/connect/get-device-list", deviceController.getDevicesForConnectPage);

/** Get Device Details of Dealers (Connect Page) **/
router.get("/connect/:device_id", deviceController.connectDevice);


/** Get Device Billing history of device (Connect Page) **/
router.get("/get-billing-history/:user_acc_id/:dealer_id", deviceController.getDeviceBillingHistory);



/** Get get App Job Queue  (Connect Page) **/
router.get("/getAppJobQueue/:device_id", deviceController.getAppJobQueueOfDevice);

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


// ====================== Users ==================== //

/**
 * @route POST /users/add/user
 * @group Dealer User - Dealer Users Operations
 * @param {string} name.formData.required - user name
 * @param {string} email.formData.required - user email
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/*** Add User ***/
router.post("/add/user", userController.addUser);

/**
 * @route POST /users/edit/user
 * @group Dealer User - Dealer Users Operations
 * @param {string} name.formData.required - user name
 * @param {string} email.formData.required - user email
 * @param {string} user_id.formData.required - user id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Edit User ***/
router.post('/edit/user', userController.editUser);

/**
 * @route PUT /users/delete_user/{user_id}
 * @group Dealer User - Dealer Users Operations
 * @param {string} user_id.path.required - user id 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/*** DELETE User ***/
router.put("/delete_user/:user_id", userController.deleteUser);

/**
 * @route PUT /users/undo_delete_user/{user_id}
 * @group Dealer User - Dealer Users Operations
 * @param {string} user_id.path.required - user id 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/***UNDO DELETE User ***/
router.put('/undo_delete_user/:user_id', userController.undoDeleteUser);


// =================== Profiles ================= //

/**
 * @route PUT /users/updateProfile/{id}
 * @group Dealer User - Dealer Users Operations
 * @param {string} name.formData.required - dealer name
 * @param {string} dealerId.formData.required - dealer id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/**UPDATE Profile details  **/
router.put('/updateProfile/:id', userController.updateProfile);

/**
 * @route POST /users/resetpwd
 * @group Dealer User - Dealer Users Operations
 * @param {string} pageName.formData.required - page name 
 * @param {string} dealer_id.formData.required - dealer id
 * @param {string} dealer_email.formData.required - dealer email
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Reset password dealers (Admin Panel) **/
router.post("/resetpwd", dealerController.resetPwd);

router.post("/set-timezone", dealerController.setTimeZone);

/**
 * @route GET /users/get-info
 * @group Dealer - Operations about Dealers
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Dealer and S Dealer Info **/
router.get("/get-info", dealerController.getInfo);


// =================== Dealers ================= //

/**
 * @route GET /users/dealers
 * @group Dealer - Operations about Dealers
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*Get All Dealers */
router.get("/dealers", dealerController.getAllDealers);

/**
 * @route GET /users/user_dealers
 * @group Dealer - Operations about Dealers
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*Get User Dealers */
router.get('/user_dealers', dealerController.getUserDealers);

/*Get All Dealers FOR SUPER_ADMIN*/
router.get('/get_dealer_list', dealerController.getDealerForSA);

/**
 * @route GET /users/dealers/{pageName}
 * @group Dealer - Operations about Dealers
 * @param {string} pageName.path.required - page name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*Get dealers*/
router.get("/dealers/:pageName", dealerController.getDealers);
router.get("/get-all-dealers", dealerController.getAllToAllDealers);
router.get("/get-admin", dealerController.getAdmin);

/**
 * @route POST /users/add/dealer
 * @group Dealer - Operations about Dealers
 * @param {string} name.formData.required - dealer name
 * @param {string} email.formData.required - dealer email
 * @param {string} pageType.formData.required - page type 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/*** Add Dealer ***/
router.post("/add/dealer", dealerController.addDealer);

/**
 * @route PUT /users/edit/dealers
 * @group Dealer - Operations about Dealers
 * @param {string} name.formData.required - dealer name 
 * @param {string} email.formData.required - dealer email 
 * @param {integer} dealer_id.formData.required - dealer id 
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/** Edit Dealer (Admin panel) **/
router.put("/edit/dealers", dealerController.editDealers);

/**
 * @route POST /users/dealer/delete
 * @group Dealer - Operations about Dealers
 * @param {string} dealer_id.formData.required - dealer id  
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Delete Dealer from admin Panel**/
router.post("/dealer/delete/", dealerController.deleteDealer);
/**
 * @route POST /users/dealer/undo
 * @group Dealer - Operations about Dealers
 * @param {string} dealer_id.formData.required - dealer id  
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Undo Dealer / S-Dealer **/
router.post("/dealer/undo", dealerController.undoDealer);

/**
 * @route POST /users/dealer/suspend
 * @group Dealer - Operations about Dealers
 * @param {string} dealer_id.formData.required - dealer id   
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Suspend Dealer **/
router.post("/dealer/suspend", dealerController.suspendDealer);

/**
 * @route POST /users/dealer/activate
 * @group Dealer - Operations about Dealers
 * @param {string} dealer_id.formData.required - dealer id    
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Activate Dealer **/
router.post("/dealer/activate", dealerController.activateDealer);

/**UPDATE DEALER DEMOS LIMIT**/
router.put("/set_demos_limit", dealerController.setDealerDemosLimit);

/**
 * @route GET /users/get_dealer_apps
 * @group Dealer - Operations about Dealers
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get logged in Dealer permitted apps  **/

router.get('/get_dealer_apps', dealerController.getLoggedDealerApps);
/**
 * @route GET /users/get_usr_acc_id/{device_id}
 * @group Dealer - Operations about Dealers
 * @param {string} device_id.path.required - device id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get user account id by device id **/
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


// =================== Connect Dealer ================= //

/**
 * @route GET /users/connect-dealer/:dealerId
 * @group Dealer - Operations about Dealers
 * @param {string} dealerId.param.required - dealer name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Connect Dealer ***/
router.get("/connect-dealer/:dealerId", dealerController.connectDealer);

/**
 * @route GET /users/dealer-domains/:dealerId
 * @group Dealer - Operations about Dealers
 * @param {string} dealerId.param.required - dealer name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/dealer-domains/:dealerId", dealerController.dealerDomains)

router.post("/dealer-domain-permissions", dealerController.connectDealerDomainsPermissions);

/**
 * @route GET /users/payment-history/:dealerId
 * @group Dealer - Operations about Dealers
 * @param {string} dealerId.param.required - dealer name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Dealer Payment History ***/
router.post("/payment-history/:dealerId", dealerController.getDealerPaymentHistory);

/**
 * @route GET /users/sales-history/:dealerId
 * @group Dealer - Operations about Dealers
 * @param {string} dealerId.param.required - dealer name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/*** Dealer Payment History ***/
router.get("/sales-history/:dealerId", dealerController.getDealerSalesHistory);


/**UPDATE DEALER CREDITS LIMIT**/
router.put("/set_credits_limit", dealerController.setDealerCreditsLimit);

/**
 * @route PUT /users/dealer-status
 * @group Dealer - Operations about Dealers
 * @param {string} dealerId.param.required - dealer name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
//** dealer account balance status */
router.put('/dealer-status/:dealerId', dealerController.changeDealerStatus);


// =================== General Routes ================= //

/**
 * @route GET /users/dealer/gtdropdown/{dropdownType}
 * @group Dealer - Operations about Dealers
 * @param {string} dropdownType.path.required - dropdown type
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get Dropdown Selected Items **/
router.get("/dealer/gtdropdown/:dropdownType", dealerController.getDropdownSelectedItems);


/**
 * @route POST /users/dealer/dropdown
 * @group Dealer - Operations about Dealers
 * @param {string} pageName.formData.required - page name
 * @param {Array} selected_items.formData.required - Dropdown value
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** post Dealer Dropdown Selected Items **/
router.post("/dealer/dropdown", dealerController.saveDropDown);
/**
 * @route GET /users/dealer/getPagination/{dropdownType}
 * @group Dealer - Operations about Dealers
 * @param {string} dropdownType.path.required - page name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

/** Get pagination **/
router.get("/dealer/getPagination/:dropdownType", dealerController.getPagination);

/**
 * @route POST /users/dealer/postPagination/{dropdownType}
 * @group Dealer - Operations about Dealers
 * @param {string} pageName.formData.required - page name
 * @param {object} selectedValue.formData.required - pagination value
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** post Dealer Pagination **/
router.post("/dealer/postPagination", dealerController.postPagination);


// =========== Policy ============= //

// policy name should be unique
/**
 * @route GET /users/get_policies
 * @group Policy - Operations on Policies
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get_policies', policyController.getPolicies);

/**
 * @route POST /users/change_policy_status
 * @group Policy - Operations on Policies
 * @param {string} id.formData.required - policy id
 * @param {string} key.formData.required - key (status or delete_status)
 * @param {boolean} value.formData.required - value (treu or false)
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/change_policy_status', policyController.changePolicyStatus);

/**
 * @route POST /users/save_policy_changes
 * @group Policy - Operations on Policies
 * @param {string} id.formData.required - policy id
 * @param {Array} push_apps.formData.required - Push apps
 * @param {Array} controls.formData.required - System Settings (controls)
 * @param {Array} permissions.formData.required - permissions
 * @param {Array} app_list.formData.required - Apps
 * @param {string} policy_note.formData.required - Policy Note
 * @param {string} policy_name.formData.required - Policy Name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/save_policy_changes', policyController.savePolicyChanges);

/**
 * @route POST /users/check_policy_name
 * @group Policy - Operations on Policies
 * @param {string} name.formData.required - Policy Name
 * @param {string} policy_id.formData.required - Policy id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/check_policy_name', policyController.checkPolicyName);

/**
 * @route POST /users/save_policy
 * @group Policy - Operations on Policies
 * @param {object} data.formData.required - Object of policy detaile
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/save_policy', policyController.savePolicy);

/**
 * @route POST /users/apply_policy/{device_id}
 * @group Policy - Operations on Policies
 * @param {string} device_id.path.required - Device id
 * @param {string} userAccId.formData.required - user account id
 * @param {string} policyId.formData.required - policy id
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

/**
 * @route GET /users/get_app_permissions
 * @group APK - All Operations on  apks
 * @returns {object} 200 - An array of app Permission and an array of Extenstions
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_app_permissions", appController.getAppPermissions);
/**
 * @route GET /users/get_system_permissions
 * @group APK - All Operations on apks
 * @returns {object} 200 - An array of system permissions
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get_system_permissions', appController.getSystemPermissions)

// policy name should be unique


router.post("/save/profile", accountController.saveProfile);
/**
 * @route GET /users/apply_settings/{device_id}
 * @group Device - Operation about Devices
 * @param {string} device_id.path.required - Device id
 * @param {string} usr_acc_id.formData.required - User account id
 * @param {Object} device_setting.formData.required - Device Settings (lists of apps, controls, subExtensions and passwords)
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/apply_settings/:device_id", deviceController.applySettings);
/**
 * @route GET /users/apply_pushapps/{device_id}
 * @group Device - Operation about Devices
 * @param {string} device_id.path.required - Device id
 * @param {string} usrAccId.formData.required - User account id
 * @param {Array} push_apps.formData.required - Array of push apps
 * @returns {object} 200 - Success message + noOfApps
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/apply_pushapps/:device_id", deviceController.applyPushApps);
/**
 * @route GET /users/apply_pullapps/{device_id}
 * @group Device - Operation about Devices
 * @param {string} device_id.path.required - Device id
 * @param {string} usrAccId.formData.required - User account id
 * @param {Array} pull_apps.formData.required - Array of pull apps
 * @returns {object} 200 - Success message + noOfApps
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/apply_pullapps/:device_id", deviceController.applyPullApps);
/**
 * @route POST /users/get_profiles
 * @group Account  -Operations on account
 * @param {string} device_id.formData.required - Device id
 * @returns {object} 200 - An array of profiles
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/get_profiles", accountController.getProfiles);

router.post("/get_device_history", deviceController.getDeviceHistory);
/**
 * @route POST /users/save_new_data
 * @group Account  -Operations on account
 * @param {Array} newData.formData.required - Array of new data
 * @param {string} type.formData.required - data type (sim_id || chat_id || pgp_email)
 * @returns {object} 200 - suscess message
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/save_new_data", accountController.saveNewData);

// import sims
/**
 * @route POST /users/import/{fieldName}
 * @group Account  -Operations on account
 * @param {Array} parsedData.formData.required - Array of data
 * @param {string} fieldName.path.required - field name (sim_id || chat_id || pgp_email)
 * @returns {object} 200 - suscess message
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/import/:fieldName", accountController.importIDs);
/**
 * @route POST /users/export/{fieldName}
 * @group Account  -Operations on account
 * @param {string} fieldName.path.required - field name (sim_id || chat_id || pgp_email)
 * @returns {object} 200 - Array of related data
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/export/:fieldName", accountController.exportIDs);
/**
 * @route GET /users/get_sim_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_sim_ids", accountController.getSimIDs);
/**
 * @route GET /users/get_all_sim_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_all_sim_ids", accountController.getAllSimIDs);

/**
 * @route GET /users/get-standalone-sims
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids 
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

router.get("/get-standalone-sims", simController.getStandAloneSims);

/**
 * @route GET /users/change_sim_status
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids 
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

router.put("/change_sim_status", simController.changeSimStatus);

/**
 * @route GET /users/resync_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/resync_ids", accountController.getAllSimIDs);

/**
 * @route GET /users/get_chat_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of chat ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// router.get('/get_used_sim_ids', accountController.getUsedSimIDs);
router.get("/get_chat_ids/:user_acc_id/:dealer_id", accountController.getChatIDs);
/**
 * @route GET /users/get_all_chat_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of chat ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_all_chat_ids", accountController.getAllChatIDs);
/**
 * @route GET /users/get_used_chat_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of chat ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_used_chat_ids", accountController.getUsedChatIDs);
/**
 * @route GET /users/get_pgp_emails
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of chat ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_pgp_emails/:user_acc_id/:dealer_id", accountController.getPGPEmails);
/**
 * @route GET /users/get_all_pgp_emails
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of pgp emails
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_all_pgp_emails", accountController.getAllPGPEmails);
/**
 * @route GET /users/get_used_pgp_emails
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of pgp emails
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_used_pgp_emails", accountController.getUsedPGPEmails);
/**
 * @route GET /users/get_used_sim_ids
 * @group Account  -Operations on account
 * @returns {object} 200 - Array of sim ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get("/get_used_sim_ids", accountController.getUsedSimIDs);

// router.get('/get_packages', accountController.getPackages);
/**
 * @route GET /users/get_used_sim_ids
 * @group Account  -Operations on account
 * @param {Array} ids.formData.required - Array of ids
 * @param {string} fieldName.path.required - field name (sim_id || chat_id || pgp_email)
 * @returns {object} 200 - Array of sim ids
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/delete_CSV_ids/:fieldName", accountController.deleteCSV);

/**
 * @route GET /users/apklist
 * @group APK - All Operations on  apks
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Get Apk List Admin Panel **/
router.get('/apklist', apkController.apkList);

/** Get Apk List Admin Panel **/
/**
 * @route POST /users/upload
 * @group APK - All Operations on  apks
 * @param {string} fieldName.query.required - field name
 * @param {file} apk.formData - screen
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// upload test apk
router.post('/upload', multipartMiddleware, apkController.uploadApk);


/**
 * @route POST /users/checkApkName
 * @group APK - All Operations on  apks
 * @param {string} name.formData.required - apk name
 * @param {string} apk_id.formData.required - apk id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

// add apk. endpoints name should be changed
router.post("/checkApkName", apkController.checkApkName);

/**
 * @route POST /users/addApk
 * @group APK - All Operations on  apks
 * @param {string} logo.formData.required - logo name
 * @param {string} apk.formData.required - apk
 * @param {string} name.formData.required - name
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// add apk. endpoints name should be changed
router.post("/addApk", apkController.addApk);

/**
 * @route POST /users/edit/apk
 * @group APK - All Operations on  apks
 * @param {string} logo.formData.required - logo name
 * @param {string} apk.formData.required - apk
 * @param {string} name.formData.required - name
 * @param {string} apk_id.formData.required - apk id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Edit Apk (Admin panel) **/
router.post("/edit/apk", apkController.editApk);

/**
 * @route POST /users/apk/delete
 * @group APK - All Operations on apks
 * @param {string} apk_id.formData.required - apk id
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/**Delete Apk**/
router.post("/apk/delete", apkController.deleteApk);

/**
 * @route POST /users/toggle
 * @group APK - All Operations on apks
 * @param {string} apk_id.formData.required - apk id
 * @param {string} status.formData.required - apk status
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
/** Toggle Apk Admin Panel (On / Off) **/
router.post("/toggle", apkController.toggle);

/**
 * @route GET /users/purchase_credits
 * @group Account  -Operations on account
 * @param {Object} data.formData.required - Credit details
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// Purchase credits_CASH
router.post("/purchase_credits", accountController.purchaseCredits);
/**
 * @route GET /users/purchase_credits_CC
 * @group Account  -Operations on account
 * @param {Object} creditInfo.formData.required - Credit details
 * @param {Object} cardInfo.formData.required - Card details
 * @returns {object} 200 - Success message
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
// Purchase credits form Credit card
router.post("/purchase_credits_CC", accountController.purchaseCredits_CC);



/**
 * @route get /users/login_history
 * @group Dealer Profile - test route
 * @returns {object} 200 - An array of user info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */

//GET logion history

//**
// @ Abaid: to get login history is not a good approach of using limit that run query every time also for previous data (fix later)
//* */
router.get("/login_history", async function (req, res) {
	try {
		var verify = req.decoded;

		// if (verify.status !== undefined && verify.status == true) {
		if (verify) {
			let start = (req.query.start) ? req.query.start : 0;
			let limit = (req.query.limit) ? req.query.limit : false;
			// console.log("start ", start, "limit ", limit)
			let id = verify.user.id;
			let data = {};

			let limitQ = ' LIMIT 50';
			// let limitQ = ' LIMIT 10';
			// if (limit) {
			// 	limitQ = ` LIMIT ${start}, ${limit}`
			// }

			let query = `SELECT * FROM login_history WHERE dealer_id = '${id}' AND type = 'token' ORDER BY created_at DESC ${limitQ};`;
			console.log(query);
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
 * @param {object} user.formData.required - user object
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

//GET User List against device dealer
router.post("/userListOfDevice", userController.getDealerUsers);

/*Transfer Apps to secure market */
router.post("/transferApps", appController.transferApps);

/*Remove Apps to secure market */
router.post("/remove_sm_apps", appController.removeSMApps);

/** Get Market app List **/

router.get("/marketApplist", appController.marketApplist);

// Change unistall app restriction for Secure market apps
router.put("/handleUninstall/:apk_id", apkController.handleUninstallApk);

// Write IMEI on device
router.post("/writeImei/:device_id", deviceController.writeIMEI);

router.post("/submit-device-passwords", deviceController.submitDevicePassword);
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
	var userType = await helpers.getDealerTypeIdByName(Constants.AUTO_UPDATE_ADMIN);
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

router.patch("/save-sa-prices", billingController.saveSaPrices);

router.post("/save-package", billingController.savePackage);

router.put("/edit-package", billingController.editPackage);

router.delete("/delete_package/:id", billingController.deletePackage);

router.put("/modify_item_price/:id", billingController.modifyItemPrice);

router.post("/save-sa-package", billingController.saveSaPackage);

router.post("/save-sa-hardware", billingController.saveSaHardware);

router.post("/edit-sa-hardware", billingController.editSaHardware);

router.post("/delete-sa-package", billingController.deleteSaPackage);

router.post("/delete-sa-hardware", billingController.deleteSaHardware);

router.get("/get-language", languageController.getLanguage);

router.patch("/save-language", languageController.saveLanguage);

router.get('/get-all-languages', languageController.getAll_Languages);

router.get("/get-prices", billingController.getPrices);

router.get("/get-packages", billingController.getPackages);

router.get("/get-hardwares", billingController.getHardwares);

router.get("/get-parent-packages", billingController.getParentPackages);

router.patch("/check-package-name", billingController.checkPackageName);

router.get('/get-parent-product-prices', billingController.getProductPrices);

router.get('/get-parent-hardware-prices', billingController.getHardwarePrices);

router.patch('/check-package-name', billingController.checkPackageName);

router.post("/credit-request-ack", accountController.ackCreditRequest);

router.get("/newRequests", billingController.newRequests);

router.get("/get_user_credits", billingController.getUserCredits);

router.put("/delete_request/:id", billingController.deleteRequest);

router.put("/accept_request/:id", billingController.acceptRequest);

router.put("/delete_service_request/:id", billingController.deleteServiceRequest);

router.put("/accept_service_request/:id", billingController.acceptServiceRequest);

router.get("/get-cancel-service-requests", billingController.getCancelServiceRequests);


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
router.get("/get-unRegSims/:device_id", simController.getUnRegisterSims);

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
 * @param {string} name.formData.required - agent name
 * @param {string} email.formData.required - agent email
 * @param {boolean} type.formData.required - agent type
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/agents', agentController.addAgent);

/**
 * @route PUT /users/agents/{agentID}
 * @group Agents - Operations about Dealer Agents
 * @param {string} name.formData.required - agent name
 * @param {string} email.formData.required - agent email
 * @param {boolean} type.formData.required - agent type
 * @param {string} agent_id.formData.required - agent id
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID', agentController.updateAgent);

/**
 * @route PUT /users/agents/{agentID}/status
 * @group Agents - Operations about Dealer Agents
 * @param {string} agentID.path.required - agent id
 * @param {string} status.formData.required - status
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID/status', agentController.changeStatus);

/**
 * @route PUT /users/agents/{agentID}/reset-pwd
 * @group Agents - Operations about Dealer Agents
 * @param {string} agentID.path.required - agent id
 * @returns {object} 200 - An array of agents info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.put('/agents/:agentID/reset-pwd', agentController.resetPwd);

/**
 * @route DELETE /users/agents
 * @group Agents - Operations about Dealer Agents
 * @param {string} agentID.path.required - agent id
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

/**
 * @route GET /users/get-domains
 * @group Dashboard - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get-domains', accountController.getDomains);

/**
 * @route GET /users/domains-domains
 * @group ACCOUNT - Operations about accounts
 * @returns {object} 200 - An array of accounts items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/add-domain', accountController.addDomain);

router.put('/edit-domain', accountController.editDomain);

router.put('/delete-domain', accountController.deleteDomain);

/**
 * @route POST /users/dealer-permissions/:permissionType
 * @group Dealers - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post("/dealer-permissions/:permissionType", dealerController.dealerPermissions);

/**
 * @route GET /users/getInvoiceId
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/getInvoiceId', userController.getInvoiceId);


//reporting routes
/**
 * @route POST /users/reports/products
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/product', reportingController.generateProductReport);

/**
 * @route POST /users/reports/hardware
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/hardware', reportingController.generateHardwareReport);

/**
 * @route POST /users/reports/invoice
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/invoice', reportingController.generateInvoiceReport);

/**
 * @route POST /users/reports/payment-history
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/payment-history', reportingController.generatePaymentHistoryReport);

/**
 * @route POST /users/reports/sales
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/sales', reportingController.generateSalesReport);

/**
 * @route POST /users/reports/grace-days
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/reports/grace-days', reportingController.generateGraceDaysReport);

/**
 * @route POST /users/get-latest-payment-history
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/get-latest-payment-history', accountController.getLatestPaymentHistory);

/**
 * @route POST /users/get-overdue-details
 * @group Reporting - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get-overdue-details', accountController.getOverdueDetails);

/**
 * @route POST /users/get-processes
 * @group Dashboard - Operations about Dashboard
 * @returns {object} 200 - An array of dashboard items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.get('/get-processes', NotificationController.getSocketProcesses);

// acl 
router.post('/add-acl-module', aclController.addAclModule);


// ****************************** Bulk Activities

// Filtered Bulk Devices

/**
 * @route POST /users/filtered-bulkDevices
 * @group BulkDevices - Operations about BulkDevices
 * @returns {object} 200 - An array of BulkDevices items info
 * @returns {Error}  default - Unexpected error
 * @security JWT
 */
router.post('/filtered-bulkDevices', bulkDevicesController.getFilteredBulkDevices);

router.get("/get-bulk-history", bulkDevicesController.bulkDevicesHistory);


/** Suspend Bulk Devices / client **/
router.post("/bulk-suspend", bulkDevicesController.suspendBulkAccountDevices);

/** Activate Bulk Device **/
router.post("/bulk-activate", bulkDevicesController.activateBulkDevices);

// /** Unlink Bulk Device  **/
router.post("/bulk-unlink", bulkDevicesController.unlinkBulkDevices);

router.post("/bulk-wipe", bulkDevicesController.wipeBulkDevices);

// router.post("/getUsersOfDealers", bulkDevicesController.getUsersOfDealers);

router.post("/apply_bulk_pushapps", bulkDevicesController.applyBulkPushApps);

router.post("/apply_bulk_pullapps", bulkDevicesController.applyBulkPullApps);

router.post('/apply_bulk_policy', bulkDevicesController.applyBulkPolicy);

router.post('/send_bulk_msg', bulkDevicesController.sendBulkMsg);

router.post('/update_bulk_msg', bulkDevicesController.updateBulkMsg);

router.post('/reset-chat-pin', deviceController.resetChatPin);

router.post('/change-s-chat-pin-status', deviceController.changeSchatPinStatus);

router.post('/get_bulk_msgs', bulkDevicesController.getBulkMsgsList);

router.get('/delete_bulk_msg/:id', bulkDevicesController.deleteBulkMsg);

// ============== SERVICES ============ //

router.post('/create-service-product', ServicesController.createServiceProduct);

router.get('/generate-random-username', ServicesController.generateRandomUsername);

router.post('/check-unique-pgp', ServicesController.checkUniquePgp);

router.post('/validate_sim_id', ServicesController.validateSimId);

router.put('/add-data-plans', ServicesController.addDataLimitsPlans);

router.put('/reset-pgp-limit', ServicesController.resetPgpLimit);


router.post('/add-standalone-sim', simController.addStandAloneSim);

module.exports = router;
