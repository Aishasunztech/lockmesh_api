/*
Navicat MySQL Data Transfer

Source Server         : Localhost
Source Server Version : 50724
Source Host           : localhost:3306
Source Database       : lockmesh_empty_live

Target Server Type    : MYSQL
Target Server Version : 50724
File Encoding         : 65001

Date: 2019-10-26 11:54:48
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for acc_action_history
-- ----------------------------
DROP TABLE IF EXISTS `acc_action_history`;
CREATE TABLE `acc_action_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` enum('DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated','wiped','Pending activation','Device Transfered','User Transfered') NOT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `device_name` varchar(255) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `simno` varchar(255) DEFAULT NULL,
  `imei` varchar(255) DEFAULT NULL,
  `simno2` varchar(255) DEFAULT NULL,
  `imei2` varchar(255) DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `online` enum('online','offline') NOT NULL DEFAULT 'offline',
  `is_sync` tinyint(4) NOT NULL DEFAULT '0',
  `flagged` enum('Defective','Lost','Stolen','Other','Not flagged') DEFAULT 'Not flagged',
  `screen_start_date` varchar(50) DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT '0',
  `account_name` varchar(255) DEFAULT NULL,
  `account_email` varchar(255) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT '0',
  `prnt_dlr_id` int(11) DEFAULT '0',
  `link_code` varchar(50) DEFAULT NULL,
  `client_id` varchar(50) DEFAULT NULL,
  `start_date` varchar(16) DEFAULT NULL,
  `expiry_months` int(100) DEFAULT NULL,
  `expiry_date` varchar(50) DEFAULT NULL,
  `activation_code` varchar(255) DEFAULT NULL,
  `status` enum('expired','active','') NOT NULL DEFAULT '',
  `device_status` tinyint(4) NOT NULL DEFAULT '0',
  `activation_status` tinyint(4) DEFAULT NULL,
  `wipe_status` varchar(255) DEFAULT NULL,
  `account_status` enum('suspended','') DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT '0',
  `transfer_status` tinyint(4) unsigned DEFAULT '0',
  `transfer_user_status` tinyint(4) NOT NULL DEFAULT '0',
  `dealer_name` varchar(255) DEFAULT NULL,
  `prnt_dlr_name` varchar(255) DEFAULT NULL,
  `user_acc_id` int(11) DEFAULT NULL,
  `pgp_email` varchar(255) DEFAULT NULL,
  `chat_id` varchar(255) DEFAULT NULL,
  `sim_id` varchar(100) DEFAULT NULL,
  `del_status` tinyint(4) DEFAULT NULL,
  `finalStatus` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `transfered_from` varchar(20) DEFAULT '',
  `transfered_to` varchar(20) DEFAULT '',
  `user_transfered_from` varchar(20) DEFAULT '',
  `user_transfered_to` varchar(20) DEFAULT '',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of acc_action_history
-- ----------------------------

-- ----------------------------
-- Table structure for acl_modules
-- ----------------------------
DROP TABLE IF EXISTS `acl_modules`;
CREATE TABLE `acl_modules` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) NOT NULL,
  `component` varchar(80) NOT NULL,
  `login_required` tinyint(1) NOT NULL DEFAULT '1',
  `sort` int(5) NOT NULL DEFAULT '0',
  `dir` text,
  `uri` varchar(100) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `uri_UNIQUE` (`uri`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of acl_modules
-- ----------------------------
INSERT INTO `acl_modules` VALUES ('1', 'Devices', 'DevicesComponent', '1', '0', '/devices', '/devices');
INSERT INTO `acl_modules` VALUES ('2', 'Login', 'LoginComponent', '0', '0', '/login', '/login');
INSERT INTO `acl_modules` VALUES ('3', 'Dealers', 'DealerComponent', '1', '0', '/dealer', '/dealer/dealer');
INSERT INTO `acl_modules` VALUES ('4', 'Sub Dealers', 'DealerComponent', '1', '0', '/dealer', '/dealer/sdealer');
INSERT INTO `acl_modules` VALUES ('5', 'Add Devices', 'AddDeviceComponent', '1', '0', '/add-device', 'add-device');
INSERT INTO `acl_modules` VALUES ('6', 'Create Dealers', 'CreateDealer', '1', '0', '/create-dealer', '/create-dealer/dealer');
INSERT INTO `acl_modules` VALUES ('7', 'Create Sub-Dealer', 'CreateDealer', '1', '0', '/create-sdealer', '/create-dealer/sdealer');
INSERT INTO `acl_modules` VALUES ('8', 'Connect Devices', 'ConnectDevicesComponent', '1', '0', '/connect-device', '/connect-device/:deviceId');
INSERT INTO `acl_modules` VALUES ('30', '', 'SettingsComponent', '1', '0', '/settings', '/settings');
INSERT INTO `acl_modules` VALUES ('31', '', 'CreateClientComponent', '1', '0', null, '/create/client');
INSERT INTO `acl_modules` VALUES ('32', '', 'UploadApkComponent', '1', '0', null, '/upload-apk');
INSERT INTO `acl_modules` VALUES ('33', '', 'ApkListComponent', '1', '0', null, '/apk-list');
INSERT INTO `acl_modules` VALUES ('35', '', 'SettingsComponent', '1', '0', null, 'settings');
INSERT INTO `acl_modules` VALUES ('36', 'Profile List', 'ProfileListComponent', '1', '0', 'components/profile-list', 'profile-list');
INSERT INTO `acl_modules` VALUES ('37', 'Account', 'AccountComponent', '1', '0', 'components/account', '/account');
INSERT INTO `acl_modules` VALUES ('38', 'Invalid Page', 'InvalidPage', '0', '0', 'components/account', '/invalid_page');
INSERT INTO `acl_modules` VALUES ('39', 'App', 'App', '1', '0', null, '/app');
INSERT INTO `acl_modules` VALUES ('40', 'Policy', 'Policy', '1', '0', null, '/policy');
INSERT INTO `acl_modules` VALUES ('41', 'Users', 'Users', '1', '0', null, '/users');
INSERT INTO `acl_modules` VALUES ('42', 'App Market', 'AppMarket', '1', '0', null, '/app-market');
INSERT INTO `acl_modules` VALUES ('43', 'Auto Update', 'AutoUpdate', '1', '0', null, '/apk-list/autoupdate');
INSERT INTO `acl_modules` VALUES ('44', 'Manage Data', 'ManageData', '1', '0', null, '/account/managedata');
INSERT INTO `acl_modules` VALUES ('45', 'Set Prices', 'SetPrices', '1', '0', null, '/set-prices');
INSERT INTO `acl_modules` VALUES ('46', 'Dashboard', 'Dashboard', '1', '0', null, '/dashboard');
INSERT INTO `acl_modules` VALUES ('47', 'Dealer Agents', 'Dealer Agents', '1', '0', 'components/dealerAgent', '/dealer-agents');

-- ----------------------------
-- Table structure for acl_module_actions
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_actions`;
CREATE TABLE `acl_module_actions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component_id` int(11) NOT NULL,
  `title` varchar(50) NOT NULL,
  `action` varchar(80) NOT NULL,
  `sort` int(5) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE,
  KEY `component_id` (`component_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of acl_module_actions
-- ----------------------------

-- ----------------------------
-- Table structure for acl_module_actions_to_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_actions_to_user_roles`;
CREATE TABLE `acl_module_actions_to_user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type_id` int(11) NOT NULL,
  `module_action_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_type_id` (`user_type_id`) USING BTREE,
  KEY `module_action_id` (`module_action_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of acl_module_actions_to_user_roles
-- ----------------------------

-- ----------------------------
-- Table structure for acl_module_to_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_to_user_roles`;
CREATE TABLE `acl_module_to_user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_role_id` (`user_role_id`) USING BTREE,
  KEY `component_id` (`component_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=70 DEFAULT CHARSET=utf8mb4;

-- ----------------------------
-- Records of acl_module_to_user_roles
-- ----------------------------
INSERT INTO `acl_module_to_user_roles` VALUES ('1', '1', '1');
INSERT INTO `acl_module_to_user_roles` VALUES ('2', '2', '1');
INSERT INTO `acl_module_to_user_roles` VALUES ('3', '3', '1');
INSERT INTO `acl_module_to_user_roles` VALUES ('4', '1', '3');
INSERT INTO `acl_module_to_user_roles` VALUES ('5', '1', '4');
INSERT INTO `acl_module_to_user_roles` VALUES ('6', '2', '4');
INSERT INTO `acl_module_to_user_roles` VALUES ('7', '1', '6');
INSERT INTO `acl_module_to_user_roles` VALUES ('26', '1', '7');
INSERT INTO `acl_module_to_user_roles` VALUES ('27', '2', '7');
INSERT INTO `acl_module_to_user_roles` VALUES ('28', '1', '8');
INSERT INTO `acl_module_to_user_roles` VALUES ('29', '2', '8');
INSERT INTO `acl_module_to_user_roles` VALUES ('30', '3', '8');
INSERT INTO `acl_module_to_user_roles` VALUES ('40', '1', '30');
INSERT INTO `acl_module_to_user_roles` VALUES ('41', '2', '30');
INSERT INTO `acl_module_to_user_roles` VALUES ('42', '3', '30');
INSERT INTO `acl_module_to_user_roles` VALUES ('43', '1', '33');
INSERT INTO `acl_module_to_user_roles` VALUES ('44', '1', '32');
INSERT INTO `acl_module_to_user_roles` VALUES ('45', '1', '37');
INSERT INTO `acl_module_to_user_roles` VALUES ('46', '1', '39');
INSERT INTO `acl_module_to_user_roles` VALUES ('47', '1', '40');
INSERT INTO `acl_module_to_user_roles` VALUES ('48', '2', '39');
INSERT INTO `acl_module_to_user_roles` VALUES ('49', '2', '33');
INSERT INTO `acl_module_to_user_roles` VALUES ('50', '2', '40');
INSERT INTO `acl_module_to_user_roles` VALUES ('51', '1', '41');
INSERT INTO `acl_module_to_user_roles` VALUES ('52', '2', '41');
INSERT INTO `acl_module_to_user_roles` VALUES ('53', '3', '41');
INSERT INTO `acl_module_to_user_roles` VALUES ('54', '1', '42');
INSERT INTO `acl_module_to_user_roles` VALUES ('55', '2', '42');
INSERT INTO `acl_module_to_user_roles` VALUES ('56', '4', '43');
INSERT INTO `acl_module_to_user_roles` VALUES ('58', '1', '44');
INSERT INTO `acl_module_to_user_roles` VALUES ('59', '1', '45');
INSERT INTO `acl_module_to_user_roles` VALUES ('60', '2', '45');
INSERT INTO `acl_module_to_user_roles` VALUES ('61', '3', '45');
INSERT INTO `acl_module_to_user_roles` VALUES ('62', '1', '46');
INSERT INTO `acl_module_to_user_roles` VALUES ('63', '2', '46');
INSERT INTO `acl_module_to_user_roles` VALUES ('64', '3', '46');
INSERT INTO `acl_module_to_user_roles` VALUES ('65', '1', '47');
INSERT INTO `acl_module_to_user_roles` VALUES ('66', '2', '47');
INSERT INTO `acl_module_to_user_roles` VALUES ('67', '3', '47');
INSERT INTO `acl_module_to_user_roles` VALUES ('68', '2', '37');
INSERT INTO `acl_module_to_user_roles` VALUES ('69', '3', '37');

-- ----------------------------
-- Table structure for apk_details
-- ----------------------------
DROP TABLE IF EXISTS `apk_details`;
CREATE TABLE `apk_details` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(255) DEFAULT NULL,
  `logo` text,
  `apk` text,
  `apk_type` enum('permanent','basic','other') DEFAULT 'basic',
  `label` text,
  `package_name` text,
  `unique_name` text,
  `version_code` text,
  `version_name` text,
  `details` text,
  `apk_bytes` int(100) DEFAULT NULL,
  `apk_size` varchar(255) DEFAULT NULL,
  `logo_bytes` int(100) DEFAULT NULL,
  `logo_size` varchar(255) DEFAULT NULL,
  `dealers` text,
  `status` enum('Off','On') NOT NULL DEFAULT 'Off',
  `delete_status` tinyint(4) NOT NULL DEFAULT '0',
  `created` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `id` (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of apk_details
-- ----------------------------

-- ----------------------------
-- Table structure for apps_info
-- ----------------------------
DROP TABLE IF EXISTS `apps_info`;
CREATE TABLE `apps_info` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) NOT NULL,
  `package_name` text,
  `icon` text,
  `extension` tinyint(4) DEFAULT '0',
  `visible` tinyint(4) NOT NULL DEFAULT '1',
  `default_app` tinyint(4) NOT NULL DEFAULT '0',
  `extension_id` int(11) DEFAULT '0',
  `system_app` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_name_constraints` (`unique_name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of apps_info
-- ----------------------------

-- ----------------------------
-- Table structure for apps_queue_jobs
-- ----------------------------
DROP TABLE IF EXISTS `apps_queue_jobs`;
CREATE TABLE `apps_queue_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(20) NOT NULL,
  `action` enum('pull','push') DEFAULT NULL,
  `type` enum('push','pull','policy') DEFAULT NULL,
  `is_in_process` varchar(10) DEFAULT 'NULL',
  `total_apps` int(11) DEFAULT '0',
  `complete_apps` int(11) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of apps_queue_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for chat_ids
-- ----------------------------
DROP TABLE IF EXISTS `chat_ids`;
CREATE TABLE `chat_ids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) DEFAULT NULL,
  `chat_id` varchar(255) NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT '0',
  `delete_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_acc_id` (`user_acc_id`) USING BTREE,
  KEY `chat_id_unique` (`chat_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of chat_ids
-- ----------------------------

-- ----------------------------
-- Table structure for credit_purchase
-- ----------------------------
DROP TABLE IF EXISTS `credit_purchase`;
CREATE TABLE `credit_purchase` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `usd_price` decimal(65,0) DEFAULT NULL,
  `currency_price` varchar(65) DEFAULT NULL,
  `payment_method` enum('CASH','BTC','CREDIT') DEFAULT NULL,
  `dealer_type` enum('admin','dealer','sdealer') DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of credit_purchase
-- ----------------------------

-- ----------------------------
-- Table structure for credit_requests
-- ----------------------------
DROP TABLE IF EXISTS `credit_requests`;
CREATE TABLE `credit_requests` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) DEFAULT NULL,
  `dealer_name` varchar(100) DEFAULT NULL,
  `dealer_email` varchar(100) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `dealer_type` enum('admin','dealer','sdealer') DEFAULT NULL,
  `status` tinyint(4) DEFAULT '0',
  `del_status` tinyint(4) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of credit_requests
-- ----------------------------

-- ----------------------------
-- Table structure for dealers
-- ----------------------------
DROP TABLE IF EXISTS `dealers`;
CREATE TABLE `dealers` (
  `dealer_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `connected_dealer` int(11) NOT NULL DEFAULT '0',
  `dealer_name` varchar(255) NOT NULL,
  `dealer_email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `link_code` varchar(10) DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT '0',
  `verification_code` varchar(255) DEFAULT NULL,
  `is_two_factor_auth` tinyint(4) unsigned NOT NULL DEFAULT '0',
  `type` int(4) NOT NULL,
  `unlink_status` tinyint(4) NOT NULL DEFAULT '0',
  `account_status` enum('suspended','') DEFAULT NULL,
  `created` datetime NOT NULL,
  `modified` datetime NOT NULL,
  PRIMARY KEY (`dealer_id`) USING BTREE,
  KEY `type` (`type`) USING BTREE,
  KEY `connected_dealer` (`connected_dealer`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=270 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES ('154', 'Neha', 'Kashyap', '0', 'admin', 'admin@gmail.com', '99b80e818d6babc76c76518e2fce2bd2', '6', '0', '', '0', '1', '0', '', '2019-02-08 09:50:04', '2019-02-08 09:50:04');

-- ----------------------------
-- Table structure for dealer_agents
-- ----------------------------
DROP TABLE IF EXISTS `dealer_agents`;
CREATE TABLE `dealer_agents` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `staff_id` varchar(255) DEFAULT NULL,
  `dealer_id` int(11) NOT NULL,
  `dealer_type` enum('admin','dealer','sdealer') DEFAULT 'dealer',
  `name` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` enum('staff','admin') NOT NULL DEFAULT 'staff',
  `status` tinyint(1) NOT NULL DEFAULT '1',
  `delete_status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_agents
-- ----------------------------

-- ----------------------------
-- Table structure for dealer_apks
-- ----------------------------
DROP TABLE IF EXISTS `dealer_apks`;
CREATE TABLE `dealer_apks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `apk_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_dealer_id_apk_id` (`dealer_id`,`apk_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------

-- ----------------------------
-- Table structure for dealer_credits
-- ----------------------------
DROP TABLE IF EXISTS `dealer_credits`;
CREATE TABLE `dealer_credits` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_credits
-- ----------------------------

-- ----------------------------
-- Table structure for dealer_dropdown_list
-- ----------------------------
DROP TABLE IF EXISTS `dealer_dropdown_list`;
CREATE TABLE `dealer_dropdown_list` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `selected_items` mediumtext,
  `type` enum('devices','dealer','sdealer','apk','policies','users') NOT NULL DEFAULT 'devices',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dealer_id` (`dealer_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=307 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES ('168', '154', '[{\"key\":\"device_id\",\"value\":\"tableHeadings.DEVICEID\"},{\"key\":\"user_id\",\"value\":\"tableHeadings.USERID\"},{\"key\":\"validity\",\"value\":\"tableHeadings.REMAININGDAYS\"},{\"key\":\"status\",\"value\":\"tableHeadings.STATUS\"},{\"key\":\"lastOnline\",\"value\":\"tableHeadings.lastOnline\"},{\"key\":\"online\",\"value\":\"tableHeadings.MODE\"},{\"key\":\"type\",\"value\":\"tableHeadings.TYPE\"},{\"key\":\"version\",\"value\":\"tableHeadings.VERSION\"},{\"key\":\"firmware_info\",\"value\":\"FIRMWARE INFO\"},{\"key\":\"flagged\",\"value\":\"tableHeadings.FLAGGED\"},{\"key\":\"name\",\"value\":\"tableHeadings.DEVICENAME\"},{\"key\":\"account_email\",\"value\":\"tableHeadings.ACCOUNTEMAIL\"},{\"key\":\"client_id\",\"value\":\"tableHeadings.CLIENTID\"},{\"key\":\"activation_code\",\"value\":\"tableHeadings.ACTIVATIONCODE\"},{\"key\":\"pgp_email\",\"value\":\"tableHeadings.PGPEMAIL\"},{\"key\":\"sim_id\",\"value\":\"tableHeadings.SIMID\"},{\"key\":\"chat_id\",\"value\":\"tableHeadings.CHATID\"},{\"key\":\"dealer_id\",\"value\":\"tableHeadings.DEALERID\"},{\"key\":\"dealer_name\",\"value\":\"tableHeadings.DEALERNAME\"},{\"key\":\"dealer_pin\",\"value\":\"tableHeadings.DEALERPIN\"},{\"key\":\"mac_address\",\"value\":\"tableHeadings.MACADDRESS\"},{\"key\":\"imei_1\",\"value\":\"tableHeadings.IMEI1\"},{\"key\":\"sim_1\",\"value\":\"tableHeadings.SIM1\"},{\"key\":\"imei_2\",\"value\":\"tableHeadings.IMEI2\"},{\"key\":\"sim_2\",\"value\":\"tableHeadings.SIM2\"},{\"key\":\"serial_number\",\"value\":\"tableHeadings.SERIALNUMBER\"},{\"key\":\"model\",\"value\":\"tableHeadings.MODEL\"},{\"key\":\"s_dealer\",\"value\":\"tableHeadings.S-DEALER\"},{\"key\":\"s_dealer_name\",\"value\":\"tableHeadings.S-DEALERNAME\"},{\"key\":\"remainTermDays\",\"value\":\"REMAINING TERM DAYS\"},{\"key\":\"start_date\",\"value\":\"tableHeadings.STARTDATE\"},{\"key\":\"expiry_date\",\"value\":\"tableHeadings.EXPIRYDATE\"}]', 'devices', '2019-06-01 12:06:05', '2019-10-09 14:42:14');
INSERT INTO `dealer_dropdown_list` VALUES ('169', '154', '[{\"key\":\"dealer_id\",\"value\":\"dealer.id\"},{\"key\":\"dealer_name\",\"value\":\"dealer.name.id\"},{\"key\":\"dealer_email\",\"value\":\"dealer.email.id\"},{\"key\":\"link_code\",\"value\":\"dealer.pin.id\"},{\"key\":\"connected_devices\",\"value\":\"devices\"},{\"key\":\"dealer_token\",\"value\":\"tokens.id\"}]', 'dealer', '2019-06-01 12:06:15', '2019-09-24 07:09:40');
INSERT INTO `dealer_dropdown_list` VALUES ('170', '154', '[{\"key\":\"dealer_id\",\"value\":\"dealer.id\"},{\"key\":\"dealer_name\",\"value\":\"dealer.name.id\"},{\"key\":\"dealer_email\",\"value\":\"dealer.email.id\"},{\"key\":\"link_code\",\"value\":\"dealer.pin.id\"},{\"key\":\"connected_devices\",\"value\":\"devices\"},{\"key\":\"dealer_token\",\"value\":\"tokens.id\"},{\"key\":\"parent_dealer\",\"value\":\"parent.dealer.id\"},{\"key\":\"parent_dealer_id\",\"value\":\"parent.dealer.id.id\"}]', 'sdealer', '2019-06-01 12:06:24', '2019-09-23 07:54:17');
INSERT INTO `dealer_dropdown_list` VALUES ('173', '154', '[{\"key\":\"permission\",\"value\":\"permission.id\"},{\"key\":\"apk_status\",\"value\":\"show.on.device.id\"},{\"key\":\"apk\",\"value\":\"apk.id\"},{\"key\":\"apk_name\",\"value\":\"app.name.id\"},{\"key\":\"apk_logo\",\"value\":\"app.logo.id\"},{\"key\":\"apk_size\",\"value\":\"SIZE\"},{\"key\":\"label\",\"value\":\"LABEL\"},{\"key\":\"package_name\",\"value\":\"PACKAGE NAME\"},{\"key\":\"version\",\"value\":\"VERSION\"},{\"key\":\"created_at\",\"value\":\"UPLOAD DATE\"},{\"key\":\"updated_at\",\"value\":\"EDIT DATE\"}]', 'apk', '2019-06-01 12:06:34', '2019-09-24 17:51:06');

-- ----------------------------
-- Table structure for dealer_language
-- ----------------------------
DROP TABLE IF EXISTS `dealer_language`;
CREATE TABLE `dealer_language` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `dealer_lng_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_dealer_id_dealer_language` (`dealer_id`,`dealer_lng_id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_language
-- ----------------------------
INSERT INTO `dealer_language` VALUES ('4', '154', '1', '2019-07-04 14:48:34', '2019-09-25 16:07:38');
INSERT INTO `dealer_language` VALUES ('5', '251', '1', '2019-07-18 06:17:33', '2019-07-18 06:17:41');
INSERT INTO `dealer_language` VALUES ('6', '233', '1', '2019-07-24 07:31:48', '2019-07-24 07:31:48');
INSERT INTO `dealer_language` VALUES ('7', '225', '1', '2019-09-25 17:45:17', '2019-09-25 18:03:22');

-- ----------------------------
-- Table structure for dealer_pagination
-- ----------------------------
DROP TABLE IF EXISTS `dealer_pagination`;
CREATE TABLE `dealer_pagination` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(10) NOT NULL,
  `record_per_page` int(10) NOT NULL,
  `type` enum('devices','dealer','sdealer','apk','policies','users') NOT NULL DEFAULT 'devices',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dealer_id` (`dealer_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------

-- ----------------------------
-- Table structure for dealer_policies
-- ----------------------------
DROP TABLE IF EXISTS `dealer_policies`;
CREATE TABLE `dealer_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `policy_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_dealer_id_apk_id` (`dealer_id`,`policy_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_policies
-- ----------------------------

-- ----------------------------
-- Table structure for default_apps
-- ----------------------------
DROP TABLE IF EXISTS `default_apps`;
CREATE TABLE `default_apps` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) NOT NULL,
  `package_name` text,
  `icon` text,
  `extension` tinyint(4) DEFAULT '0',
  `visible` tinyint(4) NOT NULL DEFAULT '1',
  `default_app` tinyint(4) NOT NULL DEFAULT '0',
  `extension_id` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_name_constraints` (`unique_name`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=23338 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of default_apps
-- ----------------------------
INSERT INTO `default_apps` VALUES ('4649', 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4650', 'com.secureSetting.SecureSettingsMainSecure Settings', 'Secure Settings', 'com.secureSetting.SecureSettingsMain', 'icon_Secure Settings.png', '1', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4651', 'com.android.browserBrowser', 'Browser', 'com.android.browser', 'icon_Browser.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4652', 'com.android.calendarCalendar', 'Calendar', 'com.android.calendar', 'icon_Calendar.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4653', 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4654', 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4655', 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4656', 'com.android.emailEmail', 'Email', 'com.android.email', 'icon_Email.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4657', 'com.android.gallery3dGallery', 'Gallery', 'com.android.gallery3d', 'icon_Gallery.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4658', 'com.android.mmsMessaging', 'Messaging', 'com.android.mms', 'icon_Messaging.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4659', 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', '0', '0', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4660', 'com.android.soundrecorderSound Recorder', 'Sound Recorder', 'com.android.soundrecorder', 'icon_Sound Recorder.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4661', 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4662', 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4663', 'com.android.quicksearchboxSearch', 'Search', 'com.android.quicksearchbox', 'icon_Search.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4664', 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4665', 'com.mediatek.systemupdateSystem software updates', 'System software updates', 'com.mediatek.systemupdate', 'icon_System software updates.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4666', 'com.rim.mobilefusion.clientUEM Client', 'UEM Client', 'com.rim.mobilefusion.client', 'icon_UEM Client.png', '0', '1', '0', '0', '2019-04-22 12:49:21', null);
INSERT INTO `default_apps` VALUES ('4668', 'com.secureSetting.SecureSettingsMainSecure SettingsBattery', 'Battery', null, 'icon_Battery.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4669', 'com.secureSetting.SecureSettingsMainSecure Settingswi-fi', 'wi-fi', null, 'icon_wi-fi.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4670', 'com.secureSetting.SecureSettingsMainSecure SettingsBluetooth', 'Bluetooth', null, 'icon_Bluetooth.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4671', 'com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards', 'SIM Cards', null, 'icon_SIM Cards.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4672', 'com.secureSetting.SecureSettingsMainSecure SettingsData Roaming', 'Data Roaming', null, 'icon_Data Roaming.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4673', 'com.secureSetting.SecureSettingsMainSecure SettingsMobile Data', 'Mobile Data', null, 'icon_Mobile Data.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4674', 'com.secureSetting.SecureSettingsMainSecure SettingsHotspot', 'Hotspot', null, 'icon_Hotspot.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4675', 'com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock', 'Finger Print + Lock', null, 'icon_Finger Print + Lock.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4676', 'com.secureSetting.SecureSettingsMainSecure SettingsBrightness', 'Brightness', null, 'icon_Brightness.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4677', 'com.secureSetting.SecureSettingsMainSecure SettingsSleep', 'Sleep', null, 'icon_Sleep.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4678', 'com.secureSetting.SecureSettingsMainSecure SettingsSound', 'Sound', null, 'icon_Sound.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('4679', 'com.secureSetting.SecureSettingsMainSecure SettingsDate & Time', 'Date & Time', null, 'icon_Date & Time.png', '1', '1', '0', '4650', '2019-04-22 12:49:22', null);
INSERT INTO `default_apps` VALUES ('21461', 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages', 'Languages', null, 'icon_Languages.png', '1', '1', '0', '4650', '2019-05-25 10:38:45', null);
INSERT INTO `default_apps` VALUES ('23212', 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages & Input', 'Languages & Input', null, 'icon_Languages & Input.png', '1', '1', '0', '4650', '2019-05-29 19:14:05', null);
INSERT INTO `default_apps` VALUES ('23337', 'com.secureSetting.SecureSettingsMainSecure SettingsNotifications', 'Notifications', '', 'icon_Notifications.png', '1', '1', '0', '4650', '2019-07-26 11:13:30', '2019-07-26 16:15:25');

-- ----------------------------
-- Table structure for default_policies
-- ----------------------------
DROP TABLE IF EXISTS `default_policies`;
CREATE TABLE `default_policies` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `policy_id` int(11) NOT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of default_policies
-- ----------------------------

-- ----------------------------
-- Table structure for default_system_permissions
-- ----------------------------
DROP TABLE IF EXISTS `default_system_permissions`;
CREATE TABLE `default_system_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `setting_name` varchar(255) NOT NULL,
  `setting_status` tinyint(1) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  UNIQUE KEY `unique_index` (`setting_name`)
) ENGINE=InnoDB AUTO_INCREMENT=10 DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of default_system_permissions
-- ----------------------------
INSERT INTO `default_system_permissions` VALUES ('1', 'Wifi', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:29');
INSERT INTO `default_system_permissions` VALUES ('2', 'Bluetooth', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:32');
INSERT INTO `default_system_permissions` VALUES ('3', 'Bluetooth File Sharing', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:33');
INSERT INTO `default_system_permissions` VALUES ('4', 'Hotspot Configuration', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:36');
INSERT INTO `default_system_permissions` VALUES ('5', 'Screen Capture', '0', '2019-09-02 14:27:34', '2019-09-02 14:27:34');
INSERT INTO `default_system_permissions` VALUES ('6', 'Block Calls', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:37');
INSERT INTO `default_system_permissions` VALUES ('7', 'Camera', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:38');
INSERT INTO `default_system_permissions` VALUES ('8', 'Microphone', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:39');
INSERT INTO `default_system_permissions` VALUES ('9', 'Speaker', '0', '2019-09-02 14:27:34', '2019-09-02 14:29:41');

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(20) DEFAULT 'NULL',
  `name` varchar(50) DEFAULT 'NULL',
  `session_id` varchar(100) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `simno` varchar(100) DEFAULT 'NULL',
  `imei` varchar(100) DEFAULT 'NULL',
  `simno2` varchar(100) DEFAULT 'NULL',
  `imei2` varchar(100) DEFAULT 'NULL',
  `serial_number` varchar(100) DEFAULT 'NULL',
  `mac_address` varchar(100) DEFAULT 'NULL',
  `fcm_token` varchar(100) DEFAULT 'NULL',
  `online` enum('online','offline') NOT NULL DEFAULT 'offline',
  `is_sync` tinyint(4) NOT NULL DEFAULT '0',
  `is_push_apps` tinyint(4) DEFAULT '0',
  `flagged` enum('Defective','Lost','Stolen','Other','Not flagged') DEFAULT 'Not flagged',
  `screen_start_date` varchar(50) DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `last_login` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE,
  KEY `unique_mac_address` (`mac_address`) USING BTREE,
  KEY `serial_number` (`serial_number`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of devices
-- ----------------------------

-- ----------------------------
-- Table structure for device_attributes
-- ----------------------------
DROP TABLE IF EXISTS `device_attributes`;
CREATE TABLE `device_attributes` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `value` varchar(255) DEFAULT NULL,
  `delete_status` enum('0','1') DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of device_attributes
-- ----------------------------

-- ----------------------------
-- Table structure for device_history
-- ----------------------------
DROP TABLE IF EXISTS `device_history`;
CREATE TABLE `device_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) DEFAULT '0',
  `device_id` varchar(20) CHARACTER SET latin1 DEFAULT 'NULL',
  `dealer_id` int(11) NOT NULL DEFAULT '0',
  `policy_name` varchar(100) CHARACTER SET latin1 DEFAULT NULL,
  `profile_name` varchar(100) CHARACTER SET latin1 DEFAULT '',
  `app_list` text CHARACTER SET latin1,
  `passwords` text CHARACTER SET latin1,
  `controls` text CHARACTER SET latin1,
  `permissions` text CHARACTER SET latin1,
  `push_apps` text CHARACTER SET latin1,
  `pull_apps` text CHARACTER SET latin1,
  `imei` text CHARACTER SET latin1,
  `type` enum('push_apps','pull_apps','history','imei','policy','force_update','profile','password','wipe') CHARACTER SET latin1 DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_acc_id` (`user_acc_id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE,
  KEY `dealer_id` (`dealer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of device_history
-- ----------------------------

-- ----------------------------
-- Table structure for imei_history
-- ----------------------------
DROP TABLE IF EXISTS `imei_history`;
CREATE TABLE `imei_history` (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) DEFAULT NULL,
  `Serial_number` varchar(255) DEFAULT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `orignal_imei1` varchar(255) DEFAULT NULL,
  `orignal_imei2` varchar(255) DEFAULT '',
  `imei1` varchar(255) DEFAULT NULL,
  `imei2` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of imei_history
-- ----------------------------

-- ----------------------------
-- Table structure for languages
-- ----------------------------
DROP TABLE IF EXISTS `languages`;
CREATE TABLE `languages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `language_id` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `locale` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `name` varchar(50) CHARACTER SET latin1 DEFAULT NULL,
  `icon` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of languages
-- ----------------------------
INSERT INTO `languages` VALUES ('1', 'english', 'en', 'English', 'us', '2019-06-28 12:03:55', '2019-07-01 17:48:00');
INSERT INTO `languages` VALUES ('2', 'french', 'fr', 'Français', 'fr', '2019-06-28 12:03:55', '2019-06-28 12:03:55');

-- ----------------------------
-- Table structure for lng_translations
-- ----------------------------
DROP TABLE IF EXISTS `lng_translations`;
CREATE TABLE `lng_translations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `lng_id` int(11) NOT NULL DEFAULT '1',
  `key_id` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `key_value` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_language_key` (`lng_id`,`key_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of lng_translations
-- ----------------------------

-- ----------------------------
-- Table structure for login_history
-- ----------------------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(11) CHARACTER SET latin1 DEFAULT NULL,
  `dealer_id` varchar(11) CHARACTER SET latin1 DEFAULT NULL,
  `socket_id` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `token` text CHARACTER SET latin1,
  `expiresin` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `ip_address` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 DEFAULT NULL,
  `logged_in_client` enum('dealer','admin','device','sdealer','auto_update_admin') CHARACTER SET latin1 DEFAULT NULL,
  `type` enum('socket','token') CHARACTER SET latin1 DEFAULT 'token',
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of login_history
-- ----------------------------

-- ----------------------------
-- Table structure for packages
-- ----------------------------
DROP TABLE IF EXISTS `packages`;
CREATE TABLE `packages` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL DEFAULT '0',
  `pkg_name` varchar(255) CHARACTER SET latin1 NOT NULL DEFAULT '',
  `pkg_price` varchar(10) CHARACTER SET latin1 NOT NULL DEFAULT '0',
  `pkg_term` enum('12 month','6 month','3 month','1 month') CHARACTER SET latin1 NOT NULL DEFAULT '1 month',
  `pkg_expiry` int(11) NOT NULL DEFAULT '0',
  `pkg_features` text CHARACTER SET latin1 NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of packages
-- ----------------------------

-- ----------------------------
-- Table structure for pgp_emails
-- ----------------------------
DROP TABLE IF EXISTS `pgp_emails`;
CREATE TABLE `pgp_emails` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) DEFAULT NULL,
  `pgp_email` varchar(255) NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT '0',
  `delete_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `user_acc_id` (`user_acc_id`) USING BTREE,
  KEY `unique_pgp_emails` (`pgp_email`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------

-- ----------------------------
-- Table structure for policy
-- ----------------------------
DROP TABLE IF EXISTS `policy`;
CREATE TABLE `policy` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(50) DEFAULT NULL,
  `policy_note` varchar(255) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `dealer_type` enum('admin','dealer','sdealer') NOT NULL,
  `command_name` varchar(100) DEFAULT NULL,
  `permissions` text,
  `app_list` text,
  `push_apps` text,
  `controls` text,
  `dealers` text,
  `passwords` text,
  `status` tinyint(4) NOT NULL DEFAULT '0',
  `delete_status` tinyint(4) NOT NULL DEFAULT '0',
  `object_size` varchar(10) DEFAULT NULL,
  `policy_size` varchar(10) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of policy
-- ----------------------------

-- ----------------------------
-- Table structure for policy_apps
-- ----------------------------
DROP TABLE IF EXISTS `policy_apps`;
CREATE TABLE `policy_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_id` int(11) NOT NULL,
  `apk_id` int(11) NOT NULL,
  `guest` tinyint(1) NOT NULL,
  `encrypted` tinyint(1) NOT NULL,
  `enable` tinyint(1) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `unique_index` (`policy_id`,`apk_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of policy_apps
-- ----------------------------

-- ----------------------------
-- Table structure for policy_queue_jobs
-- ----------------------------
DROP TABLE IF EXISTS `policy_queue_jobs`;
CREATE TABLE `policy_queue_jobs` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_id` int(11) NOT NULL,
  `device_id` varchar(100) NOT NULL,
  `is_in_process` tinyint(4) DEFAULT '0',
  `complete_steps` tinyint(4) DEFAULT '0',
  `push_apps` tinyint(4) DEFAULT '0',
  `permission` tinyint(4) DEFAULT '0',
  `app_list` tinyint(4) DEFAULT '0',
  `controls` tinyint(4) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of policy_queue_jobs
-- ----------------------------

-- ----------------------------
-- Table structure for prices
-- ----------------------------
DROP TABLE IF EXISTS `prices`;
CREATE TABLE `prices` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) DEFAULT '0',
  `price_for` enum('chat_id','vpn','sim_id','pgp_email') CHARACTER SET latin1 DEFAULT NULL,
  `unit_price` varchar(10) CHARACTER SET latin1 DEFAULT NULL,
  `price_term` enum('12 month','6 month','3 month','1 month') CHARACTER SET latin1 DEFAULT '1 month',
  `price_expiry` int(11) DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of prices
-- ----------------------------

-- ----------------------------
-- Table structure for secure_market_apps
-- ----------------------------
DROP TABLE IF EXISTS `secure_market_apps`;
CREATE TABLE `secure_market_apps` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apk_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `dealer_type` varchar(255) DEFAULT NULL,
  `is_restrict_uninstall` tinyint(4) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `apk_id` (`apk_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of secure_market_apps
-- ----------------------------

-- ----------------------------
-- Table structure for sequelizemeta
-- ----------------------------
DROP TABLE IF EXISTS `sequelizemeta`;
CREATE TABLE `sequelizemeta` (
  `name` varchar(255) COLLATE utf8_unicode_ci NOT NULL,
  PRIMARY KEY (`name`) USING BTREE,
  UNIQUE KEY `name` (`name`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

-- ----------------------------
-- Records of sequelizemeta
-- ----------------------------
INSERT INTO `sequelizemeta` VALUES ('20190725051506-create_policy_apps_table.js');
INSERT INTO `sequelizemeta` VALUES ('20190731053203-create-dealer_agents-table.js');
INSERT INTO `sequelizemeta` VALUES ('20190902090903-createDefaultSystemPermissionTable.js');
INSERT INTO `sequelizemeta` VALUES ('20190913063320-add-firmware_info-column-usr_acc.js');
INSERT INTO `sequelizemeta` VALUES ('20190914115118-add-enum-value-wipe-device_history.js');
INSERT INTO `sequelizemeta` VALUES ('20190926150931-change-column-default_sim_value-into-sims.js');
INSERT INTO `sequelizemeta` VALUES ('20190928072041-add-last_login-column-into-devices.js');
INSERT INTO `sequelizemeta` VALUES ('20191002074315-create-table-device_attributes-for-key-value.js');
INSERT INTO `sequelizemeta` VALUES ('20191002124437-delete-columns-unrGuest-unrEncrypt-and-change-column-del-into-delete_status-table-sims.js');
INSERT INTO `sequelizemeta` VALUES ('20191003131521-add-column-is_changed-into-sims.js');

-- ----------------------------
-- Table structure for sims
-- ----------------------------
DROP TABLE IF EXISTS `sims`;
CREATE TABLE `sims` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(10) NOT NULL,
  `iccid` varchar(20) DEFAULT NULL,
  `name` varchar(50) DEFAULT NULL,
  `status` varchar(20) DEFAULT NULL,
  `sim_id` varchar(50) DEFAULT NULL,
  `slotNo` enum('-1','0','1') NOT NULL,
  `note` text,
  `guest` tinyint(4) DEFAULT NULL,
  `encrypt` tinyint(4) NOT NULL,
  `dataLimit` float DEFAULT NULL,
  `sync` enum('0','1') NOT NULL,
  `delete_status` enum('0','1') DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `is_changed` enum('0','1') DEFAULT '1',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sims
-- ----------------------------

-- ----------------------------
-- Table structure for sim_ids
-- ----------------------------
DROP TABLE IF EXISTS `sim_ids`;
CREATE TABLE `sim_ids` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) DEFAULT NULL,
  `sim_id` varchar(100) NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT '0',
  `start_date` varchar(100) DEFAULT NULL,
  `expiry_date` varchar(100) DEFAULT NULL,
  `delete_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `device_id` (`user_acc_id`) USING BTREE,
  KEY `sim_id_UNIQUE` (`sim_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of sim_ids
-- ----------------------------

-- ----------------------------
-- Table structure for transferred_profiles
-- ----------------------------
DROP TABLE IF EXISTS `transferred_profiles`;
CREATE TABLE `transferred_profiles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `connected_dealer` int(11) NOT NULL DEFAULT '0',
  `chat_id` varchar(50) DEFAULT NULL,
  `client_id` varchar(50) DEFAULT NULL,
  `device_id` varchar(100) DEFAULT NULL,
  `session_id` varchar(100) DEFAULT NULL,
  `name` varchar(255) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `pgp_email` varchar(255) DEFAULT NULL,
  `link_code` varchar(50) DEFAULT NULL,
  `model` varchar(100) DEFAULT NULL,
  `ip_address` varchar(100) DEFAULT NULL,
  `sim_id` varchar(255) DEFAULT NULL,
  `simno` varchar(255) DEFAULT NULL,
  `imei` varchar(255) DEFAULT NULL,
  `sim_id2` varchar(255) DEFAULT NULL,
  `simno2` varchar(255) DEFAULT NULL,
  `imei2` varchar(255) DEFAULT NULL,
  `serial_number` varchar(255) DEFAULT NULL,
  `mac_address` varchar(255) DEFAULT NULL,
  `s_dealer` varchar(100) DEFAULT NULL,
  `s_dealer_name` varchar(255) DEFAULT NULL,
  `account` varchar(20) DEFAULT NULL,
  `fcm_token` varchar(255) DEFAULT NULL,
  `activation_code` varchar(255) DEFAULT NULL,
  `activation_status` tinyint(4) DEFAULT NULL,
  `online` enum('On','off') NOT NULL DEFAULT 'off',
  `device_status` tinyint(4) NOT NULL DEFAULT '0',
  `is_sync` tinyint(4) NOT NULL DEFAULT '0',
  `status` enum('expired','active','') NOT NULL DEFAULT 'active',
  `account_status` enum('suspended','') DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT '0',
  `screen_start_date` varchar(50) DEFAULT NULL,
  `start_date` varchar(16) DEFAULT NULL,
  `expiry_months` int(100) DEFAULT NULL,
  `expiry_date` varchar(50) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of transferred_profiles
-- ----------------------------

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(225) NOT NULL,
  `user_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` int(4) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `del_status` tinyint(1) DEFAULT '0',
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `dealer_id` (`dealer_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of users
-- ----------------------------

-- ----------------------------
-- Table structure for user_apps
-- ----------------------------
DROP TABLE IF EXISTS `user_apps`;
CREATE TABLE `user_apps` (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `device_id` int(50) NOT NULL DEFAULT '0',
  `app_id` int(10) NOT NULL DEFAULT '0',
  `guest` tinyint(4) NOT NULL DEFAULT '0',
  `encrypted` tinyint(4) NOT NULL DEFAULT '0',
  `enable` tinyint(4) NOT NULL DEFAULT '0',
  `extension` tinyint(4) NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `primary_key` (`id`) USING BTREE,
  UNIQUE KEY `user_unique_apps` (`device_id`,`app_id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE,
  KEY `app_id` (`app_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user_apps
-- ----------------------------

-- ----------------------------
-- Table structure for user_app_permissions
-- ----------------------------
DROP TABLE IF EXISTS `user_app_permissions`;
CREATE TABLE `user_app_permissions` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(50) DEFAULT '0',
  `permissions` text,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE KEY `device_setting_id` (`device_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of user_app_permissions
-- ----------------------------

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET latin1 NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES ('1', 'admin', '1');
INSERT INTO `user_roles` VALUES ('2', 'dealer', '1');
INSERT INTO `user_roles` VALUES ('3', 'sdealer', '1');
INSERT INTO `user_roles` VALUES ('4', 'auto_update_admin', '1');
INSERT INTO `user_roles` VALUES ('5', 'SuperAdmin', '0');

-- ----------------------------
-- Table structure for usr_acc
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc`;
CREATE TABLE `usr_acc` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) DEFAULT NULL,
  `user_id` varchar(255) DEFAULT NULL,
  `batch_no` varchar(255) DEFAULT NULL,
  `account_name` varchar(255) DEFAULT NULL,
  `account_email` varchar(255) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT '0',
  `prnt_dlr_id` int(11) DEFAULT '0',
  `type` varchar(255) DEFAULT NULL,
  `version` varchar(255) DEFAULT NULL,
  `link_code` varchar(50) DEFAULT NULL,
  `client_id` varchar(50) DEFAULT NULL,
  `start_date` varchar(16) DEFAULT NULL,
  `expiry_months` int(100) DEFAULT NULL,
  `expiry_date` varchar(50) DEFAULT NULL,
  `activation_code` varchar(255) DEFAULT NULL,
  `status` enum('expired','active','','trial') NOT NULL DEFAULT '',
  `device_status` tinyint(4) NOT NULL DEFAULT '0',
  `activation_status` tinyint(4) DEFAULT NULL,
  `wipe_status` varchar(255) DEFAULT NULL,
  `account_status` enum('suspended','') DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT '0',
  `transfer_status` tinyint(4) unsigned DEFAULT '0',
  `transfer_user_status` tinyint(4) NOT NULL DEFAULT '0',
  `transfered_from` varchar(20) DEFAULT '',
  `transfered_to` varchar(20) DEFAULT '',
  `user_transfered_from` varchar(20) DEFAULT '',
  `user_transfered_to` varchar(20) DEFAULT '',
  `dealer_name` varchar(255) DEFAULT NULL,
  `prnt_dlr_name` varchar(255) DEFAULT NULL,
  `del_status` tinyint(4) DEFAULT '0',
  `trial_status` tinyint(4) DEFAULT '0',
  `validity` tinyint(4) DEFAULT NULL,
  `note` varchar(255) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  `firmware_info` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  KEY `device_id` (`device_id`) USING BTREE,
  KEY `dealer_id` (`dealer_id`) USING BTREE,
  KEY `prnt_dealer_id` (`prnt_dlr_id`) USING BTREE,
  KEY `user_id` (`user_id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------

-- ----------------------------
-- Table structure for usr_acc_profile
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc_profile`;
CREATE TABLE `usr_acc_profile` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(50) DEFAULT NULL,
  `profile_note` varchar(255) DEFAULT NULL,
  `policy_id` int(11) DEFAULT '0',
  `user_acc_id` int(11) DEFAULT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `app_list` text,
  `permissions` text,
  `controls` text,
  `passwords` text,
  `status` tinyint(4) DEFAULT '0',
  `delete_status` enum('0','1') NOT NULL DEFAULT '0',
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of usr_acc_profile
-- ----------------------------
