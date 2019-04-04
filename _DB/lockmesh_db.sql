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

 Date: 04/04/2019 11:14:46
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

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
  `status` enum('Off','On') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Off',
  `created` datetime(0) NULL DEFAULT NULL,
  `modified` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (29, 'new file added', 'logo-1554200258055.jpg', 'apk-1554200217607.apk', 'basic', NULL, 'On', '2019-04-02 15:17:59', '2019-04-02 15:20:52', 0);

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
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 141 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of apps_info
-- ----------------------------
INSERT INTO `apps_info` VALUES (1, 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (2, 'com.android.chromeChrome', 'Chrome', 'com.android.chrome', 'icon_Chrome.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (3, 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (4, 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (5, 'com.google.android.apps.messagingMessages', 'Messages', 'com.google.android.apps.messaging', 'icon_Messages.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (6, 'com.google.android.apps.photosPhotos', 'Photos', 'com.google.android.apps.photos', 'icon_Photos.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (7, 'com.google.android.apps.tachyonDuo', 'Duo', 'com.google.android.apps.tachyon', 'icon_Duo.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (8, 'com.google.android.calendarCalendar', 'Calendar', 'com.google.android.calendar', 'icon_Calendar.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (9, 'com.android.soundrecorderSound Recorder', 'Sound Recorder', 'com.android.soundrecorder', 'icon_Sound Recorder.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (10, 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (11, 'com.google.android.gmGmail', 'Gmail', 'com.google.android.gm', 'icon_Gmail.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (12, 'com.google.android.musicPlay Music', 'Play Music', 'com.google.android.music', 'icon_Play Music.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (13, 'com.google.android.youtubeYouTube', 'YouTube', 'com.google.android.youtube', 'icon_YouTube.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (14, 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (15, 'com.android.wifiappWifiApp', 'WifiApp', 'com.android.wifiapp', 'icon_WifiApp.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (16, 'com.adups.fotaWireless Update', 'Wireless Update', 'com.adups.fota', 'icon_Wireless Update.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (17, 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (18, 'com.android.vendingPlay Store', 'Play Store', 'com.android.vending', 'icon_Play Store.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (19, 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (20, 'com.android.fmradioFM Radio', 'FM Radio', 'com.android.fmradio', 'icon_FM Radio.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (21, 'com.android.qr_codescanQRCode Scan', 'QRCode Scan', 'com.android.qr_codescan', 'icon_QRCode Scan.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (22, 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (23, 'com.android.systemmanagerSystem Manager', 'System Manager', 'com.android.systemmanager', 'icon_System Manager.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (24, 'com.google.android.apps.nbu.filesFiles', 'Files', 'com.google.android.apps.nbu.files', 'icon_Files.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (25, 'com.google.android.googlequicksearchboxGoogle', 'Google', 'com.google.android.googlequicksearchbox', 'icon_Google.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (26, 'com.google.android.apps.docsDrive', 'Drive', 'com.google.android.apps.docs', 'icon_Drive.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (27, 'com.google.android.apps.mapsMaps', 'Maps', 'com.google.android.apps.maps', 'icon_Maps.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (28, 'com.mediatek.emcameraEmCamera', 'EmCamera', 'com.mediatek.emcamera', 'icon_EmCamera.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (29, 'com.mediatek.mtkloggerMTKLogger', 'MTKLogger', 'com.mediatek.mtklogger', 'icon_MTKLogger.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (30, 'com.android.myapplicationMy Application', 'My Application', 'com.android.myapplication', 'icon_My Application.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (31, 'com.android.myapplication8My Application8', 'My Application8', 'com.android.myapplication8', 'icon_My Application8.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (32, 'com.example.whatsappmarketingWhatsapp Marketing', 'Whatsapp Marketing', 'com.example.whatsappmarketing', 'icon_Whatsapp Marketing.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (33, 'com.sunnatMy Application', 'My Application', 'com.sunnat', 'icon_My Application.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (34, 'com.sunztech.vpnSunzTech Vpn', 'SunzTech Vpn', 'com.sunztech.vpn', 'icon_SunzTech Vpn.png', '2019-04-03 17:59:42', NULL);
INSERT INTO `apps_info` VALUES (35, 'com.vortexlocker.appScreen Locker', 'Screen Locker', 'com.vortexlocker.app', 'icon_Screen Locker.png', '2019-04-03 17:59:42', NULL);

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
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `chat_id_unique`(`chat_id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `chat_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `id_2`(`id`) USING BTREE,
  CONSTRAINT `dealer_dropdown_list_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 89 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (85, 154, '[\"ACTIONS\"]', 'apk', '2019-04-02 16:14:22', '2019-04-02 16:14:22');
INSERT INTO `dealer_dropdown_list` VALUES (86, 154, '[\"DEVICE ID\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-02 16:18:12', '2019-04-03 18:36:18');
INSERT INTO `dealer_dropdown_list` VALUES (87, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\"]', 'dealer', '2019-04-03 15:23:12', '2019-04-03 18:33:42');
INSERT INTO `dealer_dropdown_list` VALUES (88, 154, '[\"ACTIONS\"]', 'sdealer', '2019-04-03 15:23:15', '2019-04-03 18:33:39');

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
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_pagination_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (4, 154, 10, 'devices', '2019-04-02 16:18:12', '2019-04-02 16:18:12');
INSERT INTO `dealer_pagination` VALUES (5, 154, 10, 'dealer', '2019-04-03 15:23:13', '2019-04-03 15:23:13');

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
) ENGINE = InnoDB AUTO_INCREMENT = 223 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (222, NULL, NULL, 0, 'usman hafeez', 'usmanhafeez147@gmail.com', '56b49b0545d3692fa55363d5d59e3635', '433523', 2, 0, NULL, '2019-04-03 15:23:26', '2019-04-03 15:23:26');

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
  `setting` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 636 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (635, 'QBEP609949', 'usman hafeez', NULL, 'huawie', '192.168.18.160', NULL, '354444076298332', NULL, '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', NULL, 'off', 1, NULL, 0, '2019-04-03 17:01:26', '2019-04-03 18:41:11');

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
  `updated_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pgp_emails`(`pgp_email`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `pgp_emails_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 124 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (63, NULL, '955MNH@TITANSECURE.BIZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (64, NULL, '358GTR@TITANSECURE.BIZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (65, NULL, '599NGT@TITANSECURE.BIZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (66, NULL, '791BFT@TITANSECURE.BIZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (67, NULL, '5438DNE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (68, NULL, '2675DKN@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (69, NULL, '1619DKV@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (70, NULL, '3754ZUB@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (71, NULL, '4338GQG@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (72, NULL, '5147DXT@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (73, NULL, '349VFT@TITANSECURE.BIZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (74, NULL, '3669NBQ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (75, NULL, '8244SRE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (76, NULL, '5412JJN@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (77, NULL, '4134PTE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (78, NULL, '2954PAJ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (79, NULL, '6845YAY@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (80, NULL, '7992PFY@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (81, NULL, '4967GCM@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (82, NULL, '5373SAJ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (83, NULL, '1233NPX@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (84, NULL, '7921MKT@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (85, NULL, '2188PBW@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (86, NULL, '2535MPM@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (87, NULL, '4254PMS@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (88, NULL, '4511AXM@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (89, NULL, '4437CZC@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (90, NULL, '8729YAM@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (91, NULL, '7497CXZ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (92, NULL, '5464NJF@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (93, NULL, '6362MBN@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (94, NULL, '5752CXB@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (95, NULL, '9498NBS@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (96, NULL, '3789NZU@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (97, NULL, '9643NZE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (98, NULL, '9347SKJ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (99, NULL, '8837ZRE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (100, NULL, '7245BCB@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (101, NULL, '9279GBS@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (102, NULL, '1747BBV@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (103, NULL, '4288DXZ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (104, NULL, '2474VJS@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (105, NULL, '1976JSN@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (106, NULL, '1879TWV@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (107, NULL, '2458VZC@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (108, NULL, '1842WKX@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (109, NULL, '5225CHG@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (110, NULL, '4337VZF@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (111, NULL, '5734TXZ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (112, NULL, '4763XEK@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (113, NULL, '2196GNW@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (114, NULL, '8931APD@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (115, NULL, '8478YXA@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (116, NULL, '9437TPJ@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (117, NULL, '4347HVE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (118, NULL, '5945VEC@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (119, NULL, '2583AUF@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (120, NULL, '7574XDR@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (121, NULL, '8497KRA@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (122, NULL, '6497NVE@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');
INSERT INTO `pgp_emails` VALUES (123, NULL, '3371GCF@ARMORSEC.XYZ', 0, '2019-04-04 11:12:02', '2019-04-04 11:12:02');

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
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

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
  CONSTRAINT `sim_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc_profile` (`id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = MyISAM AUTO_INCREMENT = 312 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `primary_key`(`id`) USING BTREE,
  UNIQUE INDEX `user_unique_apps`(`device_id`, `app_id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `app_id`(`app_id`) USING BTREE,
  CONSTRAINT `user_apps_ibfk_1` FOREIGN KEY (`app_id`) REFERENCES `apps_info` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `user_apps_ibfk_2` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 36 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (1, 635, 3, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (2, 635, 5, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (3, 635, 4, 1, 0, 1, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (4, 635, 1, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (5, 635, 2, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (6, 635, 8, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (7, 635, 6, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (8, 635, 7, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (9, 635, 9, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (10, 635, 10, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (11, 635, 11, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (12, 635, 14, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (13, 635, 13, 1, 0, 1, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (14, 635, 12, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (15, 635, 17, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (16, 635, 15, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (17, 635, 21, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (18, 635, 22, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (19, 635, 19, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (20, 635, 20, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (21, 635, 16, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (22, 635, 24, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (23, 635, 18, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (24, 635, 23, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (25, 635, 31, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (26, 635, 30, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (27, 635, 32, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (28, 635, 26, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (29, 635, 25, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (30, 635, 28, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (31, 635, 29, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (32, 635, 33, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (33, 635, 27, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (34, 635, 34, 1, 0, 0, '2019-04-03 17:59:42', NULL);
INSERT INTO `user_apps` VALUES (35, 635, 35, 0, 1, 1, '2019-04-03 17:59:42', NULL);

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
  `account_status` enum('suspended','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `unlink_status` tinyint(4) NOT NULL DEFAULT 0,
  `transfer_status` tinyint(4) UNSIGNED NULL DEFAULT 0,
  `dealer_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `prnt_dlr_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `prnt_dealer_id`(`prnt_dlr_id`) USING BTREE,
  CONSTRAINT `usr_acc_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `usr_acc_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 10 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------
INSERT INTO `usr_acc` VALUES (9, 635, NULL, 'usman@gmail.com', 222, 0, '433523', NULL, '2019/04/03', NULL, '2020/04/03', NULL, 'active', 1, NULL, '', 0, 0, NULL, NULL, '2019-04-03 17:01:26', '2019-04-03 18:41:11');

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

SET FOREIGN_KEY_CHECKS = 1;
