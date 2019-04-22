/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : lockmesh_db

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 22/04/2019 15:21:54
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acc_action_history
-- ----------------------------
DROP TABLE IF EXISTS `acc_action_history`;
CREATE TABLE `acc_action_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` enum('DELETE','SUSPENDED','UNLINK','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','PRE_ACTIVATED') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
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
  `online` enum('On','off') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'off',
  `is_sync` tinyint(4) NOT NULL DEFAULT 0,
  `flagged` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
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
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acc_action_history
-- ----------------------------
INSERT INTO `acc_action_history` VALUES (6, 'UNLINK', 'OCSP875142', 'BCP100', 'null', 'null', '192.168.0.103', '8985219131642221554f', '496953409506566', 'null', '014705682480304', '0123456789ABCDEF', '00:A0:4D:9F:BD:D0', 'null', 'off', 1, '', 'null', 0, NULL, 'hhh@hhh.com', 225, 0, '610192', 'null', 'null', 6, '', '', '', 0, 0, 'undefined', '', 1, 0, 'Barry', 'null', 22, '599NGT@TITANSECURE.BIZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-18 06:32:15', '2019-04-18 06:32:15');

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
) ENGINE = InnoDB AUTO_INCREMENT = 51 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 41 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `dealers` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` enum('Off','On') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Off',
  `created` datetime(0) NULL DEFAULT NULL,
  `modified` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (29, 'new file added', 'logo-1554958561193.jpg', 'apk-1554200217607.apk', 'basic', NULL, '[226,225,224,223,222]', 'On', '2019-04-02 15:17:59', '2019-04-18 06:31:42', 0);
INSERT INTO `apk_details` VALUES (30, 'usman hafeez', 'logo-1554898498235.jpg', 'apk-1554898502524.apk', 'basic', NULL, '[224,223,222]', 'On', '2019-04-10 12:15:06', '2019-04-13 11:15:15', 0);
INSERT INTO `apk_details` VALUES (31, 'test ak', 'logo-1555155160891.jpg', 'apk-1555155180487.apk', 'basic', NULL, NULL, 'Off', '2019-04-13 11:33:04', '2019-04-13 11:33:04', 0);
INSERT INTO `apk_details` VALUES (35, 'whatsapp', 'undefined', 'undefined', 'basic', NULL, NULL, 'On', '2019-04-22 05:33:19', '2019-04-22 05:33:24', 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 9616 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `apps_info` VALUES (4667, 'com.titanlocker.secureTitan Locker', 'Titan Locker', 'com.titanlocker.secure', 'icon_Titan Locker.png', 0, 1, 1, 0, '2019-04-22 12:49:21', NULL);
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 312 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------
INSERT INTO `dealer_apks` VALUES (253, 222, 29);
INSERT INTO `dealer_apks` VALUES (243, 222, 30);
INSERT INTO `dealer_apks` VALUES (252, 223, 29);
INSERT INTO `dealer_apks` VALUES (242, 223, 30);
INSERT INTO `dealer_apks` VALUES (251, 224, 29);
INSERT INTO `dealer_apks` VALUES (280, 224, 30);
INSERT INTO `dealer_apks` VALUES (250, 225, 29);
INSERT INTO `dealer_apks` VALUES (288, 225, 30);
INSERT INTO `dealer_apks` VALUES (249, 226, 29);

-- ----------------------------
-- Table structure for dealer_dropdown_list
-- ----------------------------
DROP TABLE IF EXISTS `dealer_dropdown_list`;
CREATE TABLE `dealer_dropdown_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `selected_items` mediumtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('devices','dealer','sdealer','apk') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `id_2`(`id`) USING BTREE,
  CONSTRAINT `dealer_dropdown_list_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (85, 154, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-04-02 16:14:22', '2019-04-08 15:16:34');
INSERT INTO `dealer_dropdown_list` VALUES (86, 154, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-02 16:18:12', '2019-04-16 13:46:24');
INSERT INTO `dealer_dropdown_list` VALUES (87, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'dealer', '2019-04-03 15:23:12', '2019-04-18 07:09:01');
INSERT INTO `dealer_dropdown_list` VALUES (88, 154, '[\"ACTIONS\"]', 'sdealer', '2019-04-03 15:23:15', '2019-04-15 09:43:03');
INSERT INTO `dealer_dropdown_list` VALUES (89, 222, '[\"DEVICE ID\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-08 12:11:22', '2019-04-08 12:12:08');
INSERT INTO `dealer_dropdown_list` VALUES (90, 222, '[\"ACTIONS\"]', 'sdealer', '2019-04-08 12:13:36', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (91, 223, '[\"ACTIONS\"]', 'devices', '2019-04-10 09:46:55', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (92, 223, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 09:48:00', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (93, 223, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 09:48:00', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (94, 224, '[\"ACTIONS\"]', 'devices', '2019-04-10 21:08:53', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (95, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (96, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (97, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (98, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (99, 226, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-12 07:12:13', '2019-04-12 07:12:31');
INSERT INTO `dealer_dropdown_list` VALUES (100, 225, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-12 10:20:43', '2019-04-12 11:08:03');
INSERT INTO `dealer_dropdown_list` VALUES (101, 225, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-04-12 11:19:59', '2019-04-12 11:20:03');
INSERT INTO `dealer_dropdown_list` VALUES (102, 225, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-04-12 11:20:00', '2019-04-12 11:20:03');
INSERT INTO `dealer_dropdown_list` VALUES (103, 225, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-04-18 06:30:34', '2019-04-18 06:30:37');

-- ----------------------------
-- Table structure for dealer_pagination
-- ----------------------------
DROP TABLE IF EXISTS `dealer_pagination`;
CREATE TABLE `dealer_pagination`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(10) NOT NULL,
  `record_per_page` int(10) NOT NULL,
  `type` enum('devices','dealer','sdealer','apk') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_pagination_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 15 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (4, 154, 100, 'devices', '2019-04-02 16:18:12', '2019-04-18 12:17:53');
INSERT INTO `dealer_pagination` VALUES (5, 154, 10, 'dealer', '2019-04-03 15:23:13', '2019-04-03 15:23:13');
INSERT INTO `dealer_pagination` VALUES (6, 222, 10, 'devices', '2019-04-08 12:11:22', NULL);
INSERT INTO `dealer_pagination` VALUES (7, 154, 10, 'apk', '2019-04-08 16:18:47', NULL);
INSERT INTO `dealer_pagination` VALUES (8, 154, 100, 'sdealer', '2019-04-09 14:14:40', '2019-04-11 04:13:58');
INSERT INTO `dealer_pagination` VALUES (9, 223, 10, 'devices', '2019-04-10 09:46:55', NULL);
INSERT INTO `dealer_pagination` VALUES (10, 224, 10, 'devices', '2019-04-10 21:08:53', NULL);
INSERT INTO `dealer_pagination` VALUES (11, 224, 10, 'sdealer', '2019-04-10 22:15:02', NULL);
INSERT INTO `dealer_pagination` VALUES (12, 225, 10, 'devices', '2019-04-11 10:40:39', NULL);
INSERT INTO `dealer_pagination` VALUES (13, 226, 10, 'devices', '2019-04-12 07:12:13', NULL);
INSERT INTO `dealer_pagination` VALUES (14, 225, 10, 'sdealer', '2019-04-12 11:20:00', NULL);

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
  `link_code` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 228 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (222, NULL, NULL, 0, 'usman hafeez', 'usmanhafeez147@gmail.com', '2f0e5e9951ea834eaae81d6c64a5dc79', '433523', 2, 0, NULL, '2019-04-03 15:23:26', '2019-04-03 15:23:26');
INSERT INTO `dealers` VALUES (223, NULL, NULL, 0, 'Barry', 'barrybarrygood@hotmail.com', 'b3af9d5ab1e2964e69b523a20e9690c8', '610192', 2, 0, NULL, '2019-04-10 09:14:30', '2019-04-10 09:14:30');
INSERT INTO `dealers` VALUES (224, NULL, NULL, 0, 'zaid', 'zaid@vortexapp.ca', 'e920be62c02a7d5549be410f1f31366b', '417695', 2, 0, NULL, '2019-04-10 21:06:51', '2019-04-10 21:06:51');
INSERT INTO `dealers` VALUES (225, NULL, NULL, 0, 'Hamza Dawood', 'hamza.dawood007@gmail.com', '6fc6be5e9df393f5a184c74b2c48ef70', '541763', 2, 0, NULL, '2019-04-11 10:39:50', '2019-04-11 10:39:50');
INSERT INTO `dealers` VALUES (226, NULL, NULL, 0, 'Arfan ali', 'arawan77rb@gmail.com', 'c3c6b034a0622448ec602efda5c0964f', '262165', 2, 0, NULL, '2019-04-12 07:10:40', '2019-04-12 07:10:40');
INSERT INTO `dealers` VALUES (227, NULL, NULL, 225, 'Hamza123', 'hamza.jutt004@gmail.com', 'e43a2b055b93736a42bcf71f257398ec', '753909', 3, 0, NULL, '2019-04-18 06:31:19', '2019-04-18 06:31:19');

-- ----------------------------
-- Table structure for default_apps
-- ----------------------------
DROP TABLE IF EXISTS `default_apps`;
CREATE TABLE `default_apps`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `icon` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for device_history
-- ----------------------------
DROP TABLE IF EXISTS `device_history`;
CREATE TABLE `device_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT 0,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 76 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device_history
-- ----------------------------
INSERT INTO `device_history` VALUES (71, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, 0, '2019-04-17 17:51:17', NULL);
INSERT INTO `device_history` VALUES (72, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, 0, '2019-04-18 07:57:55', NULL);
INSERT INTO `device_history` VALUES (73, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, 0, '2019-04-18 07:58:45', NULL);
INSERT INTO `device_history` VALUES (74, 25, '[{\"id\":57,\"app_id\":40,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, 0, '2019-04-18 08:13:29', NULL);
INSERT INTO `device_history` VALUES (75, 25, '[{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"},{\"id\":79,\"app_id\":2861,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SecureMenu\",\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"icon\":\"Settings.png\",\"extension\":1,\"extension_id\":0,\"packageName\":\"com.secureSetting.SecureSettingsMainSecure Settings\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', '[]', 0, '2019-04-20 13:20:29', NULL);

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
  `online` enum('On','off') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'off',
  `is_sync` tinyint(4) NOT NULL DEFAULT 0,
  `flagged` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 644 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (636, 'OCSP875142', 'BCP100', NULL, 'null', '192.168.1.107', 'null', '496953409506566', 'null', '014705682480304', '0123456789ABCDEF', '00:A0:4D:9F:BD:D0', NULL, 'On', 1, '', NULL, 0, '2019-04-10 09:47:46', '2019-04-19 21:56:19');
INSERT INTO `devices` VALUES (637, 'VSGV427807', 'BCP100', NULL, 'null', '192.168.0.128', NULL, '354444076296294', NULL, '354444076296302', 'VSP1001901S00329', '00:27:15:2C:ED:27', NULL, 'On', 0, '', NULL, 1, '2019-04-10 21:07:15', '2019-04-10 21:23:10');
INSERT INTO `devices` VALUES (638, 'UHLZ092101', 'BCP', NULL, 'undefined', '192.168.0.156', 'null', '354444076292574', 'null', '354444076292582', 'VSP1001901S00143', '00:27:15:B5:5B:12', NULL, 'off', 1, '', NULL, 0, '2019-04-10 21:12:15', '2019-04-10 22:05:59');
INSERT INTO `devices` VALUES (639, 'BGWR419008', 'BCP4', NULL, 'undefined', '192.168.0.146', 'null', '354444076295114', 'null', '354444076295122', 'VSP1001901S00270', '00:27:15:6D:DA:60', NULL, 'off', 1, '', NULL, 0, '2019-04-10 23:35:14', '2019-04-16 16:20:33');
INSERT INTO `devices` VALUES (640, 'NEEQ709111', 'hamza', NULL, 'asdas', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-12 11:53:12', NULL);
INSERT INTO `devices` VALUES (641, 'RFCH946574', 'fasfa', NULL, 'asdas', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-18 06:33:05', NULL);
INSERT INTO `devices` VALUES (642, 'DEQM506647', 'vortext test', NULL, 'vortext100', '192.168.18.160', NULL, '354444076298332', NULL, '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', NULL, 'off', 0, '', NULL, 0, '2019-04-18 09:46:51', '2019-04-19 09:45:17');
INSERT INTO `devices` VALUES (643, 'YISC356974', 'usman', NULL, 'null', '192.168.1.145', '8992042306182528852f', '354444076293150', '8992042306182528811f', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', NULL, 'off', 0, '', NULL, 0, '2019-04-22 11:54:10', '2019-04-22 14:16:19');

-- ----------------------------
-- Table structure for login_history
-- ----------------------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
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
) ENGINE = MyISAM AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_history
-- ----------------------------
INSERT INTO `login_history` VALUES (1, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0b2tlbiI6bnVsbH0sImlhdCI6MTU1NTkyODQ1NiwiZXhwIjoxNTU2MDE0ODU2fQ.LDTcc0TAuWQM-8JDjJtqxH_p0WJd13dWjXwfEnN8FZU', '86400s', 'undefined', NULL, 'admin', 'token', 1, '2019-04-22 15:20:56', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 185 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (125, NULL, '358GTR@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-08 12:11:56');
INSERT INTO `pgp_emails` VALUES (126, 22, '599NGT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-10 09:47:46');
INSERT INTO `pgp_emails` VALUES (127, 27, '349VFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-18 06:33:05');
INSERT INTO `pgp_emails` VALUES (128, 29, '791BFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-22 11:56:31');
INSERT INTO `pgp_emails` VALUES (129, NULL, '1619DKV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (130, NULL, '5438DNE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (131, 28, '2675DKN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-19 05:37:55');
INSERT INTO `pgp_emails` VALUES (132, NULL, '3754ZUB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (133, NULL, '4338GQG@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (134, NULL, '3669NBQ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (135, NULL, '5147DXT@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (136, NULL, '8244SRE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (137, NULL, '5412JJN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (138, NULL, '4134PTE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (139, NULL, '2954PAJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (140, NULL, '6845YAY@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (141, NULL, '7992PFY@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (142, NULL, '4967GCM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (143, 29, '5373SAJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-22 12:36:40');
INSERT INTO `pgp_emails` VALUES (144, NULL, '1233NPX@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (145, NULL, '7921MKT@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (146, NULL, '2188PBW@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (147, NULL, '2535MPM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (148, NULL, '4254PMS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (149, NULL, '4511AXM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (150, NULL, '4437CZC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (151, NULL, '8729YAM@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (152, NULL, '7497CXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (153, NULL, '5464NJF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (154, NULL, '6362MBN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (155, NULL, '5752CXB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (156, 25, '9498NBS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-10 23:35:14');
INSERT INTO `pgp_emails` VALUES (157, NULL, '3789NZU@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (158, NULL, '9643NZE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (159, NULL, '9347SKJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (160, NULL, '8837ZRE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (161, NULL, '7245BCB@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (162, NULL, '9279GBS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (163, NULL, '1747BBV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (164, NULL, '4288DXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (165, NULL, '2474VJS@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (166, NULL, '1976JSN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (167, NULL, '1879TWV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (168, NULL, '2458VZC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (169, NULL, '1842WKX@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (170, NULL, '5225CHG@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (171, NULL, '4337VZF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (172, NULL, '5734TXZ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (173, NULL, '4763XEK@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (174, NULL, '2196GNW@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (175, NULL, '8931APD@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (176, NULL, '8478YXA@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (177, NULL, '9437TPJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (178, NULL, '4347HVE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (179, NULL, '5945VEC@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (180, NULL, '2583AUF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (181, NULL, '7574XDR@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (182, NULL, '8497KRA@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
INSERT INTO `pgp_emails` VALUES (183, 24, '6497NVE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-10 21:12:15');
INSERT INTO `pgp_emails` VALUES (184, NULL, '3371GCF@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);

-- ----------------------------
-- Table structure for policy
-- ----------------------------
DROP TABLE IF EXISTS `policy`;
CREATE TABLE `policy`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `policy_note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `setting` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for screen_lock_devices
-- ----------------------------
DROP TABLE IF EXISTS `screen_lock_devices`;
CREATE TABLE `screen_lock_devices`  (
  `dev_id` int(11) NOT NULL AUTO_INCREMENT,
  `imei` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `end_date` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`dev_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for tbl_device_settings
-- ----------------------------
DROP TABLE IF EXISTS `tbl_device_settings`;
CREATE TABLE `tbl_device_settings`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(10) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `settings` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_setting_id`(`device_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 423 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tbl_device_settings
-- ----------------------------
INSERT INTO `tbl_device_settings` VALUES (422, 'TSJN209300', '{}', '2019-04-09 16:05:34', NULL);

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
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_app_permissions
-- ----------------------------
DROP TABLE IF EXISTS `user_app_permissions`;
CREATE TABLE `user_app_permissions`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NULL DEFAULT 0,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_setting_id`(`device_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2342 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_app_permissions
-- ----------------------------
INSERT INTO `user_app_permissions` VALUES (2341, 643, '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-22 14:05:10', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 428 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (397, 643, 4649, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (398, 643, 4650, 1, 1, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (399, 643, 4657, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (400, 643, 4652, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (401, 643, 4653, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (402, 643, 4654, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (403, 643, 4655, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (404, 643, 4651, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (405, 643, 4656, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (406, 643, 4658, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (407, 643, 4659, 0, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (408, 643, 4664, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (409, 643, 4660, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (410, 643, 4662, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (411, 643, 4663, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (412, 643, 4661, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (413, 643, 4667, 0, 1, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (414, 643, 4665, 1, 0, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (415, 643, 4666, 0, 1, 0, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (416, 643, 4668, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (417, 643, 4677, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (418, 643, 4671, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (419, 643, 4672, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (420, 643, 4673, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (421, 643, 4674, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (422, 643, 4676, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (423, 643, 4675, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (424, 643, 4670, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (425, 643, 4678, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (426, 643, 4669, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);
INSERT INTO `user_apps` VALUES (427, 643, 4679, 0, 0, 1, 0, '2019-04-22 12:49:22', NULL);

-- ----------------------------
-- Table structure for user_roles
-- ----------------------------
DROP TABLE IF EXISTS `user_roles`;
CREATE TABLE `user_roles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `role` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `status` tinyint(1) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 'admin', 1);
INSERT INTO `user_roles` VALUES (2, 'dealer', 1);
INSERT INTO `user_roles` VALUES (3, 'sdealer', 1);

-- ----------------------------
-- Table structure for usr_acc
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc`;
CREATE TABLE `usr_acc`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NULL DEFAULT NULL,
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
  `del_status` tinyint(4) NULL DEFAULT 0,
  `trial_status` tinyint(4) NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `prnt_dealer_id`(`prnt_dlr_id`) USING BTREE,
  CONSTRAINT `usr_acc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `usr_acc_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------
INSERT INTO `usr_acc` VALUES (22, 636, NULL, 'hhh@hhh.com', 222, 0, '433523', 'null', '', 6, '', '4247339', '', 0, 0, 'wipe', '', 0, 0, NULL, NULL, 1, 0, '2019-04-10 09:47:46', '2019-04-19 21:56:19');
INSERT INTO `usr_acc` VALUES (23, 637, NULL, NULL, 224, 0, '417695', NULL, NULL, NULL, NULL, NULL, '', 0, NULL, NULL, '', 0, 0, NULL, NULL, 0, 0, '2019-04-10 21:07:15', NULL);
INSERT INTO `usr_acc` VALUES (24, 638, NULL, 'zaid@zaid.com', NULL, 0, NULL, 'undefined', '', 6, '', '7802345', '', 0, 0, 'wipe', '', 1, 0, NULL, NULL, 0, 0, '2019-04-10 21:12:15', '2019-04-10 22:08:03');
INSERT INTO `usr_acc` VALUES (25, 639, NULL, 'zaid@canadaworldapps.com', 224, 0, '417695', 'N/A', '2019/04/16', 6, '2020/04/16', '9170111', 'active', 1, NULL, 'wipe', '', 0, 0, NULL, NULL, 0, 0, '2019-04-10 23:35:14', '2019-04-16 16:26:57');
INSERT INTO `usr_acc` VALUES (26, 640, NULL, 'hamza@gmail.com', 225, 0, NULL, 'adasd', NULL, 3, NULL, '1414300', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, '2019-04-12 11:53:12', NULL);
INSERT INTO `usr_acc` VALUES (27, 641, NULL, 'asd@gmail.com', 225, 0, NULL, 'adasd', NULL, 0, '2019/04/25', '9275599', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, '2019-04-18 06:33:05', NULL);
INSERT INTO `usr_acc` VALUES (28, 642, NULL, 'vortextest@gmail.com', NULL, 222, '433523', '12542', '', NULL, '', NULL, '', 0, NULL, NULL, '', 1, 0, NULL, 'usman hafeez', 0, 0, '2019-04-18 09:46:51', '2019-04-19 09:45:16');
INSERT INTO `usr_acc` VALUES (29, 643, NULL, 'usman1231@gmail.com', 222, 0, '433523', 'null', '2019/04/22', NULL, '2019/07/22', NULL, 'active', 1, NULL, NULL, '', 0, 0, NULL, NULL, 0, 0, '2019-04-22 11:54:10', '2019-04-22 12:36:40');

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
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `setting` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('policy','profile','history') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
