/*
 Navicat Premium Data Transfer

 Source Server         : TitanLocker
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : 165.22.82.254:3306
 Source Schema         : lockmesh

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : 65001

 Date: 10/06/2019 16:56:25
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acc_action_history
-- ----------------------------
DROP TABLE IF EXISTS `acc_action_history`;
CREATE TABLE `acc_action_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` enum('DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated','wiped','Pending activation') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `device_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `device_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `session_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `model` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `ip_address` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `serial_number` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `fcm_token` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `online` enum('online','offline') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'offline',
  `is_sync` tinyint(4) NOT NULL DEFAULT 0,
  `flagged` enum('Defective','Lost','Stolen','Other','Not flagged') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Not flagged',
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT 0,
  `account_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT 0,
  `prnt_dlr_id` int(11) NULL DEFAULT 0,
  `link_code` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `client_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `expiry_months` int(100) NULL DEFAULT NULL,
  `expiry_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `activation_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `status` enum('expired','active','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `device_status` tinyint(4) NOT NULL DEFAULT 0,
  `activation_status` tinyint(4) NULL DEFAULT NULL,
  `wipe_status` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account_status` enum('suspended','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT 0,
  `transfer_status` tinyint(4) UNSIGNED NULL DEFAULT 0,
  `dealer_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `prnt_dlr_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `chat_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `sim_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `del_status` tinyint(4) NULL DEFAULT NULL,
  `finalStatus` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 521 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for acl_module_actions
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_actions`;
CREATE TABLE `acl_module_actions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `component_id` int(11) NOT NULL,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `action` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `sort` int(5) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `component_id`(`component_id`) USING BTREE,
  CONSTRAINT `acl_module_actions_ibfk_1` FOREIGN KEY (`component_id`) REFERENCES `acl_modules` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for acl_module_actions_to_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_actions_to_user_roles`;
CREATE TABLE `acl_module_actions_to_user_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_type_id` int(11) NOT NULL,
  `module_action_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_type_id`(`user_type_id`) USING BTREE,
  INDEX `module_action_id`(`module_action_id`) USING BTREE,
  CONSTRAINT `acl_module_actions_to_user_roles_ibfk_1` FOREIGN KEY (`user_type_id`) REFERENCES `user_roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `acl_module_actions_to_user_roles_ibfk_2` FOREIGN KEY (`module_action_id`) REFERENCES `acl_module_actions` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for acl_module_to_user_roles
-- ----------------------------
DROP TABLE IF EXISTS `acl_module_to_user_roles`;
CREATE TABLE `acl_module_to_user_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_role_id` int(11) NOT NULL,
  `component_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_role_id`(`user_role_id`) USING BTREE,
  INDEX `component_id`(`component_id`) USING BTREE,
  CONSTRAINT `acl_module_to_user_roles_ibfk_1` FOREIGN KEY (`user_role_id`) REFERENCES `user_roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `acl_module_to_user_roles_ibfk_2` FOREIGN KEY (`component_id`) REFERENCES `acl_modules` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 58 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acl_module_to_user_roles
-- ----------------------------
INSERT INTO `acl_module_to_user_roles` VALUES (1, 1, 1);
INSERT INTO `acl_module_to_user_roles` VALUES (2, 2, 1);
INSERT INTO `acl_module_to_user_roles` VALUES (3, 3, 1);
INSERT INTO `acl_module_to_user_roles` VALUES (4, 1, 3);
INSERT INTO `acl_module_to_user_roles` VALUES (5, 1, 4);
INSERT INTO `acl_module_to_user_roles` VALUES (6, 2, 4);
INSERT INTO `acl_module_to_user_roles` VALUES (7, 1, 6);
INSERT INTO `acl_module_to_user_roles` VALUES (26, 1, 7);
INSERT INTO `acl_module_to_user_roles` VALUES (27, 2, 7);
INSERT INTO `acl_module_to_user_roles` VALUES (28, 1, 8);
INSERT INTO `acl_module_to_user_roles` VALUES (29, 2, 8);
INSERT INTO `acl_module_to_user_roles` VALUES (30, 3, 8);
INSERT INTO `acl_module_to_user_roles` VALUES (40, 1, 30);
INSERT INTO `acl_module_to_user_roles` VALUES (41, 2, 30);
INSERT INTO `acl_module_to_user_roles` VALUES (42, 3, 30);
INSERT INTO `acl_module_to_user_roles` VALUES (43, 1, 33);
INSERT INTO `acl_module_to_user_roles` VALUES (44, 1, 32);
INSERT INTO `acl_module_to_user_roles` VALUES (45, 1, 37);
INSERT INTO `acl_module_to_user_roles` VALUES (46, 1, 39);
INSERT INTO `acl_module_to_user_roles` VALUES (47, 1, 40);
INSERT INTO `acl_module_to_user_roles` VALUES (48, 2, 39);
INSERT INTO `acl_module_to_user_roles` VALUES (49, 2, 33);
INSERT INTO `acl_module_to_user_roles` VALUES (50, 2, 40);
INSERT INTO `acl_module_to_user_roles` VALUES (51, 1, 41);
INSERT INTO `acl_module_to_user_roles` VALUES (52, 2, 41);
INSERT INTO `acl_module_to_user_roles` VALUES (53, 3, 41);
INSERT INTO `acl_module_to_user_roles` VALUES (54, 1, 42);
INSERT INTO `acl_module_to_user_roles` VALUES (55, 2, 42);
INSERT INTO `acl_module_to_user_roles` VALUES (56, 4, 43);

-- ----------------------------
-- Table structure for acl_modules
-- ----------------------------
DROP TABLE IF EXISTS `acl_modules`;
CREATE TABLE `acl_modules`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(50) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `component` varchar(80) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  `login_required` tinyint(1) NOT NULL DEFAULT 1,
  `sort` int(5) NOT NULL DEFAULT 0,
  `dir` text CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NULL,
  `uri` varchar(100) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `uri_UNIQUE`(`uri`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 44 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acl_modules
-- ----------------------------
INSERT INTO `acl_modules` VALUES (1, 'Devices', 'DevicesComponent', 1, 0, '/devices', '/devices');
INSERT INTO `acl_modules` VALUES (2, 'Login', 'LoginComponent', 0, 0, '/login', '/login');
INSERT INTO `acl_modules` VALUES (3, 'Dealers', 'DealerComponent', 1, 0, '/dealer', '/dealer/dealer');
INSERT INTO `acl_modules` VALUES (4, 'Sub Dealers', 'DealerComponent', 1, 0, '/dealer', '/dealer/sdealer');
INSERT INTO `acl_modules` VALUES (5, 'Add Devices', 'AddDeviceComponent', 1, 0, '/add-device', 'add-device');
INSERT INTO `acl_modules` VALUES (6, 'Create Dealers', 'CreateDealer', 1, 0, '/create-dealer', '/create-dealer/dealer');
INSERT INTO `acl_modules` VALUES (7, 'Create Sub-Dealer', 'CreateDealer', 1, 0, '/create-sdealer', '/create-dealer/sdealer');
INSERT INTO `acl_modules` VALUES (8, 'Connect Devices', 'ConnectDevicesComponent', 1, 0, '/connect-device', '/connect-device/:deviceId');
INSERT INTO `acl_modules` VALUES (30, '', 'ProfileComponent', 1, 0, '/profile', '/profile');
INSERT INTO `acl_modules` VALUES (31, '', 'CreateClientComponent', 1, 0, NULL, '/create/client');
INSERT INTO `acl_modules` VALUES (32, '', 'UploadApkComponent', 1, 0, NULL, '/upload-apk');
INSERT INTO `acl_modules` VALUES (33, '', 'ApkListComponent', 1, 0, NULL, '/apk-list');
INSERT INTO `acl_modules` VALUES (35, '', 'SettingsComponent', 1, 0, NULL, 'settings');
INSERT INTO `acl_modules` VALUES (36, 'Profile List', 'ProfileListComponent', 1, 0, 'components/profile-list', 'profile-list');
INSERT INTO `acl_modules` VALUES (37, 'Account', 'AccountComponent', 1, 0, 'components/account', '/account');
INSERT INTO `acl_modules` VALUES (38, 'Invalid Page', 'InvalidPage', 0, 0, 'components/account', '/invalid_page');
INSERT INTO `acl_modules` VALUES (39, 'App', 'App', 1, 0, NULL, '/app');
INSERT INTO `acl_modules` VALUES (40, 'Policy', 'Policy', 1, 0, NULL, '/policy');
INSERT INTO `acl_modules` VALUES (41, 'Users', 'Users', 1, 0, NULL, '/users');
INSERT INTO `acl_modules` VALUES (42, 'AppMarket', 'AppMarket', 1, 0, NULL, '/app-market');
INSERT INTO `acl_modules` VALUES (43, 'AutoUpdate', 'AutoUpdate', 1, 0, NULL, '/apk-list/autoupdate');

-- ----------------------------
-- Table structure for apk_details
-- ----------------------------
DROP TABLE IF EXISTS `apk_details`;
CREATE TABLE `apk_details`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `app_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `logo` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `apk` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `apk_type` enum('permanent','basic','other') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'basic',
  `label` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `unique_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `version_code` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `version_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `details` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `apk_bytes` int(100) NULL DEFAULT NULL,
  `apk_size` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `logo_bytes` int(100) NULL DEFAULT NULL,
  `logo_size` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealers` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` enum('Off','On') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Off',
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `created` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 111 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for apps_info
-- ----------------------------
DROP TABLE IF EXISTS `apps_info`;
CREATE TABLE `apps_info`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `icon` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `extension` tinyint(4) NULL DEFAULT 0,
  `visible` tinyint(4) NOT NULL DEFAULT 1,
  `default_app` tinyint(4) NOT NULL DEFAULT 0,
  `extension_id` int(11) NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 28126 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apps_info
-- ----------------------------
INSERT INTO `apps_info` VALUES (4649, 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4650, 'com.secureSetting.SecureSettingsMainSecure Settings', 'Secure Settings', 'com.secureSetting.SecureSettingsMain', 'icon_Secure Settings.png', 1, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4651, 'com.android.browserBrowser', 'Browser', 'com.android.browser', 'icon_Browser.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4652, 'com.android.calendarCalendar', 'Calendar', 'com.android.calendar', 'icon_Calendar.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4653, 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4654, 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4655, 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4656, 'com.android.emailEmail', 'Email', 'com.android.email', 'icon_Email.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4657, 'com.android.gallery3dGallery', 'Gallery', 'com.android.gallery3d', 'icon_Gallery.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4658, 'com.android.mmsMessaging', 'Messaging', 'com.android.mms', 'icon_Messaging.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4659, 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', 0, 0, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4660, 'com.android.soundrecorderSound Recorder', 'Sound Recorder', 'com.android.soundrecorder', 'icon_Sound Recorder.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4661, 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4662, 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4663, 'com.android.quicksearchboxSearch', 'Search', 'com.android.quicksearchbox', 'icon_Search.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4664, 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4665, 'com.mediatek.systemupdateSystem software updates', 'System software updates', 'com.mediatek.systemupdate', 'icon_System software updates.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4666, 'com.rim.mobilefusion.clientUEM Client', 'UEM Client', 'com.rim.mobilefusion.client', 'icon_UEM Client.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `apps_info` VALUES (4667, 'com.titanlocker.secureTitan Locker', 'Titan Locker', 'com.titanlocker.secure', 'icon_Titan Locker.png', 0, 1, 0, 0, '2019-04-22 12:49:21', '2019-05-21 17:05:59');
INSERT INTO `apps_info` VALUES (4668, 'com.secureSetting.SecureSettingsMainSecure SettingsBattery', 'Battery', NULL, 'icon_Battery.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4669, 'com.secureSetting.SecureSettingsMainSecure Settingswi-fi', 'wi-fi', NULL, 'icon_wi-fi.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4670, 'com.secureSetting.SecureSettingsMainSecure SettingsBluetooth', 'Bluetooth', NULL, 'icon_Bluetooth.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4671, 'com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards', 'SIM Cards', NULL, 'icon_SIM Cards.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4672, 'com.secureSetting.SecureSettingsMainSecure SettingsData Roaming', 'Data Roaming', NULL, 'icon_Data Roaming.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4673, 'com.secureSetting.SecureSettingsMainSecure SettingsMobile Data', 'Mobile Data', NULL, 'icon_Mobile Data.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4674, 'com.secureSetting.SecureSettingsMainSecure SettingsHotspot', 'Hotspot', NULL, 'icon_Hotspot.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4675, 'com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock', 'Finger Print + Lock', NULL, 'icon_Finger Print + Lock.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4676, 'com.secureSetting.SecureSettingsMainSecure SettingsBrightness', 'Brightness', NULL, 'icon_Brightness.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4677, 'com.secureSetting.SecureSettingsMainSecure SettingsSleep', 'Sleep', NULL, 'icon_Sleep.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4678, 'com.secureSetting.SecureSettingsMainSecure SettingsSound', 'Sound', NULL, 'icon_Sound.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (4679, 'com.secureSetting.SecureSettingsMainSecure SettingsDate & Time', 'Date & Time', NULL, 'icon_Date & Time.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `apps_info` VALUES (9684, 'com.secure.vpnSecure VPN', 'Secure VPN', 'com.secure.vpn', 'icon_Secure VPN.png', 0, 1, 0, 0, '2019-04-26 02:51:19', '2019-06-10 09:38:43');
INSERT INTO `apps_info` VALUES (9686, 'com.vortexlocker.appScreen Locker', 'Screen Locker', 'com.vortexlocker.app', 'icon_Screen Locker.png', 0, 1, 1, 0, '2019-04-26 02:51:19', NULL);
INSERT INTO `apps_info` VALUES (10116, 'ca.unlimitedwireless.mailpgpMail', 'Mail', 'ca.unlimitedwireless.mailpgp', 'icon_Mail.png', 0, 1, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `apps_info` VALUES (10118, 'com.srz.unlimited.wiperEmergency Wipe', 'Emergency Wipe', 'com.srz.unlimited.wiper', 'icon_Emergency Wipe.png', 0, 1, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `apps_info` VALUES (10121, 'ca.unlimitedwireless.encryptednotesEncrypted Notes', 'Encrypted Notes', 'ca.unlimitedwireless.encryptednotes', 'icon_Encrypted Notes.png', 0, 1, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `apps_info` VALUES (10123, 'com.titansecure.titan1Titan Secure', 'Titan Secure', 'com.titansecure.titan1', 'icon_Titan Secure.png', 0, 1, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `apps_info` VALUES (12544, 'com.sec.android.app.clockpackageClock', 'Clock', 'com.sec.android.app.clockpackage', 'icon_Clock.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12545, 'com.sec.android.gallery3dGallery', 'Gallery', 'com.sec.android.gallery3d', 'icon_Gallery.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12547, 'com.samsung.android.contactsContacts', 'Contacts', 'com.samsung.android.contacts', 'icon_Contacts.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12548, 'com.samsung.android.contactsPhone', 'Phone', 'com.samsung.android.contacts', 'icon_Phone.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12549, 'com.samsung.android.messagingMessages', 'Messages', 'com.samsung.android.messaging', 'icon_Messages.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12550, 'com.sec.android.app.cameraCamera', 'Camera', 'com.sec.android.app.camera', 'icon_Camera.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12551, 'com.google.android.googlequicksearchboxVoice Search', 'Voice Search', 'com.google.android.googlequicksearchbox', 'icon_Voice Search.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12552, 'com.google.android.googlequicksearchboxGoogle', 'Google', 'com.google.android.googlequicksearchbox', 'icon_Google.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12553, 'com.samsung.attvvmVisual Voicemail', 'Visual Voicemail', 'com.samsung.attvvm', 'icon_Visual Voicemail.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12554, 'com.sec.android.app.myfilesMy Files', 'My Files', 'com.sec.android.app.myfiles', 'icon_My Files.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12555, 'com.synchronoss.dcs.att.r2gSetup & Transfer', 'Setup & Transfer', 'com.synchronoss.dcs.att.r2g', 'icon_Setup & Transfer.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12558, 'com.codeproof.device.securityCodeproof® MDM', 'Codeproof® MDM', 'com.codeproof.device.security', 'icon_Codeproof® MDM.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12562, 'com.titansecure.bizTitan Secure', 'Titan Secure', 'com.titansecure.biz', 'icon_Titan Secure.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `apps_info` VALUES (12692, 'org.thoughtcrime.securesmsSignal', 'Signal', 'org.thoughtcrime.securesms', 'icon_Signal.png', 0, 1, 0, 0, '2019-04-29 20:35:59', NULL);
INSERT INTO `apps_info` VALUES (12852, 'com.whatsappWhatsApp', 'WhatsApp', 'com.whatsapp', 'icon_WhatsApp.png', 0, 1, 0, 0, '2019-04-29 20:56:49', NULL);
INSERT INTO `apps_info` VALUES (13122, 'com.zonarmr.mtkengineermodeMTK Engineer Mode', 'MTK Engineer Mode', 'com.zonarmr.mtkengineermode', 'icon_MTK Engineer Mode.png', 0, 1, 0, 0, '2019-04-30 08:56:25', NULL);
INSERT INTO `apps_info` VALUES (15606, 'com.android.browserNavigateur', 'Navigateur', 'com.android.browser', 'icon_Navigateur.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15607, 'com.android.calendarAgenda', 'Agenda', 'com.android.calendar', 'icon_Agenda.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15608, 'com.android.deskclockHorloge', 'Horloge', 'com.android.deskclock', 'icon_Horloge.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15609, 'com.android.dialerTéléphone', 'Téléphone', 'com.android.dialer', 'icon_Téléphone.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15610, 'com.android.emailE-mail', 'E-mail', 'com.android.email', 'icon_E-mail.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15611, 'com.android.gallery3dGalerie', 'Galerie', 'com.android.gallery3d', 'icon_Galerie.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15612, 'com.android.mmsSMS/MMS', 'SMS/MMS', 'com.android.mms', 'icon_SMS/MMS.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15613, 'com.android.musicMusique', 'Musique', 'com.android.music', 'icon_Musique.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15614, 'com.android.settingsParamètres', 'Paramètres', 'com.android.settings', 'icon_Paramètres.png', 0, 0, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15615, 'com.android.soundrecorderMagnétophone', 'Magnétophone', 'com.android.soundrecorder', 'icon_Magnétophone.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15616, 'com.mediatek.cameraAppareil photo', 'Appareil photo', 'com.mediatek.camera', 'icon_Appareil photo.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15617, 'com.android.calculator2Calculatrice', 'Calculatrice', 'com.android.calculator2', 'icon_Calculatrice.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15618, 'com.android.stkBoîte à outils SIM', 'Boîte à outils SIM', 'com.android.stk', 'icon_Boîte à outils SIM.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15619, 'com.mediatek.systemupdateMises à jour du logiciel système', 'Mises à jour du logiciel système', 'com.mediatek.systemupdate', 'icon_Mises à jour du logiciel système.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15620, 'ca.unlimitedwireless.mailpgpCourrier', 'Courrier', 'ca.unlimitedwireless.mailpgp', 'icon_Courrier.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `apps_info` VALUES (15706, 'com.secureClear.SecureClearActivitySecure Clear', 'Secure Clear', 'com.secureClear.SecureClearActivity', 'icon_Secure Clear.png', 0, 1, 0, 0, '2019-05-01 08:03:46', '2019-05-25 11:59:04');
INSERT INTO `apps_info` VALUES (15926, 'com.secure.systemcontrolSystem Control', 'System Control', 'com.secure.systemcontrol', 'icon_System Control.png', 0, 1, 0, 0, '2019-05-11 04:49:02', '2019-06-07 09:32:26');
INSERT INTO `apps_info` VALUES (15929, 'com.secureMarket.SecureMarketActivitySecure Market', 'Secure Market', 'com.secureMarket.SecureMarketActivity', 'icon_Secure Market.png', 0, 1, 0, 0, '2019-05-11 04:49:02', '2019-05-25 11:59:04');
INSERT INTO `apps_info` VALUES (16067, 'com.facebook.liteLite', 'Lite', 'com.facebook.lite', 'icon_Lite.png', 0, 1, 0, 0, '2019-05-11 10:31:17', '2019-06-03 12:04:54');
INSERT INTO `apps_info` VALUES (16445, 'com.vortexlocker.apScreen Locker', 'Screen Locker', 'com.vortexlocker.ap', 'icon_Screen Locker.png', 0, 1, 1, 0, '2019-05-14 10:04:38', '2019-05-21 09:39:27');
INSERT INTO `apps_info` VALUES (16871, 'com.facebook.mliteMessenger Lite', 'Messenger Lite', 'com.facebook.mlite', 'icon_Messenger Lite.png', 0, 0, 0, 0, '2019-05-15 16:14:49', NULL);
INSERT INTO `apps_info` VALUES (16940, 'com.facebook.mliteLite', 'Lite', 'com.facebook.mlite', 'icon_Lite.png', 0, 1, 0, 0, '2019-05-15 16:15:58', NULL);
INSERT INTO `apps_info` VALUES (17626, 'com.estrongs.android.popES File Explorer', 'ES File Explorer', 'com.estrongs.android.pop', 'icon_ES File Explorer.png', 0, 1, 0, 0, '2019-05-16 06:59:30', '2019-06-04 08:02:22');
INSERT INTO `apps_info` VALUES (18288, 'com.amazon.anowPrime Now', 'Prime Now', 'com.amazon.anow', 'icon_Prime Now.png', 0, 0, 0, 0, '2019-05-16 07:59:45', '2019-05-16 08:01:28');
INSERT INTO `apps_info` VALUES (18398, 'com.google.android.ttsGoogle Text-to-speech Engine', 'Google Text-to-speech Engine', 'com.google.android.tts', 'icon_Google Text-to-speech Engine.png', 0, 0, 0, 0, '2019-05-16 08:01:28', NULL);
INSERT INTO `apps_info` VALUES (18547, 'com.cricbuzz.androidCricbuzz', 'Cricbuzz', 'com.cricbuzz.android', 'icon_Cricbuzz.png', 0, 0, 0, 0, '2019-05-16 08:29:06', NULL);
INSERT INTO `apps_info` VALUES (19254, 'com.secureSetting.SecureSettingsMainSecure SettingsAirplan mode', 'Airplan mode', NULL, 'icon_Airplan mode.png', 1, 1, 0, 4650, '2019-05-20 12:50:13', NULL);
INSERT INTO `apps_info` VALUES (19890, 'org.videolan.vlcVLC', 'VLC', 'org.videolan.vlc', 'icon_VLC.png', 0, 1, 0, 0, '2019-05-21 08:18:29', '2019-06-10 09:38:43');
INSERT INTO `apps_info` VALUES (20722, 'de.blinkt.openvpnOpenVPN for Android', 'OpenVPN for Android', 'de.blinkt.openvpn', 'icon_OpenVPN for Android.png', 0, 1, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `apps_info` VALUES (20863, 'com.armorsec.armor1ArmorSec', 'ArmorSec', 'com.armorsec.armor1', 'icon_ArmorSec.png', 0, 1, 0, 0, '2019-05-24 00:41:38', '2019-06-04 07:55:11');
INSERT INTO `apps_info` VALUES (21461, 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages', 'Languages', NULL, 'icon_Languages.png', 1, 1, 0, 4650, '2019-05-25 10:38:45', NULL);
INSERT INTO `apps_info` VALUES (21827, 'com.android.cellbroadcastreceiverCell Broadcasts', 'Cell Broadcasts', 'com.android.cellbroadcastreceiver', 'icon_Cell Broadcasts.png', 0, 1, 0, 0, '2019-05-27 09:10:24', NULL);
INSERT INTO `apps_info` VALUES (21830, 'com.android.fmradioFM Radio', 'FM Radio', 'com.android.fmradio', 'icon_FM Radio.png', 0, 1, 0, 0, '2019-05-27 09:10:24', NULL);
INSERT INTO `apps_info` VALUES (22049, 'com.paraphron.youtubeYouTube', 'YouTube', 'com.paraphron.youtube', 'icon_YouTube.png', 0, 0, 0, 0, '2019-05-27 10:53:50', '2019-06-05 05:11:35');
INSERT INTO `apps_info` VALUES (23212, 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages & Input', 'Languages & Input', NULL, 'icon_Languages & Input.png', 1, 1, 0, 4650, '2019-05-29 19:14:05', NULL);
INSERT INTO `apps_info` VALUES (23213, 'com.secureSetting.SecureSettingsMainSecure SettingsAirplane mode', 'Airplane mode', NULL, 'icon_Airplane mode.png', 1, 1, 0, 4650, '2019-05-29 19:14:05', NULL);
INSERT INTO `apps_info` VALUES (23787, 'com.teslacoilsw.launcherNova Launcher', 'Nova Launcher', 'com.teslacoilsw.launcher', 'icon_Nova Launcher.png', 0, 1, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `apps_info` VALUES (23795, 'com.example.sasukay.myapplicationBus Service system', 'Bus Service system', 'com.example.sasukay.myapplication', 'icon_Bus Service system.png', 0, 1, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `apps_info` VALUES (23827, 'com.secure.launcherSecure Launcher', 'Secure Launcher', 'com.secure.launcher', 'icon_Secure Launcher.png', 0, 1, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `apps_info` VALUES (23828, 'com.suphi.lightlaunchLightLaunch', 'LightLaunch', 'com.suphi.lightlaunch', 'icon_LightLaunch.png', 0, 1, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `apps_info` VALUES (23836, 'de.blinkt.openvpnSecure VPN', 'Secure VPN', 'de.blinkt.openvpn', 'icon_Secure VPN.png', 0, 1, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `apps_info` VALUES (23837, 'com.lenovo.anyshare.gpsSHAREit', 'SHAREit', 'com.lenovo.anyshare.gps', 'icon_SHAREit.png', 0, 1, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `apps_info` VALUES (23838, 'free.vpn.unblock.proxy.gulfVPNGulf VPN', 'Gulf VPN', 'free.vpn.unblock.proxy.gulfVPN', 'icon_Gulf VPN.png', 0, 1, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `apps_info` VALUES (24089, 'com.domobile.applockAppLock', 'AppLock', 'com.domobile.applock', 'icon_AppLock.png', 0, 1, 0, 0, '2019-06-02 20:05:28', '2019-06-03 12:06:54');
INSERT INTO `apps_info` VALUES (24499, 'com.contactSupport.ChatActivityContact Support', 'Contact Support', 'com.contactSupport.ChatActivity', 'icon_Contact Support.png', 0, 1, 0, 0, '2019-06-03 12:04:54', NULL);
INSERT INTO `apps_info` VALUES (25298, 'com.jrzheng.supervpnfreeSuperVPN', 'SuperVPN', 'com.jrzheng.supervpnfree', 'icon_SuperVPN.png', 0, 0, 0, 0, '2019-06-04 08:02:22', '2019-06-05 20:47:34');
INSERT INTO `apps_info` VALUES (26601, 'undefined', 'Secure Settings', 'undefined', 'icon_Secure Settings.png', 0, 1, 0, 0, '2019-06-07 09:32:26', '2019-06-07 12:21:36');
INSERT INTO `apps_info` VALUES (26938, 'com.vortexsecure.androidEncrypted Chat', 'Encrypted Chat', 'com.vortexsecure.android', 'icon_Encrypted Chat.png', 0, 1, 0, 0, '2019-06-07 12:25:45', NULL);
INSERT INTO `apps_info` VALUES (26939, 'ca.unlimitedwireless.encryptednotesEncrypted-Notes', 'Encrypted-Notes', 'ca.unlimitedwireless.encryptednotes', 'icon_Encrypted-Notes.png', 0, 1, 0, 0, '2019-06-07 12:25:45', NULL);
INSERT INTO `apps_info` VALUES (27688, 'com.jaz.telecomJazTelecom', 'JazTelecom', 'com.jaz.telecom', 'icon_JazTelecom.png', 0, 1, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `apps_info` VALUES (27721, 'com.secure.launcherScreen Locker', 'Screen Locker', 'com.secure.launcher', 'icon_Screen Locker.png', 0, 1, 1, 0, '2019-06-10 05:33:21', NULL);
INSERT INTO `apps_info` VALUES (27929, 'com.android.chromeChrome', 'Chrome', 'com.android.chrome', 'icon_Chrome.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27932, 'com.android.mediacenterMusic', 'Music', 'com.android.mediacenter', 'icon_Music.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27933, 'com.android.contactsDialer', 'Dialer', 'com.android.contacts', 'icon_Dialer.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27936, 'com.example.android.notepadNotepad', 'Notepad', 'com.example.android.notepad', 'icon_Notepad.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27937, 'com.google.android.apps.docs.editors.docsDocs', 'Docs', 'com.google.android.apps.docs.editors.docs', 'icon_Docs.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27938, 'com.google.android.apps.docs.editors.slidesSlides', 'Slides', 'com.google.android.apps.docs.editors.slides', 'icon_Slides.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27939, 'com.android.vendingPlay Store', 'Play Store', 'com.android.vending', 'icon_Play Store.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27940, 'com.google.android.apps.docs.editors.sheetsSheets', 'Sheets', 'com.google.android.apps.docs.editors.sheets', 'icon_Sheets.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27941, 'com.google.android.apps.mapsMaps', 'Maps', 'com.google.android.apps.maps', 'icon_Maps.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27942, 'com.google.android.apps.photosPhotos', 'Photos', 'com.google.android.apps.photos', 'icon_Photos.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27943, 'com.google.android.apps.tachyonDuo', 'Duo', 'com.google.android.apps.tachyon', 'icon_Duo.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27944, 'com.google.android.apps.docsDrive', 'Drive', 'com.google.android.apps.docs', 'icon_Drive.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27945, 'com.google.android.gmGmail', 'Gmail', 'com.google.android.gm', 'icon_Gmail.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27946, 'com.google.android.musicPlay Music', 'Play Music', 'com.google.android.music', 'icon_Play Music.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27947, 'com.huawei.hidiskFiles', 'Files', 'com.huawei.hidisk', 'icon_Files.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27948, 'com.huawei.cameraCamera', 'Camera', 'com.huawei.camera', 'icon_Camera.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27949, 'com.google.android.talkHangouts', 'Hangouts', 'com.google.android.talk', 'icon_Hangouts.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27950, 'com.ubercabUber', 'Uber', 'com.ubercab', 'icon_Uber.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27951, 'com.huawei.himovie.overseasHUAWEI Video', 'HUAWEI Video', 'com.huawei.himovie.overseas', 'icon_HUAWEI Video.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27952, 'io.faceappFaceApp', 'FaceApp', 'io.faceapp', 'icon_FaceApp.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27953, 'com.google.android.youtubeYouTube', 'YouTube', 'com.google.android.youtube', 'icon_YouTube.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27954, 'org.mozilla.firefoxFirefox', 'Firefox', 'org.mozilla.firefox', 'icon_Firefox.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27955, 'org.zwanoo.android.speedtestSpeedtest', 'Speedtest', 'org.zwanoo.android.speedtest', 'icon_Speedtest.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27957, 'com.android.documentsuiDownloads', 'Downloads', 'com.android.documentsui', 'icon_Downloads.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27958, 'com.android.hwmirrorMirror', 'Mirror', 'com.android.hwmirror', 'icon_Mirror.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27959, 'com.android.soundrecorderRecorder', 'Recorder', 'com.android.soundrecorder', 'icon_Recorder.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27962, 'com.huawei.KoBackupBackup & restore', 'Backup & restore', 'com.huawei.KoBackup', 'icon_Backup & restore.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27963, 'com.huawei.android.FMRadioFM Radio', 'FM Radio', 'com.huawei.android.FMRadio', 'icon_FM Radio.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27964, 'com.hicloud.android.clonePhone Clone', 'Phone Clone', 'com.hicloud.android.clone', 'icon_Phone Clone.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27965, 'com.android.systemuiFlashlight', 'Flashlight', 'com.android.systemui', 'icon_Flashlight.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27966, 'com.huawei.android.thememanagerThemes', 'Themes', 'com.huawei.android.thememanager', 'icon_Themes.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27967, 'com.huawei.android.totemweatherappWeather', 'Weather', 'com.huawei.android.totemweatherapp', 'icon_Weather.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27968, 'com.huawei.appmarketAppGallery', 'AppGallery', 'com.huawei.appmarket', 'icon_AppGallery.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27969, 'com.huawei.android.hwoucSystem update', 'System update', 'com.huawei.android.hwouc', 'icon_System update.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27970, 'com.huawei.healthHealth', 'Health', 'com.huawei.health', 'icon_Health.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27971, 'com.huawei.compassCompass', 'Compass', 'com.huawei.compass', 'icon_Compass.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27972, 'com.huawei.systemmanagerPhone Manager', 'Phone Manager', 'com.huawei.systemmanager', 'icon_Phone Manager.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27973, 'com.touchtype.swiftkeySwiftKey Keyboard', 'SwiftKey Keyboard', 'com.touchtype.swiftkey', 'icon_SwiftKey Keyboard.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27974, 'com.stupeflix.replayQuik', 'Quik', 'com.stupeflix.replay', 'icon_Quik.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27975, 'com.accuweather.androidAccuWeather', 'AccuWeather', 'com.accuweather.android', 'icon_AccuWeather.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27976, 'com.huawei.phoneserviceHiCare', 'HiCare', 'com.huawei.phoneservice', 'icon_HiCare.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27977, 'com.app.superbatvpnSuperBat VPN', 'SuperBat VPN', 'com.app.superbatvpn', 'icon_SuperBat VPN.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27978, 'com.asana.appAsana', 'Asana', 'com.asana.app', 'icon_Asana.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27979, 'com.bitsmedia.android.muslimproMuslim Pro', 'Muslim Pro', 'com.bitsmedia.android.muslimpro', 'icon_Muslim Pro.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27980, 'com.careem.acmaCareem', 'Careem', 'com.careem.acma', 'icon_Careem.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27981, 'com.daraz.androidDaraz', 'Daraz', 'com.daraz.android', 'icon_Daraz.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27982, 'com.example.javatestJavaTest', 'JavaTest', 'com.example.javatest', 'icon_JavaTest.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27983, 'com.facebook.katanaFacebook', 'Facebook', 'com.facebook.katana', 'icon_Facebook.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27984, 'com.facebook.orcaMessenger', 'Messenger', 'com.facebook.orca', 'icon_Messenger.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27985, 'com.fix.rizwanmushtaq.fixE Labour', 'E Labour', 'com.fix.rizwanmushtaq.fix', 'icon_E Labour.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27986, 'com.google.android.inputmethod.latinGboard', 'Gboard', 'com.google.android.inputmethod.latin', 'icon_Gboard.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27987, 'com.freelancer.android.messengerFreelancer', 'Freelancer', 'com.freelancer.android.messenger', 'icon_Freelancer.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27988, 'com.hikvision.hikconnectHik-Connect', 'Hik-Connect', 'com.hikvision.hikconnect', 'icon_Hik-Connect.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27989, 'com.imo.android.imoimimo', 'imo', 'com.imo.android.imoim', 'icon_imo.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27990, 'com.islam360Islam360', 'Islam360', 'com.islam360', 'icon_Islam360.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27992, 'com.mustakbilMustakbil', 'Mustakbil', 'com.mustakbil', 'icon_Mustakbil.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27993, 'com.olx.pkOLX Pakistan', 'OLX Pakistan', 'com.olx.pk', 'icon_OLX Pakistan.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27994, 'com.payoneer.androidPayoneer', 'Payoneer', 'com.payoneer.android', 'icon_Payoneer.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27995, 'com.pickytestPicky Assist', 'Picky Assist', 'com.pickytest', 'icon_Picky Assist.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27996, 'com.scb.pk.bmwSC', 'SC', 'com.scb.pk.bmw', 'icon_SC.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (27999, 'com.tencent.mmWeChat', 'WeChat', 'com.tencent.mm', 'icon_WeChat.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (28000, 'com.skype.raiderSkype', 'Skype', 'com.skype.raider', 'icon_Skype.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (28002, 'com.yystudio.stopwatchfullStopWatch', 'StopWatch', 'com.yystudio.stopwatchfull', 'icon_StopWatch.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (28003, 'com.zong.customercareMy Zong', 'My Zong', 'com.zong.customercare', 'icon_My Zong.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (28005, 'free.vpn.unblock.proxy.vpnproSnap VPN', 'Snap VPN', 'free.vpn.unblock.proxy.vpnpro', 'icon_Snap VPN.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);
INSERT INTO `apps_info` VALUES (28006, 'net.WisdomStar.PingPing', 'Ping', 'net.WisdomStar.Ping', 'icon_Ping.png', 0, 1, 0, 0, '2019-06-10 09:38:43', NULL);

-- ----------------------------
-- Table structure for apps_queue_jobs
-- ----------------------------
DROP TABLE IF EXISTS `apps_queue_jobs`;
CREATE TABLE `apps_queue_jobs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `action` enum('pull','push') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `type` enum('push','pull','policy') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `is_in_process` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `total_apps` int(11) NULL DEFAULT 0,
  `complete_apps` int(11) NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  CONSTRAINT `apps_queue_jobs_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`device_id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 141 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for chat_ids
-- ----------------------------
DROP TABLE IF EXISTS `chat_ids`;
CREATE TABLE `chat_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `chat_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `chat_id_unique`(`chat_id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `chat_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_ids
-- ----------------------------
INSERT INTO `chat_ids` VALUES (1, NULL, '6', 1, '2019-04-22 17:34:23', '2019-06-03 12:04:47');
INSERT INTO `chat_ids` VALUES (2, NULL, '1', 1, '2019-04-22 17:34:23', '2019-06-10 05:33:16');
INSERT INTO `chat_ids` VALUES (3, NULL, '7', 1, '2019-04-22 17:34:23', '2019-06-07 09:19:13');
INSERT INTO `chat_ids` VALUES (4, NULL, '4', 1, '2019-04-22 17:34:23', '2019-06-10 08:45:35');
INSERT INTO `chat_ids` VALUES (5, NULL, '8', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (6, NULL, '10', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (7, NULL, '5', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (8, NULL, '3', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (9, NULL, '2', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (10, NULL, '9', 0, '2019-04-22 17:34:23', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (11, NULL, '5141281331', 1, '2019-05-07 08:18:25', '2019-06-02 20:05:19');
INSERT INTO `chat_ids` VALUES (12, NULL, '5141281332', 1, '2019-05-07 08:18:25', '2019-06-05 11:19:22');
INSERT INTO `chat_ids` VALUES (13, NULL, '5141281333', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (14, NULL, '5141281334', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (15, NULL, '5141281336', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (16, NULL, '5141281337', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (17, NULL, '5141281338', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (18, NULL, '5141281339', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (19, NULL, '5141281340', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (20, NULL, '5141281341', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (21, NULL, '5141281345', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (22, NULL, '5141281342', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (23, NULL, '5141281344', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (24, NULL, '5141281343', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (25, NULL, '5141281346', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (26, NULL, '5141281347', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (27, NULL, '5141281348', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (28, NULL, '5141281349', 0, '2019-05-07 08:18:25', '2019-06-01 12:13:25');
INSERT INTO `chat_ids` VALUES (29, NULL, '5141281335', 1, '2019-05-07 08:18:25', '2019-06-07 12:17:31');

-- ----------------------------
-- Table structure for dealer_apks
-- ----------------------------
DROP TABLE IF EXISTS `dealer_apks`;
CREATE TABLE `dealer_apks`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `apk_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_dealer_id_apk_id`(`dealer_id`, `apk_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 954 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------
INSERT INTO `dealer_apks` VALUES (253, 222, 29);
INSERT INTO `dealer_apks` VALUES (243, 222, 30);
INSERT INTO `dealer_apks` VALUES (329, 222, 48);
INSERT INTO `dealer_apks` VALUES (899, 222, 62);
INSERT INTO `dealer_apks` VALUES (839, 222, 91);
INSERT INTO `dealer_apks` VALUES (915, 222, 105);
INSERT INTO `dealer_apks` VALUES (950, 222, 108);
INSERT INTO `dealer_apks` VALUES (252, 223, 29);
INSERT INTO `dealer_apks` VALUES (242, 223, 30);
INSERT INTO `dealer_apks` VALUES (328, 223, 48);
INSERT INTO `dealer_apks` VALUES (898, 223, 62);
INSERT INTO `dealer_apks` VALUES (838, 223, 91);
INSERT INTO `dealer_apks` VALUES (880, 223, 99);
INSERT INTO `dealer_apks` VALUES (878, 223, 101);
INSERT INTO `dealer_apks` VALUES (882, 223, 102);
INSERT INTO `dealer_apks` VALUES (884, 223, 103);
INSERT INTO `dealer_apks` VALUES (914, 223, 105);
INSERT INTO `dealer_apks` VALUES (949, 223, 108);
INSERT INTO `dealer_apks` VALUES (952, 223, 109);
INSERT INTO `dealer_apks` VALUES (953, 223, 110);
INSERT INTO `dealer_apks` VALUES (251, 224, 29);
INSERT INTO `dealer_apks` VALUES (280, 224, 30);
INSERT INTO `dealer_apks` VALUES (327, 224, 48);
INSERT INTO `dealer_apks` VALUES (897, 224, 62);
INSERT INTO `dealer_apks` VALUES (879, 224, 99);
INSERT INTO `dealer_apks` VALUES (877, 224, 101);
INSERT INTO `dealer_apks` VALUES (881, 224, 102);
INSERT INTO `dealer_apks` VALUES (883, 224, 103);
INSERT INTO `dealer_apks` VALUES (913, 224, 105);
INSERT INTO `dealer_apks` VALUES (934, 224, 107);
INSERT INTO `dealer_apks` VALUES (948, 224, 108);
INSERT INTO `dealer_apks` VALUES (250, 225, 29);
INSERT INTO `dealer_apks` VALUES (288, 225, 30);
INSERT INTO `dealer_apks` VALUES (326, 225, 48);
INSERT INTO `dealer_apks` VALUES (896, 225, 62);
INSERT INTO `dealer_apks` VALUES (836, 225, 91);
INSERT INTO `dealer_apks` VALUES (912, 225, 105);
INSERT INTO `dealer_apks` VALUES (947, 225, 108);
INSERT INTO `dealer_apks` VALUES (249, 226, 29);
INSERT INTO `dealer_apks` VALUES (325, 226, 48);
INSERT INTO `dealer_apks` VALUES (895, 226, 62);
INSERT INTO `dealer_apks` VALUES (835, 226, 91);
INSERT INTO `dealer_apks` VALUES (911, 226, 105);
INSERT INTO `dealer_apks` VALUES (946, 226, 108);
INSERT INTO `dealer_apks` VALUES (312, 227, 29);
INSERT INTO `dealer_apks` VALUES (324, 227, 48);
INSERT INTO `dealer_apks` VALUES (894, 227, 62);
INSERT INTO `dealer_apks` VALUES (753, 227, 64);
INSERT INTO `dealer_apks` VALUES (834, 227, 91);
INSERT INTO `dealer_apks` VALUES (910, 227, 105);
INSERT INTO `dealer_apks` VALUES (945, 227, 108);
INSERT INTO `dealer_apks` VALUES (323, 228, 48);
INSERT INTO `dealer_apks` VALUES (893, 228, 62);
INSERT INTO `dealer_apks` VALUES (909, 228, 105);
INSERT INTO `dealer_apks` VALUES (944, 228, 108);
INSERT INTO `dealer_apks` VALUES (322, 229, 48);
INSERT INTO `dealer_apks` VALUES (892, 229, 62);
INSERT INTO `dealer_apks` VALUES (832, 229, 91);
INSERT INTO `dealer_apks` VALUES (908, 229, 105);
INSERT INTO `dealer_apks` VALUES (943, 229, 108);
INSERT INTO `dealer_apks` VALUES (321, 230, 48);
INSERT INTO `dealer_apks` VALUES (891, 230, 62);
INSERT INTO `dealer_apks` VALUES (907, 230, 105);
INSERT INTO `dealer_apks` VALUES (942, 230, 108);
INSERT INTO `dealer_apks` VALUES (318, 231, 48);
INSERT INTO `dealer_apks` VALUES (890, 231, 62);
INSERT INTO `dealer_apks` VALUES (830, 231, 91);
INSERT INTO `dealer_apks` VALUES (906, 231, 105);
INSERT INTO `dealer_apks` VALUES (941, 231, 108);
INSERT INTO `dealer_apks` VALUES (320, 232, 48);
INSERT INTO `dealer_apks` VALUES (889, 232, 62);
INSERT INTO `dealer_apks` VALUES (748, 232, 64);
INSERT INTO `dealer_apks` VALUES (829, 232, 91);
INSERT INTO `dealer_apks` VALUES (905, 232, 105);
INSERT INTO `dealer_apks` VALUES (940, 232, 108);
INSERT INTO `dealer_apks` VALUES (319, 233, 48);
INSERT INTO `dealer_apks` VALUES (888, 233, 62);
INSERT INTO `dealer_apks` VALUES (747, 233, 64);
INSERT INTO `dealer_apks` VALUES (828, 233, 91);
INSERT INTO `dealer_apks` VALUES (904, 233, 105);
INSERT INTO `dealer_apks` VALUES (939, 233, 108);
INSERT INTO `dealer_apks` VALUES (887, 234, 62);
INSERT INTO `dealer_apks` VALUES (777, 234, 64);
INSERT INTO `dealer_apks` VALUES (621, 234, 65);
INSERT INTO `dealer_apks` VALUES (622, 234, 70);
INSERT INTO `dealer_apks` VALUES (623, 234, 71);
INSERT INTO `dealer_apks` VALUES (624, 234, 72);
INSERT INTO `dealer_apks` VALUES (827, 234, 91);
INSERT INTO `dealer_apks` VALUES (903, 234, 105);
INSERT INTO `dealer_apks` VALUES (938, 234, 108);
INSERT INTO `dealer_apks` VALUES (886, 235, 62);
INSERT INTO `dealer_apks` VALUES (876, 235, 75);
INSERT INTO `dealer_apks` VALUES (826, 235, 91);
INSERT INTO `dealer_apks` VALUES (902, 235, 105);
INSERT INTO `dealer_apks` VALUES (937, 235, 108);
INSERT INTO `dealer_apks` VALUES (900, 238, 62);
INSERT INTO `dealer_apks` VALUES (916, 238, 105);
INSERT INTO `dealer_apks` VALUES (951, 238, 108);
INSERT INTO `dealer_apks` VALUES (885, 239, 62);
INSERT INTO `dealer_apks` VALUES (901, 239, 105);
INSERT INTO `dealer_apks` VALUES (936, 239, 108);
INSERT INTO `dealer_apks` VALUES (935, 241, 108);

-- ----------------------------
-- Table structure for dealer_dropdown_list
-- ----------------------------
DROP TABLE IF EXISTS `dealer_dropdown_list`;
CREATE TABLE `dealer_dropdown_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `selected_items` mediumtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('devices','dealer','sdealer','apk','policies','users') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unq_dlr_id_drpdwn_type`(`dealer_id`, `type`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_dropdown_list_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 195 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (192, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\"]', 'dealer', '2019-06-10 11:36:45', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (193, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-06-10 11:36:47', '2019-06-10 11:36:54');
INSERT INTO `dealer_dropdown_list` VALUES (194, 154, '[\"ACTIONS\"]', 'apk', '2019-06-10 11:37:21', NULL);

-- ----------------------------
-- Table structure for dealer_pagination
-- ----------------------------
DROP TABLE IF EXISTS `dealer_pagination`;
CREATE TABLE `dealer_pagination`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(10) NOT NULL,
  `record_per_page` int(10) NOT NULL,
  `type` enum('devices','dealer','sdealer','apk','policies','users') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unq_dlr_id_pg_typ`(`dealer_id`, `type`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_pagination_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 53 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (50, 154, 10, 'sdealer', '2019-06-10 11:36:47', NULL);
INSERT INTO `dealer_pagination` VALUES (51, 154, 10, 'apk', '2019-06-10 11:37:21', NULL);
INSERT INTO `dealer_pagination` VALUES (52, 154, 10, 'policies', '2019-06-10 11:41:07', NULL);

-- ----------------------------
-- Table structure for dealer_policies
-- ----------------------------
DROP TABLE IF EXISTS `dealer_policies`;
CREATE TABLE `dealer_policies`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `policy_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_dealer_id_apk_id`(`dealer_id`, `policy_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 249 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_policies
-- ----------------------------
INSERT INTO `dealer_policies` VALUES (12, 222, 1);
INSERT INTO `dealer_policies` VALUES (150, 222, 2);
INSERT INTO `dealer_policies` VALUES (210, 222, 6);
INSERT INTO `dealer_policies` VALUES (227, 222, 18);
INSERT INTO `dealer_policies` VALUES (243, 222, 19);
INSERT INTO `dealer_policies` VALUES (11, 223, 1);
INSERT INTO `dealer_policies` VALUES (149, 223, 2);
INSERT INTO `dealer_policies` VALUES (209, 223, 6);
INSERT INTO `dealer_policies` VALUES (211, 223, 7);
INSERT INTO `dealer_policies` VALUES (168, 223, 8);
INSERT INTO `dealer_policies` VALUES (226, 223, 18);
INSERT INTO `dealer_policies` VALUES (242, 223, 19);
INSERT INTO `dealer_policies` VALUES (245, 223, 20);
INSERT INTO `dealer_policies` VALUES (248, 223, 21);
INSERT INTO `dealer_policies` VALUES (10, 224, 1);
INSERT INTO `dealer_policies` VALUES (148, 224, 2);
INSERT INTO `dealer_policies` VALUES (208, 224, 6);
INSERT INTO `dealer_policies` VALUES (196, 224, 7);
INSERT INTO `dealer_policies` VALUES (225, 224, 18);
INSERT INTO `dealer_policies` VALUES (241, 224, 19);
INSERT INTO `dealer_policies` VALUES (247, 224, 21);
INSERT INTO `dealer_policies` VALUES (9, 225, 1);
INSERT INTO `dealer_policies` VALUES (147, 225, 2);
INSERT INTO `dealer_policies` VALUES (207, 225, 6);
INSERT INTO `dealer_policies` VALUES (224, 225, 18);
INSERT INTO `dealer_policies` VALUES (240, 225, 19);
INSERT INTO `dealer_policies` VALUES (8, 226, 1);
INSERT INTO `dealer_policies` VALUES (146, 226, 2);
INSERT INTO `dealer_policies` VALUES (206, 226, 6);
INSERT INTO `dealer_policies` VALUES (223, 226, 18);
INSERT INTO `dealer_policies` VALUES (239, 226, 19);
INSERT INTO `dealer_policies` VALUES (7, 227, 1);
INSERT INTO `dealer_policies` VALUES (145, 227, 2);
INSERT INTO `dealer_policies` VALUES (205, 227, 6);
INSERT INTO `dealer_policies` VALUES (222, 227, 18);
INSERT INTO `dealer_policies` VALUES (238, 227, 19);
INSERT INTO `dealer_policies` VALUES (6, 228, 1);
INSERT INTO `dealer_policies` VALUES (144, 228, 2);
INSERT INTO `dealer_policies` VALUES (204, 228, 6);
INSERT INTO `dealer_policies` VALUES (221, 228, 18);
INSERT INTO `dealer_policies` VALUES (237, 228, 19);
INSERT INTO `dealer_policies` VALUES (5, 229, 1);
INSERT INTO `dealer_policies` VALUES (143, 229, 2);
INSERT INTO `dealer_policies` VALUES (203, 229, 6);
INSERT INTO `dealer_policies` VALUES (220, 229, 18);
INSERT INTO `dealer_policies` VALUES (236, 229, 19);
INSERT INTO `dealer_policies` VALUES (4, 230, 1);
INSERT INTO `dealer_policies` VALUES (142, 230, 2);
INSERT INTO `dealer_policies` VALUES (202, 230, 6);
INSERT INTO `dealer_policies` VALUES (219, 230, 18);
INSERT INTO `dealer_policies` VALUES (235, 230, 19);
INSERT INTO `dealer_policies` VALUES (3, 231, 1);
INSERT INTO `dealer_policies` VALUES (141, 231, 2);
INSERT INTO `dealer_policies` VALUES (201, 231, 6);
INSERT INTO `dealer_policies` VALUES (218, 231, 18);
INSERT INTO `dealer_policies` VALUES (234, 231, 19);
INSERT INTO `dealer_policies` VALUES (2, 232, 1);
INSERT INTO `dealer_policies` VALUES (140, 232, 2);
INSERT INTO `dealer_policies` VALUES (200, 232, 6);
INSERT INTO `dealer_policies` VALUES (217, 232, 18);
INSERT INTO `dealer_policies` VALUES (233, 232, 19);
INSERT INTO `dealer_policies` VALUES (24, 233, 1);
INSERT INTO `dealer_policies` VALUES (139, 233, 2);
INSERT INTO `dealer_policies` VALUES (199, 233, 6);
INSERT INTO `dealer_policies` VALUES (216, 233, 18);
INSERT INTO `dealer_policies` VALUES (232, 233, 19);
INSERT INTO `dealer_policies` VALUES (198, 234, 6);
INSERT INTO `dealer_policies` VALUES (215, 234, 18);
INSERT INTO `dealer_policies` VALUES (231, 234, 19);
INSERT INTO `dealer_policies` VALUES (197, 235, 6);
INSERT INTO `dealer_policies` VALUES (214, 235, 18);
INSERT INTO `dealer_policies` VALUES (230, 235, 19);
INSERT INTO `dealer_policies` VALUES (228, 238, 18);
INSERT INTO `dealer_policies` VALUES (244, 238, 19);
INSERT INTO `dealer_policies` VALUES (213, 239, 18);
INSERT INTO `dealer_policies` VALUES (229, 239, 19);

-- ----------------------------
-- Table structure for dealers
-- ----------------------------
DROP TABLE IF EXISTS `dealers`;
CREATE TABLE `dealers`  (
  `dealer_id` int(11) NOT NULL AUTO_INCREMENT,
  `first_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `last_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `connected_dealer` int(11) NOT NULL DEFAULT 0,
  `dealer_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `dealer_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `link_code` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `verified` tinyint(4) NOT NULL DEFAULT 0,
  `verification_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `is_two_factor_auth` tinyint(4) UNSIGNED NOT NULL DEFAULT 0,
  `type` int(4) NOT NULL,
  `unlink_status` tinyint(4) NOT NULL DEFAULT 0,
  `account_status` enum('suspended','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created` datetime(0) NOT NULL,
  `modified` datetime(0) NOT NULL,
  PRIMARY KEY (`dealer_id`) USING BTREE,
  UNIQUE INDEX `unique_email`(`dealer_email`) USING BTREE,
  UNIQUE INDEX `link_code_unique`(`link_code`) USING BTREE,
  INDEX `type`(`type`) USING BTREE,
  INDEX `connected_dealer`(`connected_dealer`) USING BTREE,
  CONSTRAINT `dealers_ibfk_1` FOREIGN KEY (`type`) REFERENCES `user_roles` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 242 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 0, '', 0, 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (238, NULL, NULL, 0, 'Auto Updater', 'autoupdate@gmail.com', '74109cb6586dad2d0510f20dc7a88dbf', NULL, 0, NULL, 0, 4, 0, NULL, '2019-06-04 10:26:44', '2019-06-04 10:26:48');

-- ----------------------------
-- Table structure for default_apps
-- ----------------------------
DROP TABLE IF EXISTS `default_apps`;
CREATE TABLE `default_apps`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `icon` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `extension` tinyint(4) NULL DEFAULT 0,
  `visible` tinyint(4) NOT NULL DEFAULT 1,
  `default_app` tinyint(4) NOT NULL DEFAULT 0,
  `extension_id` int(11) NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 23337 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of default_apps
-- ----------------------------
INSERT INTO `default_apps` VALUES (4649, 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4650, 'com.secureSetting.SecureSettingsMainSecure Settings', 'Secure Settings', 'com.secureSetting.SecureSettingsMain', 'icon_Secure Settings.png', 1, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4651, 'com.android.browserBrowser', 'Browser', 'com.android.browser', 'icon_Browser.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4652, 'com.android.calendarCalendar', 'Calendar', 'com.android.calendar', 'icon_Calendar.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4653, 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4654, 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4655, 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4656, 'com.android.emailEmail', 'Email', 'com.android.email', 'icon_Email.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4657, 'com.android.gallery3dGallery', 'Gallery', 'com.android.gallery3d', 'icon_Gallery.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4658, 'com.android.mmsMessaging', 'Messaging', 'com.android.mms', 'icon_Messaging.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4659, 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', 0, 0, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4661, 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4662, 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4663, 'com.android.quicksearchboxSearch', 'Search', 'com.android.quicksearchbox', 'icon_Search.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4664, 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4665, 'com.mediatek.systemupdateSystem software updates', 'System software updates', 'com.mediatek.systemupdate', 'icon_System software updates.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4666, 'com.rim.mobilefusion.clientUEM Client', 'UEM Client', 'com.rim.mobilefusion.client', 'icon_UEM Client.png', 0, 1, 0, 0, '2019-04-22 12:49:21', NULL);
INSERT INTO `default_apps` VALUES (4668, 'com.secureSetting.SecureSettingsMainSecure SettingsBattery', 'Battery', NULL, 'icon_Battery.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4669, 'com.secureSetting.SecureSettingsMainSecure Settingswi-fi', 'wi-fi', NULL, 'icon_wi-fi.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4670, 'com.secureSetting.SecureSettingsMainSecure SettingsBluetooth', 'Bluetooth', NULL, 'icon_Bluetooth.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4671, 'com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards', 'SIM Cards', NULL, 'icon_SIM Cards.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4672, 'com.secureSetting.SecureSettingsMainSecure SettingsData Roaming', 'Data Roaming', NULL, 'icon_Data Roaming.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4673, 'com.secureSetting.SecureSettingsMainSecure SettingsMobile Data', 'Mobile Data', NULL, 'icon_Mobile Data.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4674, 'com.secureSetting.SecureSettingsMainSecure SettingsHotspot', 'Hotspot', NULL, 'icon_Hotspot.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4675, 'com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock', 'Finger Print + Lock', NULL, 'icon_Finger Print + Lock.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4676, 'com.secureSetting.SecureSettingsMainSecure SettingsBrightness', 'Brightness', NULL, 'icon_Brightness.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4677, 'com.secureSetting.SecureSettingsMainSecure SettingsSleep', 'Sleep', NULL, 'icon_Sleep.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4678, 'com.secureSetting.SecureSettingsMainSecure SettingsSound', 'Sound', NULL, 'icon_Sound.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (4679, 'com.secureSetting.SecureSettingsMainSecure SettingsDate & Time', 'Date & Time', NULL, 'icon_Date & Time.png', 1, 1, 0, 4650, '2019-04-22 12:49:22', NULL);
INSERT INTO `default_apps` VALUES (10121, 'ca.unlimitedwireless.encryptednotesEncrypted Notes', 'Encrypted Notes', 'ca.unlimitedwireless.encryptednotes', 'icon_Encrypted Notes.png', 0, 1, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `default_apps` VALUES (12544, 'com.sec.android.app.clockpackageClock', 'Clock', 'com.sec.android.app.clockpackage', 'icon_Clock.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12545, 'com.sec.android.gallery3dGallery', 'Gallery', 'com.sec.android.gallery3d', 'icon_Gallery.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12547, 'com.samsung.android.contactsContacts', 'Contacts', 'com.samsung.android.contacts', 'icon_Contacts.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12548, 'com.samsung.android.contactsPhone', 'Phone', 'com.samsung.android.contacts', 'icon_Phone.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12549, 'com.samsung.android.messagingMessages', 'Messages', 'com.samsung.android.messaging', 'icon_Messages.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12550, 'com.sec.android.app.cameraCamera', 'Camera', 'com.sec.android.app.camera', 'icon_Camera.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (12551, 'com.google.android.googlequicksearchboxVoice Search', 'Voice Search', 'com.google.android.googlequicksearchbox', 'icon_Voice Search.png', 0, 1, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `default_apps` VALUES (13122, 'com.zonarmr.mtkengineermodeMTK Engineer Mode', 'MTK Engineer Mode', 'com.zonarmr.mtkengineermode', 'icon_MTK Engineer Mode.png', 0, 1, 0, 0, '2019-04-30 08:56:25', NULL);
INSERT INTO `default_apps` VALUES (15610, 'com.android.emailE-mail', 'E-mail', 'com.android.email', 'icon_E-mail.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `default_apps` VALUES (15612, 'com.android.mmsSMS/MMS', 'SMS/MMS', 'com.android.mms', 'icon_SMS/MMS.png', 0, 1, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `default_apps` VALUES (15706, 'com.secureClear.SecureClearActivitySecure Clear', 'Secure Clear', 'com.secureClear.SecureClearActivity', 'icon_Secure Clear.png', 0, 1, 0, 0, '2019-05-01 08:03:46', '2019-05-25 11:59:04');
INSERT INTO `default_apps` VALUES (15926, 'com.secure.systemcontrolSystem Control', 'System Control', 'com.secure.systemcontrol', 'icon_System Control.png', 0, 1, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `default_apps` VALUES (15929, 'com.secureMarket.SecureMarketActivitySecure Market', 'Secure Market', 'com.secureMarket.SecureMarketActivity', 'icon_Secure Market.png', 0, 1, 0, 0, '2019-05-11 04:49:02', '2019-05-25 11:59:04');
INSERT INTO `default_apps` VALUES (19890, 'org.videolan.vlcVLC', 'VLC', 'org.videolan.vlc', 'icon_VLC.png', 0, 0, 0, 0, '2019-05-21 08:18:29', NULL);
INSERT INTO `default_apps` VALUES (21461, 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages', 'Languages', NULL, 'icon_Languages.png', 1, 1, 0, 4650, '2019-05-25 10:38:45', NULL);
INSERT INTO `default_apps` VALUES (21827, 'com.android.cellbroadcastreceiverCell Broadcasts', 'Cell Broadcasts', 'com.android.cellbroadcastreceiver', 'icon_Cell Broadcasts.png', 0, 1, 0, 0, '2019-05-27 09:10:24', NULL);
INSERT INTO `default_apps` VALUES (23212, 'com.secureSetting.SecureSettingsMainSecure SettingsLanguages & Input', 'Languages & Input', NULL, 'icon_Languages & Input.png', 1, 1, 0, 4650, '2019-05-29 19:14:05', NULL);

-- ----------------------------
-- Table structure for default_policies
-- ----------------------------
DROP TABLE IF EXISTS `default_policies`;
CREATE TABLE `default_policies`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `policy_id` int(11) NOT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for device_history
-- ----------------------------
DROP TABLE IF EXISTS `device_history`;
CREATE TABLE `device_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT 0,
  `device_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `dealer_id` int(11) NOT NULL DEFAULT 0,
  `policy_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `push_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `pull_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `imei` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('push_apps','pull_apps','history','imei','policy','force_update','profile') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 135 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `session_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `model` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `ip_address` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `serial_number` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `fcm_token` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `online` enum('online','offline') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'offline',
  `is_sync` tinyint(4) NOT NULL DEFAULT 0,
  `is_push_apps` tinyint(4) NULL DEFAULT 0,
  `flagged` enum('Defective','Lost','Stolen','Other','Not flagged') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'Not flagged',
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 794 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (761, 'EACE961253', 'undefined', NULL, 'null', '192.168.0.157', NULL, '354444076297110', NULL, '354444076297128', 'VSP1001901S00370', '00:27:15:22:AD:74', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-02 20:04:42', '2019-06-10 04:14:09');
INSERT INTO `devices` VALUES (778, 'EEEE144909', 'undefined', 'sW7U0I5i1Ek_JZMEACcM', 'Vsp100 (EU)', '192.168.0.227', '8901260852296619117f', '300844813987599', NULL, NULL, '0123456789ABCDEF', '00:1E:D3:41:79:88', NULL, 'online', 1, 0, 'Not flagged', NULL, 0, '2019-06-03 16:51:55', '2019-06-10 01:12:24');
INSERT INTO `devices` VALUES (779, 'ECAE569003', 'undefined', NULL, 'Vsp100 (EU) (no imei)', '192.168.0.71', NULL, NULL, NULL, NULL, 'OUKIC11000010686', '00:3A:F4:7C:F9:18', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-03 17:02:49', '2019-06-09 06:47:08');
INSERT INTO `devices` VALUES (780, 'EAFA418535', 'undefined', NULL, 'tester', '192.168.31.144', NULL, '505951191664618', NULL, '354444076424243', 'VSP1001904S02686', '00:27:15:CE:7D:7B', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-04 07:58:28', '2019-06-09 17:49:42');
INSERT INTO `devices` VALUES (784, 'CCDB002066', 'undefined', NULL, 'null', '192.168.31.11', NULL, '455296770304917', NULL, '014990923163675', 'VSP200190500001', '00:83:22:FE:E3:6C', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-06 04:51:05', '2019-06-09 11:17:18');
INSERT INTO `devices` VALUES (787, 'BCBD957340', 'undefined', NULL, 'null', '192.168.0.150', '8901260852291397164f', NULL, NULL, NULL, '0123456789ABCDEF', '00:08:2F:55:9D:A6', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-07 09:16:07', '2019-06-08 03:53:01');
INSERT INTO `devices` VALUES (788, 'DABC790128', 'undefined', NULL, 'null', '192.168.0.182', '8901260852291397214f', NULL, NULL, NULL, '0123456789ABCDEF', '00:A5:86:AB:F1:1D', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-07 11:08:16', '2019-06-08 12:17:10');
INSERT INTO `devices` VALUES (789, 'FDDE106484', 'undefined', NULL, 'null', '192.168.0.187', '8901260852291394641f', NULL, NULL, NULL, '0123456789ABCDEF', '00:A9:21:1C:94:23', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-07 12:17:01', '2019-06-07 18:46:26');
INSERT INTO `devices` VALUES (791, 'CBFB073737', 'undefined', NULL, 'null', '192.168.0.103', NULL, NULL, NULL, NULL, '0123456789ABCDEF', '00:6D:8B:A3:57:A5', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-10 05:38:28', '2019-06-10 08:34:05');
INSERT INTO `devices` VALUES (792, 'FEBE718436', 'undefined', NULL, 'Mi ', '10.156.140.228', '8992042306182528795', '355468080559917', NULL, NULL, 'LGH872d603b454', 'DC:0B:34:C4:E4:1C', NULL, 'offline', 0, 0, 'Not flagged', NULL, 0, '2019-06-10 08:43:42', '2019-06-10 09:01:20');
INSERT INTO `devices` VALUES (793, 'DFFB715052', 'undefined', NULL, 'null', '10.155.248.45', '8992042306182528803F', '868598033592605', NULL, '868598033628615', 'FFY5T18117023569', '10:44:00:BA:F3:E2', NULL, 'offline', 1, 0, 'Not flagged', NULL, 0, '2019-06-10 09:37:59', '2019-06-10 09:51:32');

-- ----------------------------
-- Table structure for imei_history
-- ----------------------------
DROP TABLE IF EXISTS `imei_history`;
CREATE TABLE `imei_history`  (
  `id` int(4) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `Serial_number` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `orignal_imei1` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `orignal_imei2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `imei1` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 84 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for login_history
-- ----------------------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(11) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` varchar(11) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `socket_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `token` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `expiresin` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `ip_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `logged_in_client` enum('dealer','admin','device','sdealer') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `type` enum('socket','token') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT 'token',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 407 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pgp_emails
-- ----------------------------
DROP TABLE IF EXISTS `pgp_emails`;
CREATE TABLE `pgp_emails`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pgp_emails`(`pgp_email`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `pgp_emails_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE = InnoDB AUTO_INCREMENT = 195 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (125, NULL, '358GTR@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:19');
INSERT INTO `pgp_emails` VALUES (126, NULL, '599NGT@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:19');
INSERT INTO `pgp_emails` VALUES (127, NULL, '349VFT@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:19');
INSERT INTO `pgp_emails` VALUES (128, NULL, '791BFT@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:20');
INSERT INTO `pgp_emails` VALUES (129, NULL, '1619DKV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:20');
INSERT INTO `pgp_emails` VALUES (130, NULL, '5438DNE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:20');
INSERT INTO `pgp_emails` VALUES (131, NULL, '2675DKN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:21');
INSERT INTO `pgp_emails` VALUES (132, NULL, '3754ZUB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:21');
INSERT INTO `pgp_emails` VALUES (133, NULL, '4338GQG@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-10 11:39:21');
INSERT INTO `pgp_emails` VALUES (134, NULL, '3669NBQ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (135, NULL, '5147DXT@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (136, NULL, '8244SRE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (137, NULL, '5412JJN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (138, NULL, '4134PTE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (139, NULL, '2954PAJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (140, NULL, '6845YAY@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (141, NULL, '7992PFY@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (142, NULL, '4967GCM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (143, NULL, '5373SAJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-31 11:15:24');
INSERT INTO `pgp_emails` VALUES (144, NULL, '1233NPX@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-24 09:20:17');
INSERT INTO `pgp_emails` VALUES (145, NULL, '7921MKT@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (146, NULL, '2188PBW@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (147, NULL, '2535MPM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (148, NULL, '4254PMS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (149, NULL, '4511AXM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (150, NULL, '4437CZC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (151, NULL, '8729YAM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (152, NULL, '7497CXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (153, NULL, '5464NJF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (154, NULL, '6362MBN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (155, NULL, '5752CXB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (156, NULL, '9498NBS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (157, NULL, '3789NZU@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (158, NULL, '9643NZE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (159, NULL, '9347SKJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (160, NULL, '8837ZRE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (161, NULL, '7245BCB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (162, NULL, '9279GBS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (163, NULL, '1747BBV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (164, NULL, '4288DXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:02');
INSERT INTO `pgp_emails` VALUES (165, NULL, '2474VJS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (166, NULL, '1976JSN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (167, NULL, '1879TWV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (168, NULL, '2458VZC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (169, NULL, '1842WKX@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (170, NULL, '5225CHG@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (171, NULL, '4337VZF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-05-16 06:50:05');
INSERT INTO `pgp_emails` VALUES (172, NULL, '5734TXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (173, NULL, '4763XEK@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (174, NULL, '2196GNW@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (175, NULL, '8931APD@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (176, NULL, '8478YXA@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (177, NULL, '9437TPJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (178, NULL, '4347HVE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (179, NULL, '5945VEC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (180, NULL, '2583AUF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (181, NULL, '7574XDR@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (182, NULL, '8497KRA@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (183, NULL, '6497NVE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (184, NULL, '3371GCF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (185, NULL, 'test3@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (186, NULL, 'test6@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (187, NULL, 'test5@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (188, NULL, 'test9@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (189, NULL, 'test7@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (190, NULL, 'test8@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (191, NULL, 'test4@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (192, NULL, 'test1@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (193, NULL, 'test2@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-06-01 12:13:15');
INSERT INTO `pgp_emails` VALUES (194, NULL, '955MNH@TITANSECURE.BIZ', 0, '2019-05-31 12:55:16', '2019-06-10 11:39:41');

-- ----------------------------
-- Table structure for policy
-- ----------------------------
DROP TABLE IF EXISTS `policy`;
CREATE TABLE `policy`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `policy_note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `dealer_type` enum('admin','dealer','sdealer') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `command_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `push_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `dealers` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 22 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for policy_queue_jobs
-- ----------------------------
DROP TABLE IF EXISTS `policy_queue_jobs`;
CREATE TABLE `policy_queue_jobs`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_id` int(11) NOT NULL,
  `device_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `is_in_process` tinyint(4) NULL DEFAULT 0,
  `complete_steps` tinyint(4) NULL DEFAULT 0,
  `push_apps` tinyint(4) NULL DEFAULT 0,
  `permission` tinyint(4) NULL DEFAULT 0,
  `app_list` tinyint(4) NULL DEFAULT 0,
  `controls` tinyint(4) NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for secure_market_apps
-- ----------------------------
DROP TABLE IF EXISTS `secure_market_apps`;
CREATE TABLE `secure_market_apps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apk_id` int(11) NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `dealer_type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `is_restrict_uninstall` tinyint(4) NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `apk_id`(`apk_id`) USING BTREE,
  CONSTRAINT `secure_market_apps_ibfk_1` FOREIGN KEY (`apk_id`) REFERENCES `apk_details` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 891 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for sim_ids
-- ----------------------------
DROP TABLE IF EXISTS `sim_ids`;
CREATE TABLE `sim_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `sim_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `start_date` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `expiry_date` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sim_id_UNIQUE`(`sim_id`) USING BTREE,
  INDEX `device_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `sim_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE SET NULL ON UPDATE SET NULL
) ENGINE = InnoDB AUTO_INCREMENT = 85 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of sim_ids
-- ----------------------------
INSERT INTO `sim_ids` VALUES (1, NULL, '8', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-10 11:40:35');
INSERT INTO `sim_ids` VALUES (2, NULL, '9', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (3, NULL, '10', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (4, NULL, '1', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-10 11:40:36');
INSERT INTO `sim_ids` VALUES (5, NULL, '2', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-10 11:40:37');
INSERT INTO `sim_ids` VALUES (6, NULL, '5', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (7, NULL, '4', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (8, NULL, '6', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (9, NULL, '11', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (10, NULL, '7', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (11, NULL, '3', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (12, NULL, '12', 0, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (61, NULL, '13', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:28:19', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (63, NULL, '21', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:28:19', '2019-06-10 11:40:40');
INSERT INTO `sim_ids` VALUES (74, NULL, '5345', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (77, NULL, '1231231', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (78, NULL, '123123', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-06-10 11:40:41');
INSERT INTO `sim_ids` VALUES (79, NULL, '1233332', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-06-01 12:13:44');
INSERT INTO `sim_ids` VALUES (83, NULL, '3345', 0, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-06-10 11:40:41');

-- ----------------------------
-- Table structure for transferred_profiles
-- ----------------------------
DROP TABLE IF EXISTS `transferred_profiles`;
CREATE TABLE `transferred_profiles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `connected_dealer` int(11) NOT NULL DEFAULT 0,
  `chat_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `client_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `device_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `session_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `link_code` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `model` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `ip_address` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `sim_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `sim_id2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `simno2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `imei2` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `serial_number` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `mac_address` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `s_dealer` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `s_dealer_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account` varchar(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `fcm_token` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `activation_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `activation_status` tinyint(4) NULL DEFAULT NULL,
  `online` enum('On','off') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'off',
  `device_status` tinyint(4) NOT NULL DEFAULT 0,
  `is_sync` tinyint(4) NOT NULL DEFAULT 0,
  `status` enum('expired','active','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'active',
  `account_status` enum('suspended','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT 0,
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `expiry_months` int(100) NULL DEFAULT NULL,
  `expiry_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_app_permissions
-- ----------------------------
DROP TABLE IF EXISTS `user_app_permissions`;
CREATE TABLE `user_app_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_setting_id`(`device_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3244 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_apps
-- ----------------------------
DROP TABLE IF EXISTS `user_apps`;
CREATE TABLE `user_apps`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `device_id` int(50) NOT NULL,
  `app_id` int(10) NOT NULL,
  `guest` tinyint(4) NOT NULL DEFAULT 0,
  `encrypted` tinyint(4) NOT NULL DEFAULT 0,
  `enable` tinyint(4) NOT NULL DEFAULT 0,
  `extension` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `primary_key`(`id`) USING BTREE,
  UNIQUE INDEX `user_unique_apps`(`device_id`, `app_id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `app_id`(`app_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12509 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (2001, 695, 4662, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2002, 695, 4657, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2003, 695, 4649, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2004, 695, 4664, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2005, 695, 4661, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2006, 695, 4665, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2007, 695, 4656, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2008, 695, 4655, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2009, 695, 4650, 1, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2010, 695, 16445, 0, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2011, 695, 15926, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2012, 695, 4666, 0, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2013, 695, 4658, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2014, 695, 15929, 1, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2015, 695, 15706, 0, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2016, 695, 4668, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2017, 695, 4671, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2018, 695, 4674, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2019, 695, 4670, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2020, 695, 4672, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2021, 695, 4673, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2022, 695, 4669, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2023, 695, 4675, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2024, 695, 4677, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2025, 695, 4676, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2026, 695, 4679, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2027, 695, 4678, 0, 0, 1, 0, '2019-05-14 12:08:42', NULL);
INSERT INTO `user_apps` VALUES (2028, 697, 4658, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2029, 697, 4649, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2030, 697, 4654, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2031, 697, 4653, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2032, 697, 4656, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2033, 697, 4659, 1, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2034, 697, 4652, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2035, 697, 4655, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2036, 697, 4657, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2037, 697, 4651, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2038, 697, 4660, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2039, 697, 4650, 1, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2040, 697, 16445, 0, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2041, 697, 15926, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2042, 697, 4662, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2043, 697, 4665, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2044, 697, 4666, 0, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2045, 697, 4664, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2046, 697, 4663, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2047, 697, 4661, 1, 1, 0, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2048, 697, 15706, 0, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2049, 697, 15929, 1, 1, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2050, 697, 4668, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2051, 697, 4669, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2052, 697, 4674, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2053, 697, 4670, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2054, 697, 4671, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2055, 697, 4672, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2056, 697, 4675, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2057, 697, 4673, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2058, 697, 4676, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2059, 697, 4678, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2060, 697, 4677, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2061, 697, 4679, 0, 0, 1, 0, '2019-05-14 12:13:46', NULL);
INSERT INTO `user_apps` VALUES (2062, 699, 4656, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2063, 699, 4651, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2064, 699, 4653, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2065, 699, 4652, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2066, 699, 4655, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2067, 699, 4654, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2068, 699, 4659, 1, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2069, 699, 4661, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2070, 699, 4660, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2071, 699, 4657, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2072, 699, 4658, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2073, 699, 4662, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2074, 699, 4649, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2075, 699, 4663, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2076, 699, 4664, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2077, 699, 4665, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2078, 699, 15926, 1, 1, 0, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2079, 699, 16445, 0, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2080, 699, 4666, 0, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2081, 699, 15929, 1, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2082, 699, 4650, 1, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2083, 699, 15706, 0, 1, 1, 0, '2019-05-14 12:28:23', NULL);
INSERT INTO `user_apps` VALUES (2084, 699, 4668, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2085, 699, 4669, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2086, 699, 4670, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2087, 699, 4675, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2088, 699, 4671, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2089, 699, 4672, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2090, 699, 4673, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2091, 699, 4674, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2092, 699, 4676, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2093, 699, 4679, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2094, 699, 4678, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2095, 699, 4677, 0, 0, 1, 0, '2019-05-14 12:28:24', NULL);
INSERT INTO `user_apps` VALUES (2708, 708, 4649, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2709, 708, 4655, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2710, 708, 4659, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2711, 708, 4653, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2712, 708, 4658, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2713, 708, 4654, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2714, 708, 4656, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2715, 708, 4661, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2716, 708, 4660, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2717, 708, 4663, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2718, 708, 4657, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2719, 708, 4666, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2720, 708, 4665, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2721, 708, 4664, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2722, 708, 4662, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2723, 708, 4652, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2724, 708, 9686, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2725, 708, 4650, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2726, 708, 4651, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2727, 708, 15706, 0, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2728, 708, 15929, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2729, 708, 16067, 1, 1, 1, 0, '2019-05-15 13:10:38', NULL);
INSERT INTO `user_apps` VALUES (2730, 708, 4677, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2731, 708, 4670, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2732, 708, 4674, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2733, 708, 4669, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2734, 708, 4668, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2735, 708, 4672, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2736, 708, 4673, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2737, 708, 4676, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2738, 708, 4679, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2739, 708, 4675, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2740, 708, 4671, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2741, 708, 4678, 0, 0, 1, 0, '2019-05-15 13:10:40', NULL);
INSERT INTO `user_apps` VALUES (2928, 700, 4654, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2929, 700, 4652, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2930, 700, 4653, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2931, 700, 4651, 1, 1, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2932, 700, 4656, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2933, 700, 4649, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2934, 700, 4657, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2935, 700, 4659, 1, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2936, 700, 4660, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2937, 700, 4664, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2938, 700, 4663, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2939, 700, 4658, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2940, 700, 4665, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2941, 700, 4666, 0, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2942, 700, 4655, 1, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2943, 700, 4662, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2944, 700, 4661, 1, 0, 0, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2945, 700, 4650, 1, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2946, 700, 15706, 0, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2947, 700, 9686, 0, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2948, 700, 15929, 1, 1, 1, 0, '2019-05-16 06:52:35', NULL);
INSERT INTO `user_apps` VALUES (2949, 700, 4668, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2950, 700, 4669, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2951, 700, 4676, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2952, 700, 4672, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2953, 700, 4674, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2954, 700, 4670, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2955, 700, 4677, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2956, 700, 4675, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2957, 700, 4671, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2958, 700, 4673, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2959, 700, 4678, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (2960, 700, 4679, 0, 0, 1, 0, '2019-05-16 06:52:36', NULL);
INSERT INTO `user_apps` VALUES (3949, 711, 4649, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3950, 711, 4657, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3951, 711, 4653, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3952, 711, 4654, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3953, 711, 4652, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3954, 711, 4658, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3955, 711, 4655, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3956, 711, 4651, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3957, 711, 4656, 1, 1, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3958, 711, 4663, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3959, 711, 4664, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3960, 711, 9686, 0, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3961, 711, 4662, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3962, 711, 4666, 0, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3963, 711, 4659, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3964, 711, 4665, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3965, 711, 4650, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3966, 711, 4661, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3967, 711, 15706, 0, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3968, 711, 15929, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3969, 711, 17626, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3970, 711, 16067, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3971, 711, 18398, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3972, 711, 4660, 1, 0, 0, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3973, 711, 18288, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3974, 711, 18547, 1, 1, 1, 0, '2019-05-16 08:43:35', NULL);
INSERT INTO `user_apps` VALUES (3975, 711, 4668, 1, 1, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3976, 711, 4677, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3977, 711, 4674, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3978, 711, 4678, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3979, 711, 4676, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3980, 711, 4671, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3981, 711, 4675, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3982, 711, 4672, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3983, 711, 4679, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3984, 711, 4673, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3985, 711, 4669, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (3986, 711, 4670, 0, 0, 1, 0, '2019-05-16 08:43:36', NULL);
INSERT INTO `user_apps` VALUES (4020, 715, 4656, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4021, 715, 4657, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4022, 715, 4658, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4023, 715, 4654, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4024, 715, 4653, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4025, 715, 4649, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4026, 715, 4651, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4027, 715, 4660, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4028, 715, 4652, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4029, 715, 4661, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4030, 715, 4665, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4031, 715, 4664, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4032, 715, 4666, 0, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4033, 715, 4655, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4034, 715, 4662, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4035, 715, 15929, 1, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4036, 715, 4663, 1, 0, 0, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4037, 715, 4659, 1, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4038, 715, 4670, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4039, 715, 9686, 0, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4040, 715, 4672, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4041, 715, 4671, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4042, 715, 15706, 0, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4043, 715, 4650, 1, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4044, 715, 4676, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4045, 715, 4677, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4046, 715, 4678, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4047, 715, 4669, 1, 1, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4048, 715, 4675, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4049, 715, 4679, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4050, 715, 4673, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4051, 715, 4674, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4052, 715, 4668, 0, 0, 1, 0, '2019-05-16 10:28:03', NULL);
INSERT INTO `user_apps` VALUES (4053, 716, 4652, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4054, 716, 4654, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4055, 716, 4651, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4056, 716, 4655, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4057, 716, 4658, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4058, 716, 4659, 1, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4059, 716, 4653, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4060, 716, 4657, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4061, 716, 4656, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4062, 716, 4661, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4063, 716, 4664, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4064, 716, 4665, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4065, 716, 4649, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4066, 716, 4663, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4067, 716, 9686, 0, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4068, 716, 4650, 1, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4069, 716, 4662, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4070, 716, 4666, 0, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4071, 716, 4660, 1, 0, 0, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4072, 716, 15706, 0, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4073, 716, 15929, 1, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4074, 716, 4668, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4075, 716, 4671, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4076, 716, 4670, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4077, 716, 4672, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4078, 716, 4673, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4079, 716, 4669, 1, 1, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4080, 716, 4674, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4081, 716, 4679, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4082, 716, 4676, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4083, 716, 4677, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4084, 716, 4678, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4085, 716, 4675, 0, 0, 1, 0, '2019-05-16 10:37:56', NULL);
INSERT INTO `user_apps` VALUES (4504, 720, 4652, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4505, 720, 4649, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4506, 720, 4653, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4507, 720, 4658, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4508, 720, 4659, 1, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4509, 720, 4660, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4510, 720, 4662, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4511, 720, 4664, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4512, 720, 4661, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4513, 720, 4663, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4514, 720, 4666, 0, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4515, 720, 4656, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4516, 720, 4665, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4517, 720, 16445, 0, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4518, 720, 4651, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4519, 720, 4655, 1, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4520, 720, 4654, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4521, 720, 4657, 1, 0, 0, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4522, 720, 4650, 1, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4523, 720, 15706, 0, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4524, 720, 15929, 1, 1, 1, 0, '2019-05-18 04:59:07', NULL);
INSERT INTO `user_apps` VALUES (4525, 720, 4671, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4526, 720, 4676, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4527, 720, 4668, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4528, 720, 4673, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4529, 720, 4672, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4530, 720, 4674, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4531, 720, 4677, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4532, 720, 4679, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4533, 720, 4678, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4534, 720, 4670, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4535, 720, 4675, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4536, 720, 4669, 0, 0, 1, 0, '2019-05-18 04:59:16', NULL);
INSERT INTO `user_apps` VALUES (4588, 722, 4660, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4589, 722, 4656, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4590, 722, 4661, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4591, 722, 4649, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4592, 722, 4659, 1, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4593, 722, 4664, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4594, 722, 4652, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4595, 722, 4653, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4596, 722, 4657, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4597, 722, 4658, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4598, 722, 4666, 0, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4599, 722, 4665, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4600, 722, 4654, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4601, 722, 9686, 0, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4602, 722, 15929, 1, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4603, 722, 15706, 0, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4604, 722, 4663, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4605, 722, 4662, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4606, 722, 4651, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4607, 722, 4650, 1, 1, 1, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4608, 722, 4655, 1, 0, 0, 0, '2019-05-20 12:50:12', NULL);
INSERT INTO `user_apps` VALUES (4609, 722, 4672, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4610, 722, 4669, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4611, 722, 4671, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4612, 722, 4677, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4613, 722, 4675, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4614, 722, 4674, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4615, 722, 4673, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4616, 722, 4668, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4617, 722, 4670, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4618, 722, 19254, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4619, 722, 4679, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4620, 722, 4678, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4621, 722, 4676, 0, 0, 1, 0, '2019-05-20 12:50:13', NULL);
INSERT INTO `user_apps` VALUES (4796, 723, 4649, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4797, 723, 4654, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4798, 723, 4651, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4799, 723, 4652, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4800, 723, 4658, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4801, 723, 4655, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4802, 723, 4657, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4803, 723, 4656, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4804, 723, 4659, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4805, 723, 4653, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4806, 723, 4662, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4807, 723, 4664, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4808, 723, 4663, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4809, 723, 4666, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4810, 723, 9686, 0, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4811, 723, 4660, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4812, 723, 4650, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4813, 723, 4661, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4814, 723, 15929, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4815, 723, 15706, 0, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4816, 723, 4665, 0, 0, 0, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4817, 723, 18288, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4818, 723, 18398, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4819, 723, 17626, 1, 1, 1, 0, '2019-05-20 13:36:24', NULL);
INSERT INTO `user_apps` VALUES (4820, 723, 4670, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4821, 723, 4672, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4822, 723, 4671, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4823, 723, 4673, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4824, 723, 4669, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4825, 723, 4676, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4826, 723, 4675, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4827, 723, 4679, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4828, 723, 4677, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4829, 723, 4674, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4830, 723, 4678, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (4831, 723, 4668, 0, 0, 1, 0, '2019-05-20 13:36:25', NULL);
INSERT INTO `user_apps` VALUES (5154, 726, 4649, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5155, 726, 4652, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5156, 726, 4653, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5157, 726, 4657, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5158, 726, 4656, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5159, 726, 4655, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5160, 726, 4654, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5161, 726, 4651, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5162, 726, 4659, 1, 1, 1, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5163, 726, 4660, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5164, 726, 4662, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5165, 726, 4664, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5166, 726, 4665, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5167, 726, 4658, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5168, 726, 4666, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5169, 726, 4650, 1, 1, 1, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5170, 726, 4661, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5171, 726, 9686, 0, 1, 1, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5172, 726, 15706, 0, 1, 1, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5173, 726, 4663, 0, 0, 0, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5174, 726, 15929, 1, 1, 1, 0, '2019-05-21 04:26:32', NULL);
INSERT INTO `user_apps` VALUES (5175, 726, 4672, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5176, 726, 4674, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5177, 726, 4668, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5178, 726, 4670, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5179, 726, 4671, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5180, 726, 4673, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5181, 726, 4675, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5182, 726, 4676, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5183, 726, 4677, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5184, 726, 4679, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5185, 726, 4678, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5186, 726, 4669, 0, 0, 1, 0, '2019-05-21 04:26:33', NULL);
INSERT INTO `user_apps` VALUES (5685, 721, 4651, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5686, 721, 4654, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5687, 721, 4652, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5688, 721, 4658, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5689, 721, 4655, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5690, 721, 4649, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5691, 721, 4656, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5692, 721, 4653, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5693, 721, 4657, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5694, 721, 15706, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5695, 721, 16445, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5696, 721, 4665, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5697, 721, 4664, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5698, 721, 4663, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5699, 721, 4661, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5700, 721, 4660, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5701, 721, 4666, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5702, 721, 15929, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5703, 721, 4662, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5704, 721, 4659, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5705, 721, 4650, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5706, 721, 4668, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5707, 721, 4670, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5708, 721, 4669, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5709, 721, 4674, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5710, 721, 4672, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5711, 721, 4676, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5712, 721, 19254, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5713, 721, 4678, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5714, 721, 4671, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5715, 721, 4675, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5716, 721, 4673, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5717, 721, 4677, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5718, 721, 4679, 1, 1, 1, 0, '2019-05-21 16:10:20', NULL);
INSERT INTO `user_apps` VALUES (5911, 725, 4653, 1, 0, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5912, 725, 4658, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5913, 725, 4657, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5914, 725, 4655, 1, 0, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5915, 725, 4659, 0, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5916, 725, 4660, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5917, 725, 4656, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5918, 725, 4651, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5919, 725, 4649, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5920, 725, 4654, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5921, 725, 4661, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5922, 725, 4665, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5923, 725, 4652, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5924, 725, 4662, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5925, 725, 4663, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5926, 725, 9686, 0, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5927, 725, 4666, 0, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5928, 725, 4664, 1, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5929, 725, 15706, 0, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5930, 725, 15929, 1, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5931, 725, 18547, 0, 0, 0, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5932, 725, 4650, 0, 1, 1, 0, '2019-05-21 20:27:20', NULL);
INSERT INTO `user_apps` VALUES (5933, 725, 4668, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5934, 725, 4673, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5935, 725, 4669, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5936, 725, 4674, 0, 0, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5937, 725, 4671, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5938, 725, 4677, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5939, 725, 4678, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5940, 725, 4672, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5941, 725, 4675, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5942, 725, 4676, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5943, 725, 4670, 0, 0, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5944, 725, 4679, 0, 1, 1, 0, '2019-05-21 20:27:21', NULL);
INSERT INTO `user_apps` VALUES (5945, 718, 4658, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5946, 718, 4652, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5947, 718, 4654, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5948, 718, 4656, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5949, 718, 4649, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5950, 718, 4653, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5951, 718, 4655, 1, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5952, 718, 4657, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5953, 718, 4651, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5954, 718, 4659, 1, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5955, 718, 4650, 1, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5956, 718, 4661, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5957, 718, 4666, 0, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5958, 718, 9686, 0, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5959, 718, 4664, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5960, 718, 4663, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5961, 718, 4660, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5962, 718, 4662, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5963, 718, 4665, 1, 0, 0, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5964, 718, 15706, 0, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5965, 718, 15929, 1, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5966, 718, 20722, 1, 1, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5967, 718, 4669, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5968, 718, 4671, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5969, 718, 4674, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5970, 718, 4673, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5971, 718, 4675, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5972, 718, 4677, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5973, 718, 4670, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5974, 718, 4678, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5975, 718, 4679, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5976, 718, 4676, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5977, 718, 4672, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (5978, 718, 4668, 0, 0, 1, 0, '2019-05-22 06:22:14', NULL);
INSERT INTO `user_apps` VALUES (6029, 709, 4651, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6030, 709, 4658, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6031, 709, 4652, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6032, 709, 4649, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6033, 709, 4655, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6034, 709, 4656, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6035, 709, 4654, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6036, 709, 4659, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6037, 709, 4657, 1, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6038, 709, 4661, 1, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6039, 709, 4653, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6040, 709, 9686, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6041, 709, 4665, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6042, 709, 4666, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6043, 709, 4663, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6044, 709, 4650, 1, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6045, 709, 4664, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6046, 709, 4662, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6047, 709, 4660, 1, 0, 0, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6048, 709, 15706, 1, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6049, 709, 18547, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6050, 709, 15929, 1, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6051, 709, 19890, 0, 1, 1, 0, '2019-05-22 11:52:28', NULL);
INSERT INTO `user_apps` VALUES (6052, 709, 4671, 1, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6053, 709, 4675, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6054, 709, 4669, 1, 0, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6055, 709, 4668, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6056, 709, 4676, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6057, 709, 4672, 1, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6058, 709, 4674, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6059, 709, 4670, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6060, 709, 4678, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6061, 709, 4677, 0, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6062, 709, 4679, 1, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6063, 709, 4673, 1, 1, 1, 0, '2019-05-22 11:52:30', NULL);
INSERT INTO `user_apps` VALUES (6220, 738, 4653, 1, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6221, 738, 4658, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6222, 738, 4656, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6223, 738, 4657, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6224, 738, 4652, 1, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6225, 738, 4651, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6226, 738, 4649, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6227, 738, 4655, 1, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6228, 738, 4654, 1, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6229, 738, 4666, 0, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6230, 738, 4659, 0, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6231, 738, 4660, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6232, 738, 10116, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6233, 738, 4663, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6234, 738, 10121, 0, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6235, 738, 4662, 1, 0, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6236, 738, 4664, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6237, 738, 4661, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6238, 738, 4665, 1, 0, 0, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6239, 738, 9684, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6240, 738, 10118, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6241, 738, 20863, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6242, 738, 15706, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6243, 738, 4650, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6244, 738, 9686, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6245, 738, 15929, 0, 1, 1, 0, '2019-05-24 00:45:51', NULL);
INSERT INTO `user_apps` VALUES (6246, 738, 4670, 0, 0, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6247, 738, 4677, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6248, 738, 4675, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6249, 738, 4669, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6250, 738, 4673, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6251, 738, 4668, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6252, 738, 4672, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6253, 738, 4676, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6254, 738, 4674, 0, 0, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6255, 738, 4671, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6256, 738, 4678, 0, 1, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6257, 738, 19254, 0, 0, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6258, 738, 4679, 0, 0, 1, 0, '2019-05-24 00:45:52', NULL);
INSERT INTO `user_apps` VALUES (6298, 739, 4649, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6299, 739, 4654, 1, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6300, 739, 4653, 1, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6301, 739, 4657, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6302, 739, 4655, 1, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6303, 739, 4651, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6304, 739, 4652, 1, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6305, 739, 4656, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6306, 739, 4658, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6307, 739, 4659, 0, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6308, 739, 4660, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6309, 739, 4662, 1, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6310, 739, 4666, 0, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6311, 739, 4663, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6312, 739, 10116, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6313, 739, 4664, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6314, 739, 10121, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6315, 739, 4661, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6316, 739, 4665, 1, 0, 0, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6317, 739, 20863, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6318, 739, 9684, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6319, 739, 9686, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6320, 739, 4650, 1, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6321, 739, 15706, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6322, 739, 15929, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6323, 739, 10118, 0, 1, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6324, 739, 4668, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6325, 739, 4669, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6326, 739, 4672, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6327, 739, 4673, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6328, 739, 4676, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6329, 739, 4671, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6330, 739, 4678, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6331, 739, 4670, 0, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6332, 739, 4675, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6333, 739, 4674, 0, 0, 1, 0, '2019-05-24 00:48:26', NULL);
INSERT INTO `user_apps` VALUES (6334, 739, 4679, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6335, 739, 4677, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6336, 739, 19254, 0, 1, 1, 0, '2019-05-24 00:48:26', '2019-05-24 00:48:44');
INSERT INTO `user_apps` VALUES (6376, 740, 4658, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6377, 740, 4653, 1, 0, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6378, 740, 4660, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6379, 740, 4649, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6380, 740, 4656, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6381, 740, 4661, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6382, 740, 4651, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6383, 740, 4662, 1, 0, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6384, 740, 4659, 0, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6385, 740, 4664, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6386, 740, 4654, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6387, 740, 10121, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6388, 740, 4652, 1, 0, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6389, 740, 4666, 0, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6390, 740, 10116, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6391, 740, 4663, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6392, 740, 4655, 1, 0, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6393, 740, 4665, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6394, 740, 4657, 1, 0, 0, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6395, 740, 9686, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6396, 740, 4650, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6397, 740, 15706, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6398, 740, 15929, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6399, 740, 9684, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6400, 740, 10118, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6401, 740, 20863, 0, 1, 1, 0, '2019-05-24 00:56:52', NULL);
INSERT INTO `user_apps` VALUES (6402, 740, 4669, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6403, 740, 4675, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6404, 740, 4670, 0, 0, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6405, 740, 4673, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6406, 740, 4672, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6407, 740, 4676, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6408, 740, 4674, 0, 0, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6409, 740, 4671, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6410, 740, 4668, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6411, 740, 4678, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6412, 740, 4677, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6413, 740, 4679, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6414, 740, 19254, 0, 1, 1, 0, '2019-05-24 00:56:53', NULL);
INSERT INTO `user_apps` VALUES (6454, 741, 4652, 1, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6455, 741, 4649, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6456, 741, 4651, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6457, 741, 4655, 1, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6458, 741, 4658, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6459, 741, 4659, 0, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6460, 741, 4654, 1, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6461, 741, 4653, 1, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6462, 741, 4657, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6463, 741, 4656, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6464, 741, 4661, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6465, 741, 4665, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6466, 741, 10121, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6467, 741, 9684, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6468, 741, 10118, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6469, 741, 4664, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6470, 741, 4663, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6471, 741, 4660, 1, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6472, 741, 20863, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6473, 741, 4662, 1, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6474, 741, 10116, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6475, 741, 9686, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6476, 741, 4666, 0, 0, 0, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6477, 741, 4650, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6478, 741, 15706, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6479, 741, 15929, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6480, 741, 4673, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6481, 741, 4670, 0, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6482, 741, 4671, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6483, 741, 4672, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6484, 741, 4669, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6485, 741, 4677, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6486, 741, 4679, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6487, 741, 4675, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6488, 741, 4678, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6489, 741, 4668, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6490, 741, 19254, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6491, 741, 4674, 0, 0, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6492, 741, 4676, 0, 1, 1, 0, '2019-05-24 01:15:28', NULL);
INSERT INTO `user_apps` VALUES (6532, 742, 4649, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6533, 742, 4651, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6534, 742, 4653, 1, 0, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6535, 742, 4656, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6536, 742, 4655, 1, 0, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6537, 742, 4657, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6538, 742, 4658, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6539, 742, 4663, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6540, 742, 4654, 1, 0, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6541, 742, 4662, 1, 0, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6542, 742, 4659, 0, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6543, 742, 4661, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6544, 742, 4660, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6545, 742, 4664, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6546, 742, 10121, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6547, 742, 4652, 1, 0, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6548, 742, 4665, 1, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6549, 742, 4666, 0, 0, 0, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6550, 742, 10116, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6551, 742, 9686, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6552, 742, 15929, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6553, 742, 10118, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6554, 742, 9684, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6555, 742, 20863, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6556, 742, 15706, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6557, 742, 4650, 0, 1, 1, 0, '2019-05-24 01:29:26', NULL);
INSERT INTO `user_apps` VALUES (6558, 742, 4669, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6559, 742, 4671, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6560, 742, 4668, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6561, 742, 4675, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6562, 742, 4677, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6563, 742, 4676, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6564, 742, 4674, 0, 0, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6565, 742, 4672, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6566, 742, 4670, 0, 0, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6567, 742, 4673, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6568, 742, 4678, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6569, 742, 4679, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6570, 742, 19254, 0, 1, 1, 0, '2019-05-24 01:29:27', NULL);
INSERT INTO `user_apps` VALUES (6849, 727, 4652, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6850, 727, 4658, 1, 1, 0, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6851, 727, 4649, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6852, 727, 4653, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6853, 727, 4654, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6854, 727, 4664, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6855, 727, 4660, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6856, 727, 4662, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6857, 727, 4666, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6858, 727, 4656, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6859, 727, 4655, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6860, 727, 4651, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6861, 727, 4657, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6862, 727, 4659, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6863, 727, 4663, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6864, 727, 4661, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6865, 727, 15706, 0, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6866, 727, 4650, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6867, 727, 4665, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6868, 727, 17626, 0, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6869, 727, 15929, 0, 0, 0, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6870, 727, 9686, 1, 1, 1, 0, '2019-05-25 23:03:38', NULL);
INSERT INTO `user_apps` VALUES (6871, 727, 4672, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6872, 727, 4671, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6873, 727, 4676, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6874, 727, 4673, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6875, 727, 4674, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6876, 727, 4678, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6877, 727, 4669, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6878, 727, 4679, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6879, 727, 4677, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6880, 727, 4675, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6881, 727, 4670, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (6882, 727, 4668, 0, 0, 1, 0, '2019-05-25 23:03:39', NULL);
INSERT INTO `user_apps` VALUES (7797, 746, 4654, 1, 0, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7798, 746, 4655, 1, 0, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7799, 746, 4651, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7800, 746, 4653, 1, 0, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7801, 746, 4649, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7802, 746, 4652, 1, 0, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7803, 746, 4657, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7804, 746, 4658, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7805, 746, 4656, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7806, 746, 4660, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7807, 746, 4662, 1, 0, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7808, 746, 4659, 0, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7809, 746, 4661, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7810, 746, 4666, 0, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7811, 746, 10116, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7812, 746, 4663, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7813, 746, 4664, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7814, 746, 4665, 1, 0, 0, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7815, 746, 10121, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7816, 746, 9684, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7817, 746, 20863, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7818, 746, 9686, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7819, 746, 15929, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7820, 746, 4650, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7821, 746, 10118, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7822, 746, 15706, 0, 1, 1, 0, '2019-05-28 14:16:05', NULL);
INSERT INTO `user_apps` VALUES (7823, 746, 4673, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7824, 746, 4677, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7825, 746, 4672, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7826, 746, 4670, 0, 0, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7827, 746, 4675, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7828, 746, 4678, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7829, 746, 4668, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7830, 746, 4669, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7831, 746, 4674, 0, 0, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7832, 746, 19254, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7833, 746, 4676, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7834, 746, 4671, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (7835, 746, 4679, 0, 1, 1, 0, '2019-05-28 14:16:06', NULL);
INSERT INTO `user_apps` VALUES (8053, 745, 4651, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8054, 745, 4653, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8055, 745, 4655, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8056, 745, 4656, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8057, 745, 4654, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8058, 745, 4657, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8059, 745, 4652, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8060, 745, 4660, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8061, 745, 9684, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8062, 745, 4661, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8063, 745, 4662, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8064, 745, 4663, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8065, 745, 4658, 1, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8066, 745, 4649, 1, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8067, 745, 10116, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8068, 745, 9686, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8069, 745, 4666, 0, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8070, 745, 15706, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8071, 745, 21827, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8072, 745, 20863, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8073, 745, 4665, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8074, 745, 10121, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8075, 745, 10118, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8076, 745, 4650, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8077, 745, 15929, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8078, 745, 4659, 0, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8079, 745, 4664, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8080, 745, 21830, 1, 0, 0, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8081, 745, 4671, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8082, 745, 4673, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8083, 745, 4670, 0, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8084, 745, 4672, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8085, 745, 4678, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8086, 745, 4669, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8087, 745, 4674, 0, 0, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8088, 745, 4676, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8089, 745, 19254, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8090, 745, 4679, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8091, 745, 4668, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8092, 745, 4675, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8093, 745, 4677, 0, 1, 1, 0, '2019-05-29 08:55:04', NULL);
INSERT INTO `user_apps` VALUES (8199, 725, 23212, 0, 1, 1, 0, '2019-05-29 19:14:05', NULL);
INSERT INTO `user_apps` VALUES (8200, 725, 23213, 0, 1, 1, 0, '2019-05-29 19:14:05', NULL);
INSERT INTO `user_apps` VALUES (8287, 749, 4649, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8288, 749, 4652, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8289, 749, 4651, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8290, 749, 4654, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8291, 749, 4656, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8292, 749, 4653, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8293, 749, 4658, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8294, 749, 4657, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8295, 749, 4655, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8296, 749, 4660, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8297, 749, 4662, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8298, 749, 4663, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8299, 749, 9686, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8300, 749, 4661, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8301, 749, 4665, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8302, 749, 22049, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8303, 749, 4666, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8304, 749, 15929, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8305, 749, 15706, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8306, 749, 4664, 1, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8307, 749, 4650, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8308, 749, 4659, 0, 0, 0, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8309, 749, 4672, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8310, 749, 4668, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8311, 749, 4669, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8312, 749, 4673, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8313, 749, 4677, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8314, 749, 4676, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8315, 749, 4679, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8316, 749, 23212, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8317, 749, 4678, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8318, 749, 23213, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8319, 749, 4670, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8320, 749, 4675, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8321, 749, 4671, 1, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8322, 749, 4674, 0, 1, 1, 0, '2019-05-30 04:17:45', NULL);
INSERT INTO `user_apps` VALUES (8689, 743, 4658, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8690, 743, 4651, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8691, 743, 4653, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8692, 743, 4655, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8693, 743, 4649, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8694, 743, 4661, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8695, 743, 4657, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8696, 743, 4654, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8697, 743, 4660, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8698, 743, 4656, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8699, 743, 4666, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8700, 743, 4652, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8701, 743, 4662, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8702, 743, 4664, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8703, 743, 4663, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8704, 743, 9684, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8705, 743, 4659, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8706, 743, 4650, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8707, 743, 15706, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8708, 743, 4665, 1, 0, 0, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8709, 743, 9686, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8710, 743, 15929, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8711, 743, 22049, 1, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8712, 743, 4668, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8713, 743, 4677, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8714, 743, 4669, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8715, 743, 4671, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8716, 743, 4672, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8717, 743, 4676, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8718, 743, 4674, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8719, 743, 4673, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8720, 743, 4679, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8721, 743, 4675, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8722, 743, 4678, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8723, 743, 4670, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8724, 743, 23213, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8725, 743, 23212, 0, 1, 1, 0, '2019-05-30 15:12:21', NULL);
INSERT INTO `user_apps` VALUES (8726, 958, 4656, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8727, 958, 4660, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8728, 958, 4655, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8729, 958, 4651, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8730, 958, 23787, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8731, 958, 4662, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8732, 958, 4654, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8733, 958, 4658, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8734, 958, 4649, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8735, 958, 4657, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8736, 958, 22049, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8737, 958, 4652, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8738, 958, 4653, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8739, 958, 4659, 0, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8740, 958, 4661, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8741, 958, 4663, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8742, 958, 23795, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8743, 958, 4664, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8744, 958, 15929, 1, 1, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8745, 958, 4665, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8746, 958, 20722, 1, 0, 0, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8747, 958, 15706, 0, 1, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8748, 958, 16445, 0, 1, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8749, 958, 4650, 1, 1, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8750, 958, 4666, 0, 1, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8751, 958, 4676, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8752, 958, 4672, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8753, 958, 4669, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8754, 958, 4678, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8755, 958, 23213, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8756, 958, 4668, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8757, 958, 4673, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8758, 958, 4677, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8759, 958, 23212, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8760, 958, 4671, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8761, 958, 4670, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8762, 958, 4674, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8763, 958, 4675, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8764, 958, 4679, 0, 0, 1, 0, '2019-06-01 13:35:23', NULL);
INSERT INTO `user_apps` VALUES (8765, 961, 4656, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8766, 961, 4654, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8767, 961, 4658, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8768, 961, 4659, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8769, 961, 4655, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8770, 961, 4649, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8771, 961, 4653, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8772, 961, 4651, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8773, 961, 4652, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8774, 961, 4660, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8775, 961, 23828, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8776, 961, 4661, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8777, 961, 4657, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8778, 961, 23787, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8779, 961, 23827, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8780, 961, 4664, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8781, 961, 4662, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8782, 961, 4663, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8783, 961, 23836, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8784, 961, 23837, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8785, 961, 16445, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8786, 961, 4650, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8787, 961, 23838, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8788, 961, 15706, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8789, 961, 4665, 1, 0, 0, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8790, 961, 15929, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8791, 961, 4666, 1, 1, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8792, 961, 20863, 1, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8793, 961, 4677, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8794, 961, 4670, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8795, 961, 4674, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8796, 961, 4672, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8797, 961, 23213, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8798, 961, 4671, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8799, 961, 4675, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8800, 961, 4676, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8801, 961, 4669, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8802, 961, 4673, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8803, 961, 4668, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8804, 961, 4678, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8805, 961, 23212, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8806, 961, 4679, 0, 0, 1, 0, '2019-06-01 13:35:25', NULL);
INSERT INTO `user_apps` VALUES (8807, 962, 4653, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8808, 962, 4651, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8809, 962, 4649, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8810, 962, 4657, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8811, 962, 4658, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8812, 962, 4660, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8813, 962, 4655, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8814, 962, 4654, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8815, 962, 4663, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8816, 962, 4665, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8817, 962, 16445, 0, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8818, 962, 4664, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8819, 962, 4661, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8820, 962, 4650, 1, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8821, 962, 15706, 0, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8822, 962, 4662, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8823, 962, 4659, 1, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8824, 962, 15929, 1, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8825, 962, 4652, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8826, 962, 4656, 1, 0, 0, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8827, 962, 4666, 0, 1, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8828, 962, 4669, 0, 0, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8829, 962, 4675, 0, 0, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8830, 962, 4671, 0, 0, 1, 0, '2019-06-01 13:37:42', NULL);
INSERT INTO `user_apps` VALUES (8831, 962, 4672, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8832, 962, 4670, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8833, 962, 4676, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8834, 962, 4677, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8835, 962, 4674, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8836, 962, 23213, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8837, 962, 4673, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8838, 962, 23212, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8839, 962, 4679, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8840, 962, 4668, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8841, 962, 4678, 0, 0, 1, 0, '2019-06-01 13:37:43', NULL);
INSERT INTO `user_apps` VALUES (8881, 967, 4649, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8882, 967, 4656, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8883, 967, 4653, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8884, 967, 4654, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8885, 967, 4652, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8886, 967, 4657, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8887, 967, 4660, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8888, 967, 4666, 0, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8889, 967, 4659, 1, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8890, 967, 4665, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8891, 967, 4655, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8892, 967, 4658, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8893, 967, 22049, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8894, 967, 4661, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8895, 967, 16445, 0, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8896, 967, 4650, 1, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8897, 967, 20722, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8898, 967, 4662, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8899, 967, 23787, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8900, 967, 4651, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8901, 967, 23795, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8902, 967, 4664, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8903, 967, 15706, 0, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8904, 967, 4663, 1, 0, 0, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8905, 967, 15929, 1, 1, 1, 0, '2019-06-01 14:20:41', NULL);
INSERT INTO `user_apps` VALUES (8906, 967, 4670, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8907, 967, 4677, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8908, 967, 4669, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8909, 967, 23213, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8910, 967, 4673, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8911, 967, 4675, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8912, 967, 4674, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8913, 967, 4678, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8914, 967, 4668, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8915, 967, 4672, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8916, 967, 23212, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8917, 967, 4676, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8918, 967, 4679, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (8919, 967, 4671, 1, 1, 1, 0, '2019-06-01 14:20:41', '2019-06-01 14:26:42');
INSERT INTO `user_apps` VALUES (9322, 760, 4656, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9323, 760, 4651, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9324, 760, 4658, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9325, 760, 4649, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9326, 760, 4661, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9327, 760, 4654, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9328, 760, 4653, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9329, 760, 4655, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9330, 760, 4652, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9331, 760, 4660, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9332, 760, 4662, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9333, 760, 4657, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9334, 760, 4663, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9335, 760, 4665, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9336, 760, 15929, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9337, 760, 15706, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9338, 760, 4666, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9339, 760, 4664, 0, 0, 0, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9340, 760, 4659, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9341, 760, 9686, 0, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9342, 760, 4650, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9343, 760, 4669, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9344, 760, 4670, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9345, 760, 4673, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9346, 760, 4671, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9347, 760, 4668, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9348, 760, 4672, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9349, 760, 4674, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9350, 760, 4679, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9351, 760, 4678, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9352, 760, 23213, 0, 0, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9353, 760, 23212, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9354, 760, 4675, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9355, 760, 4677, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9356, 760, 4676, 1, 1, 1, 0, '2019-06-03 04:40:43', NULL);
INSERT INTO `user_apps` VALUES (9419, 777, 4649, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9420, 777, 4654, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9421, 777, 4652, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9422, 777, 4657, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9423, 777, 4653, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9424, 777, 4651, 1, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9425, 777, 4655, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9426, 777, 4656, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9427, 777, 4659, 1, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9428, 777, 4658, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9429, 777, 4661, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9430, 777, 4662, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9431, 777, 4660, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9432, 777, 4664, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9433, 777, 4650, 1, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9434, 777, 24089, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9435, 777, 16445, 0, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9436, 777, 9684, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9437, 777, 16067, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9438, 777, 4665, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9439, 777, 4663, 1, 0, 0, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9440, 777, 4666, 0, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9441, 777, 15929, 1, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9442, 777, 15706, 0, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9443, 777, 24499, 0, 1, 1, 0, '2019-06-03 12:06:54', NULL);
INSERT INTO `user_apps` VALUES (9444, 777, 4673, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9445, 777, 4672, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9446, 777, 4671, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9447, 777, 4677, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9448, 777, 4670, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9449, 777, 23212, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9450, 777, 4675, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9451, 777, 23213, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9452, 777, 4668, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9453, 777, 4669, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9454, 777, 4679, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9455, 777, 4676, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9456, 777, 4674, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (9457, 777, 4678, 0, 0, 1, 0, '2019-06-03 12:06:57', NULL);
INSERT INTO `user_apps` VALUES (10496, 780, 4655, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10497, 780, 4649, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10498, 780, 4657, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10499, 780, 4653, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10500, 780, 4654, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10501, 780, 4658, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10502, 780, 4656, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10503, 780, 4652, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10504, 780, 4651, 1, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10505, 780, 4659, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10506, 780, 4665, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10507, 780, 4661, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10508, 780, 17626, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10509, 780, 4660, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10510, 780, 15706, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10511, 780, 4664, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10512, 780, 4650, 1, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10513, 780, 4662, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10514, 780, 4663, 1, 0, 0, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10515, 780, 4666, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10516, 780, 9686, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10517, 780, 9684, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10518, 780, 22049, 0, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10519, 780, 15929, 1, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10520, 780, 25298, 1, 1, 1, 0, '2019-06-05 05:11:35', NULL);
INSERT INTO `user_apps` VALUES (10521, 780, 4676, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10522, 780, 23213, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10523, 780, 4677, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10524, 780, 4670, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10525, 780, 4672, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10526, 780, 4673, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10527, 780, 4674, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10528, 780, 23212, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10529, 780, 4668, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10530, 780, 4669, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10531, 780, 4671, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10532, 780, 4678, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10533, 780, 4675, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10534, 780, 4679, 0, 1, 1, 0, '2019-06-05 05:11:36', NULL);
INSERT INTO `user_apps` VALUES (10535, 778, 4653, 1, 0, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10536, 778, 4655, 1, 0, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10537, 778, 4657, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10538, 778, 4654, 1, 0, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10539, 778, 4649, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10540, 778, 4651, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10541, 778, 4658, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10542, 778, 4652, 1, 0, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10543, 778, 4659, 0, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10544, 778, 4660, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10545, 778, 4664, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10546, 778, 4656, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10547, 778, 4661, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10548, 778, 9686, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10549, 778, 4666, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10550, 778, 15706, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10551, 778, 4665, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10552, 778, 4663, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10553, 778, 9684, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10554, 778, 4662, 1, 0, 0, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10555, 778, 10121, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10556, 778, 20863, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10557, 778, 4650, 1, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10558, 778, 10118, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10559, 778, 15929, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10560, 778, 10116, 0, 1, 1, 0, '2019-06-05 08:10:12', NULL);
INSERT INTO `user_apps` VALUES (10561, 778, 4675, 0, 0, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10562, 778, 4668, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10563, 778, 4677, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10564, 778, 4674, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10565, 778, 23213, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10566, 778, 4676, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10567, 778, 4671, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10568, 778, 4670, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10569, 778, 4669, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10570, 778, 4672, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10571, 778, 4678, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10572, 778, 4673, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10573, 778, 4679, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10574, 778, 23212, 1, 1, 1, 0, '2019-06-05 08:10:14', NULL);
INSERT INTO `user_apps` VALUES (10681, 781, 4657, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10682, 781, 4652, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10683, 781, 4659, 0, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10684, 781, 4653, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10685, 781, 4655, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10686, 781, 9686, 0, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10687, 781, 4649, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10688, 781, 4658, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10689, 781, 4656, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10690, 781, 4654, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10691, 781, 4651, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10692, 781, 4650, 0, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10693, 781, 4662, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10694, 781, 4661, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10695, 781, 15706, 0, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10696, 781, 4664, 1, 0, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10697, 781, 4666, 0, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10698, 781, 15929, 1, 1, 1, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10699, 781, 4663, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10700, 781, 4665, 1, 0, 0, 0, '2019-06-05 11:19:51', NULL);
INSERT INTO `user_apps` VALUES (10701, 781, 23213, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10702, 781, 4673, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10703, 781, 4672, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10704, 781, 4676, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10705, 781, 4669, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10706, 781, 4671, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10707, 781, 4677, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10708, 781, 4675, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10709, 781, 4670, 0, 0, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10710, 781, 4674, 0, 0, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10711, 781, 4678, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10712, 781, 23212, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10713, 781, 4668, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10714, 781, 4679, 0, 1, 1, 0, '2019-06-05 11:19:52', NULL);
INSERT INTO `user_apps` VALUES (10958, 761, 4652, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10959, 761, 4651, 1, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10960, 761, 4658, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10961, 761, 4657, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10962, 761, 4655, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10963, 761, 4654, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10964, 761, 4656, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10965, 761, 4653, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10966, 761, 4649, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10967, 761, 4659, 1, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10968, 761, 4660, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10969, 761, 4664, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10970, 761, 4662, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10971, 761, 4661, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10972, 761, 24089, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10973, 761, 15706, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10974, 761, 4663, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10975, 761, 9686, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10976, 761, 15929, 1, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10977, 761, 23213, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10978, 761, 4650, 1, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10979, 761, 4665, 1, 0, 0, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10980, 761, 4666, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10981, 761, 9684, 1, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10982, 761, 4676, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10983, 761, 4674, 0, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10984, 761, 4669, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10985, 761, 4672, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10986, 761, 4679, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10987, 761, 4675, 0, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10988, 761, 4671, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10989, 761, 4673, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10990, 761, 4670, 0, 0, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10991, 761, 4677, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10992, 761, 4678, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10993, 761, 23212, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (10994, 761, 4668, 0, 1, 1, 0, '2019-06-05 20:24:29', NULL);
INSERT INTO `user_apps` VALUES (11033, 782, 4655, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11034, 782, 4658, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11035, 782, 4662, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11036, 782, 4651, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11037, 782, 4654, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11038, 782, 4653, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11039, 782, 4657, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11040, 782, 4664, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11041, 782, 4649, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11042, 782, 4656, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11043, 782, 4652, 1, 0, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11044, 782, 4661, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11045, 782, 4666, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11046, 782, 9686, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11047, 782, 4650, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11048, 782, 4659, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11049, 782, 15706, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11050, 782, 4663, 1, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11051, 782, 15929, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11052, 782, 4665, 0, 0, 0, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11053, 782, 4670, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11054, 782, 4669, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11055, 782, 4674, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11056, 782, 4671, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11057, 782, 4673, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11058, 782, 4672, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11059, 782, 4675, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11060, 782, 23213, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11061, 782, 4678, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11062, 782, 4679, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11063, 782, 23212, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11064, 782, 4668, 0, 0, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11065, 782, 4677, 1, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11066, 782, 4676, 0, 1, 1, 0, '2019-06-05 21:03:36', NULL);
INSERT INTO `user_apps` VALUES (11102, 779, 4649, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11103, 779, 4651, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11104, 779, 4652, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11105, 779, 4657, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11106, 779, 4655, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11107, 779, 4653, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11108, 779, 4654, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11109, 779, 4659, 1, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11110, 779, 4656, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11111, 779, 4658, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11112, 779, 4665, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11113, 779, 4666, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11114, 779, 4660, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11115, 779, 4661, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11116, 779, 4663, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11117, 779, 4650, 1, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11118, 779, 4664, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11119, 779, 4662, 1, 0, 0, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11120, 779, 10121, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11121, 779, 15706, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11122, 779, 15929, 1, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11123, 779, 9686, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11124, 779, 20863, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11125, 779, 10118, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11126, 779, 9684, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11127, 779, 10116, 0, 1, 1, 0, '2019-06-06 04:58:39', NULL);
INSERT INTO `user_apps` VALUES (11128, 779, 4669, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11129, 779, 4674, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11130, 779, 4672, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11131, 779, 4671, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11132, 779, 4679, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11133, 779, 4678, 1, 0, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11134, 779, 23213, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11135, 779, 4670, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11136, 779, 4675, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11137, 779, 4673, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11138, 779, 4676, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11139, 779, 23212, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11140, 779, 4677, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11141, 779, 4668, 1, 1, 1, 0, '2019-06-06 04:58:40', NULL);
INSERT INTO `user_apps` VALUES (11217, 784, 4653, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11218, 784, 4649, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11219, 784, 4658, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11220, 784, 4654, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11221, 784, 4651, 1, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11222, 784, 4652, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11223, 784, 4659, 0, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11224, 784, 4663, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11225, 784, 4655, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11226, 784, 4657, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11227, 784, 4656, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11228, 784, 4664, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11229, 784, 9686, 0, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11230, 784, 4665, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11231, 784, 4666, 0, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11232, 784, 4650, 1, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11233, 784, 4662, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11234, 784, 4661, 1, 0, 0, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11235, 784, 15929, 1, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11236, 784, 15706, 0, 1, 1, 0, '2019-06-06 06:10:36', NULL);
INSERT INTO `user_apps` VALUES (11237, 784, 4673, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11238, 784, 4676, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11239, 784, 4675, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11240, 784, 4674, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11241, 784, 23212, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11242, 784, 4679, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11243, 784, 4670, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11244, 784, 4669, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11245, 784, 23213, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11246, 784, 4672, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11247, 784, 4671, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11248, 784, 4668, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11249, 784, 4677, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11250, 784, 4678, 0, 1, 1, 0, '2019-06-06 06:10:39', NULL);
INSERT INTO `user_apps` VALUES (11407, 787, 4658, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11408, 787, 4651, 1, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11409, 787, 4655, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11410, 787, 4654, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11411, 787, 4653, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11412, 787, 4656, 0, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11413, 787, 4649, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11414, 787, 4663, 1, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11415, 787, 4662, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11416, 787, 4652, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11417, 787, 4664, 1, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11418, 787, 4661, 1, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11419, 787, 4657, 1, 0, 0, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11420, 787, 12544, 1, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11421, 787, 26601, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11422, 787, 4668, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11423, 787, 4670, 0, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11424, 787, 4675, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11425, 787, 4671, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11426, 787, 4673, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11427, 787, 4669, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11428, 787, 4679, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11429, 787, 21461, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11430, 787, 4674, 0, 0, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11431, 787, 4678, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11432, 787, 4672, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11433, 787, 23212, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11434, 787, 4676, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (11435, 787, 4677, 1, 1, 1, 0, '2019-06-07 09:33:06', NULL);
INSERT INTO `user_apps` VALUES (12088, 789, 4658, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12089, 789, 4651, 0, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12090, 789, 4653, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12091, 789, 9684, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12092, 789, 4657, 1, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12093, 789, 4656, 0, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12094, 789, 4652, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12095, 789, 4655, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12096, 789, 4654, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12097, 789, 4659, 0, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12098, 789, 4649, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12099, 789, 4664, 1, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12100, 789, 4662, 1, 0, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12101, 789, 4650, 1, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12102, 789, 4663, 1, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12103, 789, 15929, 1, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12104, 789, 4661, 1, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12105, 789, 4666, 0, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12106, 789, 15706, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12107, 789, 9686, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12108, 789, 10116, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12109, 789, 20863, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12110, 789, 26938, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12111, 789, 10118, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12112, 789, 27688, 1, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12113, 789, 4665, 1, 0, 0, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12114, 789, 26939, 0, 1, 1, 0, '2019-06-07 18:42:26', NULL);
INSERT INTO `user_apps` VALUES (12115, 789, 4670, 0, 0, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12116, 789, 23213, 0, 0, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12117, 789, 4677, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12118, 789, 4674, 0, 0, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12119, 789, 4672, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12120, 789, 4675, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12121, 789, 4676, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12122, 789, 4673, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12123, 789, 4671, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12124, 789, 4668, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12125, 789, 23212, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12126, 789, 4679, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12127, 789, 4669, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12128, 789, 4678, 1, 1, 1, 0, '2019-06-07 18:42:27', NULL);
INSERT INTO `user_apps` VALUES (12151, 790, 4658, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12152, 790, 4654, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12153, 790, 4655, 1, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12154, 790, 4664, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12155, 790, 4650, 1, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12156, 790, 4661, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12157, 790, 4657, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12158, 790, 4651, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12159, 790, 4660, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12160, 790, 4652, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12161, 790, 4656, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12162, 790, 4653, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12163, 790, 27721, 0, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12164, 790, 4665, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12165, 790, 4663, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12166, 790, 24499, 0, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12167, 790, 4662, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12168, 790, 4666, 0, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12169, 790, 4649, 1, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12170, 790, 15706, 0, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12171, 790, 15929, 1, 1, 1, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12172, 790, 4659, 0, 0, 0, 0, '2019-06-10 05:33:27', NULL);
INSERT INTO `user_apps` VALUES (12173, 790, 4677, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12174, 790, 4671, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12175, 790, 4676, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12176, 790, 4675, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12177, 790, 4674, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12178, 790, 4672, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12179, 790, 4668, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12180, 790, 4669, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12181, 790, 4673, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12182, 790, 4679, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12183, 790, 23213, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12184, 790, 23212, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12185, 790, 4678, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12186, 790, 4670, 0, 0, 1, 0, '2019-06-10 05:33:28', NULL);
INSERT INTO `user_apps` VALUES (12259, 791, 4658, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12260, 791, 4652, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12261, 791, 4651, 1, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12262, 791, 4654, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12263, 791, 4655, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12264, 791, 4657, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12265, 791, 4665, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12266, 791, 4664, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12267, 791, 4666, 0, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12268, 791, 4653, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12269, 791, 4663, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12270, 791, 4659, 0, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12271, 791, 4649, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12272, 791, 4656, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12273, 791, 4662, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12274, 791, 15706, 0, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12275, 791, 4650, 1, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12276, 791, 4661, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12277, 791, 15929, 1, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12278, 791, 4660, 1, 0, 0, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12279, 791, 27721, 0, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12280, 791, 24499, 0, 1, 1, 0, '2019-06-10 07:48:42', NULL);
INSERT INTO `user_apps` VALUES (12281, 791, 4669, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12282, 791, 4675, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12283, 791, 4670, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12284, 791, 4671, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12285, 791, 23213, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12286, 791, 4678, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12287, 791, 4672, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12288, 791, 4679, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12289, 791, 4674, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12290, 791, 4677, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12291, 791, 4668, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12292, 791, 4673, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12293, 791, 4676, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12294, 791, 23212, 1, 1, 1, 0, '2019-06-10 07:48:43', NULL);
INSERT INTO `user_apps` VALUES (12409, 793, 4653, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12410, 793, 4652, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12411, 793, 27929, 1, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12412, 793, 4654, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12413, 793, 4657, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12414, 793, 27933, 1, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12415, 793, 4656, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12416, 793, 27932, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12417, 793, 4658, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12418, 793, 27944, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12419, 793, 27937, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12420, 793, 27946, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12421, 793, 4659, 0, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12422, 793, 27940, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12423, 793, 27945, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12424, 793, 27949, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12425, 793, 27936, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12426, 793, 27942, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12427, 793, 27943, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12428, 793, 27953, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12429, 793, 27948, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12430, 793, 27941, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12431, 793, 27947, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12432, 793, 27950, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12433, 793, 27952, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12434, 793, 27965, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12435, 793, 4664, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12436, 793, 27938, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12437, 793, 27962, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12438, 793, 27954, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12439, 793, 12552, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12440, 793, 27959, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12441, 793, 27963, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12442, 793, 27939, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12443, 793, 27971, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12444, 793, 27967, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12445, 793, 27957, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12446, 793, 27969, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12447, 793, 27958, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12448, 793, 27980, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12449, 793, 27973, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12450, 793, 27968, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12451, 793, 4662, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12452, 793, 27976, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12453, 793, 27981, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12454, 793, 27970, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12455, 793, 27974, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12456, 793, 27951, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12457, 793, 27964, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12458, 793, 27979, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12459, 793, 27966, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12460, 793, 27955, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12461, 793, 27972, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12462, 793, 27990, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12463, 793, 27993, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12464, 793, 27984, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12465, 793, 27988, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12466, 793, 27995, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12467, 793, 27983, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12468, 793, 27996, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12469, 793, 23837, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12470, 793, 27982, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12471, 793, 9684, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12472, 793, 28000, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12473, 793, 27985, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12474, 793, 12852, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12475, 793, 27994, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12476, 793, 27721, 0, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12477, 793, 28003, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12478, 793, 27999, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12479, 793, 15706, 0, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12480, 793, 28002, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12481, 793, 28006, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12482, 793, 20722, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12483, 793, 28005, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12484, 793, 27989, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12485, 793, 27986, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12486, 793, 19890, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12487, 793, 27987, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12488, 793, 15929, 1, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12489, 793, 27978, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12490, 793, 27977, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12491, 793, 27975, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12492, 793, 4650, 1, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12493, 793, 24499, 0, 1, 1, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12494, 793, 27992, 1, 0, 0, 0, '2019-06-10 09:39:01', NULL);
INSERT INTO `user_apps` VALUES (12495, 793, 4679, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12496, 793, 4676, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12497, 793, 4671, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12498, 793, 4669, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12499, 793, 4673, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12500, 793, 4677, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12501, 793, 23213, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12502, 793, 4674, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12503, 793, 4672, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12504, 793, 4678, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12505, 793, 23212, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12506, 793, 4675, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12507, 793, 4668, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);
INSERT INTO `user_apps` VALUES (12508, 793, 4670, 1, 1, 1, 0, '2019-06-10 09:39:02', NULL);

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 'admin', 1);
INSERT INTO `user_roles` VALUES (2, 'dealer', 1);
INSERT INTO `user_roles` VALUES (3, 'sdealer', 1);
INSERT INTO `user_roles` VALUES (4, 'auto_update_admin', 1);

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_id` varchar(225) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `user_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `password` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `type` int(4) NOT NULL,
  `dealer_id` int(11) NOT NULL,
  `del_status` tinyint(1) NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for usr_acc
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc`;
CREATE TABLE `usr_acc`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NULL DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `batch_no` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT 0,
  `prnt_dlr_id` int(11) NULL DEFAULT 0,
  `link_code` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `client_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` varchar(16) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `expiry_months` int(100) NULL DEFAULT NULL,
  `expiry_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `activation_code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `status` enum('expired','active','','trial') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '',
  `device_status` tinyint(4) NOT NULL DEFAULT 0,
  `activation_status` tinyint(4) NULL DEFAULT NULL,
  `wipe_status` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `account_status` enum('suspended','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT 0,
  `transfer_status` tinyint(4) UNSIGNED NULL DEFAULT 0,
  `dealer_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `prnt_dlr_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `del_status` tinyint(4) NULL DEFAULT 0,
  `trial_status` tinyint(4) NULL DEFAULT 0,
  `validity` tinyint(4) NULL DEFAULT NULL,
  `note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `prnt_dealer_id`(`prnt_dlr_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `usr_acc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `usr_acc_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  CONSTRAINT `usr_acc_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 189 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for usr_acc_profile
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc_profile`;
CREATE TABLE `usr_acc_profile`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `profile_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `profile_note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `policy_id` int(11) NULL DEFAULT 0,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` tinyint(4) NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 12 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
