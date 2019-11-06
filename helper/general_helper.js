var express = require("express");
var router = express.Router();
var fs = require("fs");
var datetime = require("node-datetime");
var moment = require("moment-strftime");
var util = require("util");
const exec = util.promisify(require("child_process").exec);
var ApkReader = require("node-apk-parser");
var md5 = require("md5");
var randomize = require("randomatic");
const mysql_import = require("mysql-import");
var path = require("path");
const app_constants = require("../config/constants");

const { sql } = require("../config/database");

// import ADMIN from "../constants/Application";
var Constants = require("../constants/Application");
const device_helpers = require("./device_helpers");

// let usr_acc_query_text =
// 	"usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id, usr_acc.user_id, usr_acc.account_email, usr_acc.account_name,usr_acc.dealer_id, usr_acc.prnt_dlr_id,usr_acc.link_code, usr_acc.client_id, usr_acc.start_date, usr_acc.expiry_months, usr_acc.expiry_date,usr_acc.activation_code, usr_acc.status,usr_acc.device_status, usr_acc.activation_status, usr_acc.account_status,usr_acc.unlink_status, usr_acc.transfer_status, usr_acc.dealer_name, usr_acc.prnt_dlr_name, usr_acc.del_status, usr_acc.note, usr_acc.validity, usr_acc.batch_no, usr_acc.type, usr_acc.version";
let usr_acc_query_text = Constants.usr_acc_query_text;

module.exports = {
	convertToLang: async function (lngWord, constant) {
		if (lngWord !== undefined && lngWord !== "" && lngWord !== null) {
			return lngWord;
		} else if (
			constant !== undefined &&
			constant !== "" &&
			constant !== null
		) {
			return constant;
		} else {
			return "N/A";
		}
	},
	isAdmin: async function (userId) {
		var query1 = "SELECT type FROM dealers where dealer_id =" + userId;
		var user = await sql.query(query1);
		if (user.length) {
			var query2 =
				"SELECT * FROM user_roles where id =" +
				user[0].type +
				" and role='admin' ";
			var role = await sql.query(query2);
			if (role.length) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	getUserType: async function (userId) {
		var query1 = "SELECT type FROM dealers where dealer_id =" + userId;
		var user = await sql.query(query1);
		if (user.length) {
			var query2 = "SELECT * FROM user_roles where id =" + user[0].type;
			var role = await sql.query(query2);
			if (role.length) {
				return role[0].role;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	getUserTypeId: async function (userId) {
		var query1 =
			"SELECT type FROM dealers as user left join user_roles as role on( role.id = user.type) where dealer_id =" +
			userId;
		// console.log(query1);

		var user = await sql.query(query1);
		if (user.length) {
			return user[0].type;
		} else {
			return false;
		}
	},
	getUserTypeByTypeId: async function (userTypeId) {
		var query2 = "SELECT * FROM user_roles where id =" + userTypeId;
		var role = await sql.query(query2);
		if (role.length) {
			return role[0].role;
		} else {
			return false;
		}
	},
	getDealerTypeIdByName: async function (dealerType) {
		var query =
			"SELECT * FROM user_roles where role ='" +
			dealerType +
			"' and role!='admin'";
		var dType = await sql.query(query);
		if (dType.length) {
			return dType[0].id;
		}
	},
	getAllUserTypes: async function () {
		var query = "SELECT * FROM user_roles";
		var userRoles = await sql.query(query);
		return userRoles;
	},
	getAllComponents: async function () {
		var query = "SELECT * FROM acl_modules";
		var aclModules = await sql.query(query);
		return aclModules;
	},
	getComponentId: async function (componentId) {
		var component = await sql.query(
			"SELECT * FROM acl_modules where id =" + componentId
		);
		if (component.length) {
			return component[0].id;
		} else {
			return false;
		}
	},
	getComponentIdByName: async function (componentName) {
		var component = await sql.query(
			"SELECT * FROM acl_modules WHERE component ='" + componentName + "'"
		);
		if (component.length) {
			return component[0].id;
		} else {
			return false;
		}
	},
	getComponentIdByUri: async function (componentUri) {
		// console.log(componentUri);

		if (componentUri.includes("/connect-device/")) {
			componentUri = "/connect-device/:deviceId";
		}
		// console.log(componentUri);

		var component = await sql.query(
			"SELECT * FROM acl_modules WHERE uri ='" + componentUri + "' "
		);
		// console.log("SELECT * FROM acl_modules WHERE uri ='" + componentUri + "' ");
		if (component.length) {
			// console.log("hello", component);
			return component[0];
		} else {
			return false;
		}
	},
	getActionId: async function (actionId) {
		var component = await sql.query(
			"SELECT * FROM acl_module_actions where id =" + actionId
		);
		if (component.length) {
			return component[0].id;
		} else {
			return false;
		}
	},
	getAllComponentActions: async function (componentId) {
		var query =
			"SELECT * FROM acl_module_actions where component_id =" +
			componentId;
		var actions = await sql.query(query);
		return actions;
	},
	isLoginRequired: async function (componentId) {
		var query = "SELECT * FROM acl_modules where id =" + componentId;
		var component = await sql.query(query);
		if (component.length) {
			if (component[0].login_required == 1) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
	},
	isAllowedComponent: async function (componentId, userId) {
		var role = await this.getUserTypeId(userId);
		var component = await this.getComponentId(componentId);
		if (role && component) {
			var query =
				"SELECT * FROM acl_module_to_user_roles where user_role_id =" +
				role +
				" and component_id =" +
				component;
			var isComponent = await sql.query(query);
			if (isComponent.length) {
				return true;
			} else {
				return false;
			}
		} else {
			false;
		}
		//var component = await sql.query("SELECT * FROM acl_modules where id ="+ componentId);
	},
	isAllowedComponentByName: async function (componentName, userId) {
		var role = await this.getUserTypeId(userId);
		var component = await this.getComponentIdByUri(componentName);
		if (role && component) {
			var query =
				"SELECT * FROM acl_module_to_user_roles where user_role_id =" +
				role +
				" and component_id =" +
				component;
			var isComponent = await sql.query(query);
			if (isComponent.length) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		//var component = await sql.query("SELECT * FROM acl_modules where id ="+ componentId);
	},
	dealerCount: async adminRoleId => {
		var query =
			"SELECT COUNT(*) as dealer_count FROM dealers WHERE type !=" +
			adminRoleId +
			" AND type!=4 AND type!=5 ";
		let res = await sql.query(query);
		if (res.length) {
			return res[0].dealer_count;
		} else {
			return false;
		}
	},
	userDealerCount: async (type) => {

		var query = "SELECT COUNT(*) as dealer_count FROM dealers WHERE type =" + type;
		let res = await sql.query(query);
		if (res.length) {
			return res[0].dealer_count;
		} else {
			return false;
		}
	},
	getSdealersByDealerId: async (dealer_id) => {

		var query = "SELECT * FROM dealers WHERE connected_dealer = " + dealer_id;
		let res = await sql.query(query);
		let dealerList = [];
		if (res.length) {
			dealerList = res.map(item => {
				return item.dealer_id;
			});
			// console.log(dealerList);
			return dealerList;
		} else {
			return [];
		}
	},
	isAllowedComponentByUri: async function (componentUri, userId) {
		// console.log(componentUri);

		var role = await this.getUserTypeId(userId);
		// console.log(role);
		var component = await this.getComponentIdByUri(componentUri);
		// console.log(component);
		if (role && component) {
			// console.log("hello hello hello");
			// console.log(component);

			if (component.login_required == 0) {
				return true;
			}

			var query =
				"SELECT * FROM acl_module_to_user_roles where user_role_id =" +
				role +
				" and component_id =" +
				component.id;
			var isComponent = await sql.query(query);
			if (isComponent.length) {
				return true;
			} else {
				return false;
			}
		} else {
			return false;
		}
		//var component = await sql.query("SELECT * FROM acl_modules where id ="+ componentId);
	},
	isAllowedAction: async function (componentId, actionId, userId) { },

	//Helper function to get unique device_id in format like "ASGH457862"
	getDeviceId: async function (sn, mac) {
		// previous checks
		// let unlinkQuery;
		// if (sn === Constants.PRE_DEFINED_SERIAL_NUMBER) {
		// 	unlinkQuery =
		// 		"SELECT device_id from acc_action_history where mac_address = '" +
		// 		mac +
		// 		"'";
		// } else if (mac === Constants.PRE_DEFINED_MAC_ADDRESS) {
		// 	unlinkQuery =
		// 		"SELECT device_id from acc_action_history where serial_number = '" +
		// 		sn +
		// 		"'";
		// } else {
		// 	unlinkQuery =
		// 		"SELECT device_id from acc_action_history where serial_number = '" +
		// 		sn +
		// 		"' OR mac_address = '" +
		// 		mac +
		// 		"'";
		// }

		/*
		* we move device from device table to history table on unlink
		* First we see if same device exist in history with both mac and serial matched
		* if we get nothing 
		* we will see if any one of them (mac or serial) matched but not fake one
		*/
		let unlinkQuery = `SELECT device_id FROM acc_action_history 
		WHERE serial_number = '${sn}' AND mac_address = '${mac}' 
		ORDER BY id DESC LIMIT 1 `;

		let unlinkedResult = await sql.query(unlinkQuery);
		if (unlinkedResult.length < 1) {
			unlinkQuery = `SELECT device_id FROM acc_action_history 
			WHERE (serial_number = '${sn}' AND serial_number != '${Constants.PRE_DEFINED_SERIAL_NUMBER}') OR 
			(mac_address = '${mac}' AND mac_address != '${Constants.PRE_DEFINED_MAC_ADDRESS}')
			ORDER BY id DESC LIMIT 1 `;
			unlinkedResult = await sql.query(unlinkQuery);
		}

		if (unlinkedResult.length >= 1) {
			return unlinkedResult[0].device_id;
		} else {
			console.log(sn, "MAC", mac);
			var key = md5(sn + mac);
			var num = "";
			var str = "";

			for (i = 0; i < key.length; i++) {
				if (isNaN(key[i])) {
					if (str.length < 4) {
						str += key[i];
					}
				} else {
					if (num.length < 6) {
						num += key[i];
					}
				}
			}
			var deviceId = str.toUpperCase() + num;

			//this.replaceAt('FDEA999907', 2, 'L'); // FLEA999907
			deviceId = this.replaceAt(
				deviceId,
				app_constants.DEVICE_ID_SYSTEM_LETTER_INDEX,
				app_constants.DEVICE_ID_SYSTEM_LETTER
			);

			return deviceId;
		}
	},

	getAllRecordByDealerID: async function (dealer_id) {
		// console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.id = ' + device_id)
		let results = await sql.query(
			"select devices.*  ," +
			usr_acc_query_text +
			', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.dealer_id = "' +
			dealer_id +
			'"'
		);
		if (results.length) {
			let devices_acc_array = [];
			for (let i = 0; i < results.length; i++) {
				devices_acc_array.push(results[i].id)
			}
			let user_acc_ids = devices_acc_array.join()
			let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
			let sim_ids = await device_helpers.getSimids(user_acc_ids);
			let chat_ids = await device_helpers.getChatids(user_acc_ids);
			let servicesData = await device_helpers.getServicesData(user_acc_ids)

			for (let device of results) {
				device.finalStatus = device_helpers.checkStatus(device);
				let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === device.id);
				if (pgp_email) {
					device.pgp_email = pgp_email.pgp_email
				}
				let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === device.id);
				if (sim_idArray && sim_idArray.length) {
					device.sim_id = sim_idArray[0].sim_id
					device.sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
				}
				let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === device.id);
				if (chat_id) {
					device.chat_id = chat_id.chat_id
				}
				// let services = servicesData.find(data => data.user_acc_id === device.id);
				// if (services) {
				// 	device.services = services
				// }
				let services = servicesData.filter(data => data.user_acc_id === device.id);
				if (services && services.length) {
					// if (services.length > 1) {
					services.map((item) => {
						if (item.status === 'extended') {
							device.extended_services = item
						} else {
							device.services = item
						}
					})
					// } else {
					//     device.services = services[0]
					// }
				}
			}

			return results;
		} else {
			return [];
		}
	},

	generateLinkCode: async function () {
		let link_code = randomize("0", 1, { exclude: "0" }) + randomize("0", 5);
		link_code = this.replaceAt(
			link_code,
			app_constants.DEALER_PIN_SYSTEM_LETTER_INDEX,
			app_constants.DEALER_PIN_SYSTEM_LETTER
		);
		let query = `SELECT link_code FROM dealers WHERE link_code = '${link_code}' `;
		let result = await sql.query(query);
		if (result.length > 1) {
			link_code = this.generateLinkCode();
		}
		return link_code;
	},
	checkVerificationCode: async function (code) {
		let query =
			"select dealer_id from dealers where verification_code = '" +
			code +
			"';";
		let result = await sql.query(query);
		if (result.length > 1) {
			code = randomize("0", 6);
			this.checkVerificationCode(code);
		} else {
			return code;
		}
	},
	checkUserId: async function (userId) {
		let query =
			"select user_id from users where user_id = '" + userId + "';";
		let result = await sql.query(query);
		if (result.length > 1) {
			userId = randomize("0", 6);
			this.checkUserId(userId);
		} else {
			return userId;
		}
	},
	getExpDateByMonth: function (currentDate, expiryMonth) {
		return moment(currentDate, "YYYY-MM-DD")
			.add(Number(expiryMonth), "M")
			.strftime("%Y/%m/%d");
	},
	// checkDeviceId: async function (device_id, sn, mac) {
	// 	let query =
	// 		"SELECT device_id FROM devices WHERE device_id = '" +
	// 		device_id +
	// 		"';";
	// 	let result = await sql.query(query);
	// 	if (result.length > 0) {
	// 		let query =
	// 			"SELECT device_id FROM devices WHERE device_id = '" +
	// 			device_id +
	// 			"' AND serial_number = '" + sn + "' AND mac_address = '" + mac + "'";
	// 		let result = await sql.query(query)
	// 		if (result.length > 0) {
	// 			return device_id
	// 		} else {
	// 			device_id = this.getDeviceId(sn, mac);
	// 			checkDeviceId(device_id, sn, mac);
	// 		}
	// 	} else {
	// 		return device_id;
	// 	}
	// },
	validateEmail: email => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	},
	validateIPAddress: ip => {
		var re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
		return re.test(ip);
	},
	validateMacAddress: mac => {
		var re = /^([0-9A-F]{2}[:-]){5}([0-9A-F]{2})$/;
		return re.test(mystring);
	},
	checkNullStatus: userAcc => {
		if (userAcc.status === "" || userAcc.status === null) {
			return true;
		} else {
			return false;
		}
	},
	checkNullUserAccountStatus: userAcc => {
		if (userAcc.account_status === "" || userAcc.account_status === null) {
			return true;
		} else {
			return false;
		}
	},
	getDealerStatus: dealer => {
		if (
			(dealer.account_status === "" || dealer.account_status === null) &&
			dealer.unlink_status === 0
		) {
			return Constants.DEALER_ACTIVE;
		} else if (dealer.unlink_status === 1) {
			return Constants.DEALER_UNLINKED;
		} else if (dealer.account_status === "suspended") {
			return Constants.DEALER_SUSPENDED;
		} else {
			return "N/A";
		}
	},
	getUserTypeIDByName: async function (userType) {
		// console.log(userType);
		var query = "SELECT * FROM user_roles where role ='" + userType + "'";
		var dType = await sql.query(query);
		if (dType.length) {
			return dType[0].id;
		} else {
			return false;
		}
	},
	getAllRecordbyDeviceId: async function (device_id) {
		// console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.id = ' + device_id)
		let results = await sql.query(
			"select devices.*  ," +
			usr_acc_query_text +
			', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.device_id = "' +
			device_id +
			'"'
		);

		if (results.length) {
			let pgp_emails = await device_helpers.getPgpEmails(results[0].id);
			let sim_ids = await device_helpers.getSimids(results[0].id);
			let chat_ids = await device_helpers.getChatids(results[0].id);
			let servicesData = await device_helpers.getServicesData(results[0].id);

			results[0].finalStatus = device_helpers.checkStatus(results[0]);
			if (pgp_emails[0] && pgp_emails[0].pgp_email) {
				results[0].pgp_email = pgp_emails[0].pgp_email
			} else {
				results[0].pgp_email = "N/A"
			}
			if (sim_ids && sim_ids.length) {
				results[0].sim_id = sim_ids[0] ? sim_ids[0].sim_id : "N/A"
				results[0].sim_id2 = sim_ids[1] ? sim_ids[1].sim_id : "N/A"
			}
			if (chat_ids[0] && chat_ids[0].chat_id) {
				results[0].chat_id = chat_ids[0].chat_id
			}
			else {
				results[0].chat_id = "N/A"

			}
			// if (servicesData[0]) {
			// 	results[0].services = servicesData[0]
			// }
			let services = servicesData;
			if (services && services.length) {
				// if (services.length > 1) {
				services.map((item) => {
					if (item.status === 'extended') {
						results[0].extended_services = item
					} else {
						results[0].services = item
					}
				})
				// } else {
				//     results[0].services = services[0]
				// }
			}
			return results[0];
		} else {
			return [];
		}
	},

	// windows
	getWindowAPKPackageNameScript: async filePath => {
		try {
			let cmd =
				"aapt dump badging " +
				filePath +
				' | findstr /C:"package: name"';
			const { stdout, stderr, error } = await exec(cmd);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}
			if (stderr) {
				return false;
			}
			if (stdout) {
				let array = stdout.split(" ");
				let packageName = array[1].split("=");
				return packageName[1]
					? packageName[1].replace(/\'/g, "")
					: false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},
	getWindowAPKVersionCodeScript: async filePath => {
		try {
			let cmd =
				"aapt dump badging " +
				filePath +
				' | findstr /C:"package: name"';
			// console.log(cmd);
			const { stdout, stderr, error } = await exec(cmd);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}
			if (stderr) {
				return false;
			}
			if (stdout) {
				let array = stdout.split(" ");
				let versionCode = array[2].split("=");
				return versionCode[1]
					? versionCode[1].replace(/\'/g, "")
					: false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},
	getWindowAPKVersionNameScript: async filePath => {
		try {
			let cmd =
				"aapt dump badging " +
				filePath +
				' | findstr /C:"package: name"';
			console.log(cmd);
			const { stdout, stderr, error } = await exec(cmd);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}
			if (stderr) {
				return false;
			}
			if (stdout) {
				let array = stdout.split(" ");
				let versionName = array[2].split("=");
				return versionName[1]
					? versionName[1].replace(/\'/g, "")
					: false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},
	getWindowAPKLabelScript: async function (filePath) {
		try {
			let cmd =
				"aapt dump badging " +
				filePath +
				' | findstr /C:"application:"';
			const { stdout, stderr, error } = await exec(cmd);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}
			if (stderr) {
				return false;
			}
			if (stdout) {
				let array = stdout.split(" ");
				let label = array[1].split("=");

				return label[1] ? label[1].replace(/\'/g, "") : false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},

	// linux scripts
	getAPKPackageNameScript: async function (filePath) {
		try {
			let packageName =
				"aapt list -a " +
				filePath +
				" | awk -v FS='\"' '/package=/{print $2}'";
			const { stdout, stderr, error } = await exec(packageName);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}
			if (stderr) {
				return false;
			}
			if (stdout) {
				return stdout;
			}
			return false;
		} catch (error) {
			return await this.getWindowAPKPackageNameScript(filePath);
		}
	},
	getAPKVersionCodeScript: async function (filePath) {
		try {
			let versionCode =
				"aapt dump badging " +
				filePath +
				' | grep "versionCode" | sed -e "s/.*versionCode=\'//" -e "s/\' .*//"';
			const { stdout, stderr, error } = await exec(versionCode);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);

			if (error) {
				return false;
			}

			if (stderr) {
				return false;
			}
			if (stdout) {
				return stdout;
			}
			return false;
		} catch (error) {
			return await this.getWindowAPKVersionCodeScript(filePath);
		}
	},

	getAPKVersionNameScript: async function (filePath) {
		try {
			let versionName =
				"aapt dump badging " +
				filePath +
				' | grep "versionName" | sed -e "s/.*versionName=\'//" -e "s/\' .*//"';
			const { stdout, stderr, error } = await exec(versionName);

			if (error) {
				return false;
			}

			if (stderr) {
				return false;
			}
			if (stdout) {
				return stdout;
			}
			return false;
		} catch (error) {
			return await this.getWindowAPKVersionNameScript(filePath);
		}
	},
	getAPKLabelScript: async function (filePath) {
		try {
			let label = `aapt dump badging ${filePath} | grep "application" | sed -e "s/.*label=\'//" -e "s/\' .*//"`;
			const { stdout, stderr, error } = await exec(label);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}

			if (stderr) {
				return false;
			}
			if (stdout) {
				let array = stdout.split(/\r?\n/);
				console.log("stdout linux: ", array);
				let label = array[0].split(":");

				return label[1] ? label[1].replace(/\'/g, "") : false;
			}
			return false;
		} catch (error) {
			return await this.getWindowAPKLabelScript(filePath);
		}
	},
	// getting
	getAPKPackageName: async function (filePath) {
		try {
			var reader = ApkReader.readFile(filePath);
			var manifest = reader.readManifestSync();
			let res = JSON.parse(JSON.stringify(manifest));
			return res.package;
		} catch (error) {
			return await this.getAPKPackageNameScript(filePath);
		}
	},
	getAPKVersionCode: async function (filePath) {
		try {
			var reader = ApkReader.readFile(filePath);
			var manifest = reader.readManifestSync();
			// console.log("manifest", manifest);
			// let apk = util.inspect(manifest, {depth:null});
			let res = JSON.parse(JSON.stringify(manifest));
			return res.versionCode;
		} catch (e) {
			return await this.getAPKVersionCodeScript(filePath);
		}
	},
	getAPKVersionName: async function (filePath) {
		try {
			var reader = ApkReader.readFile(filePath);
			var manifest = reader.readManifestSync();
			let res = JSON.parse(JSON.stringify(manifest));
			return res.versionName;
		} catch (e) {
			return await this.getAPKVersionNameScript(filePath);
		}
	},
	getAPKDetails: async function (filePath) {
		try {
			var reader = ApkReader.readFile(filePath);
			var manifest = reader.readManifestSync();
			// let apk = util.inspect(manifest, {depth:null});
			let res = JSON.parse(JSON.stringify(manifest));
			return res;
		} catch (e) {
			throw e;
		}
	},
	getAPKLabel: async function (filePath) {
		return await this.getAPKLabelScript(filePath);
	},
	saveLogin: async function (user, loginClient, type, status) {
		let insertQ = "INSERT INTO login_history ";
		let commonFields =
			" token, expiresin, ip_address, logged_in_client, type, status ";
		let values = " VALUES ( ";
		let commonValues =
			" '" +
			user.token +
			"', '" +
			user.expiresIn +
			"', '" +
			user.ip_address +
			"', '" +
			loginClient +
			"', '" +
			type +
			"', " +
			status +
			" ";

		if (loginClient === Constants.DEVICE) {
			if (type === Constants.SOCKET) {
				insertQ =
					insertQ + " (device_id, socket_id, " + commonFields + " ) ";
				values =
					values +
					" '" +
					user.device_id +
					"', '" +
					user.socket_id +
					"', " +
					commonValues +
					" ) ";
			} else if (type === Constants.TOKEN) {
				insertQ = insertQ + " (device_id, " + commonFields + " ) ";
				values =
					values +
					" '" +
					user.device_id +
					"', " +
					commonValues +
					" ) ";
			}
		} else {
			if (type === Constants.SOCKET) {
				insertQ =
					insertQ + " (dealer_id, socket_id, " + commonFields + " ) ";
				values =
					values +
					" '" +
					user.dealer_id +
					"', '" +
					user.socket_id +
					"', " +
					commonValues +
					" ) ";
			} else if (type === Constants.TOKEN) {
				insertQ = insertQ + " (dealer_id, " + commonFields + " ) ";
				values =
					values +
					" '" +
					user.dealer_id +
					"', " +
					commonValues +
					" ) ";
			}
		}

		await sql.query(insertQ + values)
	},
	getLoginByToken: async function (token) {
		let loginQ = "SELECT * from login_history WHERE token ='" + token + "'";
		let res = await sql.query(loginQ);
		if (res.length) {
			return res[0];
		} else {
			return false;
		}
	},
	getLoginByDealerID: async function (dealerId) {
		let loginQ =
			"SELECT * from login_history WHERE dealer_id ='" + dealerId + "'";
		let res = await sql.query(loginQ);
		// console.log("resrserse", res);
		if (res.length) {
			return res[0];
		} else {
			return false;
		}
	},
	getLoginByDeviceID: async function (deviceId) {
		let loginQ =
			"SELECT * from login_history WHERE device_id ='" + deviceId + "'";
		let res = await sql.query(loginQ);
		if (res.length) {
			return res[0];
		} else {
			return false;
		}
	},
	expireLoginByToken: async function (token) {
		let loginQ =
			"UPDATE login_history SET status=0 WHERE token='" + token + "'";
		sql.query(loginQ);
	},
	expireAllLogin: async function () {
		let loginQ = "UPDATE login_history SET status=0";
		sql.query(loginQ);
	},
	getAllRecordbyUserID: async function (userID) {
		// console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.id = ' + device_id)
		let results = await sql.query(
			"select devices.*  ," +
			usr_acc_query_text +
			', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.user_id = "' +
			userID +
			'"'
		);
		if (results.length) {
			let devices_acc_array = [];
			for (let i = 0; i < results.length; i++) {
				devices_acc_array.push(results[i].id)
			}
			let user_acc_ids = devices_acc_array.join()
			let pgp_emails = await device_helpers.getPgpEmails(user_acc_ids);
			let sim_ids = await device_helpers.getSimids(user_acc_ids);
			let chat_ids = await device_helpers.getChatids(user_acc_ids);
			let servicesData = await device_helpers.getServicesData(user_acc_ids)
			for (var i = 0; i < results.length; i++) {
				results[i].finalStatus = device_helpers.checkStatus(results[i]);
				let pgp_email = pgp_emails.find(pgp_email => pgp_email.user_acc_id === results[i].id);
				if (pgp_email) {
					results[i].pgp_email = pgp_email.pgp_email
				}
				let sim_idArray = sim_ids.filter(sim_id => sim_id.user_acc_id === results[i].id);
				if (sim_idArray && sim_idArray.length) {
					results[i].sim_id = sim_idArray[0].sim_id
					results[i].sim_id2 = sim_idArray[1] ? sim_idArray[1].sim_id : "N/A"
				}
				let chat_id = chat_ids.find(chat_id => chat_id.user_acc_id === results[i].id);
				if (chat_id) {
					results[i].chat_id = chat_id.chat_id
				}
				// let services = servicesData.find(data => data.user_acc_id === results[i].id);
				// if (services) {
				// 	results[i].services = services
				// }
				let services = servicesData.filter(data => data.user_acc_id === results[i].id);
				if (services && services.length) {
					// if (services.length > 1) {
					services.map((item) => {
						if (item.status === 'extended') {
							results[i].extended_services = item
						} else {
							results[i].services = item
						}
					})
					// } else {
					//     results[i].services = services[0]
					// }
				}
			}
			return results;
		} else {
			return [];
		}
	},
	//to get User record by user ID
	getUserDataByUserId: async function (user_id) {
		let result = await sql.query(
			"SELECT * FROM users WHERE user_id = '" + user_id + "'"
		);
		if (result.length) {
			return result;
		} else {
			return [];
		}
	},
	// Check for unique Activation code
	checkActivationCode: async function (device_id) {
		let query =
			"SELECT device_id FROM devices WHERE device_id = '" +
			device_id +
			"';";
		let result = await sql.query(query);
		if (result.length > 0) {
			activationCode = randomize("0", 7);
			this.checkActivationCode(device_id);
		} else {
			return device_id;
		}
	},
	// Get Dealer Id by link code or activation code
	getDealerIDByLinkOrActivation: async function (code) {
		let query = "";
		if (code.length <= 6) {
			query = `SELECT dealer_id FROM dealers WHERE link_code ='${code}' `;
		} else if (code.length >= 7) {
			query = `SELECT dealer_id FROM usr_acc WHERE activation_code ='${code}' `;
		}

		let result = await sql.query(query);
		if (result.length) {
			return result[0].dealer_id;
		}
		return null;
	},

	getDealerByDealerId: async function (id) {
		let query =
			"SELECT * FROM dealers WHERE dealer_id='" + id + "' limit 1";
		let result = await sql.query(query);

		if (result && result.length) {
			return result;
		} else {
			return [];
		}
	},

	formatBytes: function (bytes, decimals = 2) {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return (
			parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i]
		);
	},
	bytesToSize: function (bytes) {
		var sizes = ["Bytes", "KB", "MB", "GB", "TB"];
		if (bytes == 0) return "0 Byte";
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + " " + sizes[i];
	},
	getFileSize: function (file) {
		let fileExist = path.join(__dirname, "../uploads/" + file);
		if (fs.existsSync(fileExist)) {
			let file_status = fs.statSync(fileExist);
			return file_status.size;
		} else {
			return 0;
		}
	},
	getActivityName: async function (value) {
		let name = value;

		switch (value) {
			case "imei":
				name = "IMEI CHANGED";
				break;
			case "wiped":
				name = "Devcie wipe";
				break;
			case "push_apps":
				name = "Apps Pushed";
				break;
			case "pull_apps":
				name = "Apps Pulled";
				break;
			case "history":
				name = "Setting changed";
				break;
			case "policy":
				name = "Policy Applied";
				break;
			case "profile":
				name = "Profile Applied";
				break;
			default:
				break;
		}
		// console.log(name);
		return name;
	},
	checkValue: value => {
		if (
			value !== undefined &&
			value !== "" &&
			value !== null &&
			value !== "undefined" &&
			value !== "Undefined" &&
			value !== "UNDEFINED" &&
			value !== "null" &&
			value !== "Null" &&
			value !== "NULL"
		) {
			return value;
		} else {
			return "N/A";
		}
	},
	resetDB: function () {
		var importer1 = mysql_import.config({
			host: "localhost",
			user: "root",
			password: "",
			database: "mydb",
			onerror: err => console.log(err.message)
		});
		let sqlFile = path.join(__dirname + "/../_DB/reset_db.sql");
		importer1.import(sqlFile).then(() => {
			console.log("DB1 has finished importing");
		});
	},
	replaceAt: function (string, index, replace) {
		index--;
		return (
			string.substring(0, index) + replace + string.substring(index + 1)
		);
	},

	// Policy Helpers
	refactorPolicy: async function (policy) {
		// check if push application is updated
		// push apps
		let pushApps = JSON.parse(policy[0].push_apps);
		let apksQ = "SELECT * FROM apk_details WHERE delete_status != 1";
		let apks = await sql.query(apksQ);
		apks.forEach(apk => {
			let index = pushApps.findIndex(app => app.apk_id === apk.id);
			if (index && index !== -1) {
				pushApps[index].apk = apk.apk;
				pushApps[index].apk_name = apk.app_name;
				pushApps[index].logo = apk.logo;
				pushApps[index].package_name = apk.package_name;
				pushApps[index].version_name = apk.version_name;
			}
		});

		// refactor applist
		let appList = JSON.parse(policy[0].app_list);
		appList.forEach(app => {
			// app.uniqueName = app.unique_name;
			// app.packageName = app.package_name;
			app.defaultApp = app.default_app;
			// delete app.unique_name;
			// delete app.package_name;
			// delete app.default_app;
		});

		// refactor system secure settings
		let permissions = JSON.parse(policy[0].permissions);
		permissions.forEach(app => {
			app.uniqueName = app.uniqueExtesion;

			app.defaultApp = app.default_app;
			// app.uniqueExtension = app.
			// delete app.unique_name;
			// delete app.package_name;
			delete app.default_app;
		});
		let controls = JSON.parse(policy[0].controls);
		controls.forEach(control => {
			control.setting_status = (control.setting_status) ? true : false;
		})
		// copy refactored
		policy[0].app_list = JSON.stringify(appList);
		policy[0].permissions = JSON.stringify(permissions);
		policy[0].controls = JSON.stringify(controls)
		return policy;
	},
	insertPolicyPushApps: async function (
		policyId,
		pushApps,
		newPolicy = false
	) {
		if (!newPolicy) {
			await sql.query(
				`DELETE FROM policy_apps WHERE policy_id=${policyId}`
			);
		}
		let policyAppsQuery = `INSERT INTO policy_apps (policy_id, apk_id, guest, encrypted, enable) VALUES ?`;

		let policyAppValues = [];
		pushApps.forEach(app => {
			policyAppValues.push([
				policyId,
				app.apk_id,
				app.guest,
				app.encrypted,
				app.enable
			]);
		});

		if (policyAppValues.length) {
			await sql.query(policyAppsQuery, [policyAppValues]);
		}
	},
	generateStaffID: async function () {

		let staff_id = randomize("0", 6);
		staff_id = this.replaceAt(
			staff_id,
			app_constants.STAFF_ID_SYSTEM_LETTER_INDEX,
			app_constants.STAFF_ID_SYSTEM_LETTER
		);
		let query = `SELECT staff_id FROM dealer_agents WHERE staff_id = '${staff_id}'`;
		let result = await sql.query(query);
		if (result.length > 1) {
			staff_id = this.this.generateStaffID();
		}
		return staff_id;
	},
	move: (oldPath, newPath, callback) => {

		fs.rename(oldPath, newPath, function (err) {
			if (err) {
				if (err.code === 'EXDEV') {
					copy();
				} else {
					callback(err);
				}
				return;
			}
			callback();
		});

		function copy() {
			var readStream = fs.createReadStream(oldPath);
			var writeStream = fs.createWriteStream(newPath);

			readStream.on('error', callback);
			writeStream.on('error', callback);

			readStream.on('close', function () {
				fs.unlink(oldPath, callback);
			});

			readStream.pipe(writeStream);
		}
	},
	calculateProfitLoss: async function (packages, products, loggedDealerType) {
		let packagesIds = []
		let productIds = []
		var dealer_profit = 0
		var admin_profit = 0
		packages.map((item) => {
			packagesIds.push(item.id)
		})
		products.map((item) => {
			productIds.push(item.id)
		})

		let packagesData = []
		let pricesData = []

		if (packagesIds.length) {
			packagesData = await sql.query("SELECT * from packages where id IN (" + packagesIds.join(",") + ")")
		}
		if (productIds.length) {
			pricesData = await sql.query("SELECT * from prices where id IN (" + productIds.join(",") + ")")
		}
		let sa_sim_prices = {}
		let sa_chat_prices = {}
		let sa_vpn_prices = {}
		let sa_pgp_prices = {}

		let sa_product_prices = await sql.query("SELECT * FROM prices where dealer_type = 'super_admin'")
		sa_product_prices.map((item) => {
			if (item.price_for === "sim_id") {
				sa_sim_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "chat_id") {
				sa_chat_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "vpn") {
				sa_vpn_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "pgp_email") {
				sa_pgp_prices[item.price_term] = Number(item.unit_price)
			}
		})
		if (loggedDealerType === Constants.DEALER) {
			if (packagesData.length) {
				packagesData.map(async (item) => {
					if (item.dealer_type === 'super_admin') {
						packages.map((pkg) => {
							if (pkg.id === item.id) {
								admin_profit += pkg.pkg_price - item.pkg_price
							}
						})
					} else if (item.dealer_type === 'admin') {
						let sa_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === item.id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[item.pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[item.pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[item.pkg_term]
								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[item.pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[item.pkg_term]
								}
								admin_profit += Number(pkg.pkg_price) - sa_total_price
							}
						})
					}
				})
			}
			if (pricesData.length) {
				pricesData.map(async (item) => {
					if (item.price_for === "sim_id") {
						admin_profit += item.unit_price - sa_sim_prices[item.price_term]
					}
					else if (item.price_for === "SIM ID 2") {
						admin_profit += item.unit_price - sa_sim_prices[item.price_term]
					}
					else if (item.price_for === "chat_id") {
						admin_profit += item.unit_price - sa_chat_prices[item.price_term]
					}
					else if (item.price_for === "vpn") {
						admin_profit += item.unit_price - sa_vpn_prices[item.price_term]
					}
					else if (item.price_for === "pgp_email") {
						admin_profit += item.unit_price - sa_pgp_prices[item.price_term]
					}
				})
			}
		} else if (loggedDealerType === Constants.SDEALER) {
			let admin_sim_prices = {}
			let admin_chat_prices = {}
			let admin_vpn_prices = {}
			let admin_pgp_prices = {}

			let sa_product_prices = await sql.query("SELECT * FROM prices where dealer_type = 'admin'")
			sa_product_prices.map((item) => {
				if (item.price_for === "sim_id") {
					admin_sim_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "chat_id") {
					admin_chat_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "vpn") {
					admin_vpn_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "pgp_email") {
					admin_pgp_prices[item.price_term] = Number(item.unit_price)
				}
			})
			if (packagesData.length) {
				for (let i = 0; i < packagesData.length; i++) {
					let adminPackagePrice = await sql.query("SELECT * FROM dealer_packages_prices WHERE package_id = " + packagesData[i].id + " AND created_by = 'admin'")
					let adminPrice = null
					if (adminPackagePrice.length) {
						adminPrice = adminPackagePrice[0].price
					}
					if (packagesData[i].dealer_type === 'super_admin') {
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (adminPrice) {
									admin_profit += adminPrice - packagesData[i].pkg_price
									dealer_profit += pkg.pkg_price - adminPrice
								} else {
									dealer_profit += pkg.pkg_price - packagesData[i].pkg_price
								}
							}
						})
					}
					else if (packagesData[i].dealer_type === 'admin') {
						let sa_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[packagesData[i].pkg_term]
								}
								admin_profit += adminPrice - sa_total_price
								dealer_profit += Number(pkg.pkg_price) - adminPrice
							}
						})
					}
					else if (packagesData[i].dealer_type === 'dealer') {
						let sa_total_price = 0
						let admin_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
									admin_total_price += admin_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
									admin_total_price += admin_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[packagesData[i].pkg_term]
									admin_total_price += admin_chat_prices[packagesData[i].pkg_term]

								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[packagesData[i].pkg_term]
									admin_total_price += admin_pgp_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[packagesData[i].pkg_term]
									admin_total_price += admin_vpn_prices[packagesData[i].pkg_term]
								}
								admin_profit += admin_total_price - sa_total_price
								dealer_profit += Number(pkg.pkg_price) - admin_total_price
							}
						})
					}
				}
			}
			if (pricesData.length) {
				pricesData.map(async (item) => {
					if (item.price_for === "sim_id") {
						admin_profit += admin_sim_prices[item.price_term] - sa_sim_prices[item.price_term]
						dealer_profit += item.unit_price - admin_sim_prices[item.price_term]
					}
					else if (item.price_for === "SIM ID 2") {
						admin_profit += admin_sim_prices[item.price_term] - sa_sim_prices[item.price_term]
						dealer_profit += item.unit_price - admin_sim_prices[item.price_term]
					}
					else if (item.price_for === "chat_id") {
						admin_profit += admin_chat_prices[item.price_term] - sa_chat_prices[item.price_term]
						dealer_profit += item.unit_price - admin_chat_prices[item.price_term]
					}
					else if (item.price_for === "vpn") {
						admin_profit += admin_vpn_prices[item.price_term] - sa_vpn_prices[item.price_term]
						dealer_profit += item.unit_price - admin_vpn_prices[item.price_term]
					}
					else if (item.price_for === "pgp_email") {
						admin_profit += admin_pgp_prices[item.price_term] - sa_pgp_prices[item.price_term]
						dealer_profit += item.unit_price - admin_pgp_prices[item.price_term]
					}
				})
			}

		}
		return {
			admin_profit,
			dealer_profit
		}
	},
	saveServiceSalesDetails: async function (packages, products, loggedDealerType, user_acc_id, service_id, pay_now) {
		let packagesIds = []
		let productIds = []
		var dealer_profit = 0
		var admin_profit = 0
		let discount = 0.03
		packages.map((item) => {
			packagesIds.push(item.id)
		})
		products.map((item) => {
			productIds.push(item.id)
		})

		let packagesData = []
		let pricesData = []

		if (packagesIds.length) {
			packagesData = await sql.query("SELECT * from packages where id IN (" + packagesIds.join(",") + ")")
		}
		if (productIds.length) {
			pricesData = await sql.query("SELECT * from prices where id IN (" + productIds.join(",") + ")")
		}
		let sa_sim_prices = {}
		let sa_chat_prices = {}
		let sa_vpn_prices = {}
		let sa_pgp_prices = {}

		let sa_product_prices = await sql.query("SELECT * FROM prices where dealer_type = 'super_admin'")
		sa_product_prices.map((item) => {
			if (item.price_for === "sim_id") {
				sa_sim_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "chat_id") {
				sa_chat_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "vpn") {
				sa_vpn_prices[item.price_term] = Number(item.unit_price)
			}
			else if (item.price_for === "pgp_email") {
				sa_pgp_prices[item.price_term] = Number(item.unit_price)
			}
		})
		if (loggedDealerType === Constants.DEALER) {
			if (packagesData.length) {
				packagesData.map((item) => {
					if (item.dealer_type === 'super_admin') {
						packages.map((pkg) => {
							if (pkg.id === item.id) {
								if (pay_now) {
									pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
									item.pkg_price = item.pkg_price - (item.pkg_price * discount)
								}
								sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id ,item_id,item_data, item_type, item_term, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id},'${JSON.stringify(pkg)}', 'package','${pkg.pkg_term}' ,${pkg.pkg_price} , ${item.pkg_price} , 'delivered')`)
							}
						})
					} else if (item.dealer_type === 'admin') {
						let sa_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === item.id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[item.pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[item.pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[item.pkg_term]
								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[item.pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[item.pkg_term]
								}
								if (pay_now) {
									pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
									sa_total_price = sa_total_price - (sa_total_price * discount)
								}
								sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id ,item_id ,  item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id}, '${JSON.stringify(pkg)}','${item.pkg_term}' ,'package', ${pkg.pkg_price} , ${sa_total_price} , 'delivered')`)
							}
						})
					}
				})
			}
			if (pricesData.length) {
				pricesData.map(async (item) => {
					if (item.price_for === "sim_id") {
						// admin_profit += item.unit_price - sa_sim_prices[item.price_term]
						let adminCostPrice = sa_sim_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_sim_prices[item.price_term] - (sa_sim_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id ,item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}','${item.price_term}' ,'product', ${item.unit_price} , ${adminCostPrice} , 'delivered')`)
					}
					else if (item.price_for === "SIM ID 2") {
						let adminCostPrice = sa_sim_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_sim_prices[item.price_term] - (sa_sim_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id ,item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}','${item.price_term}' ,'product', ${item.unit_price} , ${adminCostPrice} , 'delivered')`)
					}
					else if (item.price_for === "chat_id") {
						let adminCostPrice = sa_chat_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_chat_prices[item.price_term] - (sa_chat_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id ,item_id , item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}','${item.price_term}' ,'product', ${item.unit_price} , ${adminCostPrice} , 'delivered')`)
					}
					else if (item.price_for === "vpn") {
						let adminCostPrice = sa_vpn_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_vpn_prices[item.price_term] - (sa_vpn_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id ,item_id , item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}','${item.price_term}' ,'product', ${item.unit_price} , ${adminCostPrice} , 'delivered')`)
					}
					else if (item.price_for === "pgp_email") {
						let adminCostPrice = sa_pgp_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_pgp_prices[item.price_term] - (sa_pgp_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id , item_data, item_term, item_type, item_sale_price, item_admin_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}','${item.price_term}','product', ${item.unit_price} , ${adminCostPrice} , 'delivered')`)
					}
				})
			}
		} else if (loggedDealerType === Constants.SDEALER) {
			let admin_sim_prices = {}
			let admin_chat_prices = {}
			let admin_vpn_prices = {}
			let admin_pgp_prices = {}

			let sa_product_prices = await sql.query("SELECT * FROM prices where dealer_type = 'admin'")
			sa_product_prices.map((item) => {
				if (item.price_for === "sim_id") {
					admin_sim_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "chat_id") {
					admin_chat_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "vpn") {
					admin_vpn_prices[item.price_term] = Number(item.unit_price)
				}
				else if (item.price_for === "pgp_email") {
					admin_pgp_prices[item.price_term] = Number(item.unit_price)
				}
			})
			if (packagesData.length) {
				for (let i = 0; i < packagesData.length; i++) {
					let adminPackagePrice = await sql.query("SELECT * FROM dealer_packages_prices WHERE package_id = " + packagesData[i].id + " AND created_by = 'admin'")
					let adminPrice = null
					if (adminPackagePrice.length) {
						adminPrice = adminPackagePrice[0].price
					}
					if (packagesData[i].dealer_type === 'super_admin') {
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (adminPrice) {
									admin_profit += adminPrice - packagesData[i].pkg_price
									if (pay_now) {
										pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
										packagesData[i].pkg_price = packagesData[i].pkg_price - (packagesData[i].pkg_price * discount)
										adminPrice = adminPrice - (adminPrice * discount)
									}
									sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term,item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id},'${JSON.stringify(pkg)}', 'package',' ${pkg.pkg_term}', ${pkg.pkg_price} ,${packagesData[i].pkg_price} , ${adminPrice} , 'delivered')`)
								} else {
									if (pay_now) {
										pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
										packagesData[i].pkg_price = packagesData[i].pkg_price - (packagesData[i].pkg_price * discount)
									}
									sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id},'${JSON.stringify(pkg)}', 'package', '${pkg.pkg_term}', ${pkg.pkg_price} ,${packagesData[i].pkg_price} , ${packagesData[i].pkg_price} , 'delivered')`)
								}
							}
						})
					}
					else if (packagesData[i].dealer_type === 'admin') {
						let sa_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[packagesData[i].pkg_term]
								}
								if (pay_now) {
									pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
									sa_total_price = sa_total_price - (sa_total_price * discount)
									adminPrice = adminPrice - (adminPrice * discount)
								}
								sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id},'${JSON.stringify(pkg)}', 'package', '${pkg.pkg_term}', ${pkg.pkg_price} ,${sa_total_price} , ${adminPrice} , 'delivered')`)
							}
						})
					}
					else if (packagesData[i].dealer_type === 'dealer') {
						let sa_total_price = 0
						let admin_total_price = 0
						packages.map((pkg) => {
							if (pkg.id === packagesData[i].id) {
								if (pkg.pkg_features.sim_id) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
									admin_total_price += admin_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.sim_id2) {
									sa_total_price += sa_sim_prices[packagesData[i].pkg_term]
									admin_total_price += admin_sim_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.chat_id) {
									sa_total_price += sa_chat_prices[packagesData[i].pkg_term]
									admin_total_price += admin_chat_prices[packagesData[i].pkg_term]

								}
								if (pkg.pkg_features.pgp_email) {
									sa_total_price += sa_pgp_prices[packagesData[i].pkg_term]
									admin_total_price += admin_pgp_prices[packagesData[i].pkg_term]
								}
								if (pkg.pkg_features.vpn) {
									sa_total_price += sa_vpn_prices[packagesData[i].pkg_term]
									admin_total_price += admin_vpn_prices[packagesData[i].pkg_term]
								}
								if (pay_now) {
									pkg.pkg_price = pkg.pkg_price - (pkg.pkg_price * discount)
									sa_total_price = sa_total_price - (sa_total_price * discount)
									admin_total_price = admin_total_price - (admin_total_price * discount)
								}
								sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${pkg.id},'${JSON.stringify(pkg)}', 'package', '${pkg.pkg_term}', ${pkg.pkg_price} ,${sa_total_price} , ${admin_total_price} , 'delivered')`)
							}
						})
					}
				}
			}
			if (pricesData.length) {
				pricesData.map(async (item) => {
					if (item.price_for === "sim_id") {
						let adminCostPrice = sa_sim_prices[item.price_term]
						let dealerCostPrice = admin_sim_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_sim_prices[item.price_term] - (sa_sim_prices[item.price_term] * discount)
							dealerCostPrice = admin_sim_prices[item.price_term] - (admin_sim_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}', 'product', ${item.price_term}, ${item.unit_price} ,${adminCostPrice} , ${dealerCostPrice} , 'delivered')`)
					}
					else if (item.price_for === "SIM ID 2") {
						let adminCostPrice = sa_sim_prices[item.price_term]
						let dealerCostPrice = admin_sim_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_sim_prices[item.price_term] - (sa_sim_prices[item.price_term] * discount)
							dealerCostPrice = admin_sim_prices[item.price_term] - (admin_sim_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}', 'product', '${item.price_term}', ${item.unit_price} ,${adminCostPrice} , ${dealerCostPrice} , 'delivered')`)

					}
					else if (item.price_for === "chat_id") {
						let adminCostPrice = sa_chat_prices[item.price_term]
						let dealerCostPrice = admin_chat_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_chat_prices[item.price_term] - (sa_chat_prices[item.price_term] * discount)
							dealerCostPrice = admin_chat_prices[item.price_term] - (admin_chat_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}', 'product', '${item.price_term}', ${item.unit_price} ,${adminCostPrice} , ${dealerCostPrice} , 'delivered')`)

					}
					else if (item.price_for === "vpn") {
						let adminCostPrice = sa_vpn_prices[item.price_term]
						let dealerCostPrice = admin_vpn_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_vpn_prices[item.price_term] - (sa_vpn_prices[item.price_term] * discount)
							dealerCostPrice = admin_vpn_prices[item.price_term] - (admin_vpn_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}', 'product', '${item.price_term}', ${item.unit_price} ,${adminCostPrice} , ${dealerCostPrice} , 'delivered')`)

					}
					else if (item.price_for === "pgp_email") {
						let adminCostPrice = sa_pgp_prices[item.price_term]
						let dealerCostPrice = admin_pgp_prices[item.price_term]
						if (pay_now) {
							item.unit_price = item.unit_price - (item.unit_price * discount)
							adminCostPrice = sa_pgp_prices[item.price_term] - (sa_pgp_prices[item.price_term] * discount)
							dealerCostPrice = admin_pgp_prices[item.price_term] - (admin_pgp_prices[item.price_term] * discount)
						}
						sql.query(`INSERT INTO services_sale (user_acc_id,service_data_id , item_id, item_data, item_type, item_term, item_sale_price, item_admin_cost, item_dealer_cost,status) VALUES(${user_acc_id} , ${service_id}, ${item.id},'${JSON.stringify(item)}', 'product', '${item.price_term}', ${item.unit_price} ,${adminCostPrice} , ${dealerCostPrice} , 'delivered')`)
					}
				})
			}

		}
		return {
			admin_profit,
			dealer_profit
		}
	},

	updateRefundSaleDetails: async function (user_acc_id, service_id, serviceRemainingDays, prevServiceTotalDays) {
		let serviceSalesQuery = `SELECT * FROM services_sale WHERE service_data_id = ${service_id} AND user_acc_id = ${user_acc_id}`
		sql.query(serviceSalesQuery, function (err, result) {
			if (err) {
				return
			}
			if (result.length) {
				result.map((item) => {
					let paid_sale_price = item.item_sale_price - ((item.item_sale_price / prevServiceTotalDays) * serviceRemainingDays).toFixed(2);
					let paid_admin_cost = item.item_admin_cost - (item.item_admin_cost / prevServiceTotalDays * serviceRemainingDays).toFixed(2);
					let paid_dealer_cost = item.item_dealer_cost - (item.item_dealer_cost / prevServiceTotalDays * serviceRemainingDays).toFixed(2);
					let dateNow = moment().format("YYYY-MM-DD HH:mm:ss")
					let updateSaleDetails = `UPDATE services_sale SET paid_sale_price = ${paid_sale_price}, paid_admin_cost = ${paid_admin_cost} , paid_dealer_cost = ${paid_dealer_cost} , status = 'returned' , end_date = '${dateNow}' WHERE user_acc_id = ${user_acc_id} AND service_data_id = ${service_id}`
					sql.query(updateSaleDetails)
				})
			}
		});
	},

	calculateHardwareProfitLoss: async function (hardwares, loggedDealerType) {
		let hardwareIds = []
		var dealer_profit = 0
		var admin_profit = 0
		hardwares.map((item) => {
			hardwareIds.push(item.id)
		})

		let hardwaresData = []
		if (hardwareIds.length) {
			console.log("SELECT * from hardwares where id IN (" + hardwareIds.join(",") + ")");
			hardwaresData = await sql.query("SELECT * from hardwares where id IN (" + hardwareIds.join(",") + ")")
		}

		// console.log(loggedDealerType, hardwaresData, hardwareIds);

		if (loggedDealerType === Constants.DEALER) {
			if (hardwaresData.length) {
				hardwaresData.map((item) => {
					hardwares.map((hardware) => {
						console.log(hardware.id, item.id);
						if (hardware.id === item.id) {
							console.log(hardware.hardware_price, item.hardware_price);
							admin_profit += hardware.hardware_price - item.hardware_price
						}
					})
				})
			}

		} else if (loggedDealerType === Constants.SDEALER) {
			if (hardwareData.length) {
				for (let i = 0; i < packagesData.length; i++) {
					let adminHardwarePrice = await sql.query("SELECT * FROM dealer_hardwares_prices WHERE hardware_id = " + hardwaresData[i].id + " AND created_by = 'admin'")
					let adminPrice = null
					if (adminHardwarePrice.length) {
						adminPrice = adminhardwarePrice[0].price
					}
					hardwares.map((hardware) => {
						if (hardware.id === hardwaresData[i].id) {
							if (adminPrice) {
								admin_profit += adminPrice - hardwaresData[i].hardware_price
								dealer_profit += hardware.hardware_price - adminPrice
							} else {
								dealer_profit += hardware.hardware_price - hardwaresData[i].hardware_price
							}
						}
					})

				}
			}
		}
		return {
			admin_profit,
			dealer_profit
		}
	},
	updateProfitLoss: async function (admin_profit, dealer_profit, admin_data, connected_dealer, usr_acc_id, loggedDealerType, pay_now, service_id) {
		let transection_data = {
			user_acc_id: usr_acc_id,
			dealer_type: "admin",
			transection_type: "profit",
			service_id: service_id

		}
		let transection_status = "transferred"
		if (!pay_now) {
			transection_status = "holding"
		}
		if (admin_profit > 0) {
			let admin_profit_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data ,credits , transection_type , status , type) VALUES (${admin_data[0].dealer_id},${usr_acc_id} ,'${JSON.stringify(transection_data)}', ${admin_profit} ,'debit', '${transection_status}', 'services')`
			let profit_result = await sql.query(admin_profit_query);
			if (profit_result.insertId && pay_now) {
				let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
				let updateCredits = await sql.query(update_admin_credits)
				if (updateCredits.affectedRows === 0) {
					let insert_admin_credits = `INSERT INTO financial_account_balance (dealer_id , credits) VALUES(${admin_data[0].dealer_id} , ${admin_profit})`
					await sql.query(insert_admin_credits)
				}
			}
		} else if (admin_profit < 0) {
			let admin_loss_query = `INSERT INTO financial_account_transections (user_id,user_dvc_acc_id, transection_data, credits ,transection_type, status , type) VALUES (${admin_data[0].dealer_id},${usr_acc_id} ,'${JSON.stringify(transection_data)}' ,${admin_profit} ,'credit', '${transection_status}', 'services')`
			let loss_result = await sql.query(admin_loss_query);
			if (loss_result.insertId && pay_now) {
				let update_admin_credits = `UPDATE financial_account_balance SET credits = credits + ${admin_profit} WHERE dealer_id = ${admin_data[0].dealer_id}`
				await sql.query(update_admin_credits)
			}
		}
		if (loggedDealerType === Constants.SDEALER) {
			transection_data.dealer_type = "dealer"
			if (dealer_profit > 0) {
				let dealer_profit_query = `INSERT INTO financial_account_transections ( user_id,user_dvc_acc_id, transection_data ,credits, transection_type, status, type) VALUES (${connected_dealer},${usr_acc_id} ,'${JSON.stringify(transection_data)}' ,${admin_profit} ,'debit', '${transection_status}', 'services')`
				let profit_result = await sql.query(dealer_profit_query);
				if (profit_result.insertId && pay_now) {
					let update_dealet_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_profit} WHERE dealer_id = ${connected_dealer}`
					let updateCredits = await sql.query(update_dealet_credits)
					if (updateCredits.affectedRows === 0) {
						let insert_dealer_credits = `INSERT INTO financial_account_balance (dealer_id , credits) VALUES(${connected_dealer} , ${admin_profit})`
						await sql.query(insert_dealer_credits)
					}
				}
			} else if (dealer_profit < 0) {
				let dealer_loss_query = `INSERT INTO financial_account_transections ( user_id,user_dvc_acc_id, transection_data ,credits, transection_type, status, type) VALUES (${connected_dealer},${usr_acc_id},'${JSON.stringify(transection_data)}' ,${admin_profit} ,'credit', '${transection_status}', 'services')`
				let profit_result = await sql.query(dealer_loss_query);
				if (profit_result.insertId && pay_now) {
					let update_dealet_credits = `UPDATE financial_account_balance SET credits = credits + ${dealer_profit} WHERE dealer_id = ${connected_dealer}`
					await sql.query(update_dealet_credits)
				}
			}
		}
	},
	getInvoiceId: async function () {
		let invoiceId = ""
		var max = "000000"
		let lastInvoice = "SELECT id from invoices ORDER BY id DESC LIMIT 1"
		let result = await sql.query(lastInvoice)
		if (result && result.length) {
			invoiceId = (result[0].id + 1).toString()
			invoiceId = max.substring(0, max.length - invoiceId.length) + invoiceId
		} else {
			invoiceId = "000001"
		}
		return 'PI' + invoiceId;
	},
	getUserAccID: async function (dealerId) {
		let getUserAccId = await sql.query(`SELECT id FROM usr_acc WHERE dealer_id=${dealerId}`);
		console.log("getUserAccId ", getUserAccId);
		let user_acc_ids = [];


		getUserAccId.forEach((item) => {
			user_acc_ids.push(item.id);
		})
		return user_acc_ids;
	},
	getDealersAgainstPermissions: async function (permission_id, permission_type, loggedUserId, subDealers = [], loggedUserType = '') {

		let finalDealers = [];
		let allDealers = [];
		let condition = '';
		let statusAll = false;
		// console.log("subDealers ", subDealers);
		// if (subDealers && subDealers.length)
		// subDealers = subDealers

		if (subDealers && subDealers.length) {

			if (subDealers[0].dealer_id !== undefined) {
				subDealers = subDealers.map((item) => item.dealer_id);
			}
			// console.log("filtered subDealers ", subDealers);
			if (permission_type === "package" && loggedUserType === "dealer") {
				condition = ` OR (dealer_type = 'dealer' AND (dealer_id IN (${subDealers}) OR dealer_id = 0) )`;
			} else {
				condition = ` OR (dealer_type = 'admin' AND (dealer_id IN (${subDealers}) OR dealer_id = 0) )`;
			}
		} else {
			if (permission_type === "package" && loggedUserType === "dealer") {
				condition = ` OR (dealer_type = 'dealer' AND dealer_id = 0)`;
			} else {
				condition = ` OR (dealer_type = 'admin' AND dealer_id = 0)`;
			}
		}
		let selectDealerQ = `SELECT dealer_id, dealer_type, permission_by FROM dealer_permissions WHERE permission_id= ${permission_id} AND permission_type ='${permission_type}' AND (permission_by=${loggedUserId} ${condition})`; // dealer_id = ${loggedUserId} OR 
		console.log("selectDealerQ ", selectDealerQ)
		let results = await sql.query(selectDealerQ);

		console.log("permittedDealers results:: ", results);

		if (results.length > 0) {
			for (let i = 0; i < results.length; i++) {
				if (results[i].dealer_id == 0) {
					let Update_sdealerList = subDealers.map((dealer) => {
						return {
							dealer_id: dealer,
							dealer_type: results[i].dealer_type,
							permission_by: results[i].permission_by
						}
					})

					finalDealers.push(...Update_sdealerList);
					statusAll = true
				} else {
					finalDealers.push(results[i]);
				}
			}
		}
		console.log("finalDealers", finalDealers);


		if (loggedUserType !== "admin") {
			let deleteIds = [];
			finalDealers.forEach((item) => {
				// console.log("item ", item);
				if (item.dealer_type === "admin") {
					let index = finalDealers.findIndex((sd) => sd.dealer_type === "dealer" && sd.dealer_id === item.dealer_id);
					deleteIds.push(index);
				}
			})
			// console.log("deleteIds index: ", deleteIds);
			allDealers = finalDealers.filter((item, i) => !deleteIds.includes(i));
		} else {
			allDealers = finalDealers;
		}

		allDealers = allDealers.filter((item) => item.dealer_id !== loggedUserId)

		return {
			allDealers: JSON.stringify(allDealers),
			statusAll
		}
	},
	savePermission: async function (prevDealers, allDealers, permissionType, permissionId, loggedUserId, loggedUserType) {
		// this query is to avoid duplication records
		// let dealers_data = await sql.query(`SELECT dealer_id FROM dealer_permissions WHERE permission_type='${permissionType}' AND permission_id=${permissionId} AND permission_by= ${loggedUserId}`);

		let insertQuery = "INSERT INTO dealer_permissions (permission_id, dealer_id, permission_type, permission_by, dealer_type) VALUES ";
		let insertOrIgnore = ''
		for (let i = 0; i < allDealers.length; i++) {
			// console.log(i, "allDealers.length ", allDealers.length);
			if (prevDealers.length) {
				let index = prevDealers.findIndex((dealer) => dealer.dealer_id == allDealers[i]);
				if (index !== -1) {
					continue
				}
			}

			if (i == (allDealers.length - 1)) {
				insertOrIgnore = insertOrIgnore + `(${permissionId}, ${allDealers[i]}, '${permissionType}', '${loggedUserId}', '${loggedUserType}')`
			} else {
				insertOrIgnore = insertOrIgnore + `(${permissionId}, ${allDealers[i]}, '${permissionType}', '${loggedUserId}', '${loggedUserType}'),`
			}
		}

		// console.log("insertOrIgnore general helper:: ", insertOrIgnore)
		// return insertOrIgnore;

		if (insertOrIgnore) {
			let insertDealerPermissionsQ = insertQuery + insertOrIgnore;
			console.log("insertDealerPermissionsQ ", insertDealerPermissionsQ);
			let insertDealers = await sql.query(insertDealerPermissionsQ);

			if (insertDealers.affectedRows) {
				return {
					status: true,
					msg: 'permission saved successfully'
				}
			} else {
				return {
					status: false,
					msg: 'failed to save permission'
				}
			}
		} else {
			return {
				status: false,
				msg: 'failed to save permission'
			}
		}
	},
	getUserDealers: async function (loggedUserType, loggedUserId, permissionType = '') {
		let dealerList = [];
		let dealerCount = 0;

		if (loggedUserType === "admin") {
			if (permissionType === "package") {
				dealerList = await sql.query(`SELECT * FROM dealers WHERE type = 2 ORDER BY created DESC`);
				dealerCount = dealerList ? dealerList.length : 0;
			} else {
				let adminRoleId = await this.getUserTypeIDByName(loggedUserType);
				let selectQ = `SELECT * FROM dealers WHERE type!=${adminRoleId} AND type != 4 AND type !=5 ORDER BY created DESC`;
				dealerList = await sql.query(selectQ);
				dealerCount = await this.dealerCount(adminRoleId);
			}

		}
		else if (loggedUserType === "dealer") {
			dealerList = await sql.query(`SELECT dealer_id FROM dealers WHERE connected_dealer ='${loggedUserId}'`)
			dealerCount = (dealerList && dealerList.length) ? dealerList.length : 0;
		}
		// console.log("===================> dealerList:: ", dealerList);
		let getDealerIds = dealerList.map((dealer) => dealer.dealer_id);

		return {
			dealerList: getDealerIds,
			dealerCount
		}
	},
	updatePendingTransactions: async function (dealerId, credits) {
		let get_last_panding_transections_query = `SELECT * from financial_account_transections WHERE user_id = ${dealerId} AND status = 'pending' ORDER BY created_at asc`
		let last_panding_transections = await sql.query(get_last_panding_transections_query)
		console.log(last_panding_transections.length);
		if (last_panding_transections && last_panding_transections.length) {
			for (let i = 0; i < last_panding_transections.length; i++) {
				let paid_credits = 0
				let due_credits = 0
				if (credits > 0) {
					if (credits >= last_panding_transections[i].due_credits) {
						credits = credits - last_panding_transections[i].due_credits
						paid_credits = last_panding_transections[i].due_credits
						due_credits = 0
						sql.query(`UPDATE financial_account_transections SET paid_credits = paid_credits + ${paid_credits} , due_credits = ${due_credits} , status = 'transferred' WHERE id = ${last_panding_transections[i].id}`)
						

					} else {
						due_credits = last_panding_transections[i].due_credits - credits
						paid_credits = credits
						credits = 0
						sql.query(`UPDATE financial_account_transections SET paid_credits = paid_credits + ${paid_credits} , due_credits = ${due_credits} WHERE id = ${last_panding_transections[i].id}`)
					}
				} else {
					break
				}
			}
			let allDealers = await sql.query(`SELECT dealer_id FROM dealers WHERE dealer_id = ${dealerId}`);
			if (allDealers.length) {
				let item = allDealers[0]
				let getDate = moment().subtract(22, 'day').format('YYYY-MM-DD');
				let getTransaction = await sql.query("SELECT * FROM financial_account_transections " +
					"WHERE user_id = " + item.dealer_id + " AND status = 'pending' AND DATE(created_at) >= " + getDate + " LIMIT 1");
				if (getTransaction.length) {
					let now = moment();
					let end = moment(getTransaction[0].created_at).format('YYYY-MM-DD');
					let duration = now.diff(end, 'days');

					if (duration > 21 && duration <= 60) {
						await sql.query("UPDATE dealers set account_balance_status = 'restricted' WHERE dealer_id = " + item.dealer_id);
					} else if (duration > 60) {
						await sql.query("UPDATE dealers set account_balance_status = 'suspended' WHERE dealer_id = " + item.dealer_id);
					}
				} else {
					await sql.query("UPDATE dealers set account_balance_status = 'active' WHERE dealer_id = " + item.dealer_id);
				}
			}
		}
	}
}
