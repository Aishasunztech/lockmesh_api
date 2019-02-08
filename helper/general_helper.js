var express = require('express');
var router = express.Router();
const sql = require('../helper/sql.js');

module.exports = {
	isAdmin: async function (userId) {
		var query1 = "SELECT type FROM dealers where dealer_id =" + userId;
		var user = await sql.query(query1);
		if (user.length) {
			var query2 = "SELECT * FROM user_roles where id =" + user[0].type;
			var role = await sql.query(query2);
			if (role.length) {
				if (role[0].role == "admin") {
					return true;
				} else {
					return false;
				}
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
		var query1 = "SELECT type FROM dealers where dealer_id =" + userId;
		var user = await sql.query(query1);
		if (user.length) {
			var query2 = "SELECT * FROM user_roles where id =" + user[0].type;
			var role = await sql.query(query2);
			if (role.length) {
				return role[0].id;
			} else {
				return false;
			}
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
		if (dealerType == "dealer" || dealerType == "sdealer") {
			var query = "SELECT * FROM user_roles where role ='" + dealerType + "'";
			var dType = await sql.query(query);
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
		var component = await this.getComponentIdByName(componentName);
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
	isAllowedAction: async function (componentId, actionId, userId) {

	},

	//Helper function to get unique device_id in format like "ASGH457862" 
	getDeviceId: function () {
		const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
		let fourLetterWords = [];
		for (let firstLetterIndex = 0; firstLetterIndex < alphabet.length; firstLetterIndex++) {
			for (let secondLetterIndex = 0; secondLetterIndex < alphabet.length; secondLetterIndex++) {
				for (let thirdLetterIndex = 0; thirdLetterIndex < alphabet.length; thirdLetterIndex++) {
					for (let fourthLetterIndex = 0; fourthLetterIndex < alphabet.length; fourthLetterIndex++) {
						fourLetterWords.push(alphabet[firstLetterIndex] + alphabet[secondLetterIndex] + alphabet[thirdLetterIndex] + alphabet[fourthLetterIndex]);
					}

				}
			}
		}
		const digits = '1234567890';
		let sixDigitsCombination = [];
		for (let firstDigitIndex = 0; firstDigitIndex < digits.length; firstDigitIndex++) {
			for (let secondDigitIndex = 0; secondDigitIndex < digits.length; secondDigitIndex++) {
				for (let thirdDigitIndex = 0; thirdDigitIndex < digits.length; thirdDigitIndex++) {
					for (let fourthDigitIndex = 0; fourthDigitIndex < digits.length; fourthDigitIndex++) {
						for (let fifthDigitIndex = 0; fifthDigitIndex < digits.length; fifthDigitIndex++) {
							for (let sixthDigitIndex = 0; sixthDigitIndex < digits.length; sixthDigitIndex++) {
								sixDigitsCombination.push(digits[firstDigitIndex].toString() + digits[secondDigitIndex].toString() + digits[thirdDigitIndex].toString() + digits[fourthDigitIndex].toString() + digits[fifthDigitIndex].toString() + digits[sixthDigitIndex].toString());
							}
						}
					}
				}
			}
		}
		var randAlphabet = Math.floor(Math.random() * 456976);
		var randDigits = Math.floor(Math.random() * 1000000);
		var deviceId = fourLetterWords[randAlphabet] + sixDigitsCombination[randDigits];

		sixDigitsCombination = [];
		fourLetterWords = [];

		return deviceId;
	}
}