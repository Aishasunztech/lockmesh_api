/*
 Navicat Premium Data Transfer

 Source Server         : lockmesh_dev
 Source Server Type    : MySQL
 Source Server Version : 100314
 Source Host           : 142.93.102.239:3306
 Source Schema         : lockmesh_db

 Target Server Type    : MySQL
 Target Server Version : 100314
 File Encoding         : 65001

 Date: 12/04/2019 11:36:05
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acc_action_history
-- ----------------------------
DROP TABLE IF EXISTS `acc_action_history`;
CREATE TABLE `acc_action_history`  (
  `id` int(11) NOT NULL,
  `device_id` int(11) NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `action` enum('DELETE','SUSPEND','UNLINK','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NOT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
  `modified` timestamp(0) NULL DEFAULT current_timestamp() ON UPDATE CURRENT_TIMESTAMP(0),
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 31 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (29, 'new file added', 'logo-1554958561193.jpg', 'apk-1554200217607.apk', 'basic', NULL, '[225,224,223,222]', 'On', '2019-04-02 15:17:59', '2019-04-12 05:50:23', 0);
INSERT INTO `apk_details` VALUES (30, 'usman hafeez', 'logo-1554898498235.jpg', 'apk-1554898502524.apk', 'basic', NULL, '[224,223]', 'On', '2019-04-10 12:15:06', '2019-04-12 05:37:32', 0);

-- ----------------------------
-- Table structure for apps_info
-- ----------------------------
DROP TABLE IF EXISTS `apps_info`;
CREATE TABLE `apps_info`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `unique_name` varchar(500) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'unique app name (package_name + lable)',
  `label` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `icon` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 2861 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apps_info
-- ----------------------------
INSERT INTO `apps_info` VALUES (36, 'com.android.calendarCalendar', 'Calendar', 'com.android.calendar', 'icon_Calendar.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (37, 'com.android.browserBrowser', 'Browser', 'com.android.browser', 'icon_Browser.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (38, 'com.android.soundrecorderSound Recorder', 'Sound Recorder', 'com.android.soundrecorder', 'icon_Sound Recorder.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (39, 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (40, 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (41, 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (42, 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (43, 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (44, 'com.android.cellbroadcastreceiverCell Broadcasts', 'Cell Broadcasts', 'com.android.cellbroadcastreceiver', 'icon_Cell Broadcasts.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (45, 'com.android.fmradioFM Radio', 'FM Radio', 'com.android.fmradio', 'icon_FM Radio.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (46, 'com.android.quicksearchboxSearch', 'Search', 'com.android.quicksearchbox', 'icon_Search.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (47, 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (48, 'com.mediatek.systemupdateSystem software updates', 'System software updates', 'com.mediatek.systemupdate', 'icon_System software updates.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (49, 'com.launcher.changeLauncher Changer', 'Launcher Changer', 'com.launcher.change', 'icon_Launcher Changer.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (50, 'com.rim.mobilefusion.clientUEM Client', 'UEM Client', 'com.rim.mobilefusion.client', 'icon_UEM Client.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (51, 'com.vortexlocker.appScreen Locker', 'Screen Locker', 'com.vortexlocker.app', 'icon_Screen Locker.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (52, 'com.android.gallery3dGallery', 'Gallery', 'com.android.gallery3d', 'icon_Gallery.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (53, 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (54, 'com.android.emailEmail', 'Email', 'com.android.email', 'icon_Email.png', '2019-04-08 12:39:34', NULL);
INSERT INTO `apps_info` VALUES (55, 'com.android.mmsMessaging', 'Messaging', 'com.android.mms', 'icon_Messaging.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (56, 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', '2019-04-08 12:39:35', NULL);
INSERT INTO `apps_info` VALUES (78, 'com.wxy.vpn2017VPN 2017', 'VPN 2017', 'com.wxy.vpn2017', 'icon_VPN 2017.png', '2019-04-09 15:16:40', NULL);
INSERT INTO `apps_info` VALUES (2716, 'com.secure.vpnSecure VPN', 'Secure VPN', 'com.secure.vpn', 'icon_Secure VPN.png', '2019-04-10 14:31:50', NULL);
INSERT INTO `apps_info` VALUES (2837, 'com.secure.wifiSettingsSecure\nSettings', 'Secure\nSettings', 'com.secure.wifiSettings', 'icon_Secure\nSettings.png', '2019-04-11 06:03:31', NULL);

-- ----------------------------
-- Table structure for chat_ids
-- ----------------------------
DROP TABLE IF EXISTS `chat_ids`;
CREATE TABLE `chat_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `chat_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `chat_id_unique`(`chat_id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `chat_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
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
) ENGINE = InnoDB AUTO_INCREMENT = 196 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------
INSERT INTO `dealer_apks` VALUES (192, 222, 29);
INSERT INTO `dealer_apks` VALUES (178, 223, 29);
INSERT INTO `dealer_apks` VALUES (158, 223, 30);
INSERT INTO `dealer_apks` VALUES (177, 224, 29);
INSERT INTO `dealer_apks` VALUES (154, 224, 30);
INSERT INTO `dealer_apks` VALUES (176, 225, 29);

-- ----------------------------
-- Table structure for dealer_dropdown_list
-- ----------------------------
DROP TABLE IF EXISTS `dealer_dropdown_list`;
CREATE TABLE `dealer_dropdown_list`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(11) NOT NULL,
  `selected_items` mediumtext CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('devices','dealer','sdealer','apk') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `id_2`(`id`) USING BTREE,
  CONSTRAINT `dealer_dropdown_list_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 99 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (85, 154, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-04-02 16:14:22', '2019-04-08 15:16:34');
INSERT INTO `dealer_dropdown_list` VALUES (86, 154, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\",\"MODE\"]', 'devices', '2019-04-02 16:18:12', '2019-04-12 06:22:24');
INSERT INTO `dealer_dropdown_list` VALUES (87, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\"]', 'dealer', '2019-04-03 15:23:12', '2019-04-11 05:58:58');
INSERT INTO `dealer_dropdown_list` VALUES (88, 154, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'sdealer', '2019-04-03 15:23:15', '2019-04-10 14:05:39');
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

-- ----------------------------
-- Table structure for dealer_pagination
-- ----------------------------
DROP TABLE IF EXISTS `dealer_pagination`;
CREATE TABLE `dealer_pagination`  (
  `id` int(10) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(10) NOT NULL,
  `record_per_page` int(10) NOT NULL,
  `type` enum('devices','dealer','sdealer','apk') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_pagination_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (4, 154, 10, 'devices', '2019-04-02 16:18:12', '2019-04-11 12:19:46');
INSERT INTO `dealer_pagination` VALUES (5, 154, 10, 'dealer', '2019-04-03 15:23:13', '2019-04-03 15:23:13');
INSERT INTO `dealer_pagination` VALUES (6, 222, 10, 'devices', '2019-04-08 12:11:22', NULL);
INSERT INTO `dealer_pagination` VALUES (7, 154, 10, 'apk', '2019-04-08 16:18:47', NULL);
INSERT INTO `dealer_pagination` VALUES (8, 154, 100, 'sdealer', '2019-04-09 14:14:40', '2019-04-11 04:13:58');
INSERT INTO `dealer_pagination` VALUES (9, 223, 10, 'devices', '2019-04-10 09:46:55', NULL);
INSERT INTO `dealer_pagination` VALUES (10, 224, 10, 'devices', '2019-04-10 21:08:53', NULL);
INSERT INTO `dealer_pagination` VALUES (11, 224, 10, 'sdealer', '2019-04-10 22:15:02', NULL);
INSERT INTO `dealer_pagination` VALUES (12, 225, 10, 'devices', '2019-04-11 10:40:39', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 226 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (222, NULL, NULL, 0, 'usman hafeez', 'usmanhafeez147@gmail.com', '2f0e5e9951ea834eaae81d6c64a5dc79', '433523', 2, 0, NULL, '2019-04-03 15:23:26', '2019-04-03 15:23:26');
INSERT INTO `dealers` VALUES (223, NULL, NULL, 0, 'Barry', 'barrybarrygood@hotmail.com', 'b3af9d5ab1e2964e69b523a20e9690c8', '610192', 2, 0, NULL, '2019-04-10 09:14:30', '2019-04-10 09:14:30');
INSERT INTO `dealers` VALUES (224, NULL, NULL, 0, 'zaid', 'zaid@vortexapp.ca', 'e920be62c02a7d5549be410f1f31366b', '417695', 2, 0, NULL, '2019-04-10 21:06:51', '2019-04-10 21:06:51');
INSERT INTO `dealers` VALUES (225, NULL, NULL, 0, 'Hamza Dawood', 'hamza.dawood007@gmail.com', '756e80a75496396292b41446beab7385', '541763', 2, 0, NULL, '2019-04-11 10:39:50', '2019-04-11 10:39:50');

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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
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
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 71 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 640 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (636, 'OCSP875142', 'BCP100', NULL, 'null', '192.168.0.103', '8985219131642221554f', '496953409506566', 'null', '014705682480304', '0123456789ABCDEF', '00:A0:4D:9F:BD:D0', NULL, 'off', 1, '', NULL, 0, '2019-04-10 09:47:46', '2019-04-11 10:29:33');
INSERT INTO `devices` VALUES (637, 'VSGV427807', 'BCP100', NULL, 'null', '192.168.0.128', NULL, '354444076296294', NULL, '354444076296302', 'VSP1001901S00329', '00:27:15:2C:ED:27', NULL, 'On', 0, '', NULL, 1, '2019-04-10 21:07:15', '2019-04-10 21:23:10');
INSERT INTO `devices` VALUES (638, 'UHLZ092101', 'BCP', NULL, 'undefined', '192.168.0.156', 'null', '354444076292574', 'null', '354444076292582', 'VSP1001901S00143', '00:27:15:B5:5B:12', NULL, 'off', 1, '', NULL, 0, '2019-04-10 21:12:15', '2019-04-10 22:05:59');
INSERT INTO `devices` VALUES (639, 'BGWR419008', 'BCP', NULL, 'undefined', '192.168.0.146', 'null', '354444076295114', 'null', '354444076295122', 'VSP1001901S00270', '00:27:15:6D:DA:60', NULL, 'off', 1, '', NULL, 0, '2019-04-10 23:35:14', '2019-04-11 02:43:34');

-- ----------------------------
-- Table structure for pgp_emails
-- ----------------------------
DROP TABLE IF EXISTS `pgp_emails`;
CREATE TABLE `pgp_emails`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pgp_emails`(`pgp_email`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `pgp_emails_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 185 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (125, NULL, '358GTR@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', '2019-04-11 06:23:27');
INSERT INTO `pgp_emails` VALUES (126, 22, '599NGT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-10 09:47:46');
INSERT INTO `pgp_emails` VALUES (127, NULL, '349VFT@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (128, NULL, '791BFT@TITANSECURE.BIZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (129, NULL, '1619DKV@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (130, NULL, '5438DNE@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
INSERT INTO `pgp_emails` VALUES (131, NULL, '2675DKN@ARMORSEC.XYZ', 0, '2019-04-08 10:58:08', NULL);
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
INSERT INTO `pgp_emails` VALUES (143, NULL, '5373SAJ@ARMORSEC.XYZ', 0, '2019-04-08 10:58:09', NULL);
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
  `id` int(11) NOT NULL,
  `policy_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `policy_note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `setting` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sim_id_UNIQUE`(`sim_id`) USING BTREE,
  INDEX `device_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `sim_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc_profile` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_setting_id`(`device_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 423 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `extansion` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `primary_key`(`id`) USING BTREE,
  UNIQUE INDEX `user_unique_apps`(`device_id`, `app_id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `app_id`(`app_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 79 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (57, 647, 40, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (58, 647, 37, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (59, 647, 39, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (60, 647, 38, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (61, 647, 36, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (62, 647, 44, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (63, 647, 54, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (64, 647, 42, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (65, 647, 43, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (66, 647, 53, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (67, 647, 41, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (68, 647, 55, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (69, 647, 46, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (70, 647, 45, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (71, 647, 47, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (72, 647, 52, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (73, 647, 48, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (74, 647, 50, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (75, 647, 51, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (76, 647, 56, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (77, 647, 49, 1, 1, 1, 0, '2019-04-08 13:06:55', '2019-04-09 15:51:09');
INSERT INTO `user_apps` VALUES (78, 647, 78, 1, 1, 1, 0, '2019-04-09 15:16:40', '2019-04-09 15:51:09');

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
  `created_at` timestamp(0) NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `prnt_dealer_id`(`prnt_dlr_id`) USING BTREE,
  CONSTRAINT `usr_acc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `usr_acc_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------
INSERT INTO `usr_acc` VALUES (22, 636, NULL, 'hhh@hhh.com', 223, 0, NULL, 'null', NULL, 6, '2019/10/10', '4247339', 'active', 1, 1, 'wipe', '', 0, 0, NULL, NULL, '2019-04-10 09:47:46', '2019-04-11 10:29:34');
INSERT INTO `usr_acc` VALUES (23, 637, NULL, NULL, 224, 0, '417695', NULL, NULL, NULL, NULL, NULL, '', 0, NULL, NULL, '', 0, 0, NULL, NULL, '2019-04-10 21:07:15', NULL);
INSERT INTO `usr_acc` VALUES (24, 638, NULL, 'zaid@zaid.com', NULL, 0, NULL, 'undefined', '', 6, '', '7802345', '', 0, 0, 'wipe', '', 1, 0, NULL, NULL, '2019-04-10 21:12:15', '2019-04-10 22:08:03');
INSERT INTO `usr_acc` VALUES (25, 639, NULL, 'zaid@canadaworldapps.com', 224, 0, NULL, 'undefined', NULL, 6, '2019/10/11', '9170111', 'active', 1, 1, 'wipe', 'suspended', 0, 0, NULL, NULL, '2019-04-10 23:35:14', '2019-04-11 11:59:12');

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
  `created_at` timestamp(0) NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
