var express = require('express');
var router = express.Router();
const sql = require('../helper/sql.js');
var datetime = require('node-datetime');
// var moment = require('moment');
// import ADMIN from "../constants/Application";
var moment = require('moment-strftime');
var Constants = require('../constants/Application');
const device_helpers = require('./device_helpers');
var util = require('util')
const exec = util.promisify(require('child_process').exec);

var ApkReader = require('node-apk-parser')
var md5 = require('md5');
var randomize = require('randomatic');
const mysql_import = require('mysql-import');
var path = require('path');

let usr_acc_query_text = "usr_acc.id,usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.user_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity"
module.exports = {
	isAdmin: async function (userId) {
		var query1 = "SELECT type FROM dealers where dealer_id =" + userId;
		var user = await sql.query(query1);
		if (user.length) {
			var query2 = "SELECT * FROM user_roles where id =" + user[0].type + " and role='admin' ";
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
		var query1 = "SELECT type FROM dealers as user left join user_roles as role on( role.id = user.type) where dealer_id =" + userId;
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
		var query = "SELECT * FROM user_roles where role ='" + dealerType + "' and role!='admin'";
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
		var component = await sql.query("SELECT * FROM acl_modules where id =" + componentId);
		if (component.length) {
			return component[0].id;
		} else {
			return false;
		}
	},
	getComponentIdByName: async function (componentName) {
		var component = await sql.query("SELECT * FROM acl_modules WHERE component ='" + componentName + "'");
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

		var component = await sql.query("SELECT * FROM acl_modules WHERE uri ='" + componentUri + "' ");
		// console.log("SELECT * FROM acl_modules WHERE uri ='" + componentUri + "' ");
		if (component.length) {
			// console.log("hello", component);
			return component[0];
		} else {
			return false;
		}
	},
	getActionId: async function (actionId) {
		var component = await sql.query("SELECT * FROM acl_module_actions where id =" + actionId);
		if (component.length) {
			return component[0].id;
		} else {
			return false;
		}
	},
	getAllComponentActions: async function (componentId) {
		var query = "SELECT * FROM acl_module_actions where component_id =" + componentId;
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
			var query = "SELECT * FROM acl_module_to_user_roles where user_role_id =" + role + " and component_id =" + component;
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
			var query = "SELECT * FROM acl_module_to_user_roles where user_role_id =" + role + " and component_id =" + component;
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
	dealerCount: async (adminRoleId) => {

		var query = "SELECT COUNT(*) as dealer_count FROM dealers WHERE type !=" + adminRoleId;
		let res = await sql.query(query);
		if (res.length) {
			return res[0].dealer_count;
		} else {
			return false;
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

			var query = "SELECT * FROM acl_module_to_user_roles where user_role_id =" + role + " and component_id =" + component.id;
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
	isAllowedAction: async function (componentId, actionId, userId) {

	},

	//Helper function to get unique device_id in format like "ASGH457862" 


	getDeviceId: async function (sn, mac) {
		// let sqlQuery = "SELECT device_id from devices where serial_number = '" + sn + "' OR mac_address = '" + mac + "'";
		// let result = await sql.query(sqlQuery)
		let unlickQuery
		if (sn === Constants.PRE_DEFINED_SERIAL_NUMBER) {
			unlickQuery = "SELECT device_id from acc_action_history where mac_address = '" + mac + "'";
		} else if (mac === Constants.PRE_DEFINED_MAC_ADDRESS) {
			unlickQuery = "SELECT device_id from acc_action_history where serial_number = '" + sn + "'";
		}
		else {
			unlickQuery = "SELECT device_id from acc_action_history where serial_number = '" + sn + "' OR mac_address = '" + mac + "'";
		}

		let unlinkedResult = await sql.query(unlickQuery)
		// if (result.length) {
		// 	return result[0].device_id
		// }
		// else 
		if (unlinkedResult.length) {
			return unlinkedResult[0].device_id
		}
		else {

			console.log(sn, 'MAC', mac);
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

			return deviceId;
		}
		// const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		// let fourLetterWords = [];
		// for (let firstLetterIndex = 0; firstLetterIndex < alphabet.length; firstLetterIndex++) {
		// 	for (let secondLetterIndex = 0; secondLetterIndex < alphabet.length; secondLetterIndex++) {
		// 		for (let thirdLetterIndex = 0; thirdLetterIndex < alphabet.length; thirdLetterIndex++) {
		// 			for (let fourthLetterIndex = 0; fourthLetterIndex < alphabet.length; fourthLetterIndex++) {
		// 				fourLetterWords.push(alphabet[firstLetterIndex] + alphabet[secondLetterIndex] + alphabet[thirdLetterIndex] + alphabet[fourthLetterIndex]);
		// 			}

		// 		}
		// 	}
		// }
		// // const digits = '1234567890';
		// // let sixDigitsCombination;


		// var random = Math.floor(100000 + Math.random() * 900000);


		// var randAlphabet = Math.floor(Math.random() * 456976);
		// var deviceId = fourLetterWords[randAlphabet] + random;


		// fourLetterWords = [];

		// return deviceId;
	},
	checkLinkCode: async function (link_code) {

		let query = "select dealer_id from dealers where link_code = '" + link_code + "';"
		let result = await sql.query(query);
		if (result.length > 1) {
			link_code = randomize('0', 6);
			this.checkLinkCode(link_code);
		} else {
			return link_code;
		}
	},
	checkVerificationCode: async function (code) {
		let query = "select dealer_id from dealers where verification_code = '" + code + "';"
		let result = await sql.query(query);
		if (result.length > 1) {
			code = randomize('0', 6);
			this.checkVerificationCode(code);
		} else {
			return code;
		}
	},
	checkUserId: async function (userId) {

		let query = "select user_id from users where user_id = '" + userId + "';"
		let result = await sql.query(query);
		if (result.length > 1) {
			userId = randomize('0', 6);
			this.checkUserId(userId);
		} else {
			return userId;
		}
	},
	getExpDateByMonth: function (currentDate, expiryMonth) {
		return moment(currentDate, "YYYY-MM-DD").add(expiryMonth, 'M').strftime("%Y/%m/%d");
	},
	checkDeviceId: async (device_id, sn, mac) => {
		let query = "SELECT device_id FROM devices WHERE device_id = '" + device_id + "';"
		let result = await sql.query(query);
		if (result.length > 1) {
			device_id = helpers.getDeviceId(sn, mac);
			checkDeviceId(device_id, sn, mac);
		} else {
			return device_id;
		}
	},
	validateEmail: (email) => {
		var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return re.test(String(email).toLowerCase());
	},
	checkNullStatus: (userAcc) => {
		if (userAcc.status === '' || userAcc.status === null) {
			return true;
		} else {
			return false;
		}
	},
	checkNullUserAccountStatus: (userAcc) => {
		if (userAcc.account_status === '' || userAcc.account_status === null) {
			return true;
		} else {
			return false;
		}
	},
	getDealerStatus: (dealer) => {
		if ((dealer.account_status === '' || dealer.account_status === null) && (dealer.unlink_status === 0)) {
			return Constants.DEALER_ACTIVE;
		} else if (dealer.unlink_status === 1) {
			return Constants.DEALER_UNLINKED;
		} else if (dealer.account_status === 'suspended') {
			return Constants.DEALER_SUSPENDED;
		} else {
			return 'N/A';
		}
	},
	getuserTypeIdByName: async function (userType) {
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
		let results = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE devices.device_id = "' + device_id + '"');
		if (results.length) {
			results[0].finalStatus = device_helpers.checkStatus(results[0])
			results[0].pgp_email = await device_helpers.getPgpEmails(results[0])
			results[0].sim_id = await device_helpers.getSimids(results[0])
			results[0].chat_id = await device_helpers.getChatids(results[0])
			return results[0]
		}
		else {
			return [];
		}
	},

	// windows
	getWindowAPKPackageNameScript: async (filePath) => {
		try {
			let cmd = "aapt dump badging " + filePath + " | findstr /C:\"package: name\"";
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
				let array = stdout.split(' ');
				let packageName = array[1].split('=');
				return (packageName[1]) ? packageName[1].replace(/\'/g, '') : false;
			}
			return false;
		} catch (error) {
			return false;
		}

	},
	getWindowAPKVersionCodeScript: async (filePath) => {
		try {
			let cmd = "aapt dump badging " + filePath + " | findstr /C:\"package: name\"";
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
				let array = stdout.split(' ');
				let versionCode = array[2].split('=');
				return (versionCode[1]) ? versionCode[1].replace(/\'/g, '') : false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},
	getWindowAPKVersionNameScript: async (filePath) => {
		try {
			let cmd = "aapt dump badging " + filePath + " | findstr /C:\"package: name\"";
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
				let array = stdout.split(' ');
				let versionName = array[2].split('=');
				return (versionName[1]) ? versionName[1].replace(/\'/g, '') : false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},
	getWindowAPKLabelScript: async function (filePath) {
		try {
			let cmd = "aapt dump badging " + filePath + " | findstr /C:\"application:\"";
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
				let array = stdout.split(' ');
				console.log("arr", array);
				let label = array[1].split('=');
				console.log("label", label);

				return (label[1]) ? label[1].replace(/\'/g, '') : false;
			}
			return false;
		} catch (error) {
			return false;
		}
	},

	// linux scripts
	getAPKPackageNameScript: async function (filePath) {
		try {
			let packageName = "aapt list -a " + filePath + " | awk -v FS='\"' '/package=/{print $2}'";
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
			let versionCode = "aapt dump badging " + filePath + " | grep \"versionCode\" | sed -e \"s/.*versionCode='//\" -e \"s/' .*//\"";
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
			let versionName = "aapt dump badging " + filePath + " | grep \"versionName\" | sed -e \"s/.*versionName='//\" -e \"s/' .*//\"";
			const { stdout, stderr, error } = await exec(versionName);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}

			if (stderr) {
				return false
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
			let label = "aapt dump badging " + filePath + " | grep \"application\" | sed -e \"s/.*label='//\" -e \"s/' .*//\""
				;
			const { stdout, stderr, error } = await exec(label);
			// console.log('stdout:', stdout);
			// console.log('stderr:', stderr);
			if (error) {
				return false;
			}

			if (stderr) {
				return false
			}
			if (stdout) {
				return stdout;
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
			return res.package

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
			return res.versionCode
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
			throw (e);
		}

	},
	getAPKLabel: async function (filePath) {
		return await this.getAPKLabelScript(filePath)
	},
	saveLogin: async function (user, loginClient, type, status) {
		let insertQ = "INSERT INTO login_history ";
		let commonFields = " token, expiresin, ip_address, logged_in_client, type, status ";
		let values = " VALUES ( ";
		let commonValues = " '" + user.token + "', '" + user.expiresIn + "', '" + user.ip_address + "', '" + loginClient + "', '" + type + "', " + status + " ";

		if (loginClient === Constants.DEVICE) {
			if (type === Constants.SOCKET) {
				insertQ = insertQ + " (device_id, socket_id, " + commonFields + " ) ";
				values = values + " '" + user.device_id + "', '" + user.socket_id + "', " + commonValues + " ) "
			} else if (type === Constants.TOKEN) {
				insertQ = insertQ + " (device_id, " + commonFields + " ) ";
				values = values + " '" + user.device_id + "', " + commonValues + " ) ";
			}
		} else {
			if (type === Constants.SOCKET) {
				insertQ = insertQ + " (dealer_id, socket_id, " + commonFields + " ) ";
				values = values + " '" + user.dealer_id + "', '" + user.socket_id + "', " + commonValues + " ) "
			} else if (type === Constants.TOKEN) {
				insertQ = insertQ + " (dealer_id, " + commonFields + " ) ";
				values = values + " '" + user.dealer_id + "', " + commonValues + " ) ";
			}
		}
		// console.log();
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
		let loginQ = "SELECT * from login_history WHERE dealer_id ='" + dealerId + "'";
		let res = await sql.query(loginQ);
		// console.log("resrserse", res);
		if (res.length) {
			return res[0];
		} else {
			return false;
		}
	},
	getLoginByDeviceID: async function (deviceId) {
		let loginQ = "SELECT * from login_history WHERE device_id ='" + deviceId + "'";
		let res = await sql.query(loginQ);
		if (res.length) {
			return res[0];
		} else {
			return false;
		}
	},
	expireLoginByToken: async function (token) {
		let loginQ = "UPDATE login_history SET status=0 WHERE token='" + token + "'";
		sql.query(loginQ);
	},
	expireAllLogin: async function () {
		let loginQ = "UPDATE login_history SET status=0";
		sql.query(loginQ);
	},
	getAllRecordbyUserID: async function (userID) {
		// console.log('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.id = ' + device_id)
		let results = await sql.query('select devices.*  ,' + usr_acc_query_text + ', dealers.dealer_name,dealers.connected_dealer from devices left join usr_acc on  devices.id = usr_acc.device_id LEFT JOIN dealers on usr_acc.dealer_id = dealers.dealer_id WHERE usr_acc.user_id = "' + userID + '"');
		if (results.length) {
			for (var i = 0; i < results.length; i++) {
				results[i].finalStatus = device_helpers.checkStatus(results[i])
				results[i].pgp_email = await device_helpers.getPgpEmails(results[i])
				results[i].sim_id = await device_helpers.getSimids(results[i])
				results[i].chat_id = await device_helpers.getChatids(results[i])
			}
			return results
		}
		else {
			return [];
		}
	},
	//to get User record by user ID
	getUserDataByUserId: async function (user_id) {

		let result = await sql.query("SELECT * FROM users WHERE user_id = '" + user_id + "'")
		if (result.length) {
			return result
		} else {
			return []
		}
	},
	// Check for unique Activation code
	checkActivationCode: async function (device_id) {

		let query = "SELECT device_id FROM devices WHERE device_id = '" + device_id + "';"
		let result = await sql.query(query);
		if (result.length > 0) {
			activationCode = randomize('0', 7);
			this.checkActivationCode(device_id);
		} else {
			return device_id;
		}
	},
	// Get Dealer Id by link code or activation code
	getDealerIdByLinkOrActivation: async function (code) {

		let query = "SELECT dealer_id FROM dealers WHERE link_code ='" + code + "' "
		let result = await sql.query(query);
		if (result.length) {
			return result[0].dealer_id
		} else {
			let query = "SELECT dealer_id FROM usr_acc WHERE activation_code ='" + code + "'";
			let result = await sql.query(query);
			if (result.length) {
				return result[0].dealer_id
			} else {
				return null;
			}
		}
	},
	formatBytes: function (bytes, decimals = 2) {
		if (bytes === 0) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));


		return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
	},
	bytesToSize: function (bytes) {
		var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
		if (bytes == 0) return '0 Byte';
		var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
		return Math.round(bytes / Math.pow(1024, i), 2) + ' ' + sizes[i];
	},
	getActivityName: async function (value) {

		let name = value

		switch (value) {
			case 'imei':
				name = 'IMEI CHANGED'
				break;
			case 'wiped':
				name = 'Devcie wipe'
				break;
			case 'push_apps':
				name = 'Apps Pushed'
				break;
			case 'pull_apps':
				name = 'Apps Pulled'
				break;
			case 'history':
				name = 'Setting changed'
				break;
			case 'policy':
				name = 'Policy Applied'
				break;
			case 'profile':
				name = 'Profile Applied'
				break;
			default:
				break;
		}
		// console.log(name);
		return name
	},
	checkValue: (value) => {
		if (value !== undefined && value !== '' && value !== null && value !== 'undefined' && value !== 'Undefined' && value !== "UNDEFINED" && value !== 'null' && value !== 'Null' && value !== 'NULL') {
			return value;
		} else {
			return 'N/A';
		}
	},
	resetDB: function () {
		var importer1 = mysql_import.config({
			host: 'localhost',
			user: 'root',
			password: '',
			database: 'mydb',
			onerror: err => console.log(err.message)
		});
		let sqlFile = path.join(__dirname + '/../_DB/reset_db.sql');
		importer1.import(sqlFile).then(() => {
			console.log('DB1 has finished importing')
		});
	},
	refactorPolicy: function (policy) {
		let applist = JSON.parse(policy[0].app_list);
		applist.forEach((app) => {
			app.uniqueName = app.unique_name;
			app.packageName = app.package_name;
			app.defaultApp = app.default_app;
			delete app.unique_name;
			delete app.package_name;
			delete app.default_app;
		})

		let permissions = JSON.parse(policy[0].permissions);
		permissions.forEach((app) => {
			app.uniqueName = app.uniqueExtesion;

			app.defaultApp = app.default_app;
			// app.uniqueExtension = app.
			// delete app.unique_name;
			// delete app.package_name;
			delete app.default_app;
		})

		policy[0].app_list = JSON.stringify(applist);

		policy[0].permissions = JSON.stringify(permissions);
		return policy;
	}
}