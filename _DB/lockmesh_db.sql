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

 Date: 02/04/2019 16:13:26
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

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
  CONSTRAINT `chat_ids_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
) ENGINE = InnoDB AUTO_INCREMENT = 85 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 222 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');

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
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 626 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for pgp_emails
-- ----------------------------
DROP TABLE IF EXISTS `pgp_emails`;
CREATE TABLE `pgp_emails`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT NULL,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pgp_emails`(`pgp_email`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `pgp_emails_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `device_id` int(11) NULL DEFAULT NULL,
  `sim_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `start_date` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `expiry_date` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sim_id_UNIQUE`(`sim_id`) USING BTREE,
  INDEX `device_id`(`device_id`) USING BTREE,
  CONSTRAINT `sim_ids_ibfk_1` FOREIGN KEY (`device_id`) REFERENCES `devices` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
  `status` enum('expired','active','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'active',
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
  CONSTRAINT `usr_acc_ibfk_2` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT,
  CONSTRAINT `usr_acc_ibfk_3` FOREIGN KEY (`prnt_dlr_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

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

-- ----------------------------
-- View structure for userstat
-- ----------------------------
DROP VIEW IF EXISTS `userstat`;
CREATE ALGORITHM = UNDEFINED DEFINER = `root`@`localhost` SQL SECURITY DEFINER VIEW `userstat` AS select `devices`.`id` AS `device_id`,`usr_acc`.`id` AS `acc_id`,`dealers`.`dealer_name` AS `dealer_name`,`pgp_emails`.`pgp_email` AS `pgp_email`,`chat_ids`.`chat_id` AS `chat_id`,`sim_ids`.`sim_id` AS `sim_id` from (((((`devices` join `usr_acc` on((`devices`.`id` = `usr_acc`.`device_id`))) join `dealers` on((`dealers`.`dealer_id` = `usr_acc`.`dealer_id`))) left join `pgp_emails` on((`pgp_emails`.`user_acc_id` = `usr_acc`.`id`))) left join `chat_ids` on((`chat_ids`.`user_acc_id` = `usr_acc`.`id`))) left join `sim_ids` on((`sim_ids`.`device_id` = `usr_acc`.`device_id`))) where (`usr_acc`.`transfer_status` = 0);

SET FOREIGN_KEY_CHECKS = 1;
