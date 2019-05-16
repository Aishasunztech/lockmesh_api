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

 Date: 15/05/2019 17:27:34
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
) ENGINE = InnoDB AUTO_INCREMENT = 101 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of acc_action_history
-- ----------------------------
INSERT INTO `acc_action_history` VALUES (7, 'Pre-activated', 'HNFI517627', 'test1', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'test@gmail.com', 229, 0, 'null', '1', 'null', 3, '2019/07/27', '8344795', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 40, 'test1@titansecure.biz', 'N/A', 'N/A', 1, 'Pre-activated', '2019-04-28 19:37:17', '2019-04-28 19:37:17');
INSERT INTO `acc_action_history` VALUES (8, 'Pre-activated', 'PDJS422924', 'test1', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'test1@titansecure.biz', 229, 0, 'null', 'undefined', 'null', 3, '2019/07/28', '3995110', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 42, 'test1@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-28 19:38:15', NULL);
INSERT INTO `acc_action_history` VALUES (9, 'Pre-activated', 'null', 'Adeel', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'adeel@sunztech.com', 231, 0, 'null', 'undefined', 'null', 0, '2019/05/06', '8586223', '', 0, 0, 'undefined', '', 0, 0, 'Adeel', 'null', 43, 'test3@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-29 13:01:19', NULL);
INSERT INTO `acc_action_history` VALUES (10, 'Pre-activated', 'null', 'titanlyon', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'titanlyon@titansecure.biz', 229, 0, 'null', 'undefined', 'null', 3, '2019/07/29', '5634666', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 44, 'test6@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-29 16:12:20', NULL);
INSERT INTO `acc_action_history` VALUES (11, 'Pre-activated', 'null', 'zaid', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'Tsupport@titansecure.biz', 224, 0, 'null', 'undefined', 'null', 6, '2019/10/29', '5759705', '', 0, 0, 'undefined', '', 0, 0, 'zaid', 'null', 45, 'test9@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-29 16:35:26', NULL);
INSERT INTO `acc_action_history` VALUES (12, 'SUSPENDED', 'FBED031936', 'zaid', 'null', 'undefined', '26.67.230.34', '8901260852293381554', '356338090435516', 'null', 'null', 'R28K52MSDSM', '48:C7:96:41:74:19', 'null', 'off', 1, '', 'null', 0, NULL, 'Tsupport@titansecure.biz', 224, 0, 'null', 'undefined', '2019/04/29', 6, '2019/10/29', '5759705', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'zaid', 'null', 45, 'test9@titansecure.biz', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-29 16:45:07', NULL);
INSERT INTO `acc_action_history` VALUES (13, 'ACTIVE', 'FBED031936', 'zaid', 'null', 'undefined', '26.67.230.34', '8901260852293381554', '356338090435516', 'null', 'null', 'R28K52MSDSM', '48:C7:96:41:74:19', 'null', 'off', 1, '', 'null', 0, NULL, 'Tsupport@titansecure.biz', 224, 0, 'null', 'undefined', '2019/04/29', 6, '2019/10/29', '5759705', 'active', 1, 1, 'undefined', '', 0, 0, 'zaid', 'null', 45, 'test9@titansecure.biz', 'N/A', 'N/A', NULL, 'Active', '2019-04-29 16:45:22', NULL);
INSERT INTO `acc_action_history` VALUES (15, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '1348771', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 46, '7921MKT@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (16, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '6361564', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 47, '2188PBW@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (17, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '8517262', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 48, '2535MPM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (18, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '5630814', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 49, '4254PMS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (19, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '0225517', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (20, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '5640681', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 51, '4437CZC@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (21, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '1232445', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 52, '8729YAM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (22, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '1490199', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 53, '7497CXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (23, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '3121419', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 54, '5464NJF@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (24, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 3, '2019/07/30', '7409656', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 08:03:30', NULL);
INSERT INTO `acc_action_history` VALUES (26, 'SUSPENDED', 'DDAF250244', 'null', 'Fj8PLAgJZVEWKG55AAAv', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 09:30:14', NULL);
INSERT INTO `acc_action_history` VALUES (27, 'ACTIVE', 'DDAF250244', 'null', 'Fj8PLAgJZVEWKG55AAAv', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 09:30:19', NULL);
INSERT INTO `acc_action_history` VALUES (28, 'SUSPENDED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 09:35:50', NULL);
INSERT INTO `acc_action_history` VALUES (29, 'ACTIVE', 'DDAF250244', 'null', 'NvmNy0CzZFEQtgzAAAA3', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 09:37:54', NULL);
INSERT INTO `acc_action_history` VALUES (33, 'SUSPENDED', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 10:43:34', NULL);
INSERT INTO `acc_action_history` VALUES (34, 'ACTIVE', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 10:43:43', NULL);
INSERT INTO `acc_action_history` VALUES (35, 'SUSPENDED', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 10:43:52', NULL);
INSERT INTO `acc_action_history` VALUES (36, 'ACTIVE', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 10:43:59', NULL);
INSERT INTO `acc_action_history` VALUES (43, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '0494318', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 56, '5752CXB@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (44, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '4346035', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 57, '3789NZU@ARMORSEC.XYZ', 'N/A', 'N/A', 1, 'Pre-activated', '2019-05-01 04:54:32', '2019-05-01 04:54:32');
INSERT INTO `acc_action_history` VALUES (45, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '7803190', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 58, '9643NZE@ARMORSEC.XYZ', 'N/A', 'N/A', 1, 'Pre-activated', '2019-05-01 04:54:32', '2019-05-01 04:54:32');
INSERT INTO `acc_action_history` VALUES (46, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '8257071', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 59, '9347SKJ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (47, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '7683594', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 60, '8837ZRE@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (48, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '0664192', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 61, '7245BCB@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (49, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '8609465', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 62, '9279GBS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (50, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '7240531', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 63, '1747BBV@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (51, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '2915866', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 64, '4288DXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (52, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 12, '2020/04/30', '4721576', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-04-30 13:38:00', NULL);
INSERT INTO `acc_action_history` VALUES (55, 'SUSPENDED', 'DDAF250244', 'null', '5njrdxdT9eIKXDubAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 12, '2020/04/30', '4721576', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 13:42:31', NULL);
INSERT INTO `acc_action_history` VALUES (56, 'ACTIVE', 'DDAF250244', 'null', '5njrdxdT9eIKXDubAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 12, '2020/04/30', '4721576', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 13:42:36', NULL);
INSERT INTO `acc_action_history` VALUES (64, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '9380453', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 66, '3789NZU@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (65, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '0021097', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 67, '9643NZE@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (66, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '4165191', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 68, '1976JSN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (67, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '7964696', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 69, '1879TWV@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (68, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '2062394', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 70, '2458VZC@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (69, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '2714726', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 71, '1842WKX@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (70, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '6340400', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 72, '5225CHG@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (71, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '3113884', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 73, '4337VZF@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (72, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '8752917', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 74, '5734TXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (73, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/01', '6688603', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 75, '4763XEK@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-01 05:35:44', NULL);
INSERT INTO `acc_action_history` VALUES (75, 'Pre-activated', 'null', 'sarkozi', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, '377mmk@titansecure.biz', 229, 0, 'null', 'undefined', 'null', 3, '2019/08/02', '2552031', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 76, 'test3@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-02 12:35:34', NULL);
INSERT INTO `acc_action_history` VALUES (76, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 229, 0, 'null', 'null', 'null', 3, '2019/08/03', '5608439', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 77, '2196GNW@ARMORSEC.XYZ', 'N/A', 'N/A', 1, 'Pre-activated', '2019-05-03 11:48:00', '2019-05-03 11:48:00');
INSERT INTO `acc_action_history` VALUES (77, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 229, 0, 'null', 'null', 'null', 3, '2019/08/03', '0096184', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 78, '8931APD@ARMORSEC.XYZ', 'N/A', 'N/A', 1, 'Pre-activated', '2019-05-03 11:48:12', '2019-05-03 11:48:12');
INSERT INTO `acc_action_history` VALUES (78, 'Pre-activated', 'null', 'jean', 'null', 'undefined', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, '997cdt@titansecure.biz', 229, 0, 'null', 'undefined', 'null', 6, '2019/11/03', '4895982', '', 0, 0, 'undefined', '', 0, 0, 'titan', 'null', 79, 'test4@titansecure.biz', 'N/A', 'N/A', NULL, 'Pre-activated', '2019-05-03 11:49:49', NULL);
INSERT INTO `acc_action_history` VALUES (79, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '7723061', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 80, '2196GNW@ARMORSEC.XYZ', '5141281331', '13', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (80, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '9031428', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 81, '8931APD@ARMORSEC.XYZ', '5141281332', '21', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (81, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '7007521', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 82, '8478YXA@ARMORSEC.XYZ', '5141281333', '5345', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (82, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '8225131', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 83, '9437TPJ@ARMORSEC.XYZ', '5141281334', '1231231', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (83, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '0102902', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 84, '4347HVE@ARMORSEC.XYZ', '5141281336', '123123', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (84, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '9634678', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 85, '5945VEC@ARMORSEC.XYZ', '5141281337', '1233332', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (85, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '8933490', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 86, '2583AUF@ARMORSEC.XYZ', '5141281338', '3345', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (86, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '5454928', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 87, '7574XDR@ARMORSEC.XYZ', '5141281339', 'N/A', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (87, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '0339737', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 88, '8497KRA@ARMORSEC.XYZ', '5141281340', 'N/A', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (88, 'Pre-activated', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', 'null', 6, '2019/11/11', '4006618', '', 0, 0, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 89, '3371GCF@ARMORSEC.XYZ', '5141281341', 'N/A', NULL, 'Pre-activated', '2019-05-11 04:47:24', NULL);
INSERT INTO `acc_action_history` VALUES (89, 'UNLINKED', 'AECE977918', 'test', 'null', 'vortex', '192.168.0.106', 'null', '526791423794766', 'null', '015453980052264', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'testing@gmail.com', 225, 225, '541763', '123', '', NULL, '', 'null', '', 0, NULL, 'undefined', '', 1, 0, 'Hamza Dawood', 'Hamza Dawood', 90, 'test8@titansecure.biz', '5141281348', 'N/A', NULL, 'Unlinked', '2019-05-11 10:34:44', NULL);
INSERT INTO `acc_action_history` VALUES (90, 'UNLINKED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.100', '8992042306182528852f', '354444076298332', '8992042306182528811f', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '7723061', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 80, '2196GNW@ARMORSEC.XYZ', '5141281331', '13', NULL, 'Unlinked', '2019-05-11 10:44:39', NULL);
INSERT INTO `acc_action_history` VALUES (91, 'UNLINKED', 'ECCB212734', 'null', 'Mg49i1TrKTQS2QprAAAV', 'null', '192.168.0.110', 'null', 'null', 'null', 'null', '0123456789ABCDEF', '00:69:06:45:00:CC', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '0339737', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 88, '8497KRA@ARMORSEC.XYZ', '5141281340', 'N/A', NULL, 'Unlinked', '2019-05-11 10:58:30', NULL);
INSERT INTO `acc_action_history` VALUES (92, 'UNLINKED', 'DDAF250244', 'null', '4IQxv7d3fb17AkCrAAAZ', 'null', '192.168.0.104', '8992042306182528852f', '354444076298332', '8992042306182528811f', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '4006618', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 89, '3371GCF@ARMORSEC.XYZ', '5141281341', 'N/A', NULL, 'Unlinked', '2019-05-11 11:02:10', NULL);
INSERT INTO `acc_action_history` VALUES (93, 'UNLINKED', 'DDAF250244', 'null', 'gI6AaMKJbBClokjmAAAU', 'null', '192.168.0.104', '8992042306182528852f', '354444076298332', '8992042306182528811f', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '5454928', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 87, '7574XDR@ARMORSEC.XYZ', '5141281339', 'N/A', NULL, 'Unlinked', '2019-05-11 11:12:12', NULL);
INSERT INTO `acc_action_history` VALUES (94, 'UNLINKED', 'DDAF250244', 'null', 'ln5HbenTh6ZIC4PKAAAX', 'null', '192.168.0.104', '8992042306182528852f', '354444076298332', '8992042306182528811f', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '0102902', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 84, '4347HVE@ARMORSEC.XYZ', '5141281336', '123123', NULL, 'Unlinked', '2019-05-11 11:17:49', NULL);
INSERT INTO `acc_action_history` VALUES (95, 'UNLINKED', 'ECCB212734', 'Test', 'null', 'vortex', '192.168.0.110', 'null', 'null', 'null', 'null', '0123456789ABCDEF', '00:69:06:45:00:CC', 'null', 'off', 0, '', 'null', 0, NULL, 'tsting@gmail.com', 225, 225, '541763', 'test123', '', NULL, '', 'null', '', 0, NULL, 'undefined', '', 1, 0, 'Hamza Dawood', 'Hamza Dawood', 91, 'test1@titansecure.biz', '5141281345', 'N/A', NULL, 'Unlinked', '2019-05-11 11:20:06', NULL);
INSERT INTO `acc_action_history` VALUES (96, 'UNLINKED', 'AECE977918', 'null', '8hBnae15jCiltGUHAAAF', 'null', '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '7007521', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 82, '8478YXA@ARMORSEC.XYZ', '5141281333', '5345', NULL, 'Unlinked', '2019-05-14 12:07:07', NULL);
INSERT INTO `acc_action_history` VALUES (97, 'UNLINKED', 'AECE977918', 'null', 'dNW--D-hJtCo90LsAAAM', 'null', '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '9031428', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 81, '8931APD@ARMORSEC.XYZ', '5141281332', '21', NULL, 'Unlinked', '2019-05-14 12:10:36', NULL);
INSERT INTO `acc_action_history` VALUES (98, 'UNLINKED', 'AECE977918', 'null', 'Ax4UmZbSKaZXhcJmAAAF', 'null', '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '8225131', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 83, '9437TPJ@ARMORSEC.XYZ', '5141281334', '1231231', NULL, 'Unlinked', '2019-05-14 12:27:22', NULL);
INSERT INTO `acc_action_history` VALUES (99, 'UNLINKED', 'AECE977918', 'null', '203DXwa25SCwtAnKAAAJ', 'null', '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '9634678', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 85, '5945VEC@ARMORSEC.XYZ', '5141281337', '1233332', NULL, 'Unlinked', '2019-05-14 12:40:00', NULL);
INSERT INTO `acc_action_history` VALUES (100, 'wiped', 'AECE977918', 'null', 'Zv2j2J2Gzgu9XBAQAAAQ', 'null', '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/05/14', 6, '2019/11/14', '8933490', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 86, '2583AUF@ARMORSEC.XYZ', '5141281338', '3345', NULL, 'Active', '2019-05-14 15:30:52', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 56 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 43 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
  `label` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 60 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (41, 'SL version 4.68', 'logo-1557389662458.jpg', 'apk-1557920591896.apk', 'permanent', NULL, 'com.vortexlocker.ap', NULL, '468', '4.68', '{\"versionCode\":468,\"versionName\":\"4.68\",\"compileSdkVersion\":28,\"compileSdkVersionCodename\":\"9\",\"package\":\"com.vortexlocker.ap\",\"platformBuildVersionCode\":468,\"platformBuildVersionName\":1083556495,\"usesPermissions\":[{\"name\":\"android.permission.PACKAGE_USAGE_STATS\"},{\"name\":\"android.permission.REQUEST_INSTALL_PACKAGES\"},{\"name\":\"android.permission.REQUEST_IGNORE_BATTERY_OPTIMIZATIONS\"},{\"name\":\"android:name=”android.permission.GET_TASKS\"},{\"name\":\"com.android.launcher.permission.INSTALL_SHORTCUT\"},{\"name\":\"com.android.launcher.permission.UNINSTALL_SHORTCUT\"},{\"name\":\"android.permission.BIND_ACCESSIBILITY_SERVICE\"},{\"name\":\"android.permission.KILL_BACKGROUND_PROCESSES\"},{\"name\":\"android.permission.REORDER_TASKS\"},{\"name\":\"android.permission.STATUS_BAR\"},{\"name\":\"android.permission.INTERNAL_SYSTEM_WINDOW\"},{\"name\":\"android.permission.READ_PHONE_STATE\"},{\"name\":\"android.permission.TETHER_PRIVILEGE\"},{\"name\":\"android.permission.ACCESS_WIFI_STATE\"},{\"name\":\"android.permission.CHANGE_WIFI_STATE\"},{\"name\":\"android.permission.ACCESS_NETWORK_STATE\"},{\"name\":\"android.permission.CHANGE_NETWORK_STATE\"},{\"name\":\"android.permission.WRITE_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.READ_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.INSTALL_PACKAGES\"},{\"name\":\"android.permission.WRITE_SETTINGS\"},{\"name\":\"android.permission.WRITE_SECURE_SETTINGS\"},{\"name\":\"android.permission.FORCE_STOP_PACKAGES\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"Manifest.permission.ANSWER_PHONE_CALLS\"},{\"name\":\"android.permission.BLUETOOTH\"},{\"name\":\"android.permission.CALL_PHONE\"},{\"name\":\"android.permission.BLUETOOTH_ADMIN\"},{\"name\":\"android.permission.DISABLE_KEYGUARD\"},{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.WAKE_LOCK\"},{\"name\":\"android.permission.EXPAND_STATUS_BAR\"},{\"name\":\"android.permission.GET_TASKS\"},{\"name\":\"android.permission.SYSTEM_ALERT_WINDOW\"},{\"name\":\"android.permission.ACCESS_FINE_LOCATION\"},{\"name\":\"android.permission.ACCESS_COARSE_LOCATION\"},{\"name\":\"android.permission.ACTION_MANAGE_OVERLAY_PERMISSION\"},{\"name\":\"android.permission.TYPE_APPLICATION_OVERLAY\"}],\"permissions\":[],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":21,\"targetSdkVersion\":28},\"usesConfiguration\":null,\"usesFeatures\":[],\"supportsScreens\":null,\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f100006\",\"label\":\"resourceId:0x7f0f001c\",\"icon\":\"resourceId:0x7f0d0000\",\"name\":\"com.screenlocker.secure.app.MyApplication\",\"sharedUserId\":\"android.uid.system\",\"debuggable\":true,\"allowBackup\":true,\"hardwareAccelerated\":false,\"largeHeap\":true,\"supportsRtl\":true,\"appComponentFactory\":\"androidx.core.app.CoreComponentFactory\",\"activities\":[{\"theme\":\"resourceId:0x1030010\",\"name\":\"com.screenlocker.secure.socket.TransparentActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f100006\",\"name\":\"com.screenlocker.secure.settings$Wallpaper$ChangeWallpaper\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f1000eb\",\"name\":\"com.secureClear.SecureClearActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.IMEIActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.permissions.InstallAppSilently\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.permissions.WelcomeScreenActivity\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.ExitActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.secureSettings.SecureSettingsActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.policy.PolicyActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f1000ca\",\"name\":\"com.screenlocker.secure.launcher.MainActivity\",\"enabled\":true,\"taskAffinity\":\"\",\"clearTaskOnLaunch\":true,\"stateNotNeeded\":true,\"launchMode\":2,\"screenOrientation\":5,\"configChanges\":3571,\"windowSoftInputMode\":32,\"resumeWhilePausing\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.HOME\"},{\"name\":\"android.intent.category.DEFAULT\"},{\"name\":\"android.intent.category.MONKEY\"},{\"name\":\"android.intent.category.LAUNCHER_APP\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.SettingsActivity\",\"launchMode\":1,\"screenOrientation\":1,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]},{\"theme\":\"resourceId:0x7f100006\",\"name\":\"com.screenlocker.secure.settings$Wallpaper$WallpaperActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f100006\",\"name\":\"com.screenlocker.secure.permissions.SteppersActivity\",\"screenOrientation\":1,\"configChanges\":1456,\"windowSoftInputMode\":32,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.SetUpLockActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":5,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.appSelection.AppSelectionActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":3,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.ManagePasswords\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f10003f\",\"name\":\"com.theartofdev.edmodo.cropper.CropImageActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.systemControls.SystemPermissionActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.CodeSettingActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.installApps.InstallAppsActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings$codeSetting$Sim$SimActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f0f001c\",\"name\":\"com.screenlocker.secure.mdm.MainActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":3,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.mdm.ui.LinkDeviceActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f1000eb\",\"name\":\"com.secureSetting.SecureSettingsMain\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f1000eb\",\"name\":\"com.secureMarket.SecureMarketActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.codeSetting.Sim.SimActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.Wallpaper.WallpaperActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.Wallpaper.ChangeWallpaper\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f1000c8\",\"label\":\"\",\"name\":\"pub.devrel.easypermissions.AppSettingsDialogHolderActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]}],\"activityAliases\":[],\"launcherActivities\":[{\"name\":\"com.screenlocker.secure.settings.SettingsActivity\",\"launchMode\":1,\"screenOrientation\":1,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]}],\"services\":[{\"name\":\"com.screenlocker.secure.utils.LifecycleReceiverService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.service.LockScreenService\",\"enabled\":true,\"exported\":true,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f0f001c\",\"name\":\"com.screenlocker.secure.service.DeviceNotificationListener\",\"permission\":\"android.permission.BIND_NOTIFICATION_LISTENER_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.service.notification.NotificationListenerService\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.socket.service.SocketService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.MyService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.mdm.utils.LifecycleReceiverService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.service.UpdateTriggerService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.SystemAlarmService\",\"enabled\":\"resourceId:0x7f040003\",\"exported\":false,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemjob.SystemJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":\"resourceId:0x7f040004\",\"exported\":true,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.room.MultiInstanceInvalidationService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.screenlocker.secure.ReBootReciever\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.QUICKBOOT_POWERON\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.ShutDownReceiver\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_SHUTDOWN\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.MyAdmin\",\"permission\":\"android.permission.BIND_DEVICE_ADMIN\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.app.action.DEVICE_ADMIN_ENABLED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"android.app.device_admin\",\"resource\":\"resourceId:0x7f120000\"}]},{\"name\":\"com.screenlocker.secure.utils.AppInstallReciever\",\"enabled\":true,\"priority\":100,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.PACKAGE_ADDED\"},{\"name\":\"android.intent.action.PACKAGE_REPLACED\"},{\"name\":\"android.intent.action.PACKAGE_REMOVED\"}],\"categories\":[],\"data\":[{\"scheme\":\"package\"}]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.settings.disableCalls.PhoneCallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.PHONE_STATE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.screenlocker.secure.socket.receiver.DeviceStatusReceiver\",\"enabled\":true,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.utils.ForceStopRunnable$BroadcastReceiver\",\"enabled\":true,\"exported\":false,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryChargingProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_POWER_CONNECTED\"},{\"name\":\"android.intent.action.ACTION_POWER_DISCONNECTED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryNotLowProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BATTERY_OKAY\"},{\"name\":\"android.intent.action.BATTERY_LOW\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$StorageNotLowProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DEVICE_STORAGE_LOW\"},{\"name\":\"android.intent.action.DEVICE_STORAGE_OK\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$NetworkStateProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.net.conn.CONNECTIVITY_CHANGE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.RescheduleReceiver\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.TIME_SET\"},{\"name\":\"android.intent.action.TIMEZONE_CHANGED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxyUpdateReceiver\",\"enabled\":\"resourceId:0x7f040003\",\"exported\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"androidx.work.impl.background.systemalarm.UpdateProxies\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"providers\":[{\"name\":\"androidx.core.content.FileProvider\",\"exported\":false,\"authorities\":\"com.vortexlocker.ap.fileprovider\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f120001\"}],\"pathPermissions\":[]},{\"name\":\"androidx.work.impl.WorkManagerInitializer\",\"exported\":false,\"multiprocess\":true,\"authorities\":\"com.vortexlocker.ap.workmanager-init\",\"directBootAware\":false,\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"com.crashlytics.android.CrashlyticsInitProvider\",\"exported\":false,\"authorities\":\"com.vortexlocker.ap.crashlyticsinitprovider\",\"initOrder\":90,\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"androidx.lifecycle.ProcessLifecycleOwnerInitializer\",\"exported\":false,\"multiprocess\":true,\"authorities\":\"com.vortexlocker.ap.lifecycle-process\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]}],\"usesLibraries\":[],\"metaDatas\":[{\"name\":\"io.fabric.ApiKey\",\"value\":\"4ae69637afb36cd9f3268feda60e462831a0cd2e\"}]}}', NULL, NULL, NULL, NULL, NULL, 'On', 1, '2019-04-23 18:24:05', '2019-05-15 17:13:59');
INSERT INTO `apk_details` VALUES (55, 'Facebook Lite', 'logo-1557572131634.jpg', 'apk-1557572140451.apk', 'basic', NULL, 'com.facebook.lite', NULL, '153192400', '145.0.0.8.111', '{\"versionCode\":153192400,\"versionName\":\"145.0.0.8.111\",\"package\":\"com.facebook.lite\",\"usesPermissions\":[{\"name\":\"android.permission.ACCESS_COARSE_LOCATION\"},{\"name\":\"android.permission.ACCESS_FINE_LOCATION\"},{\"name\":\"android.permission.ACCESS_NETWORK_STATE\"},{\"name\":\"android.permission.ACCESS_WIFI_STATE\"},{\"name\":\"android.permission.BATTERY_STATS\"},{\"name\":\"android.permission.BROADCAST_STICKY\"},{\"name\":\"android.permission.CALL_PHONE\"},{\"name\":\"android.permission.CAMERA\"},{\"name\":\"android.permission.CHANGE_NETWORK_STATE\"},{\"name\":\"android.permission.CHANGE_WIFI_STATE\"},{\"name\":\"android.permission.GET_TASKS\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"android.permission.READ_CALENDAR\"},{\"name\":\"android.permission.READ_CONTACTS\"},{\"name\":\"android.permission.GET_ACCOUNTS\"},{\"name\":\"android.permission.AUTHENTICATE_ACCOUNTS\"},{\"name\":\"android.permission.MANAGE_ACCOUNTS\"},{\"name\":\"android.permission.READ_PHONE_STATE\"},{\"name\":\"android.permission.READ_PROFILE\"},{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.RECORD_AUDIO\"},{\"name\":\"android.permission.SYSTEM_ALERT_WINDOW\"},{\"name\":\"android.permission.VIBRATE\"},{\"name\":\"android.permission.WAKE_LOCK\"},{\"name\":\"android.permission.WRITE_CALENDAR\"},{\"name\":\"android.permission.WRITE_CONTACTS\"},{\"name\":\"android.permission.WRITE_EXTERNAL_STORAGE\"},{\"name\":\"com.android.launcher.permission.INSTALL_SHORTCUT\"},{\"name\":\"com.android.launcher.permission.UNINSTALL_SHORTCUT\"},{\"name\":\"com.facebook.lite.permission.C2D_MESSAGE\"},{\"name\":\"com.facebook.receiver.permission.ACCESS\"},{\"name\":\"com.facebook.katana.provider.ACCESS\"},{\"name\":\"com.facebook.orca.provider.ACCESS\"},{\"name\":\"com.facebook.mlite.provider.ACCESS\"},{\"name\":\"com.facebook.wakizashi.provider.ACCESS\"},{\"name\":\"com.facebook.permission.prod.FB_APP_COMMUNICATION\"},{\"name\":\"com.sec.android.provider.badge.permission.WRITE\"},{\"name\":\"com.sec.android.provider.badge.permission.READ\"},{\"name\":\"com.htc.launcher.permission.READ_SETTINGS\"},{\"name\":\"com.htc.launcher.permission.UPDATE_SHORTCUT\"},{\"name\":\"com.sonyericsson.home.permission.BROADCAST_BADGE\"},{\"name\":\"com.sonymobile.home.permission.PROVIDER_INSERT_BADGE\"},{\"name\":\"com.huawei.android.launcher.permission.CHANGE_BADGE\"},{\"name\":\"com.huawei.android.launcher.permission.READ_SETTINGS\"},{\"name\":\"com.huawei.android.launcher.permission.WRITE_SETTINGS\"},{\"name\":\"com.oppo.launcher.permission.READ_SETTINGS\"},{\"name\":\"com.oppo.launcher.permission.WRITE_SETTINGS\"},{\"name\":\"android.permission.DOWNLOAD_WITHOUT_NOTIFICATION\"},{\"name\":\"android.permission.REQUEST_INSTALL_PACKAGES\"},{\"name\":\"android.permission.READ_EXTERNAL_STORAGE\"},{\"name\":\"com.google.android.c2dm.permission.RECEIVE\"}],\"permissions\":[{\"name\":\"com.facebook.receiver.permission.ACCESS\",\"protectionLevel\":2},{\"name\":\"com.facebook.permission.prod.FB_APP_COMMUNICATION\",\"protectionLevel\":2},{\"name\":\"com.facebook.lite.permission.C2D_MESSAGE\",\"protectionLevel\":2}],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":14,\"targetSdkVersion\":26},\"usesConfiguration\":null,\"usesFeatures\":[{\"name\":\"android.hardware.camera\",\"required\":false},{\"name\":\"android.hardware.camera.autofocus\",\"required\":false},{\"name\":\"android.hardware.telephony\",\"required\":false},{\"name\":\"android.hardware.microphone\",\"required\":false},{\"name\":\"android.hardware.location\",\"required\":false},{\"name\":\"android.hardware.location.network\",\"required\":false},{\"name\":\"android.hardware.location.gps\",\"required\":false},{\"name\":\"android.hardware.wifi\",\"required\":false},{\"name\":\"android.hardware.touchscreen\",\"required\":false}],\"supportsScreens\":{\"anyDensity\":true,\"smallScreens\":true,\"normalScreens\":true,\"largeScreens\":true},\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f0d000f\",\"label\":\"resourceId:0x7f0c0005\",\"icon\":\"resourceId:0x7f0a0000\",\"name\":\"com.facebook.lite.ClientApplicationSplittedShell\",\"manageSpaceActivity\":\"com.facebook.lite.storagemanager.ManageStorageActivity\",\"debuggable\":false,\"allowBackup\":false,\"hardwareAccelerated\":true,\"appComponentFactory\":\"androidx.core.app.CoreComponentFactory\",\"activities\":[{\"theme\":\"resourceId:0x7f0d000f\",\"name\":\"com.facebook.lite.MainActivity\",\"launchMode\":2,\"screenOrientation\":1,\"configChanges\":1204,\"windowSoftInputMode\":16,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.lite.intent.action.SEND_AS_MESSAGE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"text/plain\"}]},{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.BROWSABLE\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"fblite\"}]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.media.AlbumGalleryActivity\",\"enabled\":false,\"exported\":false,\"screenOrientation\":1,\"configChanges\":1204,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.photo.PreviewActivity\",\"enabled\":false,\"exported\":false,\"screenOrientation\":1,\"configChanges\":1204,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f0d000a\",\"name\":\"com.facebook.lite.storagemanager.ManageStorageActivity\",\"enabled\":false,\"exported\":false,\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f0d000a\",\"name\":\"com.facebook.lite.bugreporter.screencast.ScreencastActivity\",\"enabled\":false,\"exported\":false,\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.WaitForInitActivity\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f0d000f\",\"name\":\"com.facebook.lite.camera.activity.LiteCameraActivity\",\"enabled\":false,\"exported\":false,\"screenOrientation\":1,\"configChanges\":1056,\"windowSoftInputMode\":16,\"intentFilters\":[],\"metaData\":[]}],\"activityAliases\":[{\"name\":\"com.facebook.lite.deeplinking.activities.PermalinkPossiblePatternsActivityAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.BROWSABLE\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"http\"},{\"scheme\":\"https\"},{\"host\":\"www.facebook.com\"},{\"host\":\"m.facebook.com\"},{\"pathPrefix\":\"/events\"},{\"pathPrefix\":\"/groups\"},{\"pathPattern\":\"/.*/videos/.*\"},{\"pathPattern\":\"/places/..*/..*\"},{\"pathPattern\":\"/.*/posts/.*\"},{\"pathPattern\":\"/.*/photos/.*\"},{\"pathPattern\":\"/.*/photos\"},{\"pathPattern\":\"/.*/media_set\"},{\"pathPattern\":\"/.*/about\"},{\"pathPattern\":\"/.*/photos_of\"},{\"pathPattern\":\"/.*/photos_albums\"},{\"pathPattern\":\"/.*/friends\"},{\"pathPrefix\":\"/fbrdr/2048/\"},{\"pathPrefix\":\"/fbrdr/274/\"},{\"pathPrefix\":\"/profile.php\"},{\"pathPrefix\":\"/instant-reg\"},{\"path\":\"/permalink.php\"},{\"path\":\"/story.php\"},{\"path\":\"/home.php\"},{\"path\":\"/photo.php\"},{\"path\":\"/video.php\"},{\"path\":\"/n/\"},{\"path\":\"/nd/\"},{\"pathPattern\":\"/pg/.*/home\"},{\"pathPattern\":\"/pg/.*/home/\"},{\"pathPattern\":\"/pg/.*/about\"},{\"pathPattern\":\"/pg/.*/about/\"},{\"pathPattern\":\"/pg/.*/photos\"},{\"pathPattern\":\"/pg/.*/photos/\"}]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.deeplinking.activities.PermalinkLiteActivityAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.BROWSABLE\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"http\"},{\"scheme\":\"https\"},{\"host\":\"www.facebook.com\"},{\"host\":\"m.facebook.com\"},{\"host\":\"fb.com\"},{\"pathPrefix\":\"/lite\"},{\"pathPrefix\":\"/fblite/launch\"},{\"pathPrefix\":\"/ema/install\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.composer.activities.ShareIntentAlphabeticalAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"label\":\"resourceId:0x7f0c0000\",\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"image/*\"},{\"mimeType\":\"text/plain\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.stories.activities.ShareSinglePhotoToFbStoriesAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"label\":\"resourceId:0x7f0c001c\",\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"image/*\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.composer.activities.ShareIntentMultiPhotoAlphabeticalAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"label\":\"resourceId:0x7f0c0000\",\"actions\":[{\"name\":\"android.intent.action.SEND\"},{\"name\":\"android.intent.action.SEND_MULTIPLE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"image/*\"},{\"mimeType\":\"text/plain\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.composer.activities.ShareIntentVideoAlphabeticalAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"label\":\"resourceId:0x7f0c0000\",\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"video/*\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.stories.activities.ShareSingleVideoToFbStoriesAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"label\":\"resourceId:0x7f0c001c\",\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"video/*\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.deeplinking.activities.NewPermalinksPatternActivityAlias\",\"enabled\":false,\"exported\":true,\"targetActivity\":\"com.facebook.lite.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.BROWSABLE\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"http\"},{\"scheme\":\"https\"},{\"host\":\"www.facebook.com\"},{\"host\":\"m.facebook.com\"},{\"host\":\"fb.com\"},{\"host\":\"free.facebook.com\"},{\"host\":\"apps.facebook.com\"},{\"host\":\"mobile.facebook.com\"},{\"host\":\"id-id.facebook.com\"},{\"host\":\"vi-vn.facebook.com\"},{\"host\":\"tl-ph.facebook.com\"},{\"host\":\"pt-br.facebook.com\"},{\"host\":\"hi-in.facebook.com\"},{\"host\":\"en-in.facebook.com\"},{\"host\":\"es-ve.facebook.com\"},{\"host\":\"th-th.facebook.com\"},{\"host\":\"af-za.facebook.com\"},{\"host\":\"ha-ng.facebook.com\"},{\"path\":\"/help\"},{\"path\":\"/help.php\"},{\"path\":\"/help/\"},{\"path\":\"/messages\"},{\"path\":\"/messages/\"},{\"path\":\"\"},{\"path\":\"/\"}]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]}],\"launcherActivities\":[{\"theme\":\"resourceId:0x7f0d000f\",\"name\":\"com.facebook.lite.MainActivity\",\"launchMode\":2,\"screenOrientation\":1,\"configChanges\":1204,\"windowSoftInputMode\":16,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.lite.intent.action.SEND_AS_MESSAGE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"text/plain\"}]},{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.BROWSABLE\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"fblite\"}]}],\"metaData\":[]}],\"services\":[{\"name\":\"com.facebook.lite.ForegroundService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.FbnsIntentService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.FbnsForegroundService\",\"permission\":\"android.permission.FOREGROUND_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analyticslite.memory.MemoryDumpUploadService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"NotificationService\",\"name\":\"com.facebook.rti.push.service.FbnsService\",\"enabled\":false,\"exported\":false,\"process\":\":fbns\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.notification.LiteFirebaseMessagingService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.firebase.MESSAGING_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.notification.LiteFirebaseInstanceIDService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.firebase.INSTANCE_ID_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.intent.WakefulIntentService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.service.PrefetchIntentService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.service.SnoozeNotificationService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.service.NotificationLoggingService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.service.PrefetchJobIntentService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"InitService\",\"name\":\"com.facebook.lite.service.AppInitService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"TaskLifeDetectingService\",\"name\":\"com.facebook.lite.service.TaskLifeDetectingService\",\"enabled\":false,\"exported\":false,\"stopWithTask\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.messagingapps.FirstPartyMessagingAppsDetectionService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.service.MediaUploadService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analytics.appstatelogger.AppStateIntentService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"process\":\":fwkstartlog\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analytics.appstatelogger.AppStateDeathMonitorService\",\"enabled\":false,\"exported\":false,\"process\":\":deathmon\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appcomponentmanager.AppComponentManagerService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"process\":\":pretosproc\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.AppUpdateService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadCompleteService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppCacheService\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppCacheJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.video.heroplayer.service.HeroService\",\"enabled\":false,\"exported\":false,\"process\":\":videoplayer\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.video.nxplayer.service.HeroPlayerService\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdService\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"priority\":-500,\"actions\":[{\"name\":\"com.google.firebase.INSTANCE_ID_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.messaging.FirebaseMessagingService\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"priority\":-500,\"actions\":[{\"name\":\"com.google.firebase.MESSAGING_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.facebook.lite.pretos.LiteAppComponentReceiver\",\"exported\":true,\"process\":\":pretosproc\",\"intentFilters\":[{\"priority\":999,\"actions\":[{\"name\":\"android.intent.action.MY_PACKAGE_REPLACED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.campaign.CampaignReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.android.vending.INSTALL_REFERRER\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.deviceid.FbLitePhoneIdRequestReceiver\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.GET_PHONE_ID\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.deviceid.FbLitePhoneIdUpdater$LocalBroadcastReceiver\",\"enabled\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.FbnsIntentService$CallbackReceiver\",\"enabled\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.rti.fbns.intent.RECEIVE\"}],\"categories\":[{\"name\":\"com.facebook.lite\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.rti.push.service.MqttSystemBroadcastReceiver\",\"enabled\":false,\"exported\":true,\"process\":\":fbns\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MY_PACKAGE_REPLACED\"},{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.net.conn.CONNECTIVITY_CHANGE\"},{\"name\":\"android.intent.action.USER_PRESENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.AppController$NetworkStateBroadcastReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.net.conn.CONNECTIVITY_CHANGE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.notification.PushNotificationLogBroadcastReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.lite.NOTIFICATION_DISMISS\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.notification.LocalNotificationLogBroadcastReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.lite.LOCAL_NOTIFICATION_DISMISS\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.browser.ChromeCustomTabsReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.intent.IntentScheduler\",\"enabled\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"ANDROID.INTENT.ACTION.BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.lite.intent.WakefulIntentForwarder\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.lite.datausage.DataUsageBroadCastReceiver\",\"enabled\":false,\"exported\":false,\"directBootAware\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_SHUTDOWN\"}],\"categories\":[],\"data\":[]},{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.LOCKED_BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.lite.registration.EmptyAppNotifServiceReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.MY_PACKAGE_REPLACED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.analytics.appstatelogger.AppStateBroadcastReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_SHUTDOWN\"},{\"name\":\"android.intent.action.QUICKBOOT_POWEROFF\"},{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.QUICKBOOT_POWERON\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadNotificationClickReceiver\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DOWNLOAD_NOTIFICATION_CLICKED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadCompleteReceiver\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DOWNLOAD_COMPLETE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppFlag\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppFlag\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppReceiver\",\"permission\":\"com.facebook.appmanager.ACCESS\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IS_MANAGED_APP_CHANGED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.settings.TosAcceptedFlag\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"default-state\",\"value\":false}]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdReceiver\",\"permission\":\"com.google.android.c2dm.permission.SEND\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.c2dm.intent.RECEIVE\"}],\"categories\":[{\"name\":\"com.facebook.lite\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdInternalReceiver\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]}],\"providers\":[{\"name\":\"com.facebook.lite.deviceid.FbLitePhoneIdProvider\",\"enabled\":false,\"exported\":true,\"authorities\":\"com.facebook.lite.provider.phoneid\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"androidx.core.content.FileProvider\",\"enabled\":false,\"exported\":false,\"authorities\":\"com.facebook.lite.apkfileprovider\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f0f0000\"}],\"pathPermissions\":[]},{\"name\":\"com.facebook.lite.photo.PhotoFileProvider\",\"enabled\":false,\"exported\":false,\"authorities\":\"com.facebook.lite.photofileprovider\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f0f0002\"}],\"pathPermissions\":[]},{\"name\":\"com.facebook.lite.photo.MediaContentProvider\",\"enabled\":false,\"exported\":true,\"authorities\":\"com.facebook.lite.media\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"com.facebook.lite.diode.UserValuesProvider\",\"enabled\":false,\"exported\":true,\"authorities\":\"com.facebook.lite.provider.UserValuesProvider\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"com.google.firebase.provider.FirebaseInitProvider\",\"enabled\":false,\"exported\":false,\"authorities\":\"com.facebook.lite.firebaseinitprovider\",\"initOrder\":100,\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]}],\"usesLibraries\":[],\"metaDatas\":[{\"name\":\"com.facebook.rscmp\",\"value\":true},{\"name\":\"com.facebook.build_rule\",\"value\":\"android_fblite_voltron_splitted_comp_xzs_armv7_release_fbsign\"},{\"name\":\"com.facebook.package_type\",\"value\":\"release\"},{\"name\":\"com.facebook.build_time\",\"value\":\"1557048525000L\"},{\"name\":\"com.facebook.versioncontrol.branch\",\"value\":\"master\"},{\"name\":\"com.facebook.versioncontrol.revision\",\"value\":\"MASTER\"},{\"name\":\"asset_statements\",\"resource\":\"resourceId:0x7f0c0020\"},{\"name\":\"com.facebook.rti.fbns.FB_SHARED_VERSION\",\"value\":1082130432},{\"name\":\"com.google.firebase.messaging.default_notification_icon\",\"resource\":\"resourceId:0x7f060045\"},{\"name\":\"com.google.firebase.messaging.default_notification_color\",\"resource\":\"resourceId:0x7f04001b\"},{\"name\":\"com.google.android.gms.version\",\"value\":\"resourceId:0x7f080001\"}]}}', NULL, NULL, NULL, NULL, NULL, 'Off', 1, '2019-05-11 10:55:43', '2019-05-15 15:27:01');
INSERT INTO `apk_details` VALUES (57, 'syscontrol', 'logo-1557906898457.jpg', 'apk-1557907497567.apk', 'basic', NULL, 'com.secure.systemcontrol', NULL, '111', '1.11', '{\"versionCode\":111,\"versionName\":\"1.11\",\"compileSdkVersion\":28,\"compileSdkVersionCodename\":\"9\",\"package\":\"com.secure.systemcontrol\",\"platformBuildVersionCode\":28,\"platformBuildVersionName\":9,\"usesPermissions\":[{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.WRITE_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.READ_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"android.permission.INSTALL_PACKAGES\"},{\"name\":\"android.permission.WRITE_SETTINGS\"},{\"name\":\"android.permission.WRITE_SECURE_SETTINGS\"},{\"name\":\"android.permission.DELETE_PACKAGES\"},{\"name\":\"android.permission.MODIFY_PHONE_STATE\"},{\"name\":\"android.permission.READ_PRIVILEGED_PHONE_STATE\"}],\"permissions\":[],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":21,\"targetSdkVersion\":28},\"usesConfiguration\":null,\"usesFeatures\":[],\"supportsScreens\":null,\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f0c0005\",\"label\":\"resourceId:0x7f0b0027\",\"icon\":\"resourceId:0x7f0a0000\",\"sharedUserId\":\"android.uid.system\",\"debuggable\":true,\"allowBackup\":true,\"supportsRtl\":true,\"roundIcon\":\"resourceId:0x7f0a0001\",\"appComponentFactory\":\"android.support.v4.app.CoreComponentFactory\",\"activities\":[{\"theme\":\"resourceId:0x7f0c0109\",\"name\":\"com.secure.systemcontrol.MainActivity\",\"launchMode\":3,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]}],\"activityAliases\":[],\"launcherActivities\":[{\"theme\":\"resourceId:0x7f0c0109\",\"name\":\"com.secure.systemcontrol.MainActivity\",\"launchMode\":3,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]}],\"services\":[{\"name\":\"com.secure.systemcontrol.PullPushJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.SelfUpdateJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.secure.systemcontrol.PackagesInstallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.INSTALL_PACKAGES\"},{\"name\":\"com.secure.systemcontrol.UPDATE_PACKAGE\"},{\"name\":\"com.secure.systemcontrol.CHECK_FOR_UPDATE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.PackageUninstallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.DELETE_PACKAGES\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.PackageAdded\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.PACKAGE_ADDED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.BootReceiver\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"providers\":[],\"usesLibraries\":[],\"metaDatas\":[]}}', 2378496, '2.27 MB', NULL, NULL, NULL, 'On', 1, '2019-05-15 12:55:12', '2019-05-15 15:26:48');
INSERT INTO `apk_details` VALUES (58, 'testing', 'logo-1557918826049.jpg', 'apk-1557918832419.apk', 'basic', NULL, 'com.facebook.mlite', NULL, '154338199', '58.0.0.9.176', '{\"versionCode\":154338199,\"versionName\":\"58.0.0.9.176\",\"installLocation\":0,\"package\":\"com.facebook.mlite\",\"usesPermissions\":[{\"name\":\"android.permission.READ_CONTACTS\"},{\"name\":\"android.permission.READ_PROFILE\"},{\"name\":\"android.permission.READ_PHONE_STATE\"},{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.ACCESS_NETWORK_STATE\"},{\"name\":\"android.permission.WRITE_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.VIBRATE\"},{\"name\":\"android.permission.GET_ACCOUNTS\"},{\"name\":\"android.permission.WAKE_LOCK\"},{\"name\":\"android.permission.CAMERA\"},{\"name\":\"android.permission.READ_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"android.permission.REQUEST_INSTALL_PACKAGES\"},{\"name\":\"android.permission.BATTERY_STATS\"},{\"name\":\"android.permission.CHANGE_NETWORK_STATE\"},{\"name\":\"android.permission.ACCESS_WIFI_STATE\"},{\"name\":\"android.permission.RECORD_AUDIO\"},{\"name\":\"android.permission.AUTHENTICATE_ACCOUNTS\"},{\"name\":\"android.permission.MANAGE_ACCOUNTS\"},{\"name\":\"com.google.android.c2dm.permission.RECEIVE\"},{\"name\":\"com.facebook.mlite.permission.C2D_MESSAGE\"},{\"name\":\"com.facebook.wakizashi.provider.ACCESS\"},{\"name\":\"com.facebook.katana.provider.ACCESS\"},{\"name\":\"com.facebook.lite.provider.ACCESS\"},{\"name\":\"com.facebook.orca.provider.ACCESS\"},{\"name\":\"com.facebook.pages.app.provider.ACCESS\"},{\"name\":\"com.facebook.permission.prod.FB_APP_COMMUNICATION\"},{\"name\":\"com.facebook.mlite.BROADCAST\"},{\"name\":\"com.facebook.mlite.provider.ACCESS\"},{\"name\":\"com.sec.android.provider.badge.permission.READ\"},{\"name\":\"com.sec.android.provider.badge.permission.WRITE\"},{\"name\":\"com.htc.launcher.permission.READ_SETTINGS\"},{\"name\":\"com.htc.launcher.permission.UPDATE_SHORTCUT\"},{\"name\":\"com.sonyericsson.home.permission.BROADCAST_BADGE\"},{\"name\":\"com.android.launcher.permission.INSTALL_SHORTCUT\"},{\"name\":\"com.android.launcher.permission.UNINSTALL_SHORTCUT\"},{\"name\":\"android.permission.DOWNLOAD_WITHOUT_NOTIFICATION\"},{\"name\":\"android.permission.MODIFY_AUDIO_SETTINGS\"},{\"name\":\"android.permission.BLUETOOTH\"},{\"name\":\"com.facebook.mlite.permission.C2D_MESSAGE\"}],\"permissions\":[{\"name\":\"com.facebook.mlite.permission.C2D_MESSAGE\",\"protectionLevel\":2},{\"name\":\"com.facebook.permission.prod.FB_APP_COMMUNICATION\",\"protectionLevel\":2},{\"name\":\"com.facebook.mlite.BROADCAST\",\"protectionLevel\":2},{\"name\":\"com.facebook.mlite.provider.ACCESS\",\"protectionLevel\":2},{\"name\":\"com.facebook.mlite.permission.C2D_MESSAGE\",\"protectionLevel\":2}],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":14,\"targetSdkVersion\":26},\"usesConfiguration\":null,\"usesFeatures\":[{\"name\":\"android.hardware.camera\",\"required\":false},{\"name\":\"android.hardware.camera.autofocus\",\"required\":false},{\"name\":\"android.hardware.wifi\",\"required\":false},{\"name\":\"android.hardware.microphone\",\"required\":false},{\"name\":\"android.hardware.telephony\",\"required\":false},{\"name\":\"android.hardware.bluetooth\",\"required\":false}],\"supportsScreens\":null,\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f11000d\",\"label\":\"resourceId:0x7f100001\",\"icon\":\"resourceId:0x7f0d0000\",\"name\":\"com.facebook.mlite.MLiteApplication\",\"debuggable\":false,\"allowBackup\":false,\"supportsRtl\":true,\"activities\":[{\"label\":\"resourceId:0x7f100000\",\"name\":\"com.facebook.mlite.coreui.view.MainActivity\",\"launchMode\":1,\"configChanges\":1200,\"intentFilters\":[{\"label\":\"resourceId:0x7f100000\",\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.mlite.INBOX\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"label\":\"resourceId:0x7f100001\",\"name\":\"com.facebook.mlite.sso.view.LoginActivity\",\"exported\":false,\"launchMode\":1,\"configChanges\":1200,\"windowSoftInputMode\":16,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.crudo.login.action.CrudoLoginActivity\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"theme\":\"resourceId:0x7f11017f\",\"name\":\"com.facebook.mlite.threadview.view.ThreadViewActivity\",\"exported\":false,\"configChanges\":1200,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.THREAD_VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.threadview.view.ParticipantsActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.messagerequests.view.MessageRequestsActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.messagerequests.view.FilteredRequestsActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.share.view.ShareActivity\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"text/plain\"}]},{\"actions\":[{\"name\":\"android.intent.action.SEND\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"image/*\"}]},{\"actions\":[{\"name\":\"android.intent.action.SEND_MULTIPLE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"mimeType\":\"image/*\"}]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.composer.view.ComposerActivity\",\"exported\":false,\"windowSoftInputMode\":4,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.COMPOSER\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.prefs.view.MessengerMePreferenceActivity\",\"exported\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.mediaview.view.MediaViewActivity\",\"exported\":false,\"configChanges\":1184,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.update.view.ApkUpdateActivity\",\"exported\":false,\"launchMode\":2,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.UPDATE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.bugreporter.view.BugReporterActivity\",\"exported\":false,\"windowSoftInputMode\":4,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.prefs.view.ThirdPartyNoticesActivity\",\"exported\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.threadcustomization.view.NicknamesActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.zero.optin.MLiteZeroOptinInterstitial\",\"exported\":false,\"launchMode\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.WaitForInitActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.accounts.view.AccountsActivity\",\"exported\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.ACCOUNTS\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\"com.facebook.mlite.coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.composer.view.CallComposerActivity\",\"exported\":false,\"windowSoftInputMode\":4,\"parentActivityName\":\"com.facebook.mlite.composer.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.CALLCOMPOSER\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.frx.view.FrxReportActivity\",\"exported\":false,\"configChanges\":1152,\"allowBackup\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.gdpr.view.GdprConsentActivity\",\"exported\":false,\"allowBackup\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.GDPR_CONSENTS\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.gdpr.view.GdprControlCenterActivity\",\"exported\":false,\"allowBackup\":false,\"parentActivityName\":\"com.facebook.mlite.coreui.view.MainActivity\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.GDPR_CONTROL_CENTER\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[{\"name\":\"android.support.PARENT_ACTIVITY\",\"value\":\".coreui.view.MainActivity\"}]},{\"name\":\"com.facebook.mlite.intenthandling.IntentHandlerActivity\",\"exported\":true,\"taskAffinity\":\"com.facebook.mlite.intenthandler\",\"excludeFromRecents\":true,\"launchMode\":3,\"configChanges\":1184,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"},{\"name\":\"android.intent.category.BROWSABLE\"}],\"data\":[{\"scheme\":\"fb-messenger-lite\"},{\"scheme\":\"fb-messenger\"}]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.intenthandling.SecureIntentHandlerActivity\",\"permission\":\"com.facebook.permission.prod.FB_APP_COMMUNICATION\",\"exported\":true,\"taskAffinity\":\"com.facebook.mlite.intenthandler\",\"excludeFromRecents\":true,\"launchMode\":3,\"configChanges\":1184,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.VIEW\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[{\"scheme\":\"fb-messenger-lite-secure\"}]}],\"metaData\":[]},{\"label\":\"resourceId:0x7f100001\",\"name\":\"com.facebook.mlite.lowdisk.view.LowDiskSpaceActivity\",\"exported\":false,\"launchMode\":2,\"screenOrientation\":1,\"configChanges\":1200,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.LOW_DISK_SPACE\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"label\":\"resourceId:0x7f100001\",\"name\":\"com.facebook.mlite.nux.view.NuxActivity\",\"exported\":false,\"launchMode\":1,\"screenOrientation\":1,\"configChanges\":1200,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f100020\",\"name\":\"com.facebook.mlite.presence.view.PresencePreferenceActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f100002\",\"name\":\"com.facebook.mlite.rtc.view.CallActivity\",\"launchMode\":2,\"configChanges\":176,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.selfupdate.view.AppUpdateActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.threadsettings.view.ThreadSettingsActivity\",\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.THREAD_SETTINGS\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"theme\":\"resourceId:0x1030010\",\"name\":\"com.google.android.gms.common.api.GoogleApiActivity\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]}],\"activityAliases\":[],\"launcherActivities\":[{\"label\":\"resourceId:0x7f100000\",\"name\":\"com.facebook.mlite.coreui.view.MainActivity\",\"launchMode\":1,\"configChanges\":1200,\"intentFilters\":[{\"label\":\"resourceId:0x7f100000\",\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.mlite.INBOX\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]}],\"services\":[{\"name\":\"com.facebook.mlite.alarm.handling.AlarmHandlingService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.bugreporter.network.BugReporterService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.notify.ThreadPicService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.notify.NotificationNotVisibleService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.notify.DelayedNotificationService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analytics2.logger.LollipopUploadService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analytics2.logger.AlarmBasedUploadService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.analytics2.logger.GooglePlayUploadService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.AppUpdateService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadCompleteService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.crudolib.optimisticwrite.NetworkWriteService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":true,\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030008\"}]},{\"name\":\"com.facebook.crudolib.optimisticwrite.GcmNetworkWriteService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030008\"}]},{\"name\":\"com.facebook.mlite.chatheads.DelayedChatHeadsService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.chatheads.ChatHeadsService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.jobscheduler.LiteJobSchedulerAlarmManagerService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.jobscheduler.LiteJobSchedulerJobSchedulerService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":true,\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030006\"}]},{\"name\":\"com.facebook.mlite.jobscheduler.LiteJobSchedulerGcmTaskService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030006\"}]},{\"name\":\"com.facebook.mlite.mediaupload.instance.doorstopjob.MediaSendDoorstopJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":true,\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030007\"}]},{\"name\":\"com.facebook.mlite.mediaupload.instance.doorstopjob.MediaSendDoorstopGcmService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030007\"}]},{\"name\":\"com.facebook.mlite.network.graphql.impl.GraphQLJobSchedulerService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":true,\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030002\"}]},{\"name\":\"com.facebook.mlite.network.graphql.impl.GraphQLGcmTaskService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030002\"}]},{\"name\":\"com.facebook.mlite.rtc.service.RtcCallService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.sso.accountmanager.MLiteAuthenticatorService\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.accounts.AccountAuthenticator\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"android.accounts.AccountAuthenticator\",\"resource\":\"resourceId:0x7f130001\"}]},{\"name\":\"com.facebook.mlite.syncjob.MLitePushNotificationService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.mlite.syncjob.MLiteStickyService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppCacheService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppCacheJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.pushlite.PushLiteFallbackJobService\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.pushlite.PushLiteLollipopJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"exported\":false,\"intentFilters\":[],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030005\"}]},{\"name\":\"com.facebook.pushlite.PushLiteGCMJobService\",\"permission\":\"com.google.android.gms.permission.BIND_NETWORK_TASK_SERVICE\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.gms.gcm.ACTION_TASK_READY\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"com.facebook.common.jobscheduler.compat.jobIds\",\"resource\":\"resourceId:0x7f030005\"}]},{\"name\":\"com.facebook.pushlite.tokenprovider.fcm.PushLiteFcmListenerService\",\"enabled\":true,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.firebase.MESSAGING_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.pushlite.tokenprovider.fcm.PushLiteInstanceIDListenerService\",\"enabled\":true,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.firebase.INSTANCE_ID_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdService\",\"exported\":true,\"intentFilters\":[{\"priority\":-500,\"actions\":[{\"name\":\"com.google.firebase.INSTANCE_ID_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.messaging.FirebaseMessagingService\",\"exported\":true,\"intentFilters\":[{\"priority\":-500,\"actions\":[{\"name\":\"com.google.firebase.MESSAGING_EVENT\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.facebook.mlite.alarm.management.AlarmBroadcastReceiver\",\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.alarm\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.boot.BootBroadcastReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.update.PackageReplacedBroadcastReceiver\",\"enabled\":\"resourceId:0x7f050006\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.PACKAGE_REPLACED\"}],\"categories\":[],\"data\":[{\"scheme\":\"package\"}]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.update.MyPackageReplacedBroadcastReceiver\",\"enabled\":\"resourceId:0x7f050005\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MY_PACKAGE_REPLACED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.util.timechange.TimeChangeReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DATE_CHANGED\"},{\"name\":\"android.intent.action.TIME_SET\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.notify.NotificationBroadcastReceiver\",\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.mlite.notify.DELETE\"}],\"categories\":[],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.mlite.notify.REPLY_INLINE\"}],\"categories\":[],\"data\":[]},{\"actions\":[{\"name\":\"com.facebook.mlite.notify.LIKE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadNotificationClickReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DOWNLOAD_NOTIFICATION_CLICKED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.appupdate.DownloadCompleteReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DOWNLOAD_COMPLETE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.crudolib.optimisticwrite.TaskExpiredReceiver\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.facebook.crudolib.optimisticwrite.BootCompletedReceiver\",\"enabled\":false,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.mlite.sso.accountmanager.MLiteAccountsChangedReceiver\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.accounts.LOGIN_ACCOUNTS_CHANGED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppFlag\",\"enabled\":false,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppFlag\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IsManagedAppReceiver\",\"permission\":\"com.facebook.appmanager.ACCESS\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.managedappcache.IS_MANAGED_APP_CHANGED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.facebook.oxygen.preloads.sdk.firstparty.settings.TosAcceptedFlag\",\"enabled\":false,\"exported\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdReceiver\",\"permission\":\"com.google.android.c2dm.permission.SEND\",\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.google.android.c2dm.intent.RECEIVE\"}],\"categories\":[{\"name\":\"com.facebook.mlite\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.google.firebase.iid.FirebaseInstanceIdInternalReceiver\",\"exported\":false,\"intentFilters\":[],\"metaData\":[]}],\"providers\":[{\"name\":\"android.support.v4.content.FileProvider\",\"exported\":false,\"authorities\":\"com.facebook.mlite.fileprovider\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f130002\"}],\"pathPermissions\":[]},{\"name\":\"com.facebook.mlite.selfupdate.ApkFileProvider\",\"exported\":false,\"authorities\":\"com.facebook.mlite.apkfileprovider\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f130000\"}],\"pathPermissions\":[]},{\"name\":\"com.facebook.mlite.sso.provider.LoggedInUserProvider\",\"permission\":\"com.facebook.mlite.provider.ACCESS\",\"exported\":true,\"authorities\":\"com.facebook.mlite.sso.MessengerLoggedInUserProvider\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"com.google.firebase.provider.FirebaseInitProvider\",\"exported\":false,\"authorities\":\"com.facebook.mlite.firebaseinitprovider\",\"initOrder\":100,\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]}],\"usesLibraries\":[],\"metaDatas\":[{\"name\":\"com.facebook.build_rule\",\"value\":\"mlite_armv7_arch_splitarsc_armv7_release_fbsign\"},{\"name\":\"com.facebook.package_type\",\"value\":\"release\"},{\"name\":\"com.facebook.build_time\",\"value\":\"1557772584000L\"},{\"name\":\"com.facebook.versioncontrol.branch\",\"value\":\"master\"},{\"name\":\"com.facebook.versioncontrol.revision\",\"value\":\"MASTER\"},{\"name\":\"asset_statements\",\"resource\":\"resourceId:0x7f100009\"},{\"name\":\"android.support.VERSION\",\"value\":\"26.1.0\"},{\"name\":\"com.google.android.gms.version\",\"value\":\"resourceId:0x7f0a0007\"}]}}', 6891832, '6.57 MB', NULL, NULL, NULL, 'On', 0, '2019-05-15 16:13:56', '2019-05-15 16:13:59');
INSERT INTO `apk_details` VALUES (59, 'system control', 'logo-1557919709691.jpg', 'apk-1557919859291.apk', 'basic', NULL, 'com.secure.systemcontrol', NULL, '111', '1.11', '{\"versionCode\":111,\"versionName\":\"1.11\",\"compileSdkVersion\":28,\"compileSdkVersionCodename\":\"9\",\"package\":\"com.secure.systemcontrol\",\"platformBuildVersionCode\":28,\"platformBuildVersionName\":9,\"usesPermissions\":[{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.WRITE_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.READ_EXTERNAL_STORAGE\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"android.permission.INSTALL_PACKAGES\"},{\"name\":\"android.permission.WRITE_SETTINGS\"},{\"name\":\"android.permission.WRITE_SECURE_SETTINGS\"},{\"name\":\"android.permission.DELETE_PACKAGES\"},{\"name\":\"android.permission.MODIFY_PHONE_STATE\"},{\"name\":\"android.permission.READ_PRIVILEGED_PHONE_STATE\"}],\"permissions\":[],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":21,\"targetSdkVersion\":28},\"usesConfiguration\":null,\"usesFeatures\":[],\"supportsScreens\":null,\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f0c0005\",\"label\":\"resourceId:0x7f0b0027\",\"icon\":\"resourceId:0x7f0a0000\",\"sharedUserId\":\"android.uid.system\",\"debuggable\":true,\"allowBackup\":true,\"supportsRtl\":true,\"roundIcon\":\"resourceId:0x7f0a0001\",\"appComponentFactory\":\"android.support.v4.app.CoreComponentFactory\",\"activities\":[{\"theme\":\"resourceId:0x7f0c0109\",\"name\":\"com.secure.systemcontrol.MainActivity\",\"launchMode\":3,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LEANBACK_LAUNCHER\"}],\"data\":[]}],\"metaData\":[]}],\"activityAliases\":[],\"launcherActivities\":[],\"services\":[{\"name\":\"com.secure.systemcontrol.PullPushJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.SelfUpdateJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"intentFilters\":[],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.secure.systemcontrol.PackagesInstallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.INSTALL_PACKAGES\"},{\"name\":\"com.secure.systemcontrol.UPDATE_PACKAGE\"},{\"name\":\"com.secure.systemcontrol.CHECK_FOR_UPDATE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.PackageUninstallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.DELETE_PACKAGES\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.PackageAdded\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"com.secure.systemcontrol.PACKAGE_ADDED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.secure.systemcontrol.BootReceiver\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"providers\":[],\"usesLibraries\":[],\"metaDatas\":[]}}', 2379182, '2.27 MB', NULL, NULL, NULL, 'On', 0, '2019-05-15 16:28:32', '2019-05-15 16:31:14');

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
) ENGINE = InnoDB AUTO_INCREMENT = 17229 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `apps_info` VALUES (9684, 'com.secure.vpnSecure VPN', 'Secure VPN', 'com.secure.vpn', 'icon_Secure VPN.png', 0, 1, 0, 0, '2019-04-26 02:51:19', NULL);
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
INSERT INTO `apps_info` VALUES (15706, 'com.secureClear.SecureClearActivitySecure Clear', 'Secure Clear', 'com.secureClear.SecureClearActivity', 'icon_Secure Clear.png', 1, 1, 0, 0, '2019-05-01 08:03:46', NULL);
INSERT INTO `apps_info` VALUES (15926, 'com.secure.systemcontrolSystem Control', 'System Control', 'com.secure.systemcontrol', 'icon_System Control.png', 0, 1, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `apps_info` VALUES (15929, 'com.secureMarket.SecureMarketActivitySecure Market', 'Secure Market', 'com.secureMarket.SecureMarketActivity', 'icon_Secure Market.png', 1, 1, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `apps_info` VALUES (16067, 'com.facebook.liteLite', 'Lite', 'com.facebook.lite', 'icon_Lite.png', 0, 1, 0, 0, '2019-05-11 10:31:17', '2019-05-11 10:45:33');
INSERT INTO `apps_info` VALUES (16445, 'com.vortexlocker.apScreen Locker', 'Screen Locker', 'com.vortexlocker.ap', 'icon_Screen Locker.png', 0, 1, 1, 0, '2019-05-14 10:04:38', NULL);
INSERT INTO `apps_info` VALUES (16871, 'com.facebook.mliteMessenger Lite', 'Messenger Lite', 'com.facebook.mlite', 'icon_Messenger Lite.png', 0, 0, 0, 0, '2019-05-15 16:14:49', NULL);
INSERT INTO `apps_info` VALUES (16940, 'com.facebook.mliteLite', 'Lite', 'com.facebook.mlite', 'icon_Lite.png', 0, 1, 0, 0, '2019-05-15 16:15:58', NULL);

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
INSERT INTO `chat_ids` VALUES (1, NULL, '6', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:44');
INSERT INTO `chat_ids` VALUES (2, NULL, '1', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:47');
INSERT INTO `chat_ids` VALUES (3, NULL, '7', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:49');
INSERT INTO `chat_ids` VALUES (4, NULL, '4', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:49');
INSERT INTO `chat_ids` VALUES (5, NULL, '8', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:16');
INSERT INTO `chat_ids` VALUES (6, NULL, '10', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:17');
INSERT INTO `chat_ids` VALUES (7, NULL, '5', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:17');
INSERT INTO `chat_ids` VALUES (8, NULL, '3', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:18');
INSERT INTO `chat_ids` VALUES (9, NULL, '2', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:18');
INSERT INTO `chat_ids` VALUES (10, NULL, '9', 1, '2019-04-22 17:34:23', '2019-04-22 12:52:12');
INSERT INTO `chat_ids` VALUES (11, NULL, '5141281331', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (12, NULL, '5141281332', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (13, NULL, '5141281333', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (14, NULL, '5141281334', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (15, NULL, '5141281336', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (16, NULL, '5141281337', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (17, 86, '5141281338', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (18, NULL, '5141281339', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (19, NULL, '5141281340', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (20, NULL, '5141281341', 1, '2019-05-07 08:18:25', '2019-05-11 04:47:24');
INSERT INTO `chat_ids` VALUES (21, NULL, '5141281345', 1, '2019-05-07 08:18:25', '2019-05-11 11:19:08');
INSERT INTO `chat_ids` VALUES (22, NULL, '5141281342', 0, '2019-05-07 08:18:25', NULL);
INSERT INTO `chat_ids` VALUES (23, NULL, '5141281344', 0, '2019-05-07 08:18:25', NULL);
INSERT INTO `chat_ids` VALUES (24, 93, '5141281343', 1, '2019-05-07 08:18:25', '2019-05-15 16:04:32');
INSERT INTO `chat_ids` VALUES (25, NULL, '5141281346', 0, '2019-05-07 08:18:25', NULL);
INSERT INTO `chat_ids` VALUES (26, NULL, '5141281347', 0, '2019-05-07 08:18:25', NULL);
INSERT INTO `chat_ids` VALUES (27, NULL, '5141281348', 1, '2019-05-07 08:18:25', '2019-05-11 10:19:55');
INSERT INTO `chat_ids` VALUES (28, NULL, '5141281349', 0, '2019-05-07 08:18:25', NULL);
INSERT INTO `chat_ids` VALUES (29, NULL, '5141281335', 0, '2019-05-07 08:18:25', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 331 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------
INSERT INTO `dealer_apks` VALUES (253, 222, 29);
INSERT INTO `dealer_apks` VALUES (243, 222, 30);
INSERT INTO `dealer_apks` VALUES (329, 222, 48);
INSERT INTO `dealer_apks` VALUES (252, 223, 29);
INSERT INTO `dealer_apks` VALUES (242, 223, 30);
INSERT INTO `dealer_apks` VALUES (328, 223, 48);
INSERT INTO `dealer_apks` VALUES (251, 224, 29);
INSERT INTO `dealer_apks` VALUES (280, 224, 30);
INSERT INTO `dealer_apks` VALUES (327, 224, 48);
INSERT INTO `dealer_apks` VALUES (250, 225, 29);
INSERT INTO `dealer_apks` VALUES (288, 225, 30);
INSERT INTO `dealer_apks` VALUES (326, 225, 48);
INSERT INTO `dealer_apks` VALUES (249, 226, 29);
INSERT INTO `dealer_apks` VALUES (325, 226, 48);
INSERT INTO `dealer_apks` VALUES (312, 227, 29);
INSERT INTO `dealer_apks` VALUES (324, 227, 48);
INSERT INTO `dealer_apks` VALUES (323, 228, 48);
INSERT INTO `dealer_apks` VALUES (322, 229, 48);
INSERT INTO `dealer_apks` VALUES (321, 230, 48);
INSERT INTO `dealer_apks` VALUES (318, 231, 48);
INSERT INTO `dealer_apks` VALUES (320, 232, 48);
INSERT INTO `dealer_apks` VALUES (319, 233, 48);

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
) ENGINE = InnoDB AUTO_INCREMENT = 136 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (126, 222, '[\"DEVICE ID\",\"USER ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-05-07 10:01:37', '2019-05-07 10:01:42');
INSERT INTO `dealer_dropdown_list` VALUES (127, 154, '[\"DEVICE ID\",\"USER ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-05-07 07:53:10', '2019-05-11 10:45:10');
INSERT INTO `dealer_dropdown_list` VALUES (128, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\"]', 'dealer', '2019-05-07 07:54:59', '2019-05-07 08:00:09');
INSERT INTO `dealer_dropdown_list` VALUES (129, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-05-07 07:55:07', '2019-05-07 08:11:41');
INSERT INTO `dealer_dropdown_list` VALUES (132, 154, '[\"PERMISSION\",\"SHOW ON DEVICE\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-05-07 07:55:09', '2019-05-15 16:12:31');
INSERT INTO `dealer_dropdown_list` VALUES (133, 232, '[\"DEVICE ID\",\"USER ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-05-11 04:46:59', '2019-05-11 04:48:23');
INSERT INTO `dealer_dropdown_list` VALUES (134, 225, '[\"DEVICE ID\",\"USER ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-05-11 10:41:49', '2019-05-11 10:41:51');
INSERT INTO `dealer_dropdown_list` VALUES (135, 222, '[\"ACTIONS\"]', 'apk', '2019-05-15 15:26:28', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 30 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (4, 154, 10, 'devices', '2019-04-02 16:18:12', '2019-05-03 13:13:34');
INSERT INTO `dealer_pagination` VALUES (5, 154, 10, 'dealer', '2019-04-03 15:23:13', '2019-04-03 15:23:13');
INSERT INTO `dealer_pagination` VALUES (6, 222, 20, 'devices', '2019-04-08 12:11:22', '2019-05-07 09:49:11');
INSERT INTO `dealer_pagination` VALUES (7, 154, 20, 'apk', '2019-04-08 16:18:47', '2019-05-08 11:30:03');
INSERT INTO `dealer_pagination` VALUES (8, 154, 100, 'sdealer', '2019-04-09 14:14:40', '2019-04-11 04:13:58');
INSERT INTO `dealer_pagination` VALUES (9, 223, 10, 'devices', '2019-04-10 09:46:55', NULL);
INSERT INTO `dealer_pagination` VALUES (10, 224, 10, 'devices', '2019-04-10 21:08:53', NULL);
INSERT INTO `dealer_pagination` VALUES (11, 224, 10, 'sdealer', '2019-04-10 22:15:02', NULL);
INSERT INTO `dealer_pagination` VALUES (12, 225, 10, 'devices', '2019-04-11 10:40:39', NULL);
INSERT INTO `dealer_pagination` VALUES (13, 226, 10, 'devices', '2019-04-12 07:12:13', NULL);
INSERT INTO `dealer_pagination` VALUES (14, 225, 10, 'sdealer', '2019-04-12 11:20:00', NULL);
INSERT INTO `dealer_pagination` VALUES (15, 228, 10, 'devices', '2019-04-24 17:43:55', NULL);
INSERT INTO `dealer_pagination` VALUES (16, 230, 10, 'devices', '2019-04-27 23:22:23', NULL);
INSERT INTO `dealer_pagination` VALUES (17, 229, 10, 'devices', '2019-04-27 23:24:38', NULL);
INSERT INTO `dealer_pagination` VALUES (18, 229, 10, 'sdealer', '2019-04-27 23:27:13', NULL);
INSERT INTO `dealer_pagination` VALUES (19, 231, 10, 'devices', '2019-04-29 09:52:13', NULL);
INSERT INTO `dealer_pagination` VALUES (20, 154, 10, 'users', '2019-04-29 16:10:09', '2019-05-13 05:02:33');
INSERT INTO `dealer_pagination` VALUES (21, 224, 10, 'users', '2019-04-29 16:36:26', NULL);
INSERT INTO `dealer_pagination` VALUES (22, 232, 10, 'devices', '2019-04-30 08:00:32', NULL);
INSERT INTO `dealer_pagination` VALUES (23, 232, 10, 'users', '2019-04-30 08:08:52', NULL);
INSERT INTO `dealer_pagination` VALUES (24, 229, 10, 'users', '2019-04-30 16:11:07', NULL);
INSERT INTO `dealer_pagination` VALUES (25, 231, 10, 'users', '2019-05-02 06:57:43', NULL);
INSERT INTO `dealer_pagination` VALUES (26, 231, 10, 'sdealer', '2019-05-02 07:00:37', NULL);
INSERT INTO `dealer_pagination` VALUES (27, 233, 10, 'users', '2019-05-02 07:30:02', NULL);
INSERT INTO `dealer_pagination` VALUES (28, 154, 10, 'policies', '2019-05-07 09:33:08', '2019-05-14 14:40:12');
INSERT INTO `dealer_pagination` VALUES (29, 222, 10, 'policies', '2019-05-14 16:54:58', '2019-05-15 12:19:08');

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
) ENGINE = InnoDB AUTO_INCREMENT = 104 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_policies
-- ----------------------------
INSERT INTO `dealer_policies` VALUES (12, 222, 1);
INSERT INTO `dealer_policies` VALUES (70, 222, 2);
INSERT INTO `dealer_policies` VALUES (11, 223, 1);
INSERT INTO `dealer_policies` VALUES (92, 223, 2);
INSERT INTO `dealer_policies` VALUES (10, 224, 1);
INSERT INTO `dealer_policies` VALUES (45, 224, 2);
INSERT INTO `dealer_policies` VALUES (9, 225, 1);
INSERT INTO `dealer_policies` VALUES (44, 225, 2);
INSERT INTO `dealer_policies` VALUES (8, 226, 1);
INSERT INTO `dealer_policies` VALUES (43, 226, 2);
INSERT INTO `dealer_policies` VALUES (7, 227, 1);
INSERT INTO `dealer_policies` VALUES (42, 227, 2);
INSERT INTO `dealer_policies` VALUES (6, 228, 1);
INSERT INTO `dealer_policies` VALUES (41, 228, 2);
INSERT INTO `dealer_policies` VALUES (5, 229, 1);
INSERT INTO `dealer_policies` VALUES (40, 229, 2);
INSERT INTO `dealer_policies` VALUES (4, 230, 1);
INSERT INTO `dealer_policies` VALUES (39, 230, 2);
INSERT INTO `dealer_policies` VALUES (3, 231, 1);
INSERT INTO `dealer_policies` VALUES (38, 231, 2);
INSERT INTO `dealer_policies` VALUES (2, 232, 1);
INSERT INTO `dealer_policies` VALUES (37, 232, 2);
INSERT INTO `dealer_policies` VALUES (24, 233, 1);
INSERT INTO `dealer_policies` VALUES (36, 233, 2);

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
) ENGINE = InnoDB AUTO_INCREMENT = 234 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 0, NULL, 0, 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (222, NULL, NULL, 0, 'usman hafeez', 'usmanhafeez147@gmail.com', '99ce78652ecfc64899f9811135f86ffd', '433523', 0, '', 0, 2, 0, '', '2019-04-03 15:23:26', '2019-04-03 15:23:26');
INSERT INTO `dealers` VALUES (223, NULL, NULL, 0, 'Barry', 'barrybarrygood@hotmail.com', 'b3af9d5ab1e2964e69b523a20e9690c8', '610192', 0, NULL, 0, 2, 0, NULL, '2019-04-10 09:14:30', '2019-04-10 09:14:30');
INSERT INTO `dealers` VALUES (224, NULL, NULL, 0, 'zaid', 'zaid@vortexapp.ca', 'e920be62c02a7d5549be410f1f31366b', '417695', 0, NULL, 0, 2, 0, NULL, '2019-04-10 21:06:51', '2019-04-10 21:06:51');
INSERT INTO `dealers` VALUES (225, NULL, NULL, 0, 'Hamza Dawood', 'hamza.dawood007@gmail.com', 'ddd4f7b9a97897ec3ab9400b70034d40', '541763', 1, NULL, 0, 2, 0, NULL, '2019-04-11 10:39:50', '2019-04-11 10:39:50');
INSERT INTO `dealers` VALUES (226, NULL, NULL, 0, 'Arfan ali', 'arawan77rb@gmail.com', 'c3c6b034a0622448ec602efda5c0964f', '262165', 0, NULL, 0, 2, 0, NULL, '2019-04-12 07:10:40', '2019-04-12 07:10:40');
INSERT INTO `dealers` VALUES (227, NULL, NULL, 225, 'Hamza123', 'hamza.jutt004@gmail.com', 'e43a2b055b93736a42bcf71f257398ec', '753909', 0, NULL, 0, 3, 0, NULL, '2019-04-18 06:31:19', '2019-04-18 06:31:19');
INSERT INTO `dealers` VALUES (228, NULL, NULL, 0, 'Omegamoon', 'omegamoon@gmail.com', '78db4f647cbd8a14782b620b8e305242', '187854', 0, NULL, 0, 2, 0, NULL, '2019-04-24 16:55:43', '2019-04-24 16:55:43');
INSERT INTO `dealers` VALUES (229, NULL, NULL, 0, 'titan', 'dealer@titansecure.mobi', '66cd3187390abbb19fea16e5ed7b1eaf', '690957', 0, NULL, 0, 2, 0, NULL, '2019-04-27 23:10:08', '2019-04-27 23:10:08');
INSERT INTO `dealers` VALUES (230, NULL, NULL, 229, 'titan-subdealer', 'subdealer@titansecure.mobi', '7eb95339f4ae8e0a0b1d7f606c2c728e', '428146', 0, NULL, 0, 3, 0, NULL, '2019-04-27 23:11:11', '2019-04-27 23:11:11');
INSERT INTO `dealers` VALUES (231, NULL, NULL, 0, 'Adeel', 'adeel@sunztech.com', 'a96e1e296399f5c9f704b9088c6e9785', '166778', 0, NULL, 0, 2, 0, NULL, '2019-04-29 09:47:08', '2019-04-29 09:47:08');
INSERT INTO `dealers` VALUES (232, NULL, NULL, 0, 'Muhammad mehran', 'imuhammadmehran@gmail.com', '3484962edfa5bfbe1994f61592804085', '674794', 0, NULL, 0, 2, 0, NULL, '2019-04-30 07:59:15', '2019-04-30 07:59:15');
INSERT INTO `dealers` VALUES (233, NULL, NULL, 231, 'Adeel S-dealer', 'adeelsunztech@gmail.com', '8788fe086257e6aa8072409beacb01ac', '718785', 0, NULL, 0, 3, 0, NULL, '2019-05-02 07:01:26', '2019-05-02 07:01:26');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of default_policies
-- ----------------------------
INSERT INTO `default_policies` VALUES (4, 225, 3, '2019-05-14 12:46:43', '2019-05-14 12:48:39');

-- ----------------------------
-- Table structure for device_history
-- ----------------------------
DROP TABLE IF EXISTS `device_history`;
CREATE TABLE `device_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `user_acc_id` int(11) NULL DEFAULT 0,
  `dealer_id` int(11) NOT NULL DEFAULT 0,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `push_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `pull_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `imei` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('push_apps','pull_apps','history','imei','policy','force_update') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 222 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device_history
-- ----------------------------
INSERT INTO `device_history` VALUES (213, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":55,\"apk_id\":55,\"package_name\":\"com.facebook.lite\",\"version_name\":\"145.0.0.8.111\",\"apk\":\"apk-1557572140451.apk\",\"apk_name\":\"Facebook Lite\",\"guest\":false,\"encrypted\":true,\"enable\":true}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:05:29', '2019-05-15 16:05:29');
INSERT INTO `device_history` VALUES (214, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":55,\"apk_id\":55,\"package_name\":\"com.facebook.lite\",\"version_name\":\"145.0.0.8.111\",\"apk\":\"apk-1557572140451.apk\",\"apk_name\":\"Facebook Lite\",\"guest\":true,\"encrypted\":true,\"enable\":true}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:08:03', '2019-05-15 16:08:03');
INSERT INTO `device_history` VALUES (215, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":55,\"apk_id\":55,\"package_name\":\"com.facebook.lite\",\"version_name\":\"145.0.0.8.111\",\"apk\":\"apk-1557572140451.apk\",\"apk_name\":\"Facebook Lite\",\"guest\":false,\"encrypted\":false,\"enable\":false}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:08:25', '2019-05-15 16:08:25');
INSERT INTO `device_history` VALUES (216, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":true,\"encrypted\":true,\"enable\":true}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:14:33', '2019-05-15 16:14:33');
INSERT INTO `device_history` VALUES (217, 93, 0, NULL, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":false,\"encrypted\":false,\"enable\":false}]', NULL, 'pull_apps', 1, '2019-05-15 16:16:40', '2019-05-15 16:16:40');
INSERT INTO `device_history` VALUES (218, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":true,\"encrypted\":true,\"enable\":true}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:17:20', '2019-05-15 16:17:20');
INSERT INTO `device_history` VALUES (219, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":false,\"encrypted\":true,\"enable\":true}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:39:14', '2019-05-15 16:39:14');
INSERT INTO `device_history` VALUES (220, 93, 0, NULL, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":false,\"encrypted\":false,\"enable\":false}]', NULL, 'pull_apps', 1, '2019-05-15 16:39:45', '2019-05-15 16:39:45');
INSERT INTO `device_history` VALUES (221, 93, 0, NULL, NULL, NULL, NULL, '[{\"key\":58,\"apk_id\":58,\"package_name\":\"com.facebook.mlite\",\"version_name\":\"58.0.0.9.176\",\"apk\":\"apk-1557918832419.apk\",\"apk_name\":\"testing\",\"guest\":false,\"encrypted\":false,\"enable\":false}]', NULL, NULL, 'push_apps', 1, '2019-05-15 16:40:01', '2019-05-15 16:40:01');

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
  `is_push_apps` tinyint(4) NULL DEFAULT 0,
  `flagged` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '',
  `screen_start_date` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `reject_status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_mac_address`(`mac_address`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 709 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (700, 'AECE977918', NULL, 'puwoEvsMYIZ9oSa8AAAB', NULL, '192.168.0.101', 'null', '354444076293150', 'null', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', NULL, 'off', 1, 0, '', NULL, 0, '2019-05-11 04:47:24', '2019-05-15 15:41:00');
INSERT INTO `devices` VALUES (704, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, 0, '', NULL, 0, '2019-05-11 10:05:16', NULL);
INSERT INTO `devices` VALUES (708, 'DDAF250244', 'Usman', 'pZPWpUJ47CjyRYs8AAAX', 'sdfsaf', '192.168.0.102', '8992042306182528852f', '354444076298332', '8992042306182528811f', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', NULL, 'On', 1, 0, '', NULL, 0, '2019-05-15 16:03:48', '2019-05-15 17:24:40');

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
) ENGINE = InnoDB AUTO_INCREMENT = 16 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of imei_history
-- ----------------------------
INSERT INTO `imei_history` VALUES (12, 'ECCB212734', '0123456789ABCDEF', '00:69:06:45:00:CC', 'null', 'null', 'null', 'null', '2019-05-11 11:18:20', NULL);
INSERT INTO `imei_history` VALUES (13, 'AECE977918', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '354444076293150', '354444076293168', '354444076293150', '354444076293168', '2019-05-14 10:04:32', NULL);
INSERT INTO `imei_history` VALUES (14, 'BDBD107716', '0123456789ABCDEF', '00:2F:F2:7F:EC:94', NULL, '', 'null', 'null', '2019-05-15 15:58:58', NULL);
INSERT INTO `imei_history` VALUES (15, 'DDAF250244', 'VSP1001901S00431', '00:27:15:2E:8E:BD', '354444076298332', '354444076298340', '354444076298332', '354444076298340', '2019-05-15 16:03:48', NULL);

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
) ENGINE = MyISAM AUTO_INCREMENT = 177 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of login_history
-- ----------------------------
INSERT INTO `login_history` VALUES (1, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0b2tlbiI6bnVsbH0sImlhdCI6MTU1NTkyODQ1NiwiZXhwIjoxNTU2MDE0ODU2fQ.LDTcc0TAuWQM-8JDjJtqxH_p0WJd13dWjXwfEnN8FZU', '86400s', 'undefined', NULL, 'admin', 'token', 1, '2019-04-22 15:20:56', NULL);
INSERT INTO `login_history` VALUES (2, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NTkyODgxNiwiZXhwIjoxNTU2MDE1MjE2fQ.ibE8aHx5CdysBdROHwww8rVAq3JKkJMWosOQLVUpigg', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-04-22 15:26:56', NULL);
INSERT INTO `login_history` VALUES (3, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NTkzNjQyMiwiZXhwIjoxNTU2MDIyODIyfQ.noegBcpa4SfQcAYQNyRcJgIv2Gw230mPSQIGY8Xlhpw', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-04-22 17:33:42', NULL);
INSERT INTO `login_history` VALUES (4, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5MzczMzAsImV4cCI6MTU1NjAyMzczMH0.IpUFUMEcxO8f3f9c3Q0pz0YrkQzGu2rS9m9AbOIvaOw', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 12:48:50', NULL);
INSERT INTO `login_history` VALUES (5, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5MzczNTQsImV4cCI6MTU1NjAyMzc1NH0.gSWKKfoyEWyAR_lm5rPJWnu2n5h11LpNPLzxK6HfdlI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 12:49:14', NULL);
INSERT INTO `login_history` VALUES (6, NULL, '225', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjUsImRlYWxlcl9pZCI6MjI1LCJlbWFpbCI6ImhhbXphLmRhd29vZDAwN0BnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6IkhhbXphIERhd29vZCIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJIYW16YSBEYXdvb2QiLCJkZWFsZXJfZW1haWwiOiJoYW16YS5kYXdvb2QwMDdAZ21haWwuY29tIiwibGlua19jb2RlIjoiNTQxNzYzIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMiJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwibW9kaWZpZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU1OTM3MzkyLCJleHAiOjE1NTYwMjM3OTJ9.zVCCAC2gOm2auQPnzv83nrR4O3MLk2SomIBb7YfMTD8', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-22 12:49:52', NULL);
INSERT INTO `login_history` VALUES (7, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5NTg4NzEsImV4cCI6MTU1NjA0NTI3MX0.hJnwW1vIcZ2ig5lpLx1N9g5hTDWEr5r4jsNLF6AZ4pU', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 18:47:51', NULL);
INSERT INTO `login_history` VALUES (8, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5NTg4NzEsImV4cCI6MTU1NjA0NTI3MX0.hJnwW1vIcZ2ig5lpLx1N9g5hTDWEr5r4jsNLF6AZ4pU', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 18:47:51', NULL);
INSERT INTO `login_history` VALUES (9, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5NTg5MjIsImV4cCI6MTU1NjA0NTMyMn0._C_3NJFiVWUoFQpYHzfiv82ErixNjd3nB56OBR3lYdk', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 18:48:42', NULL);
INSERT INTO `login_history` VALUES (10, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5NTk0MzksImV4cCI6MTU1NjA0NTgzOX0.2CFmKcCUJwHz8VY0MYT9CcJPSQWDc0_D98gEsMGMdrg', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 18:57:19', NULL);
INSERT INTO `login_history` VALUES (11, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTU5NjE0NDgsImV4cCI6MTU1NjA0Nzg0OH0.VTnYACQ6PLnEjh_gs76xZPJOnANmjKHuOr6Hsq9tI8E', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-22 19:30:48', NULL);
INSERT INTO `login_history` VALUES (12, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYwMTgxNTksImV4cCI6MTU1NjEwNDU1OX0.f112je3Db7CT4kfgghZHsG6zKPmWF7C8HxAtt8O1qVI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-23 11:15:59', NULL);
INSERT INTO `login_history` VALUES (13, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYwOTQ4OTQsImV4cCI6MTU1NjE4MTI5NH0.5wPau_FFk47C5eUtIPpoHlTC9Z03LoBG05WPGla5qbQ', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 08:34:54', NULL);
INSERT INTO `login_history` VALUES (14, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYwOTg2NzQsImV4cCI6MTU1NjE4NTA3NH0.9ZI3FePOtvwYPRsSMhCTYgtijgXTsZ47JXdHhBax51g', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 09:37:54', NULL);
INSERT INTO `login_history` VALUES (15, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYwOTg2NzksImV4cCI6MTU1NjE4NTA3OX0.nV150DTVwwqYRS9HJerkXBKvofTjbcTjGGOTjNkjO6Q', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 09:37:59', NULL);
INSERT INTO `login_history` VALUES (16, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYwOTg3MjgsImV4cCI6MTU1NjE4NTEyOH0.2ZhJTvjKlpjgL2nN4y1lkxQ_1jdLzMGBmcS-gdBnIyE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 09:38:48', NULL);
INSERT INTO `login_history` VALUES (17, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxMDQ4MDUsImV4cCI6MTU1NjE5MTIwNX0.7G7euIdHpgu8KAjBpkBU7EkQp-msYWYnnBowT7HWmxc', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 11:20:05', NULL);
INSERT INTO `login_history` VALUES (18, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxMDk0NzMsImV4cCI6MTU1NjE5NTg3M30.RXFz0TH0VJLF5324p9BnIl8r5dRwmMa7J1DkOtOI3Pk', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 12:37:53', NULL);
INSERT INTO `login_history` VALUES (19, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxMjQ3MjgsImV4cCI6MTU1NjIxMTEyOH0.HaL40ZcHVZZXn1DPrlD9MRLAekCXo2-z-FapzrrjT_A', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 16:52:08', NULL);
INSERT INTO `login_history` VALUES (20, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxMjY1MTksImV4cCI6MTU1NjIxMjkxOX0._tReXBtyBRamSHiFGyMrrWxwjUY1i6eIKMAtJCT1Pjk', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 17:21:59', NULL);
INSERT INTO `login_history` VALUES (21, NULL, '228', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjgsImRlYWxlcl9pZCI6MjI4LCJlbWFpbCI6Im9tZWdhbW9vbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik9tZWdhbW9vbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJPbWVnYW1vb24iLCJkZWFsZXJfZW1haWwiOiJvbWVnYW1vb25AZ21haWwuY29tIiwibGlua19jb2RlIjoiMTg3ODU0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI0IDE2OjU1OjQzIiwibW9kaWZpZWQiOiIyMDE5LTA0LTI0IDE2OjU1OjQzIiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2MTI2NzExLCJleHAiOjE1NTYyMTMxMTF9.VrkpNIdfJiCFnzYiPzP02K1BBTZyTpN8RTGYg_KfMYY', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-24 17:25:11', NULL);
INSERT INTO `login_history` VALUES (22, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxMjcxOTIsImV4cCI6MTU1NjIxMzU5Mn0.UvgDqr07VLV0rxprjmaZj-7L38vydKrX9p0tA77FiE0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-24 17:33:12', NULL);
INSERT INTO `login_history` VALUES (23, NULL, '228', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjgsImRlYWxlcl9pZCI6MjI4LCJlbWFpbCI6Im9tZWdhbW9vbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik9tZWdhbW9vbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJPbWVnYW1vb24iLCJkZWFsZXJfZW1haWwiOiJvbWVnYW1vb25AZ21haWwuY29tIiwibGlua19jb2RlIjoiMTg3ODU0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI0IDE2OjU1OjQzIiwibW9kaWZpZWQiOiIyMDE5LTA0LTI0IDE2OjU1OjQzIiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2MTI3NzE4LCJleHAiOjE1NTYyMTQxMTh9.x2h_V1lsLP8fjoUxzLlMcD0RCzeU1Pw-CLRPPHN13Vk', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-24 17:41:58', NULL);
INSERT INTO `login_history` VALUES (24, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjEifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjE1NzIxNSwiZXhwIjoxNTU2MjQzNjE1fQ.Mz-r-ahZA-XOc-Mzqlc9YnuxnzshanTxRsq2ug_ow9g', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-25 01:53:35', NULL);
INSERT INTO `login_history` VALUES (25, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxNTcyMzksImV4cCI6MTU1NjI0MzYzOX0.CrMf6HLCRqYBw-6cRYpKLzye3KqXXl8BotSNB9qusNM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-25 01:53:59', NULL);
INSERT INTO `login_history` VALUES (26, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjEifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjE1OTA1NywiZXhwIjoxNTU2MjQ1NDU3fQ.RPWspcq1f3318pfPMD3oTmS9krNvj91aY-gAqatNMm0', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-25 02:24:17', NULL);
INSERT INTO `login_history` VALUES (27, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxNTkzODIsImV4cCI6MTU1NjI0NTc4Mn0.au4Xj-_eqnbUrsckhcpOIEgKSBrlfqdqHGfmQYCNqQE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-25 02:29:42', NULL);
INSERT INTO `login_history` VALUES (28, NULL, '222', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjIsImRlYWxlcl9pZCI6MjIyLCJlbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoidXNtYW4gaGFmZWV6IiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InVzbWFuIGhhZmVleiIsImRlYWxlcl9lbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxpbmtfY29kZSI6IjQzMzUyMyIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjIifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0wMyAxNToyMzoyNiIsIm1vZGlmaWVkIjoiMjAxOS0wNC0wMyAxNToyMzoyNiIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjE2ODc1OSwiZXhwIjoxNTU2MjU1MTU5fQ.iKdKePQa3qBAHdxFQ91v3mRdAzfvkCiSljuKTr23C7w', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-25 05:05:59', NULL);
INSERT INTO `login_history` VALUES (29, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYxOTQyNzgsImV4cCI6MTU1NjI4MDY3OH0.x61fAyPpb2qigUFfEMDPJ796y9ZxxaQhdBd__POgrv8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-25 12:11:18', NULL);
INSERT INTO `login_history` VALUES (30, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYyNDY5OTcsImV4cCI6MTU1NjMzMzM5N30.S5ccXHFYOxE9k5ebAP_I4oRYG3CO__Oz6kulZnljFUU', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-26 02:49:57', NULL);
INSERT INTO `login_history` VALUES (31, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYyNjAyMjcsImV4cCI6MTU1NjM0NjYyN30.3QP1WBdEVzxveTnxJAnSZ81fwksATkf6aPv1-4rISY8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-26 06:30:27', NULL);
INSERT INTO `login_history` VALUES (32, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYyNzYzMTAsImV4cCI6MTU1NjM2MjcxMH0.v421b-eqxL4Z16DGsgnh_gBCzV_iIk69cfMz_SjRCX8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-26 10:58:30', NULL);
INSERT INTO `login_history` VALUES (33, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYyNzYzNjEsImV4cCI6MTU1NjM2Mjc2MX0.JwU_jtvLzcCgZO784TvMsq9R7OPlJmvTZ89N7_8egLo', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-26 10:59:21', NULL);
INSERT INTO `login_history` VALUES (34, NULL, '222', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjIsImRlYWxlcl9pZCI6MjIyLCJlbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoidXNtYW4gaGFmZWV6IiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InVzbWFuIGhhZmVleiIsImRlYWxlcl9lbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxpbmtfY29kZSI6IjQzMzUyMyIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjIifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0wMyAxNToyMzoyNiIsIm1vZGlmaWVkIjoiMjAxOS0wNC0wMyAxNToyMzoyNiIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjI3NjQyMywiZXhwIjoxNTU2MzYyODIzfQ.IrLo0-r3k0JXQScBhv1MRJCQIPIgNK62duJj5W68vt8', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-26 11:00:23', NULL);
INSERT INTO `login_history` VALUES (35, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYyNzY2NDksImV4cCI6MTU1NjM2MzA0OX0.u_rHyVlDLuBxm0YVbNWxLLG9iB--R3LAe4EYjycm3qY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-26 11:04:09', NULL);
INSERT INTO `login_history` VALUES (36, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzNDI4NTcsImV4cCI6MTU1NjQyOTI1N30.fXKXNBVA4RTuW1IRh5mBAYDRgSssmJYch_D8OaolyhI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 05:27:37', NULL);
INSERT INTO `login_history` VALUES (37, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjIifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjM0MzM4NCwiZXhwIjoxNTU2NDI5Nzg0fQ.KR1xL5uthiw3pN_DymAj6B6PyWVfRnYaP3pD-gq7B28', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-27 05:36:24', NULL);
INSERT INTO `login_history` VALUES (38, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzNDM0NDQsImV4cCI6MTU1NjQyOTg0NH0.vlPGHcWeCL-QL7QiOO9XaAmz6urwc1lddSu2nzwFlcg', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 05:37:24', NULL);
INSERT INTO `login_history` VALUES (39, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjMifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjM0MzU2MSwiZXhwIjoxNTU2NDI5OTYxfQ.BbIijcsrD9McKTSZs-hS1-nXC9i0IQwExyccyeCCXro', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-27 05:39:21', NULL);
INSERT INTO `login_history` VALUES (40, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzNDM3NjgsImV4cCI6MTU1NjQzMDE2OH0.krLl6d2xwbdctgdkZLdUlKaL8s_h2Dag6brhRTYv68M', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 05:42:48', NULL);
INSERT INTO `login_history` VALUES (41, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzNDg4OTksImV4cCI6MTU1NjQzNTI5OX0.bljZo8vG1WF8D91XRMqRRww1K039940Kl1wR6ZYLe_U', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 07:08:19', NULL);
INSERT INTO `login_history` VALUES (42, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzNjgyMjcsImV4cCI6MTU1NjQ1NDYyN30.beda1I_EC8z-pPaOdePHQYCeHeZNByWKPC7cqfQQhOQ', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 12:30:27', NULL);
INSERT INTO `login_history` VALUES (43, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTYzOTE1MTIsImV4cCI6MTU1NjQ3NzkxMn0.IypQHsAOjZmFfSq3GJhMp8n6b2zgi6rrKDnxzXE8phM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 18:58:32', NULL);
INSERT INTO `login_history` VALUES (44, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDYzMDUsImV4cCI6MTU1NjQ5MjcwNX0.yLGcNiYO_aeF9IsJ0mRQ-BFZBy1tQwKsQTFZ66Ar2O0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 23:05:05', NULL);
INSERT INTO `login_history` VALUES (45, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDY5MzcsImV4cCI6MTU1NjQ5MzMzN30.9U1vwXgmASi4_0RIK7UjU4IemaRQfm3Z1GN-9hUBq30', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-27 23:15:37', NULL);
INSERT INTO `login_history` VALUES (46, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDY5ODIsImV4cCI6MTU1NjQ5MzM4Mn0.-Dmpx2fkpaj3XW-CDM0UX9vKIS5lx6LIkWjx9dLs864', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 23:16:22', NULL);
INSERT INTO `login_history` VALUES (47, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDcyMzQsImV4cCI6MTU1NjQ5MzYzNH0.W2-LeFRfWG__bJ0BHn8MD6MyYOhqSNG1k9urDL88CAc', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-27 23:20:34', NULL);
INSERT INTO `login_history` VALUES (48, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDczNzAsImV4cCI6MTU1NjQ5Mzc3MH0.c4Wl-hpdpAMkWX-j67ayXetcDrVEApPN8D2I16GLxM0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 23:22:50', NULL);
INSERT INTO `login_history` VALUES (49, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NDA3NDc3LCJleHAiOjE1NTY0OTM4Nzd9.1U6fk38dvgcsE9xJJ43qlguNjAJW8d5HpUAVU5Nlijg', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-27 23:24:37', NULL);
INSERT INTO `login_history` VALUES (50, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDc1NTMsImV4cCI6MTU1NjQ5Mzk1M30.MVlm--cjx-Uzx3_oZPfqdzpA0u2lxwtJ3nnq2kHdSnE', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-27 23:25:53', NULL);
INSERT INTO `login_history` VALUES (51, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDc1NjcsImV4cCI6MTU1NjQ5Mzk2N30.eDdzIsmAzG9jl03feHf7oVrgWTT2mxcLXx6sYFQ_td0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 23:26:07', NULL);
INSERT INTO `login_history` VALUES (52, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NDA3NTkzLCJleHAiOjE1NTY0OTM5OTN9.B7iC_t5bwGJymD0tASMTvuoYeJp-__75Sz7WgcJvm7o', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-27 23:26:33', NULL);
INSERT INTO `login_history` VALUES (53, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDc2NjIsImV4cCI6MTU1NjQ5NDA2Mn0.kfovNSejeTeinCPxHzKrUtdRXBXqHz-wFP_2x0W6TC4', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-27 23:27:42', NULL);
INSERT INTO `login_history` VALUES (54, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NDA3NzMwLCJleHAiOjE1NTY0OTQxMzB9.xDc7Ye7bigpP0ybiJOkmJpkgRJvG8XT2bijN_A8YmFQ', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-27 23:28:50', NULL);
INSERT INTO `login_history` VALUES (55, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MDgzMDUsImV4cCI6MTU1NjQ5NDcwNX0.ZdiRqgO8D1anFNAZag6wau206JnGMz0B1pRvC7tKonI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-27 23:38:25', NULL);
INSERT INTO `login_history` VALUES (56, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTM2NjIsImV4cCI6MTU1NjUwMDA2Mn0.dgxPh5uwmnDUlsxmfN4NwOdWQ20xi9_GNvMLZTkj-48', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-28 01:07:42', NULL);
INSERT INTO `login_history` VALUES (57, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTM4NDUsImV4cCI6MTU1NjUwMDI0NX0.E16xqYm4pPJHaOSQyvHDmK1D7fV1c3If1rIzQS0O6fg', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-28 01:10:45', NULL);
INSERT INTO `login_history` VALUES (58, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTQxNTMsImV4cCI6MTU1NjUwMDU1M30.sr97-AU0QHH67DorrakbFLQ4kWqSGkxaPeYBBUdRwFo', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-28 01:15:53', NULL);
INSERT INTO `login_history` VALUES (59, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTkwNDgsImV4cCI6MTU1NjUwNTQ0OH0.27FgKngqYQtdSYhoBL8JP5jr9pJBzWjCJ6jHsXsP8IM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-28 02:37:28', NULL);
INSERT INTO `login_history` VALUES (60, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NDE5MTE2LCJleHAiOjE1NTY1MDU1MTZ9.tkO_PP3Kwtu7kGtmH0_JTtzbClunxr9AP3Mb3SXfq0A', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-28 02:38:36', NULL);
INSERT INTO `login_history` VALUES (61, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjEifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTkxMjcsImV4cCI6MTU1NjUwNTUyN30.PYSiiywbcAC5UEpgklFdGkmw1YshzLPgEcM12yp6W5g', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-28 02:38:47', NULL);
INSERT INTO `login_history` VALUES (62, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0MTk3NTUsImV4cCI6MTU1NjUwNjE1NX0.idRyzeUtiyf66FOj6n7Eo__ZTY983oziArZmkTOeXRY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-28 02:49:15', NULL);
INSERT INTO `login_history` VALUES (63, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY0ODAxODQsImV4cCI6MTU1NjU2NjU4NH0.SKNFwWOYGTdAtqRdJ_GoYJPZvM_CfJrg9PhVX12I_Co', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-28 19:36:24', NULL);
INSERT INTO `login_history` VALUES (64, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NDgwMjA0LCJleHAiOjE1NTY1NjY2MDR9.rLAd08o97n9rdN50N5H0YpUL9iCM9HDF5_wP70DCo3c', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-28 19:36:44', NULL);
INSERT INTO `login_history` VALUES (65, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1MTg3NDksImV4cCI6MTU1NjYwNTE0OX0.fa8FpEBBslpfAB7zfagNEzUPQ7D8oKjaJu9rwuBqDI8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 06:19:09', NULL);
INSERT INTO `login_history` VALUES (66, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1MTk0MDgsImV4cCI6MTU1NjYwNTgwOH0.ldycj9lcR_yvDlXshFqyv0excZqNtVudSiB5G2ONiNc', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 06:30:08', NULL);
INSERT INTO `login_history` VALUES (67, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIwIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjUzMTMxNywiZXhwIjoxNTU2NjE3NzE3fQ.C6tFnKFgMdkwD61GxTAyvx8zaAyOP8TnPGUPQQcwUUw', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-04-29 09:48:40', NULL);
INSERT INTO `login_history` VALUES (68, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1MzcxODUsImV4cCI6MTU1NjYyMzU4NX0.vRlUdW9t2SEhvKiM85NF6hBsrClIKI6l0vcP2TFzEUw', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 11:26:25', NULL);
INSERT INTO `login_history` VALUES (69, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjU0Mzg3MSwiZXhwIjoxNTU2NjMwMjcxfQ.CSW_kkRz-otACKQQFVQm4guB9nZKreb33ZQbPHCd1Ig', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-04-29 13:17:55', NULL);
INSERT INTO `login_history` VALUES (70, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjU0Mzk0MywiZXhwIjoxNTU2NjMwMzQzfQ.B4y7ofD7kDd5Z1bMQ6TfLhlV7BdODNgENsprKnVTlfw', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-04-29 13:19:07', NULL);
INSERT INTO `login_history` VALUES (71, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NDU0MTYsImV4cCI6MTU1NjYzMTgxNn0.sSxmbO7HexN43eRbpHBP_SNkZQjGSqD_L36D7UEntvY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 13:43:36', NULL);
INSERT INTO `login_history` VALUES (72, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTM0NDUsImV4cCI6MTU1NjYzOTg0NX0.-_zDyWcGfOt7p2LO5qfU-JWzgzO6jQF-mMCNHJfUP_Q', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 15:57:25', NULL);
INSERT INTO `login_history` VALUES (73, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTQxNjMsImV4cCI6MTU1NjY0MDU2M30.ZOaEiC6uCJCVG1nJDyp8jbDEKlelmhVk-P-w7eQI6oA', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-04-29 16:09:23', NULL);
INSERT INTO `login_history` VALUES (74, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTQyMDEsImV4cCI6MTU1NjY0MDYwMX0.spA4xSAhBswHBd2JvOZgb2VKQPc_yFSU7oK8mvYHI_s', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:10:01', NULL);
INSERT INTO `login_history` VALUES (75, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMiJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NTU0MjM3LCJleHAiOjE1NTY2NDA2Mzd9.-pY9mK1W5NQbuvhmxaZnh6vPaaHsPfvFRz41fMx6iR4', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-29 16:10:37', NULL);
INSERT INTO `login_history` VALUES (76, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTQ0ODksImV4cCI6MTU1NjY0MDg4OX0.Jq4lFqNxV0AVZSGgLFE_ktlB7QgVJ67zfjLVZZ70Gw8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:14:49', NULL);
INSERT INTO `login_history` VALUES (77, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTQ1MTIsImV4cCI6MTU1NjY0MDkxMn0.EeqjFO8k1qMiivAzZ92XvMVi5UVVRFHbS1_mGJxjOvE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:15:12', NULL);
INSERT INTO `login_history` VALUES (78, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTQ2MzMsImV4cCI6MTU1NjY0MTAzM30.ZTCOrAikQUtPytjfrEc2FcuqlTD5k3KgdawhrfZOG3A', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:17:13', NULL);
INSERT INTO `login_history` VALUES (79, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMyJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NTU0Nzc3LCJleHAiOjE1NTY2NDExNzd9.Qota2FdzPbLkgHcrmINtlpsQdMSJgQBa0OJDtTFNC7I', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-29 16:19:37', NULL);
INSERT INTO `login_history` VALUES (80, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjMifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjU1NTU5NCwiZXhwIjoxNTU2NjQxOTk0fQ.yDpBP47XA7TtTD740MqJixfquALfHqkDEyELDxZCI8E', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-29 16:33:14', NULL);
INSERT INTO `login_history` VALUES (81, NULL, '224', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjQsImRlYWxlcl9pZCI6MjI0LCJlbWFpbCI6InphaWRAdm9ydGV4YXBwLmNhIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ6YWlkIiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InphaWQiLCJkZWFsZXJfZW1haWwiOiJ6YWlkQHZvcnRleGFwcC5jYSIsImxpbmtfY29kZSI6IjQxNzY5NSIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjQifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0xMCAyMTowNjo1MSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NjU1NTg4NiwiZXhwIjoxNTU2NjQyMjg2fQ.PqSfUPH_7PiqKs1p5m0n66wcOEHELkisEPekauxggq8', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-29 16:38:06', NULL);
INSERT INTO `login_history` VALUES (82, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTYxNjUsImV4cCI6MTU1NjY0MjU2NX0.PSVO5qOzkszAaluYE4NwQutS5O-O5CCFyS56OGIp5A0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:42:45', NULL);
INSERT INTO `login_history` VALUES (83, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NTYyOTEsImV4cCI6MTU1NjY0MjY5MX0.zf68kdb3tmrjlJx6ca1TXy3rA-DTqKtEyJQe3XzSlYE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 16:44:51', NULL);
INSERT INTO `login_history` VALUES (84, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1NjM1MzIsImV4cCI6MTU1NjY0OTkzMn0.j-V9cC1c6KmVPG-7YUEV40vh-bK6bBDSVRlvS9SHNSc', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 18:45:32', NULL);
INSERT INTO `login_history` VALUES (85, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY1Njc4MTMsImV4cCI6MTU1NjY1NDIxM30.Q0Z-lmd-4S6EHd2yOqUTXkMUK1InV3uv0OGsqQZ2XSY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-29 19:56:53', NULL);
INSERT INTO `login_history` VALUES (86, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MDYyNDUsImV4cCI6MTU1NjY5MjY0NX0.9UwfJpM_NJfGdLiHNvAyRWjXZrzY6skOqIKCk2yC9qM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 06:37:25', NULL);
INSERT INTO `login_history` VALUES (87, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MTA5NzIsImV4cCI6MTU1NjY5NzM3Mn0.3AY7vDDgPIBKV1fl6bZz9WQO5X7EQpie5nZbfzRF4HM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 07:56:12', NULL);
INSERT INTO `login_history` VALUES (88, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwibW9kaWZpZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NjExMTkzLCJleHAiOjE1NTY2OTc1OTN9.VqhCyg0xyHg9m1HDOdrwPzlucPBxHcidriMwvxL5O-4', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-30 07:59:53', NULL);
INSERT INTO `login_history` VALUES (89, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwibW9kaWZpZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NjExMjk0LCJleHAiOjE1NTY2OTc2OTR9.2G5l8K-jAdVvzl_vUUfHjjhNMiADgnsSMVZRR7EtFDk', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-30 08:01:34', NULL);
INSERT INTO `login_history` VALUES (90, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MTI2MjIsImV4cCI6MTU1NjY5OTAyMn0.4TJViJKSjUJyjuM2ucGFEh45fK2Nc34tIhq_7VSn8oA', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 08:23:42', NULL);
INSERT INTO `login_history` VALUES (91, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MTI2MzgsImV4cCI6MTU1NjY5OTAzOH0.9eNUebmDm18j30nUyH_U9_l-ESEvEopI-ChZCNx1fmE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 08:23:58', NULL);
INSERT INTO `login_history` VALUES (92, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MTQzMTMsImV4cCI6MTU1NjcwMDcxM30.DtXjK1hP_TRTIgwUwwAjjAfbBj4HFPOgLPQXSVIuU9g', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 08:51:53', NULL);
INSERT INTO `login_history` VALUES (93, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiOSJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwibW9kaWZpZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NjE0MzU4LCJleHAiOjE1NTY3MDA3NTh9.N-V9XKTz17vkXPbAeNpCONwdM65jXmUUdN68S-PxAeE', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-30 08:52:38', NULL);
INSERT INTO `login_history` VALUES (94, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MjEzODksImV4cCI6MTU1NjcwNzc4OX0.F57ednOmaWHu6Vc7Za4TchGzK57rfEUfUW2qkyj3dWo', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 10:49:49', NULL);
INSERT INTO `login_history` VALUES (95, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjYyNTc3NywiZXhwIjoxNTU2NzEyMTc3fQ.P6Po3iV5RTbhmYiF6BHS7CTOluSZ0SOQh20t0KJHn-k', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-04-30 12:02:59', NULL);
INSERT INTO `login_history` VALUES (96, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MjU4NDUsImV4cCI6MTU1NjcxMjI0NX0.IgDkXNJ8jeB7N658d4vEZD9wVr4Zcr-Nqxn4coDIcKI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 12:04:05', NULL);
INSERT INTO `login_history` VALUES (97, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MjYzNDgsImV4cCI6MTU1NjcxMjc0OH0.0ohvpI9PSf3SckSa3LPhBh2jDN3go-n3n21PjFv7eFs', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-04-30 12:12:28', NULL);
INSERT INTO `login_history` VALUES (98, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjYyNjM1MywiZXhwIjoxNTU2NzEyNzUzfQ.KG96SpbXt56PAiOCPVVmkaPaaOHNurM9sMQ7E9--hOU', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-04-30 12:12:35', NULL);
INSERT INTO `login_history` VALUES (99, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MjcwMjAsImV4cCI6MTU1NjcxMzQyMH0.9Bb7uUz709i3NYfmeUVqsIWP2mNk0qjFf31GnYRlcNY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 12:23:40', NULL);
INSERT INTO `login_history` VALUES (100, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2MzAxODgsImV4cCI6MTU1NjcxNjU4OH0.hJKHgCXrkEhXJSCoqPiwBvDaZR90bOkni1E_21dSAPM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-04-30 13:16:28', NULL);
INSERT INTO `login_history` VALUES (101, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY2ODYyNjksImV4cCI6MTU1Njc3MjY2OX0.RAgNa6xfg8A3LtpYN-1ABwx_fsO55Rso5Nd_Bluka4Y', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-01 04:51:09', NULL);
INSERT INTO `login_history` VALUES (102, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMiJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwibW9kaWZpZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2Njg2NDM1LCJleHAiOjE1NTY3NzI4MzV9.buo7O95I-IIcXYh25Gj9z4XMSSJjRUDG53MXaLAk16Q', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-01 04:53:55', NULL);
INSERT INTO `login_history` VALUES (103, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjcwNzE3MiwiZXhwIjoxNTU2NzkzNTcyfQ.wZ2PE_4IOj-RorbnUtGo2StpmvNJlbWArm7qqExvPws', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-01 10:39:34', NULL);
INSERT INTO `login_history` VALUES (104, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3MTAyNjMsImV4cCI6MTU1Njc5NjY2M30.v_EPwdTkQLkC_RZGRpk2I5_jNEvcbzaqkrLklphBEWg', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-01 11:31:03', NULL);
INSERT INTO `login_history` VALUES (105, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjcxNDM5MiwiZXhwIjoxNTU2ODAwNzkyfQ.6LgjHomCl98rdwQ60BXueRZPDqAQcJ7C-Sq3NiZ-Yvo', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-05-01 12:39:55', NULL);
INSERT INTO `login_history` VALUES (106, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1NjcxNDQ2OSwiZXhwIjoxNTU2ODAwODY5fQ.rjz2D-vX9mO_RfckaWgFct4GbKOn6yZvvqETsG7JW_c', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-01 12:41:12', NULL);
INSERT INTO `login_history` VALUES (107, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3Nzk2OTgsImV4cCI6MTU1Njg2NjA5OH0.-HLPXtEJbbjeuDS3Qk53bKtC76ksxj-7jgTAPOsCwZw', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-02 06:48:18', NULL);
INSERT INTO `login_history` VALUES (108, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1Njc4MDAzOCwiZXhwIjoxNTU2ODY2NDM4fQ.5217w2wHHqX6-JzFOIE2T0GdUwBb-w1JOZRuKi0fPGc', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-02 06:54:01', NULL);
INSERT INTO `login_history` VALUES (109, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3ODA1NDUsImV4cCI6MTU1Njg2Njk0NX0.7wzCUCrbNpATMk58q3mFGR0yJ4RrL55jMPUUm9LSsVY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 07:02:25', NULL);
INSERT INTO `login_history` VALUES (110, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3ODE2NDYsImV4cCI6MTU1Njg2ODA0Nn0.OoE5lPfBxoZU49k2ak-S1glX8GBwOnlDPArJYCaCsLc', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 07:20:46', NULL);
INSERT INTO `login_history` VALUES (111, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3ODE3MjIsImV4cCI6MTU1Njg2ODEyMn0.Eojfsd8uqgaL6LEgA52PWOGQ1k8b73TRbfvCP3kAju4', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-02 07:22:02', NULL);
INSERT INTO `login_history` VALUES (112, NULL, '233', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzMsImRlYWxlcl9pZCI6MjMzLCJlbWFpbCI6ImFkZWVsc3VuenRlY2hAZ21haWwuY29tIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJBZGVlbCBTLWRlYWxlciIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJBZGVlbCBTLWRlYWxlciIsImRlYWxlcl9lbWFpbCI6ImFkZWVsc3VuenRlY2hAZ21haWwuY29tIiwibGlua19jb2RlIjoiNzE4Nzg1IiwiY29ubmVjdGVkX2RlYWxlciI6MjMxLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIwIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoic2RlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA1LTAyIDA3OjAxOjI2IiwibW9kaWZpZWQiOiIyMDE5LTA1LTAyIDA3OjAxOjI2IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2NzgyMTk1LCJleHAiOjE1NTY4Njg1OTV9._ChmdYxddylmGTvb_Ne8cV0sIKRPCQKMDpGUn9z-2pQ', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-05-02 07:29:55', NULL);
INSERT INTO `login_history` VALUES (113, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3ODIyNDksImV4cCI6MTU1Njg2ODY0OX0.eIC_BesW-rIgJPRim1aoPmR4lL-cTRU3AhqZAgOp_Ws', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-02 07:30:49', NULL);
INSERT INTO `login_history` VALUES (114, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY3OTE0NTUsImV4cCI6MTU1Njg3Nzg1NX0.pd53V4uQCG7fCYNqrw81o4ehFS9Tm8gYLxYlSSEa0mQ', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 10:04:15', NULL);
INSERT INTO `login_history` VALUES (115, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMyJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2ODAwMzYzLCJleHAiOjE1NTY4ODY3NjN9.2ocBLgIUtk190nZp5xYDtIn7GZM1NmIo-4-h9LpldfM', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-02 12:32:43', NULL);
INSERT INTO `login_history` VALUES (116, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4MDA3ODIsImV4cCI6MTU1Njg4NzE4Mn0.W6sr5Bt3nkI6SqjAKItxp7VJv236D4fI1APDlNrFqOQ', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 12:39:42', NULL);
INSERT INTO `login_history` VALUES (117, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiNCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2ODAwODE1LCJleHAiOjE1NTY4ODcyMTV9.C7zbngMTxRy8TUQNRohWk6y-fBnyn4wBrdnyYVHLA_M', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-02 12:40:15', NULL);
INSERT INTO `login_history` VALUES (118, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4MDEwMjEsImV4cCI6MTU1Njg4NzQyMX0.4mGu2nK4ZDpFyQDuHBzRcrZ-NmF8P0les5QgnYiOZqk', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 12:43:41', NULL);
INSERT INTO `login_history` VALUES (119, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4MDYyMzQsImV4cCI6MTU1Njg5MjYzNH0.6tw3QUUACmY9d1wTptmt4nNAt0SlO88QXqhOhK0X9o8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 14:10:34', NULL);
INSERT INTO `login_history` VALUES (120, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4MDYzNDMsImV4cCI6MTU1Njg5Mjc0M30.6ti2jmiAW6cLfNR36dEllaQV55vZ9B0B79ozPaZlkj0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-02 14:12:23', NULL);
INSERT INTO `login_history` VALUES (121, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NTg4MjUsImV4cCI6MTU1Njk0NTIyNX0.xemlTFKdA56Mmc-s2xexrh4eUHxEk5cLEnB4qvo63uM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 04:47:05', NULL);
INSERT INTO `login_history` VALUES (122, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NjkyMjcsImV4cCI6MTU1Njk1NTYyN30.S6IfI2YRecnu29YJOmkWVt44HLmysBdqjOF2PqjfEKI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 07:40:27', NULL);
INSERT INTO `login_history` VALUES (123, NULL, '231', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzEsImRlYWxlcl9pZCI6MjMxLCJlbWFpbCI6ImFkZWVsQHN1bnp0ZWNoLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoiQWRlZWwiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoiQWRlZWwiLCJkZWFsZXJfZW1haWwiOiJhZGVlbEBzdW56dGVjaC5jb20iLCJsaW5rX2NvZGUiOiIxNjY3NzgiLCJjb25uZWN0ZWRfZGVhbGVyIjowLCJjb25uZWN0ZWRfZGV2aWNlcyI6W3sidG90YWwiOiIxIn1dLCJhY2NvdW50X3N0YXR1cyI6bnVsbCwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJtb2RpZmllZCI6IjIwMTktMDQtMjkgMDk6NDc6MDgiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NjkyNDksImV4cCI6MTU1Njk1NTY0OX0.jeaexX83dZkIkfx0B4YUp2IuUiSZiDSkEuZkrIuDcAE', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-03 07:40:49', NULL);
INSERT INTO `login_history` VALUES (124, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NzMyMTIsImV4cCI6MTU1Njk1OTYxMn0.gXGhH6ETPxIHI23u-e5jYXlEBqqB5eff3zbTWwWRqgw', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 08:46:52', NULL);
INSERT INTO `login_history` VALUES (125, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NzU1ODMsImV4cCI6MTU1Njk2MTk4M30.MilbBS56F00BkH4_2bErYDzNo34dhJFx4LJYKbi-pRA', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 09:26:23', NULL);
INSERT INTO `login_history` VALUES (126, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4NzU1ODMsImV4cCI6MTU1Njk2MTk4M30.MilbBS56F00BkH4_2bErYDzNo34dhJFx4LJYKbi-pRA', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 09:26:23', NULL);
INSERT INTO `login_history` VALUES (127, NULL, '229', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjksImRlYWxlcl9pZCI6MjI5LCJlbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJ0aXRhbiIsImRlYWxlcl9lbWFpbCI6ImRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGlua19jb2RlIjoiNjkwOTU3IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiNCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwibW9kaWZpZWQiOiIyMDE5LTA0LTI3IDIzOjEwOjA4IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU2ODgzOTUyLCJleHAiOjE1NTY5NzAzNTJ9.cu3IPvWZ2F_9lG9Cv0wl4IAGQM7eExmiGyx-1PIqDMI', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-03 11:45:52', NULL);
INSERT INTO `login_history` VALUES (128, NULL, '230', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzAsImRlYWxlcl9pZCI6MjMwLCJlbWFpbCI6InN1YmRlYWxlckB0aXRhbnNlY3VyZS5tb2JpIiwibGFzdE5hbWUiOm51bGwsIm5hbWUiOiJ0aXRhbi1zdWJkZWFsZXIiLCJmaXJzdE5hbWUiOm51bGwsImRlYWxlcl9uYW1lIjoidGl0YW4tc3ViZGVhbGVyIiwiZGVhbGVyX2VtYWlsIjoic3ViZGVhbGVyQHRpdGFuc2VjdXJlLm1vYmkiLCJsaW5rX2NvZGUiOiI0MjgxNDYiLCJjb25uZWN0ZWRfZGVhbGVyIjoyMjksImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJzZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJtb2RpZmllZCI6IjIwMTktMDQtMjcgMjM6MTE6MTEiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4ODQzODIsImV4cCI6MTU1Njk3MDc4Mn0.ooAV_8nu9J4fyqI50efnslpxaYH6CSwZVF1fCnlPqMw', '86400s', '::ffff:134.209.124.196', NULL, 'sdealer', 'token', 1, '2019-05-03 11:53:02', NULL);
INSERT INTO `login_history` VALUES (129, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4ODkyMDcsImV4cCI6MTU1Njk3NTYwN30.7DzdR-ZH6X2Wx13N4Uc8UsUQBjLZw3PsOxc8KCLiHzI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 13:13:27', NULL);
INSERT INTO `login_history` VALUES (130, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4OTAwMzYsImV4cCI6MTU1Njk3NjQzNn0.8inNzMC1f3zniECqVlq2voJyJgsk7sGXtvolONx56FU', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 13:27:16', NULL);
INSERT INTO `login_history` VALUES (131, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4OTU0NTIsImV4cCI6MTU1Njk4MTg1Mn0.ncQAz9fCH-KWiCVBtleSon7hvz_9fTZGBaiAlQGMYE0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 14:57:32', NULL);
INSERT INTO `login_history` VALUES (132, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTY4OTU2ODAsImV4cCI6MTU1Njk4MjA4MH0.YjPWkl_sPE9eDJLM0R06zpL2M7oMoXq63ShcREO2Bas', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-03 15:01:20', NULL);
INSERT INTO `login_history` VALUES (133, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcxMjAxMDYsImV4cCI6MTU1NzIwNjUwNn0.cUKbiIDMQ5mFGv1wEoI2xpiS1hfwB87FYNuyEsN5P6k', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-06 05:21:46', NULL);
INSERT INTO `login_history` VALUES (134, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcxNDIzMDcsImV4cCI6MTU1NzIyODcwN30.MYCMxMzsrJAzPg9LMazX3yjnfm_zP1ZFx4b53B7BKLs', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-06 11:31:47', NULL);
INSERT INTO `login_history` VALUES (135, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcxNDgwNjcsImV4cCI6MTU1NzIzNDQ2N30._L99Y4JDDNNq2qzM3C9HGK7q-R7n4Nwl3WJJedSw0RM', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-06 13:07:47', NULL);
INSERT INTO `login_history` VALUES (136, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcyMTU1ODgsImV4cCI6MTU1NzMwMTk4OH0.-ZL96KDHdYXg493Fgk2k9aiOvQOkXi3c_e7Y2GyZnUo', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-07 07:53:08', NULL);
INSERT INTO `login_history` VALUES (137, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcyMTU3OTIsImV4cCI6MTU1NzMwMjE5Mn0.W53af2N8RU3Lkf4l2HzKabvQqq1jCedQal5Kht__5l4', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-07 07:56:32', NULL);
INSERT INTO `login_history` VALUES (138, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcyMjEyNjIsImV4cCI6MTU1NzMwNzY2Mn0.SfDG_iZ65c9-cz2_-yRKVKC88MlZDiyC521xJRDtxdY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-07 09:27:42', NULL);
INSERT INTO `login_history` VALUES (139, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcyMzAyMjksImV4cCI6MTU1NzMxNjYyOX0.WLB2gwBlgtVINM2xaKvKBecbCXRZBTcb291ZSi9JwiE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-07 11:57:09', NULL);
INSERT INTO `login_history` VALUES (140, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTcyNTk5MzMsImV4cCI6MTU1NzM0NjMzM30.j4TLCNsOKSx3JWvwG7AoZ6VMI97xlTVuWcm93XAya-s', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-07 20:12:13', NULL);
INSERT INTO `login_history` VALUES (141, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTczMDgyNTcsImV4cCI6MTU1NzM5NDY1N30.On1lCkW3lZuytoZIPdqfvthz6eQxOO-zRWF37Ew3pic', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-08 09:37:37', NULL);
INSERT INTO `login_history` VALUES (142, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTczMDg3NDYsImV4cCI6MTU1NzM5NTE0Nn0.6NRrV7ZCAnNaFQkIzkbtbPZY271ZLj-gzXjuBW7kTkY', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-08 09:45:46', NULL);
INSERT INTO `login_history` VALUES (143, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTczODQzNzAsImV4cCI6MTU1NzQ3MDc3MH0.duRFZq7GIYITHRwyKKEc_3Y-48jvJKDwP5p-IkPt5S0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-09 06:46:10', NULL);
INSERT INTO `login_history` VALUES (144, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTczODc3NjYsImV4cCI6MTU1NzQ3NDE2Nn0.KHlVJPiQaBBtLQmOn-yAevA3FYvo-ueVooKkTo3fci0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-09 07:42:46', NULL);
INSERT INTO `login_history` VALUES (145, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTczODkzNDksImV4cCI6MTU1NzQ3NTc0OX0.QAoYVon5G5Ki8otVdKV29pn67ALqzM1etvttGHoOsnI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-09 08:09:09', NULL);
INSERT INTO `login_history` VALUES (146, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc0MDEwODAsImV4cCI6MTU1NzQ4NzQ4MH0.LPbQUWGVM982kGmD1NvxmacUBSBiAbYWVOSwpTcud9Y', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-09 11:24:40', NULL);
INSERT INTO `login_history` VALUES (147, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc0ODE3ODYsImV4cCI6MTU1NzU2ODE4Nn0.YB6zgS7Q9C_zAIwrnjOKP5uOkaTc-0zM3eLsn80P750', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-10 09:49:46', NULL);
INSERT INTO `login_history` VALUES (148, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc0ODUyODUsImV4cCI6MTU1NzU3MTY4NX0.OPTjU0_CsBlueP8gVaK-QAwjc0-PzorjKmwglvbeoT4', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-10 10:48:05', NULL);
INSERT INTO `login_history` VALUES (149, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwibW9kaWZpZWQiOiIyMDE5LTA0LTMwIDA3OjU5OjE1IiwiaXBfYWRkcmVzcyI6Ijo6ZmZmZjoxMzQuMjA5LjEyNC4xOTYifSwiaWF0IjoxNTU3NTUwMDE4LCJleHAiOjE1NTc2MzY0MTh9.3A1cMnR9IxyCA4G-fxrs7JRJnez_SBG2SVvsdR34yiM', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 04:46:58', NULL);
INSERT INTO `login_history` VALUES (150, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NTAyMTQsImV4cCI6MTU1NzYzNjYxNH0.Zq1j8nhTzKPdYA3pnWa7uwshLKwUaLSj4Ix13IDUek8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 04:50:14', NULL);
INSERT INTO `login_history` VALUES (151, NULL, '232', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMzIsImRlYWxlcl9pZCI6MjMyLCJlbWFpbCI6ImltdWhhbW1hZG1laHJhbkBnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6Ik11aGFtbWFkIG1laHJhbiIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJNdWhhbW1hZCBtZWhyYW4iLCJkZWFsZXJfZW1haWwiOiJpbXVoYW1tYWRtZWhyYW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiNjc0Nzk0IiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMTAifV0sImFjY291bnRfc3RhdHVzIjpudWxsLCJ1c2VyX3R5cGUiOiJkZWFsZXIiLCJjcmVhdGVkIjoiMjAxOS0wNC0zMCAwNzo1OToxNSIsIm1vZGlmaWVkIjoiMjAxOS0wNC0zMCAwNzo1OToxNSIsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzU1NDM0MCwiZXhwIjoxNTU3NjQwNzQwfQ.xWEXHpm1qsP3GNy2aKmEETCfRwr6NM4ntEH0fiUzi68', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 05:59:00', NULL);
INSERT INTO `login_history` VALUES (152, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NTQ1MjYsImV4cCI6MTU1NzY0MDkyNn0.lWcdvyM978zWrX2PIV_PwUTDdvV85BonYWQZQLhiovQ', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 06:02:06', NULL);
INSERT INTO `login_history` VALUES (153, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NTQ1NzUsImV4cCI6MTU1NzY0MDk3NX0.m6C326EHwXHMp-Sc9GyAIa9PFD-JrR_J6vwXH1PUKKE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 06:02:55', NULL);
INSERT INTO `login_history` VALUES (154, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NTU5MTksImV4cCI6MTU1NzY0MjMxOX0.ZRbESvBfO2AMyhUrhH-RizjwN-7UbLr8hVY1tM1uPCc', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 06:25:19', NULL);
INSERT INTO `login_history` VALUES (155, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzU2OTg0MiwiZXhwIjoxNTU3NjU2MjQyfQ.zT31jZacUL6rq-0lbQ02TB7O3_yBgxNIuBS_SAPWmu0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 10:17:22', NULL);
INSERT INTO `login_history` VALUES (156, NULL, '225', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjUsImRlYWxlcl9pZCI6MjI1LCJlbWFpbCI6ImhhbXphLmRhd29vZDAwN0BnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6IkhhbXphIERhd29vZCIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJIYW16YSBEYXdvb2QiLCJkZWFsZXJfZW1haWwiOiJoYW16YS5kYXdvb2QwMDdAZ21haWwuY29tIiwibGlua19jb2RlIjoiNTQxNzYzIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwibW9kaWZpZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwidHdvX2ZhY3Rvcl9hdXRoIjowLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NzEzMDcsImV4cCI6MTU1NzY1NzcwN30.ug7rk_D-C38omKq6P1RgbZO-6kpQn7xylHLxGBBgCmQ', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 10:41:47', NULL);
INSERT INTO `login_history` VALUES (157, NULL, '225', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjUsImRlYWxlcl9pZCI6MjI1LCJlbWFpbCI6ImhhbXphLmRhd29vZDAwN0BnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6IkhhbXphIERhd29vZCIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJIYW16YSBEYXdvb2QiLCJkZWFsZXJfZW1haWwiOiJoYW16YS5kYXdvb2QwMDdAZ21haWwuY29tIiwibGlua19jb2RlIjoiNTQxNzYzIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwibW9kaWZpZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwidHdvX2ZhY3Rvcl9hdXRoIjoxLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NzEzNDAsImV4cCI6MTU1NzY1Nzc0MH0.Z8K6UJaW6O6K5d_-CGWZVk-Qh7DWTFYmAI3pLz9BSIc', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 10:42:20', NULL);
INSERT INTO `login_history` VALUES (158, NULL, '225', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjUsImRlYWxlcl9pZCI6MjI1LCJlbWFpbCI6ImhhbXphLmRhd29vZDAwN0BnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6IkhhbXphIERhd29vZCIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJIYW16YSBEYXdvb2QiLCJkZWFsZXJfZW1haWwiOiJoYW16YS5kYXdvb2QwMDdAZ21haWwuY29tIiwibGlua19jb2RlIjoiNTQxNzYzIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwibW9kaWZpZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwidHdvX2ZhY3Rvcl9hdXRoIjoxLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NzEzNjgsImV4cCI6MTU1NzY1Nzc2OH0.B7kMZj7sNXlNQCAp6kRgu2BoESdWywjI-VR3cCCRES0', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 10:42:48', NULL);
INSERT INTO `login_history` VALUES (159, NULL, '225', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjUsImRlYWxlcl9pZCI6MjI1LCJlbWFpbCI6ImhhbXphLmRhd29vZDAwN0BnbWFpbC5jb20iLCJsYXN0TmFtZSI6bnVsbCwibmFtZSI6IkhhbXphIERhd29vZCIsImZpcnN0TmFtZSI6bnVsbCwiZGVhbGVyX25hbWUiOiJIYW16YSBEYXdvb2QiLCJkZWFsZXJfZW1haWwiOiJoYW16YS5kYXdvb2QwMDdAZ21haWwuY29tIiwibGlua19jb2RlIjoiNTQxNzYzIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImRlYWxlciIsImNyZWF0ZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwibW9kaWZpZWQiOiIyMDE5LTA0LTExIDEwOjM5OjUwIiwidHdvX2ZhY3Rvcl9hdXRoIjowLCJpcF9hZGRyZXNzIjoiOjpmZmZmOjEzNC4yMDkuMTI0LjE5NiJ9LCJpYXQiOjE1NTc1NzEzODQsImV4cCI6MTU1NzY1Nzc4NH0.wLP1g8D4gS6_CMWPVwVGBa7-gV5wOtrIbSmWXugPfZI', '86400s', '::ffff:134.209.124.196', NULL, 'dealer', 'token', 1, '2019-05-11 10:43:04', NULL);
INSERT INTO `login_history` VALUES (160, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzU3MTM5MSwiZXhwIjoxNTU3NjU3NzkxfQ.RoEENEg2MLZ2OsDT3kclvu7QaOVhl3GAfU6tTs9calU', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 10:43:11', NULL);
INSERT INTO `login_history` VALUES (161, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzU3NDIzMSwiZXhwIjoxNTU3NjYwNjMxfQ.e3vnKbtA7fI1oxNW0wBWSMoSN7Z2nAPZIQ-hOAjl0vA', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-11 11:30:31', NULL);
INSERT INTO `login_history` VALUES (162, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzcyMzczNSwiZXhwIjoxNTU3ODEwMTM1fQ.I77glul_PF3g2iK-B3agwNoCnc13x4cSPAwoLcFNIZE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 05:02:15', NULL);
INSERT INTO `login_history` VALUES (163, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzcyNTc1NCwiZXhwIjoxNTU3ODEyMTU0fQ.xDyNPhSwDuntTqjAWiSKwxzbrPoJa2-rgFzBdat4laI', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 05:35:54', NULL);
INSERT INTO `login_history` VALUES (164, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzcyNjA1NSwiZXhwIjoxNTU3ODEyNDU1fQ.NQf7pFIuZv_XzbXVWyap17WQj0LdK2QABW9YOz-Du2s', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 05:40:55', NULL);
INSERT INTO `login_history` VALUES (165, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzcyNjEzNCwiZXhwIjoxNTU3ODEyNTM0fQ.vHxyEjcd9QGgBUyvZl6Aq0qXTjiHXPOj6ww2Qf1Hpho', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 05:42:14', NULL);
INSERT INTO `login_history` VALUES (166, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzcyNjI0NywiZXhwIjoxNTU3ODEyNjQ3fQ.vSS00_4uFpb4hvoGQ-aHUEFJKaTplwm9y_EnDZT7UtE', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 05:44:07', NULL);
INSERT INTO `login_history` VALUES (167, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1NzczOTg0MCwiZXhwIjoxNTU3ODI2MjQwfQ.OBxvLAOPQMALqHjpb747QgvUBBM9-QHFZRan9Ootkks', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 09:30:40', NULL);
INSERT INTO `login_history` VALUES (168, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1Nzc0MjA5MywiZXhwIjoxNTU3ODI4NDkzfQ.lp044evNhj1o6BXzyTQOme_DNZMpjce456ssXUaa_NA', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 10:08:13', NULL);
INSERT INTO `login_history` VALUES (169, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1Nzc1OTYxOSwiZXhwIjoxNTU3ODQ2MDE5fQ.pPfPIZ30mLALEAU3gaHwaQrjCGRaVqqGvtkCd-M6rd8', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 15:00:19', NULL);
INSERT INTO `login_history` VALUES (170, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OmZmZmY6MTM0LjIwOS4xMjQuMTk2In0sImlhdCI6MTU1Nzc2MDkwNCwiZXhwIjoxNTU3ODQ3MzA0fQ.BGhDm8WzknUxWldILbQBfszk4Q-F14RDGTka9MoRJn0', '86400s', '::ffff:134.209.124.196', NULL, 'admin', 'token', 1, '2019-05-13 15:21:44', NULL);
INSERT INTO `login_history` VALUES (171, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3ODEyMzkxLCJleHAiOjE1NTc4OTg3OTF9.bgCuB2cCSVLnamSx7zT2aWKTr4iqfmP1iRrMsCPh2ls', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-14 10:39:51', NULL);
INSERT INTO `login_history` VALUES (172, NULL, '222', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjIsImRlYWxlcl9pZCI6MjIyLCJlbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoidXNtYW4gaGFmZWV6IiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InVzbWFuIGhhZmVleiIsImRlYWxlcl9lbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxpbmtfY29kZSI6IjQzMzUyMyIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjoiIiwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMDMgMTU6MjM6MjYiLCJtb2RpZmllZCI6IjIwMTktMDQtMDMgMTU6MjM6MjYiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3ODM0ODkwLCJleHAiOjE1NTc5MjEyOTB9.3DAkT871diR7eXD4v_CTROElPPTE5dubU5K9e9NTlUQ', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-05-14 16:54:50', NULL);
INSERT INTO `login_history` VALUES (173, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3OTAyOTc4LCJleHAiOjE1NTc5ODkzNzh9.0N-hAys4OFbvLMF37Qyf6G6wDPlS1N1fNz_N-CKmP_Q', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-15 11:49:38', NULL);
INSERT INTO `login_history` VALUES (174, NULL, '222', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoyMjIsImRlYWxlcl9pZCI6MjIyLCJlbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxhc3ROYW1lIjpudWxsLCJuYW1lIjoidXNtYW4gaGFmZWV6IiwiZmlyc3ROYW1lIjpudWxsLCJkZWFsZXJfbmFtZSI6InVzbWFuIGhhZmVleiIsImRlYWxlcl9lbWFpbCI6InVzbWFuaGFmZWV6MTQ3QGdtYWlsLmNvbSIsImxpbmtfY29kZSI6IjQzMzUyMyIsImNvbm5lY3RlZF9kZWFsZXIiOjAsImNvbm5lY3RlZF9kZXZpY2VzIjpbeyJ0b3RhbCI6IjAifV0sImFjY291bnRfc3RhdHVzIjoiIiwidXNlcl90eXBlIjoiZGVhbGVyIiwiY3JlYXRlZCI6IjIwMTktMDQtMDMgMTU6MjM6MjYiLCJtb2RpZmllZCI6IjIwMTktMDQtMDMgMTU6MjM6MjYiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3OTA0NjM1LCJleHAiOjE1NTc5OTEwMzV9.vIw1TltNb3G6N1apt2ORJoG765lWQEUTYKDaxZasIyU', '86400s', '::1', NULL, 'dealer', 'token', 1, '2019-05-15 12:17:15', NULL);
INSERT INTO `login_history` VALUES (175, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3OTA0Njc1LCJleHAiOjE1NTc5OTEwNzV9.M6vtkZ1q6V0Xh4INimur2HkQ010ym0OWukoPltKUbYY', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-15 12:17:55', NULL);
INSERT INTO `login_history` VALUES (176, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJ0d29fZmFjdG9yX2F1dGgiOjAsImlwX2FkZHJlc3MiOiI6OjEifSwiaWF0IjoxNTU3OTE1OTk5LCJleHAiOjE1NTgwMDIzOTl9.aWUH3iTkgK4Psidoq9kOa0rcn-YjWlLIecQbQXDRwe0', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-15 15:26:39', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 194 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (125, NULL, '358GTR@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-08 12:11:56');
INSERT INTO `pgp_emails` VALUES (126, NULL, '599NGT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-10 09:47:46');
INSERT INTO `pgp_emails` VALUES (127, NULL, '349VFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-18 06:33:05');
INSERT INTO `pgp_emails` VALUES (128, NULL, '791BFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-22 11:56:31');
INSERT INTO `pgp_emails` VALUES (129, NULL, '1619DKV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:16');
INSERT INTO `pgp_emails` VALUES (130, NULL, '5438DNE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:17');
INSERT INTO `pgp_emails` VALUES (131, NULL, '2675DKN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-19 05:37:55');
INSERT INTO `pgp_emails` VALUES (132, NULL, '3754ZUB@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:17');
INSERT INTO `pgp_emails` VALUES (133, NULL, '4338GQG@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:18');
INSERT INTO `pgp_emails` VALUES (134, NULL, '3669NBQ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:18');
INSERT INTO `pgp_emails` VALUES (135, NULL, '5147DXT@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:52:12');
INSERT INTO `pgp_emails` VALUES (136, NULL, '8244SRE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:52:12');
INSERT INTO `pgp_emails` VALUES (137, NULL, '5412JJN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-24 17:31:20');
INSERT INTO `pgp_emails` VALUES (138, NULL, '4134PTE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 02:51:07');
INSERT INTO `pgp_emails` VALUES (139, NULL, '2954PAJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:11');
INSERT INTO `pgp_emails` VALUES (140, NULL, '6845YAY@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:11');
INSERT INTO `pgp_emails` VALUES (141, NULL, '7992PFY@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-25 02:26:15');
INSERT INTO `pgp_emails` VALUES (142, NULL, '4967GCM@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:12');
INSERT INTO `pgp_emails` VALUES (143, NULL, '5373SAJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-22 12:36:40');
INSERT INTO `pgp_emails` VALUES (144, NULL, '1233NPX@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:12');
INSERT INTO `pgp_emails` VALUES (145, NULL, '7921MKT@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (146, NULL, '2188PBW@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (147, NULL, '2535MPM@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (148, NULL, '4254PMS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (149, NULL, '4511AXM@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (150, NULL, '4437CZC@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (151, NULL, '8729YAM@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (152, NULL, '7497CXZ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (153, NULL, '5464NJF@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (154, NULL, '6362MBN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 08:03:30');
INSERT INTO `pgp_emails` VALUES (155, NULL, '5752CXB@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (156, NULL, '9498NBS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-10 23:35:14');
INSERT INTO `pgp_emails` VALUES (157, NULL, '3789NZU@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (158, NULL, '9643NZE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (159, NULL, '9347SKJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (160, NULL, '8837ZRE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (161, NULL, '7245BCB@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (162, NULL, '9279GBS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (163, NULL, '1747BBV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (164, NULL, '4288DXZ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (165, NULL, '2474VJS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (166, NULL, '1976JSN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (167, NULL, '1879TWV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (168, NULL, '2458VZC@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (169, NULL, '1842WKX@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (170, NULL, '5225CHG@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (171, NULL, '4337VZF@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (172, NULL, '5734TXZ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (173, NULL, '4763XEK@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (174, NULL, '2196GNW@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (175, NULL, '8931APD@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (176, NULL, '8478YXA@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (177, NULL, '9437TPJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (178, NULL, '4347HVE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (179, NULL, '5945VEC@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (180, 86, '2583AUF@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (181, NULL, '7574XDR@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (182, NULL, '8497KRA@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (183, NULL, '6497NVE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-10 21:12:15');
INSERT INTO `pgp_emails` VALUES (184, NULL, '3371GCF@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-11 04:47:24');
INSERT INTO `pgp_emails` VALUES (185, NULL, 'test3@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-05-02 12:35:34');
INSERT INTO `pgp_emails` VALUES (186, NULL, 'test6@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-29 16:12:20');
INSERT INTO `pgp_emails` VALUES (187, NULL, 'test5@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-28 01:11:33');
INSERT INTO `pgp_emails` VALUES (188, NULL, 'test9@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-29 16:35:26');
INSERT INTO `pgp_emails` VALUES (189, NULL, 'test7@titansecure.biz', 0, '2019-04-27 23:19:20', NULL);
INSERT INTO `pgp_emails` VALUES (190, NULL, 'test8@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-05-11 10:19:55');
INSERT INTO `pgp_emails` VALUES (191, NULL, 'test4@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-05-03 11:49:49');
INSERT INTO `pgp_emails` VALUES (192, NULL, 'test1@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-05-11 11:19:08');
INSERT INTO `pgp_emails` VALUES (193, 93, 'test2@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-05-15 16:04:32');

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
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of policy
-- ----------------------------
INSERT INTO `policy` VALUES (1, 'test', 'test id', 154, 'admin', '#test', '[]', '[]', '[{\"apk_id\":29,\"apk_name\":\"new file added\",\"logo\":\"logo-1554958561193.jpg\",\"apk\":\"apk-1554200217607.apk\",\"guest\":false,\"encrypted\":false,\"enable\":false,\"apk_status\":\"On\",\"deleteable\":true},{\"apk_id\":30,\"apk_name\":\"usman hafeez\",\"logo\":\"logo-1554898498235.jpg\",\"apk\":\"apk-1554898502524.apk\",\"guest\":true,\"encrypted\":false,\"enable\":false,\"apk_status\":\"On\",\"deleteable\":true,\"isChanged\":true},{\"apk_id\":31,\"apk_name\":\"test ak\",\"logo\":\"logo-1555155160891.jpg\",\"apk\":\"apk-1555155180487.apk\",\"guest\":true,\"encrypted\":false,\"enable\":false,\"apk_status\":\"Off\",\"deleteable\":true,\"isChanged\":true},{\"apk_id\":36,\"apk_name\":\"test\",\"logo\":\"logo-1556020720141.jpg\",\"apk\":\"apk-1556020716752.apk\",\"guest\":false,\"encrypted\":false,\"enable\":false,\"apk_status\":\"Off\",\"deleteable\":true},{\"apk_id\":37,\"apk_name\":\"test\",\"logo\":\"logo-1556020757490.jpg\",\"apk\":\"apk-1556020755385.apk\",\"guest\":false,\"encrypted\":false,\"enable\":false,\"apk_status\":\"Off\",\"deleteable\":true},{\"apk_id\":41,\"apk_name\":\"lockmesh123\",\"logo\":\"logo-1556025836499.jpg\",\"apk\":\"apk-1556025770593.apk\",\"guest\":false,\"encrypted\":false,\"enable\":false,\"apk_status\":\"Off\",\"deleteable\":false}]', '[{\"name\":\"Wifi\",\"value\":false},{\"name\":\"Bluetooth\",\"value\":true},{\"name\":\"Screenshot\",\"value\":true},{\"name\":\"Location\",\"value\":false},{\"name\":\"Hotspot\",\"value\":false}]', NULL, NULL, 0, 1, '2019-05-01 12:55:16', '2019-05-07 09:33:11');
INSERT INTO `policy` VALUES (2, 'my policy', 'policy creation ', 154, 'admin', '#my_policy', '[{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Secure Settings\",\"subExtension\":[{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Battery\",\"icon\":\"icon_Battery.png\",\"id\":4668,\"app_id\":4668,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"wi-fi\",\"icon\":\"icon_wi-fi.png\",\"id\":4669,\"app_id\":4669,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Bluetooth\",\"icon\":\"icon_Bluetooth.png\",\"id\":4670,\"app_id\":4670,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"SIM Cards\",\"icon\":\"icon_SIM Cards.png\",\"id\":4671,\"app_id\":4671,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Data Roaming\",\"icon\":\"icon_Data Roaming.png\",\"id\":4672,\"app_id\":4672,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Mobile Data\",\"icon\":\"icon_Mobile Data.png\",\"id\":4673,\"app_id\":4673,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Hotspot\",\"icon\":\"icon_Hotspot.png\",\"id\":4674,\"app_id\":4674,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Finger Print + Lock\",\"icon\":\"icon_Finger Print + Lock.png\",\"id\":4675,\"app_id\":4675,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Brightness\",\"icon\":\"icon_Brightness.png\",\"id\":4676,\"app_id\":4676,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Sleep\",\"icon\":\"icon_Sleep.png\",\"id\":4677,\"app_id\":4677,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Sound\",\"icon\":\"icon_Sound.png\",\"id\":4678,\"app_id\":4678,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Date & Time\",\"icon\":\"icon_Date & Time.png\",\"id\":4679,\"app_id\":4679,\"default_app\":0,\"guest\":1,\"isChanged\":true,\"encrypted\":1}]},{\"uniqueName\":\"com.secureClear.SecureClearActivitySecure Clear\",\"label\":\"Secure Clear\",\"subExtension\":[]},{\"uniqueName\":\"com.secureMarket.SecureMarketActivitySecure Market\",\"label\":\"Secure Market\",\"subExtension\":[]}]', '[{\"id\":4649,\"unique_name\":\"com.android.musicMusic\",\"label\":\"Music\",\"package_name\":\"com.android.music\",\"icon\":\"icon_Music.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4650,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Secure Settings\",\"package_name\":\"com.secureSetting.SecureSettingsMain\",\"icon\":\"icon_Secure Settings.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4651,\"unique_name\":\"com.android.browserBrowser\",\"label\":\"Browser\",\"package_name\":\"com.android.browser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4652,\"unique_name\":\"com.android.calendarCalendar\",\"label\":\"Calendar\",\"package_name\":\"com.android.calendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4653,\"unique_name\":\"com.android.contactsContacts\",\"label\":\"Contacts\",\"package_name\":\"com.android.contacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4654,\"unique_name\":\"com.android.deskclockClock\",\"label\":\"Clock\",\"package_name\":\"com.android.deskclock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4655,\"unique_name\":\"com.android.dialerPhone\",\"label\":\"Phone\",\"package_name\":\"com.android.dialer\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4656,\"unique_name\":\"com.android.emailEmail\",\"label\":\"Email\",\"package_name\":\"com.android.email\",\"icon\":\"icon_Email.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4657,\"unique_name\":\"com.android.gallery3dGallery\",\"label\":\"Gallery\",\"package_name\":\"com.android.gallery3d\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4658,\"unique_name\":\"com.android.mmsMessaging\",\"label\":\"Messaging\",\"package_name\":\"com.android.mms\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4659,\"unique_name\":\"com.android.settingsSettings\",\"label\":\"Settings\",\"package_name\":\"com.android.settings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"visible\":0,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4660,\"unique_name\":\"com.android.soundrecorderSound Recorder\",\"label\":\"Sound Recorder\",\"package_name\":\"com.android.soundrecorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4661,\"unique_name\":\"com.mediatek.cameraCamera\",\"label\":\"Camera\",\"package_name\":\"com.mediatek.camera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4662,\"unique_name\":\"com.android.calculator2Calculator\",\"label\":\"Calculator\",\"package_name\":\"com.android.calculator2\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4663,\"unique_name\":\"com.android.quicksearchboxSearch\",\"label\":\"Search\",\"package_name\":\"com.android.quicksearchbox\",\"icon\":\"icon_Search.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4664,\"unique_name\":\"com.android.stkSIM Toolkit\",\"label\":\"SIM Toolkit\",\"package_name\":\"com.android.stk\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4665,\"unique_name\":\"com.mediatek.systemupdateSystem software updates\",\"label\":\"System software updates\",\"package_name\":\"com.mediatek.systemupdate\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null},{\"id\":4666,\"unique_name\":\"com.rim.mobilefusion.clientUEM Client\",\"label\":\"UEM Client\",\"package_name\":\"com.rim.mobilefusion.client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"enable\":true},{\"id\":4667,\"unique_name\":\"com.titanlocker.secureTitan Locker\",\"label\":\"Titan Locker\",\"package_name\":\"com.titanlocker.secure\",\"icon\":\"icon_Titan Locker.png\",\"extension\":0,\"visible\":1,\"default_app\":1,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"encrypted\":false},{\"id\":4668,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBattery\",\"label\":\"Battery\",\"package_name\":null,\"icon\":\"icon_Battery.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4669,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure Settingswi-fi\",\"label\":\"wi-fi\",\"package_name\":null,\"icon\":\"icon_wi-fi.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4670,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBluetooth\",\"label\":\"Bluetooth\",\"package_name\":null,\"icon\":\"icon_Bluetooth.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4671,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards\",\"label\":\"SIM Cards\",\"package_name\":null,\"icon\":\"icon_SIM Cards.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4672,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsData Roaming\",\"label\":\"Data Roaming\",\"package_name\":null,\"icon\":\"icon_Data Roaming.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4673,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsMobile Data\",\"label\":\"Mobile Data\",\"package_name\":null,\"icon\":\"icon_Mobile Data.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4674,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsHotspot\",\"label\":\"Hotspot\",\"package_name\":null,\"icon\":\"icon_Hotspot.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4675,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock\",\"label\":\"Finger Print + Lock\",\"package_name\":null,\"icon\":\"icon_Finger Print + Lock.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4676,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBrightness\",\"label\":\"Brightness\",\"package_name\":null,\"icon\":\"icon_Brightness.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4677,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSleep\",\"label\":\"Sleep\",\"package_name\":null,\"icon\":\"icon_Sleep.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4678,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSound\",\"label\":\"Sound\",\"package_name\":null,\"icon\":\"icon_Sound.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":4679,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsDate & Time\",\"label\":\"Date & Time\",\"package_name\":null,\"icon\":\"icon_Date & Time.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null},{\"id\":9684,\"unique_name\":\"com.secure.vpnSecure VPN\",\"label\":\"Secure VPN\",\"package_name\":\"com.secure.vpn\",\"icon\":\"icon_Secure VPN.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-26 02:51:19\",\"updated_at\":null},{\"id\":9686,\"unique_name\":\"com.vortexlocker.appScreen Locker\",\"label\":\"Screen Locker\",\"package_name\":\"com.vortexlocker.app\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-26 02:51:19\",\"updated_at\":\"2019-05-07 12:45:56\"},{\"id\":10116,\"unique_name\":\"ca.unlimitedwireless.mailpgpMail\",\"label\":\"Mail\",\"package_name\":\"ca.unlimitedwireless.mailpgp\",\"icon\":\"icon_Mail.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null},{\"id\":10118,\"unique_name\":\"com.srz.unlimited.wiperEmergency Wipe\",\"label\":\"Emergency Wipe\",\"package_name\":\"com.srz.unlimited.wiper\",\"icon\":\"icon_Emergency Wipe.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null},{\"id\":10121,\"unique_name\":\"ca.unlimitedwireless.encryptednotesEncrypted Notes\",\"label\":\"Encrypted Notes\",\"package_name\":\"ca.unlimitedwireless.encryptednotes\",\"icon\":\"icon_Encrypted Notes.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null},{\"id\":10123,\"unique_name\":\"com.titansecure.titan1Titan Secure\",\"label\":\"Titan Secure\",\"package_name\":\"com.titansecure.titan1\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null},{\"id\":12544,\"unique_name\":\"com.sec.android.app.clockpackageClock\",\"label\":\"Clock\",\"package_name\":\"com.sec.android.app.clockpackage\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12545,\"unique_name\":\"com.sec.android.gallery3dGallery\",\"label\":\"Gallery\",\"package_name\":\"com.sec.android.gallery3d\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12547,\"unique_name\":\"com.samsung.android.contactsContacts\",\"label\":\"Contacts\",\"package_name\":\"com.samsung.android.contacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12548,\"unique_name\":\"com.samsung.android.contactsPhone\",\"label\":\"Phone\",\"package_name\":\"com.samsung.android.contacts\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12549,\"unique_name\":\"com.samsung.android.messagingMessages\",\"label\":\"Messages\",\"package_name\":\"com.samsung.android.messaging\",\"icon\":\"icon_Messages.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12550,\"unique_name\":\"com.sec.android.app.cameraCamera\",\"label\":\"Camera\",\"package_name\":\"com.sec.android.app.camera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12551,\"unique_name\":\"com.google.android.googlequicksearchboxVoice Search\",\"label\":\"Voice Search\",\"package_name\":\"com.google.android.googlequicksearchbox\",\"icon\":\"icon_Voice Search.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12552,\"unique_name\":\"com.google.android.googlequicksearchboxGoogle\",\"label\":\"Google\",\"package_name\":\"com.google.android.googlequicksearchbox\",\"icon\":\"icon_Google.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12553,\"unique_name\":\"com.samsung.attvvmVisual Voicemail\",\"label\":\"Visual Voicemail\",\"package_name\":\"com.samsung.attvvm\",\"icon\":\"icon_Visual Voicemail.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12554,\"unique_name\":\"com.sec.android.app.myfilesMy Files\",\"label\":\"My Files\",\"package_name\":\"com.sec.android.app.myfiles\",\"icon\":\"icon_My Files.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12555,\"unique_name\":\"com.synchronoss.dcs.att.r2gSetup & Transfer\",\"label\":\"Setup & Transfer\",\"package_name\":\"com.synchronoss.dcs.att.r2g\",\"icon\":\"icon_Setup & Transfer.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12558,\"unique_name\":\"com.codeproof.device.securityCodeproof® MDM\",\"label\":\"Codeproof® MDM\",\"package_name\":\"com.codeproof.device.security\",\"icon\":\"icon_Codeproof® MDM.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12562,\"unique_name\":\"com.titansecure.bizTitan Secure\",\"label\":\"Titan Secure\",\"package_name\":\"com.titansecure.biz\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null},{\"id\":12692,\"unique_name\":\"org.thoughtcrime.securesmsSignal\",\"label\":\"Signal\",\"package_name\":\"org.thoughtcrime.securesms\",\"icon\":\"icon_Signal.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 20:35:59\",\"updated_at\":null},{\"id\":12852,\"unique_name\":\"com.whatsappWhatsApp\",\"label\":\"WhatsApp\",\"package_name\":\"com.whatsapp\",\"icon\":\"icon_WhatsApp.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 20:56:49\",\"updated_at\":null},{\"id\":13122,\"unique_name\":\"com.zonarmr.mtkengineermodeMTK Engineer Mode\",\"label\":\"MTK Engineer Mode\",\"package_name\":\"com.zonarmr.mtkengineermode\",\"icon\":\"icon_MTK Engineer Mode.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-30 08:56:25\",\"updated_at\":null},{\"id\":15606,\"unique_name\":\"com.android.browserNavigateur\",\"label\":\"Navigateur\",\"package_name\":\"com.android.browser\",\"icon\":\"icon_Navigateur.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15607,\"unique_name\":\"com.android.calendarAgenda\",\"label\":\"Agenda\",\"package_name\":\"com.android.calendar\",\"icon\":\"icon_Agenda.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15608,\"unique_name\":\"com.android.deskclockHorloge\",\"label\":\"Horloge\",\"package_name\":\"com.android.deskclock\",\"icon\":\"icon_Horloge.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15609,\"unique_name\":\"com.android.dialerTéléphone\",\"label\":\"Téléphone\",\"package_name\":\"com.android.dialer\",\"icon\":\"icon_Téléphone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15610,\"unique_name\":\"com.android.emailE-mail\",\"label\":\"E-mail\",\"package_name\":\"com.android.email\",\"icon\":\"icon_E-mail.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15611,\"unique_name\":\"com.android.gallery3dGalerie\",\"label\":\"Galerie\",\"package_name\":\"com.android.gallery3d\",\"icon\":\"icon_Galerie.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15612,\"unique_name\":\"com.android.mmsSMS/MMS\",\"label\":\"SMS/MMS\",\"package_name\":\"com.android.mms\",\"icon\":\"icon_SMS/MMS.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15613,\"unique_name\":\"com.android.musicMusique\",\"label\":\"Musique\",\"package_name\":\"com.android.music\",\"icon\":\"icon_Musique.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15614,\"unique_name\":\"com.android.settingsParamètres\",\"label\":\"Paramètres\",\"package_name\":\"com.android.settings\",\"icon\":\"icon_Paramètres.png\",\"extension\":0,\"visible\":0,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15615,\"unique_name\":\"com.android.soundrecorderMagnétophone\",\"label\":\"Magnétophone\",\"package_name\":\"com.android.soundrecorder\",\"icon\":\"icon_Magnétophone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15616,\"unique_name\":\"com.mediatek.cameraAppareil photo\",\"label\":\"Appareil photo\",\"package_name\":\"com.mediatek.camera\",\"icon\":\"icon_Appareil photo.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15617,\"unique_name\":\"com.android.calculator2Calculatrice\",\"label\":\"Calculatrice\",\"package_name\":\"com.android.calculator2\",\"icon\":\"icon_Calculatrice.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15618,\"unique_name\":\"com.android.stkBoîte à outils SIM\",\"label\":\"Boîte à outils SIM\",\"package_name\":\"com.android.stk\",\"icon\":\"icon_Boîte à outils SIM.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15619,\"unique_name\":\"com.mediatek.systemupdateMises à jour du logiciel système\",\"label\":\"Mises à jour du logiciel système\",\"package_name\":\"com.mediatek.systemupdate\",\"icon\":\"icon_Mises à jour du logiciel système.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15620,\"unique_name\":\"ca.unlimitedwireless.mailpgpCourrier\",\"label\":\"Courrier\",\"package_name\":\"ca.unlimitedwireless.mailpgp\",\"icon\":\"icon_Courrier.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 07:46:18\",\"updated_at\":null},{\"id\":15706,\"unique_name\":\"com.secureClear.SecureClearActivitySecure Clear\",\"label\":\"Secure Clear\",\"package_name\":\"com.secureClear.SecureClearActivity\",\"icon\":\"icon_Secure Clear.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 08:03:46\",\"updated_at\":null},{\"id\":15951,\"unique_name\":\"com.secure.systemcontrolSystem Control\",\"label\":\"System Control\",\"package_name\":\"com.secure.systemcontrol\",\"icon\":\"icon_System Control.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-07 09:53:26\",\"updated_at\":null},{\"id\":15952,\"unique_name\":\"com.vortexlocker.apScreen Locker\",\"label\":\"Screen Locker\",\"package_name\":\"com.vortexlocker.ap\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"visible\":1,\"default_app\":1,\"extension_id\":0,\"created_at\":\"2019-05-07 09:53:26\",\"updated_at\":null,\"isChanged\":true,\"encrypted\":false},{\"id\":15955,\"unique_name\":\"com.secureMarket.SecureMarketActivitySecure Market\",\"label\":\"Secure Market\",\"package_name\":\"com.secureMarket.SecureMarketActivity\",\"icon\":\"icon_Secure Market.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-07 09:53:26\",\"updated_at\":null},{\"id\":20252,\"unique_name\":\"com.estrongs.android.popES File Explorer\",\"label\":\"ES File Explorer\",\"package_name\":\"com.estrongs.android.pop\",\"icon\":\"icon_ES File Explorer.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-07 12:48:40\",\"updated_at\":null},{\"id\":20253,\"unique_name\":\"com.facebook.liteLite\",\"label\":\"Lite\",\"package_name\":\"com.facebook.lite\",\"icon\":\"icon_Lite.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-07 12:48:40\",\"updated_at\":null},{\"id\":20468,\"unique_name\":\"mp3videoconverter.videotomp3converter.audioconverterVideo to MP3 Converter\",\"label\":\"Video to MP3 Converter\",\"package_name\":\"mp3videoconverter.videotomp3converter.audioconverter\",\"icon\":\"icon_Video to MP3 Converter.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-07 14:41:34\",\"updated_at\":null},{\"id\":21001,\"unique_name\":\"facebook liteLite\",\"label\":\"undefined\",\"package_name\":\"com.facebook.lite\",\"icon\":\"icon_undefined.png\",\"extension\":0,\"visible\":0,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-08 10:41:12\",\"updated_at\":null}]', '[]', '{\"wifi_status\":true,\"bluetooth_status\":false,\"screenshot_status\":true,\"location_status\":false,\"hotspot_status\":false}', '[233,232,231,230,229,228,227,226,225,224,222,223]', NULL, 1, 0, '2019-05-08 10:54:08', '2019-05-15 12:19:02');

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
-- Table structure for secure_market_apps
-- ----------------------------
DROP TABLE IF EXISTS `secure_market_apps`;
CREATE TABLE `secure_market_apps`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `apk_id` int(11) NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `dealer_type` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 565 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of secure_market_apps
-- ----------------------------
INSERT INTO `secure_market_apps` VALUES (563, 41, 154, 'admin', '2019-05-11 10:56:19', NULL);
INSERT INTO `secure_market_apps` VALUES (564, 55, 154, 'admin', '2019-05-11 10:56:19', NULL);

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
INSERT INTO `sim_ids` VALUES (1, NULL, '8', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:05');
INSERT INTO `sim_ids` VALUES (2, NULL, '9', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:06');
INSERT INTO `sim_ids` VALUES (3, NULL, '10', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:06');
INSERT INTO `sim_ids` VALUES (4, NULL, '1', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:06');
INSERT INTO `sim_ids` VALUES (5, NULL, '2', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:07');
INSERT INTO `sim_ids` VALUES (6, NULL, '5', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:07');
INSERT INTO `sim_ids` VALUES (7, NULL, '4', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 17:35:08');
INSERT INTO `sim_ids` VALUES (8, NULL, '6', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:16');
INSERT INTO `sim_ids` VALUES (9, NULL, '11', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:17');
INSERT INTO `sim_ids` VALUES (10, NULL, '7', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:17');
INSERT INTO `sim_ids` VALUES (11, NULL, '3', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:18');
INSERT INTO `sim_ids` VALUES (12, NULL, '12', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:18');
INSERT INTO `sim_ids` VALUES (61, NULL, '13', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:28:19', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (63, NULL, '21', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:28:19', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (74, NULL, '5345', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (77, NULL, '1231231', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (78, NULL, '123123', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (79, NULL, '1233332', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-05-11 04:47:24');
INSERT INTO `sim_ids` VALUES (83, 86, '3345', 1, '26-3-2019', '26-4-2019', '2019-05-07 08:47:25', '2019-05-11 04:47:24');

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
  `device_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '0',
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_setting_id`(`device_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 2756 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_app_permissions
-- ----------------------------
INSERT INTO `user_app_permissions` VALUES (2699, 'CABC611976', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":false}', '2019-05-03 13:01:42', NULL);
INSERT INTO `user_app_permissions` VALUES (2403, 'NZNH883530', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-28 02:38:21', NULL);
INSERT INTO `user_app_permissions` VALUES (2434, 'DEQM506647', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-30 07:58:06', NULL);
INSERT INTO `user_app_permissions` VALUES (2755, 'DDAF250244', 'null', '2019-05-15 17:26:46', NULL);
INSERT INTO `user_app_permissions` VALUES (2413, 'FBED031936', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-29 17:04:14', '2019-05-01 05:33:40');
INSERT INTO `user_app_permissions` VALUES (2730, 'AECE977918', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-05-15 11:01:54', NULL);
INSERT INTO `user_app_permissions` VALUES (2717, 'ECCB212734', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-05-11 10:57:47', NULL);
INSERT INTO `user_app_permissions` VALUES (2680, 'YISC356974', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-05-01 04:49:19', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 2642 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `user_apps` VALUES (415, 643, 4666, 0, 1, 1, 0, '2019-04-22 12:49:22', '2019-05-01 04:49:18');
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
INSERT INTO `user_apps` VALUES (428, 652, 4651, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (429, 652, 4655, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (430, 652, 4653, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (431, 652, 4652, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (432, 652, 4654, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (433, 652, 4658, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (434, 652, 4656, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (435, 652, 4657, 1, 0, 0, 0, '2019-04-25 02:33:48', NULL);
INSERT INTO `user_apps` VALUES (436, 652, 4649, 1, 0, 0, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (437, 652, 4669, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (438, 652, 4668, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (439, 652, 4678, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (440, 652, 4674, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (441, 652, 4670, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (442, 652, 4677, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (443, 652, 4672, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (444, 652, 4673, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (445, 652, 4676, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (446, 652, 4671, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (447, 652, 4679, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (448, 652, 4675, 0, 0, 1, 0, '2019-04-25 02:33:49', NULL);
INSERT INTO `user_apps` VALUES (449, 642, 4673, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (450, 642, 4670, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (451, 642, 4671, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (452, 642, 4672, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (453, 642, 4678, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (454, 642, 4679, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (455, 642, 4674, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (456, 642, 4669, 1, 1, 1, 0, '2019-04-26 02:51:18', '2019-04-30 07:58:06');
INSERT INTO `user_apps` VALUES (457, 642, 4676, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (458, 642, 4677, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (459, 642, 4668, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (460, 642, 4675, 0, 0, 1, 0, '2019-04-26 02:51:18', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (461, 642, 4652, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (462, 642, 4655, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (463, 642, 4653, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (464, 642, 4659, 0, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (465, 642, 4654, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (466, 642, 4658, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (467, 642, 4661, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (468, 642, 4662, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (469, 642, 4651, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (470, 642, 4657, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (471, 642, 4656, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (472, 642, 4664, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (473, 642, 4649, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (474, 642, 4660, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (475, 642, 4666, 0, 1, 1, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (476, 642, 9684, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (477, 642, 4663, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (478, 642, 9686, 0, 1, 1, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (479, 642, 4665, 1, 0, 0, 0, '2019-04-26 02:51:19', '2019-04-26 03:02:03');
INSERT INTO `user_apps` VALUES (480, 642, 4650, 1, 1, 1, 0, '2019-04-26 02:51:19', NULL);
INSERT INTO `user_apps` VALUES (481, 659, 4649, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (482, 659, 4652, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (483, 659, 4651, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (484, 659, 4653, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (485, 659, 4654, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (486, 659, 4660, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (487, 659, 4655, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (488, 659, 4656, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (489, 659, 4658, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (490, 659, 4661, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (491, 659, 10116, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (492, 659, 4650, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (493, 659, 4657, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (494, 659, 4666, 0, 1, 1, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (495, 659, 4665, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (496, 659, 4663, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (497, 659, 10123, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (498, 659, 4659, 0, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (499, 659, 4664, 1, 0, 0, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (500, 659, 4667, 0, 1, 1, 0, '2019-04-28 01:12:00', NULL);
INSERT INTO `user_apps` VALUES (501, 659, 9684, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (502, 659, 4662, 1, 0, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (503, 659, 10121, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (504, 659, 10118, 0, 1, 1, 0, '2019-04-28 01:12:00', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (505, 659, 4669, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (506, 659, 4670, 0, 0, 1, 0, '2019-04-28 01:12:03', NULL);
INSERT INTO `user_apps` VALUES (507, 659, 4668, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (508, 659, 4672, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (509, 659, 4675, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (510, 659, 4678, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (511, 659, 4676, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (512, 659, 4671, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (513, 659, 4677, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (514, 659, 4679, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (515, 659, 4673, 0, 1, 1, 0, '2019-04-28 01:12:03', '2019-04-28 01:15:02');
INSERT INTO `user_apps` VALUES (516, 659, 4674, 0, 0, 1, 0, '2019-04-28 01:12:03', NULL);
INSERT INTO `user_apps` VALUES (517, 662, 4676, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (518, 662, 4671, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-01 19:29:50');
INSERT INTO `user_apps` VALUES (519, 662, 4672, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-01 19:29:50');
INSERT INTO `user_apps` VALUES (520, 662, 4670, 0, 0, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (521, 662, 4674, 0, 0, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (522, 662, 4675, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-01 19:29:50');
INSERT INTO `user_apps` VALUES (523, 662, 4679, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (524, 662, 4669, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (525, 662, 4668, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (526, 662, 4673, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-01 19:29:50');
INSERT INTO `user_apps` VALUES (527, 662, 4677, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (528, 662, 4678, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-05-03 12:56:05');
INSERT INTO `user_apps` VALUES (529, 662, 4653, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (530, 662, 4651, 1, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (531, 662, 4656, 1, 0, 0, 0, '2019-04-29 16:19:52', '2019-04-29 20:35:59');
INSERT INTO `user_apps` VALUES (532, 662, 4657, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (533, 662, 4654, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (534, 662, 4655, 1, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (535, 662, 4659, 0, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (536, 662, 4649, 1, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (537, 662, 4652, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (538, 662, 4663, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (539, 662, 4661, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (540, 662, 4658, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (541, 662, 9684, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (542, 662, 4662, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (543, 662, 4664, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (544, 662, 4660, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (545, 662, 10121, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (546, 662, 4665, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (547, 662, 10116, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (548, 662, 4666, 0, 0, 0, 0, '2019-04-29 16:19:52', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (549, 662, 10118, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (550, 662, 4667, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (551, 662, 4650, 1, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:07:07');
INSERT INTO `user_apps` VALUES (552, 662, 10123, 0, 1, 1, 0, '2019-04-29 16:19:52', '2019-05-01 19:18:10');
INSERT INTO `user_apps` VALUES (553, 663, 4674, 0, 0, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (554, 663, 4670, 0, 0, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (555, 663, 4672, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (556, 663, 4669, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (557, 663, 4671, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (558, 663, 4677, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (559, 663, 4678, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (560, 663, 4676, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (561, 663, 4675, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (562, 663, 4679, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (563, 663, 4668, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (564, 663, 4673, 0, 1, 1, 0, '2019-04-29 16:38:42', NULL);
INSERT INTO `user_apps` VALUES (565, 663, 4659, 0, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (566, 663, 12544, 1, 1, 1, 0, '2019-04-29 16:38:43', '2019-04-29 17:04:14');
INSERT INTO `user_apps` VALUES (567, 663, 12549, 1, 0, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (568, 663, 12548, 1, 0, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (569, 663, 12554, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (570, 663, 10121, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (571, 663, 12545, 1, 0, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (572, 663, 12547, 1, 0, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (573, 663, 12551, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (574, 663, 12550, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (575, 663, 12553, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (576, 663, 12555, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (577, 663, 4666, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (578, 663, 12558, 0, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (579, 663, 12562, 0, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (580, 663, 10116, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (581, 663, 10118, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (582, 663, 12552, 1, 0, 0, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (583, 663, 4667, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (584, 663, 9684, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (585, 663, 10123, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (586, 663, 4650, 0, 1, 1, 0, '2019-04-29 16:38:43', NULL);
INSERT INTO `user_apps` VALUES (587, 662, 12692, 0, 1, 1, 0, '2019-04-29 20:35:59', NULL);
INSERT INTO `user_apps` VALUES (588, 662, 12852, 0, 1, 1, 0, '2019-04-29 20:56:49', '2019-05-03 12:55:25');
INSERT INTO `user_apps` VALUES (589, 664, 4653, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (590, 664, 4654, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (591, 664, 4651, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (592, 664, 4649, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (593, 664, 4659, 0, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (594, 664, 4658, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (595, 664, 4656, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (596, 664, 4655, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (597, 664, 4652, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (598, 664, 4661, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (599, 664, 4662, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (600, 664, 4657, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (601, 664, 4663, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (602, 664, 4660, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (603, 664, 4664, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (604, 664, 4650, 1, 1, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (605, 664, 9686, 0, 1, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (606, 664, 4666, 0, 1, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (607, 664, 4665, 1, 0, 0, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (608, 664, 4678, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (609, 664, 4677, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (610, 664, 4672, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (611, 664, 4669, 1, 1, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (612, 664, 4668, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (613, 664, 4675, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (614, 664, 4674, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (615, 664, 4679, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (616, 664, 4671, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (617, 664, 4670, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (618, 664, 4673, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (619, 664, 4676, 0, 0, 1, 0, '2019-04-30 08:04:54', NULL);
INSERT INTO `user_apps` VALUES (620, 662, 13122, 0, 0, 0, 0, '2019-04-30 08:56:25', '2019-04-30 08:57:03');
INSERT INTO `user_apps` VALUES (621, 673, 4652, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (622, 673, 4651, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (623, 673, 4656, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (624, 673, 4654, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (625, 673, 4658, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (626, 673, 4649, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (627, 673, 4659, 0, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (628, 673, 4657, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (629, 673, 4655, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (630, 673, 4653, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (631, 673, 4660, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (632, 673, 4661, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (633, 673, 4662, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (634, 673, 4664, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (635, 673, 4665, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (636, 673, 4666, 0, 1, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (637, 673, 4663, 1, 0, 0, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (638, 673, 9686, 0, 1, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (639, 673, 4650, 1, 1, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (640, 673, 4668, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (641, 673, 4674, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (642, 673, 4671, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (643, 673, 4670, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (644, 673, 4672, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (645, 673, 4669, 1, 1, 1, 0, '2019-04-30 09:28:48', '2019-04-30 09:38:58');
INSERT INTO `user_apps` VALUES (646, 673, 4677, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (647, 673, 4673, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (648, 673, 4675, 1, 1, 1, 0, '2019-04-30 09:28:48', '2019-04-30 09:38:58');
INSERT INTO `user_apps` VALUES (649, 673, 4678, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (650, 673, 4676, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (651, 673, 4679, 0, 0, 1, 0, '2019-04-30 09:28:48', NULL);
INSERT INTO `user_apps` VALUES (652, 671, 4659, 0, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (653, 671, 4651, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (654, 671, 4658, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (655, 671, 4649, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (656, 671, 4652, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (657, 671, 4655, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (658, 671, 4653, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (659, 671, 4654, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (660, 671, 4657, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (661, 671, 4656, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (662, 671, 4661, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (663, 671, 4660, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (664, 671, 4662, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (665, 671, 4663, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (666, 671, 4665, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (667, 671, 9686, 0, 1, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (668, 671, 4650, 1, 1, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (669, 671, 4666, 0, 1, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (670, 671, 4664, 1, 0, 0, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (671, 671, 4669, 1, 1, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (672, 671, 4671, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (673, 671, 4673, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (674, 671, 4668, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (675, 671, 4676, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (676, 671, 4675, 1, 1, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (677, 671, 4670, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (678, 671, 4672, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (679, 671, 4674, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (680, 671, 4677, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (681, 671, 4679, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (682, 671, 4678, 0, 0, 1, 0, '2019-04-30 09:46:36', NULL);
INSERT INTO `user_apps` VALUES (683, 667, 4651, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (684, 667, 4658, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (685, 667, 4652, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (686, 667, 4649, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (687, 667, 4653, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (688, 667, 4656, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (689, 667, 4659, 0, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (690, 667, 4654, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (691, 667, 4662, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (692, 667, 4661, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (693, 667, 4663, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (694, 667, 4655, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (695, 667, 4657, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (696, 667, 4660, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (697, 667, 4664, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (698, 667, 4665, 1, 0, 0, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (699, 667, 4666, 0, 1, 1, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (700, 667, 9686, 0, 1, 1, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (701, 667, 4650, 1, 1, 1, 0, '2019-04-30 10:10:38', NULL);
INSERT INTO `user_apps` VALUES (702, 667, 4669, 1, 1, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (703, 667, 4675, 1, 1, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (704, 667, 4668, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (705, 667, 4671, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (706, 667, 4674, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (707, 667, 4670, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (708, 667, 4676, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (709, 667, 4677, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (710, 667, 4673, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (711, 667, 4679, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (712, 667, 4678, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (713, 667, 4672, 0, 0, 1, 0, '2019-04-30 10:10:40', NULL);
INSERT INTO `user_apps` VALUES (714, 668, 4652, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (715, 668, 4653, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (716, 668, 4660, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (717, 668, 4659, 0, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (718, 668, 4663, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (719, 668, 4655, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (720, 668, 4654, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (721, 668, 4651, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (722, 668, 4664, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (723, 668, 4661, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (724, 668, 4666, 0, 1, 1, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (725, 668, 4649, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (726, 668, 4650, 1, 1, 1, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (727, 668, 4662, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (728, 668, 4657, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (729, 668, 9686, 0, 1, 1, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (730, 668, 4665, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (731, 668, 4658, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (732, 668, 4656, 1, 0, 0, 0, '2019-04-30 10:11:28', NULL);
INSERT INTO `user_apps` VALUES (733, 668, 4672, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (734, 668, 4676, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (735, 668, 4670, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (736, 668, 4677, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (737, 668, 4673, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (738, 668, 4669, 1, 1, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (739, 668, 4671, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (740, 668, 4675, 1, 1, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (741, 668, 4668, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (742, 668, 4678, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (743, 668, 4674, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (744, 668, 4679, 0, 0, 1, 0, '2019-04-30 10:11:31', NULL);
INSERT INTO `user_apps` VALUES (745, 672, 4670, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (746, 672, 4668, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (747, 672, 4674, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (748, 672, 4676, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (749, 672, 4669, 1, 1, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (750, 672, 4677, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (751, 672, 4673, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (752, 672, 4675, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (753, 672, 4671, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (754, 672, 4672, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (755, 672, 4679, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (756, 672, 4678, 0, 0, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (757, 672, 4659, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:59:36');
INSERT INTO `user_apps` VALUES (758, 672, 4651, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (759, 672, 4655, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (760, 672, 4657, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (761, 672, 4652, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (762, 672, 4654, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (763, 672, 4653, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (764, 672, 4660, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (765, 672, 4656, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (766, 672, 4649, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (767, 672, 4658, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (768, 672, 4661, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (769, 672, 4663, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (770, 672, 4664, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (771, 672, 4662, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (772, 672, 4666, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (773, 672, 4665, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (774, 672, 9686, 1, 1, 1, 0, '2019-04-30 12:49:20', '2019-04-30 12:52:33');
INSERT INTO `user_apps` VALUES (775, 672, 4650, 1, 1, 1, 0, '2019-04-30 12:49:20', NULL);
INSERT INTO `user_apps` VALUES (776, 670, 4666, 0, 1, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (777, 670, 4657, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (778, 670, 4659, 0, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (779, 670, 4655, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (780, 670, 4654, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (781, 670, 4653, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (782, 670, 4656, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (783, 670, 4649, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (784, 670, 4652, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (785, 670, 4658, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (786, 670, 4661, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (787, 670, 4664, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (788, 670, 4665, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (789, 670, 4651, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (790, 670, 4662, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (791, 670, 4660, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (792, 670, 4663, 1, 0, 0, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (793, 670, 4650, 1, 1, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (794, 670, 9686, 0, 1, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (795, 670, 4670, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (796, 670, 4668, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (797, 670, 4669, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (798, 670, 4673, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (799, 670, 4674, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (800, 670, 4678, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (801, 670, 4677, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (802, 670, 4671, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (803, 670, 4672, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (804, 670, 4679, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (805, 670, 4676, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (806, 670, 4675, 0, 0, 1, 0, '2019-04-30 13:05:14', NULL);
INSERT INTO `user_apps` VALUES (807, 669, 4655, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (808, 669, 4651, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (809, 669, 4653, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (810, 669, 4658, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (811, 669, 4656, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (812, 669, 4649, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (813, 669, 4660, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (814, 669, 4657, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (815, 669, 4661, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (816, 669, 4663, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (817, 669, 4662, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (818, 669, 4664, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (819, 669, 4659, 0, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (820, 669, 4666, 0, 1, 1, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (821, 669, 9686, 0, 1, 1, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (822, 669, 4652, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (823, 669, 4654, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (824, 669, 4665, 1, 0, 0, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (825, 669, 4650, 1, 1, 1, 0, '2019-04-30 13:24:49', NULL);
INSERT INTO `user_apps` VALUES (826, 669, 4677, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (827, 669, 4672, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (828, 669, 4671, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (829, 669, 4669, 1, 1, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (830, 669, 4676, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (831, 669, 4674, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (832, 669, 4673, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (833, 669, 4668, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (834, 669, 4675, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (835, 669, 4678, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (836, 669, 4670, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (837, 669, 4679, 0, 0, 1, 0, '2019-04-30 13:27:05', NULL);
INSERT INTO `user_apps` VALUES (838, 665, 4659, 0, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (839, 665, 4654, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (840, 665, 4653, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (841, 665, 4656, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (842, 665, 4655, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (843, 665, 4661, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (844, 665, 4649, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (845, 665, 4657, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (846, 665, 4651, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (847, 665, 4663, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (848, 665, 4662, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (849, 665, 4666, 0, 1, 1, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (850, 665, 9686, 0, 1, 1, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (851, 665, 4652, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (852, 665, 4665, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (853, 665, 4664, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (854, 665, 4658, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (855, 665, 4660, 1, 0, 0, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (856, 665, 4650, 1, 1, 1, 0, '2019-04-30 13:29:44', NULL);
INSERT INTO `user_apps` VALUES (857, 665, 4668, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (858, 665, 4669, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (859, 665, 4675, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (860, 665, 4671, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (861, 665, 4673, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (862, 665, 4670, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (863, 665, 4676, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (864, 665, 4674, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (865, 665, 4677, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (866, 665, 4672, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (867, 665, 4678, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (868, 665, 4679, 0, 0, 1, 0, '2019-04-30 13:29:46', NULL);
INSERT INTO `user_apps` VALUES (869, 666, 4653, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (870, 666, 4651, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (871, 666, 4654, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (872, 666, 4652, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (873, 666, 4658, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (874, 666, 4659, 0, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (875, 666, 4656, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (876, 666, 4655, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (877, 666, 4660, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (878, 666, 4664, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (879, 666, 4665, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (880, 666, 4657, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (881, 666, 4663, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (882, 666, 4649, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (883, 666, 9686, 0, 1, 1, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (884, 666, 4661, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (885, 666, 4666, 0, 1, 1, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (886, 666, 4662, 1, 0, 0, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (887, 666, 4650, 1, 1, 1, 0, '2019-04-30 13:33:08', NULL);
INSERT INTO `user_apps` VALUES (888, 666, 4670, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (889, 666, 4669, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (890, 666, 4675, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (891, 666, 4671, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (892, 666, 4676, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (893, 666, 4672, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (894, 666, 4668, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (895, 666, 4673, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (896, 666, 4678, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (897, 666, 4674, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (898, 666, 4679, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (899, 666, 4677, 0, 0, 1, 0, '2019-04-30 13:33:09', NULL);
INSERT INTO `user_apps` VALUES (900, 674, 4652, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (901, 674, 4651, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (902, 674, 4655, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (903, 674, 4653, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (904, 674, 4649, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (905, 674, 4656, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (906, 674, 4663, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (907, 674, 4657, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (908, 674, 4658, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (909, 674, 4660, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (910, 674, 4659, 0, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (911, 674, 4661, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (912, 674, 4664, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (913, 674, 4662, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (914, 674, 4665, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (915, 674, 4666, 0, 1, 1, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (916, 674, 4654, 1, 0, 0, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (917, 674, 4650, 1, 1, 1, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (918, 674, 9686, 0, 1, 1, 0, '2019-04-30 13:38:43', NULL);
INSERT INTO `user_apps` VALUES (919, 674, 4673, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (920, 674, 4672, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (921, 674, 4669, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (922, 674, 4676, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (923, 674, 4675, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (924, 674, 4677, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (925, 674, 4671, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (926, 674, 4674, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (927, 674, 4670, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (928, 674, 4679, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (929, 674, 4678, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (930, 674, 4668, 0, 0, 1, 0, '2019-04-30 13:38:44', NULL);
INSERT INTO `user_apps` VALUES (931, 683, 4651, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (932, 683, 4653, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (933, 683, 4652, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (934, 683, 4658, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (935, 683, 4656, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (936, 683, 4649, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (937, 683, 4657, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (938, 683, 4655, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (939, 683, 4660, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (940, 683, 4661, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (941, 683, 4664, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (942, 683, 4659, 0, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (943, 683, 4654, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (944, 683, 4666, 0, 1, 1, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (945, 683, 4662, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (946, 683, 4663, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (947, 683, 4665, 1, 0, 0, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (948, 683, 9686, 0, 1, 1, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (949, 683, 4650, 1, 1, 1, 0, '2019-04-30 13:41:57', NULL);
INSERT INTO `user_apps` VALUES (950, 683, 4669, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (951, 683, 4670, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (952, 683, 4677, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (953, 683, 4675, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (954, 683, 4671, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (955, 683, 4668, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (956, 683, 4672, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (957, 683, 4673, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (959, 683, 4679, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (961, 683, 4674, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (966, 683, 4676, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (967, 683, 4678, 0, 0, 1, 0, '2019-04-30 13:42:00', NULL);
INSERT INTO `user_apps` VALUES (973, 682, 4651, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (974, 682, 4652, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (975, 682, 4655, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (976, 682, 4654, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (977, 682, 4657, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (978, 682, 4658, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (979, 682, 4653, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (980, 682, 4656, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (981, 682, 4660, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (982, 682, 4649, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (983, 682, 4662, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (984, 682, 4661, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (985, 682, 4663, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (986, 682, 4665, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (987, 682, 4659, 1, 1, 1, 0, '2019-04-30 13:45:32', NULL);
INSERT INTO `user_apps` VALUES (988, 682, 4666, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (989, 682, 4650, 1, 1, 1, 0, '2019-04-30 13:45:32', NULL);
INSERT INTO `user_apps` VALUES (990, 682, 9686, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (991, 682, 4664, 1, 1, 1, 0, '2019-04-30 13:45:32', '2019-04-30 13:53:10');
INSERT INTO `user_apps` VALUES (992, 682, 4668, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (993, 682, 4673, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (994, 682, 4674, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (995, 682, 4671, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (996, 682, 4676, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (997, 682, 4672, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (998, 682, 4670, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (999, 682, 4677, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (1000, 682, 4675, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (1001, 682, 4678, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (1002, 682, 4669, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (1003, 682, 4679, 0, 0, 1, 0, '2019-04-30 13:45:33', NULL);
INSERT INTO `user_apps` VALUES (1004, 681, 4659, 0, 0, 0, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1005, 681, 4649, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1006, 681, 4653, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1007, 681, 4658, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1008, 681, 4652, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1009, 681, 4655, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1010, 681, 4656, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1011, 681, 4654, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1012, 681, 4651, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1013, 681, 4657, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1014, 681, 4660, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1015, 681, 4661, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1016, 681, 9686, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1017, 681, 4650, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1018, 681, 4662, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1019, 681, 4663, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1020, 681, 4664, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1021, 681, 4665, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1022, 681, 4666, 1, 1, 1, 0, '2019-04-30 13:56:05', NULL);
INSERT INTO `user_apps` VALUES (1023, 681, 4669, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1024, 681, 4668, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1025, 681, 4670, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1026, 681, 4674, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1027, 681, 4676, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1028, 681, 4672, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1029, 681, 4671, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1030, 681, 4679, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1031, 681, 4678, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1032, 681, 4675, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1033, 681, 4673, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1034, 681, 4677, 1, 1, 1, 0, '2019-04-30 13:56:07', NULL);
INSERT INTO `user_apps` VALUES (1035, 680, 4656, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1036, 680, 4660, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1037, 680, 4661, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1038, 680, 4654, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1039, 680, 4655, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1040, 680, 4649, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1041, 680, 4662, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1042, 680, 4652, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1043, 680, 4658, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1044, 680, 4653, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1045, 680, 4664, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1046, 680, 4665, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1047, 680, 4657, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1048, 680, 4663, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1049, 680, 4659, 0, 0, 0, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1050, 680, 4666, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1051, 680, 9686, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1052, 680, 4651, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1053, 680, 4650, 1, 1, 1, 0, '2019-04-30 14:00:00', NULL);
INSERT INTO `user_apps` VALUES (1054, 680, 4671, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1055, 680, 4673, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1056, 680, 4670, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1057, 680, 4669, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1058, 680, 4672, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1059, 680, 4679, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1060, 680, 4678, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1061, 680, 4674, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1062, 680, 4668, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1063, 680, 4676, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1064, 680, 4677, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1065, 680, 4675, 1, 1, 1, 0, '2019-04-30 14:00:01', NULL);
INSERT INTO `user_apps` VALUES (1066, 678, 4659, 0, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1067, 678, 4652, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1068, 678, 4651, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1069, 678, 4654, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1070, 678, 4656, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1071, 678, 4653, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1072, 678, 4649, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1073, 678, 4660, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1074, 678, 4658, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1075, 678, 4657, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1076, 678, 4664, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1077, 678, 4663, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1078, 678, 4661, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1079, 678, 9686, 0, 1, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1080, 678, 4665, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1081, 678, 4655, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1082, 678, 4662, 1, 0, 0, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1083, 678, 4666, 0, 1, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1084, 678, 4650, 1, 1, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1085, 678, 4671, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1086, 678, 4672, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1087, 678, 4673, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1088, 678, 4668, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1089, 678, 4674, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1090, 678, 4670, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1091, 678, 4669, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1092, 678, 4676, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1093, 678, 4677, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1094, 678, 4675, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1095, 678, 4678, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1096, 678, 4679, 0, 0, 1, 0, '2019-04-30 14:14:54', NULL);
INSERT INTO `user_apps` VALUES (1097, 677, 4659, 0, 0, 0, 0, '2019-04-30 14:18:01', NULL);
INSERT INTO `user_apps` VALUES (1098, 677, 4651, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1099, 677, 4655, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1100, 677, 4653, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1101, 677, 4658, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1102, 677, 4649, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1103, 677, 4657, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1104, 677, 4656, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1105, 677, 4660, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1106, 677, 4652, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1107, 677, 4654, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1108, 677, 4665, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1109, 677, 4663, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1110, 677, 4662, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1111, 677, 4661, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1112, 677, 4666, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1113, 677, 4664, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1114, 677, 4650, 1, 1, 1, 0, '2019-04-30 14:18:01', NULL);
INSERT INTO `user_apps` VALUES (1115, 677, 9686, 1, 1, 1, 0, '2019-04-30 14:18:01', '2019-04-30 14:23:23');
INSERT INTO `user_apps` VALUES (1116, 677, 4671, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1117, 677, 4669, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1118, 677, 4672, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1119, 677, 4679, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1120, 677, 4668, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1121, 677, 4678, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1122, 677, 4676, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1123, 677, 4677, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1124, 677, 4674, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1125, 677, 4673, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1126, 677, 4675, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1127, 677, 4670, 0, 0, 1, 0, '2019-04-30 14:18:03', NULL);
INSERT INTO `user_apps` VALUES (1128, 643, 9686, 0, 1, 1, 0, '2019-05-01 04:49:18', NULL);
INSERT INTO `user_apps` VALUES (1129, 693, 4674, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1130, 693, 4675, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1131, 693, 4677, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1132, 693, 4676, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1133, 693, 4669, 0, 0, 1, 0, '2019-05-01 05:37:06', '2019-05-01 05:59:38');
INSERT INTO `user_apps` VALUES (1134, 693, 4670, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1135, 693, 4678, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1136, 693, 4673, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1137, 693, 4672, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1138, 693, 4671, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1139, 693, 4668, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1140, 693, 4679, 0, 0, 1, 0, '2019-05-01 05:37:06', NULL);
INSERT INTO `user_apps` VALUES (1141, 693, 4659, 0, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1142, 693, 4649, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1143, 693, 4653, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1144, 693, 4654, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1145, 693, 4656, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1146, 693, 4652, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1147, 693, 4655, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1148, 693, 4658, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1149, 693, 4651, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1150, 693, 4660, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1151, 693, 4661, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1152, 693, 4657, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1153, 693, 9686, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1154, 693, 4663, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1155, 693, 4664, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1156, 693, 4662, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1157, 693, 4665, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1158, 693, 4650, 1, 1, 1, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1159, 693, 4666, 1, 1, 1, 0, '2019-05-01 05:37:08', '2019-05-01 08:03:46');
INSERT INTO `user_apps` VALUES (1160, 662, 15606, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1161, 662, 15609, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1162, 662, 15610, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1163, 662, 15612, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1164, 662, 15614, 0, 0, 0, 0, '2019-05-01 07:46:18', NULL);
INSERT INTO `user_apps` VALUES (1165, 662, 15607, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1166, 662, 15615, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1167, 662, 15608, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1168, 662, 15611, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1169, 662, 15618, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1170, 662, 15620, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1171, 662, 15616, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1172, 662, 15613, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1173, 662, 15619, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1174, 662, 15617, 0, 0, 0, 0, '2019-05-01 07:46:18', '2019-05-01 07:53:19');
INSERT INTO `user_apps` VALUES (1175, 693, 15706, 1, 1, 1, 0, '2019-05-01 08:03:46', NULL);
INSERT INTO `user_apps` VALUES (1335, 694, 4658, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1336, 694, 4654, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1337, 694, 4653, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1338, 694, 4652, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1339, 694, 4656, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1340, 694, 4657, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1341, 694, 4649, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1342, 694, 4659, 0, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1343, 694, 4660, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1344, 694, 9686, 0, 1, 1, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1345, 694, 4663, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1346, 694, 4666, 0, 1, 1, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1347, 694, 4662, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1348, 694, 4664, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1349, 694, 4661, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1350, 694, 4665, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1351, 694, 4651, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1352, 694, 4655, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1353, 694, 15926, 1, 0, 0, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1354, 694, 15929, 1, 1, 1, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1355, 694, 15706, 0, 1, 1, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1356, 694, 4650, 1, 1, 1, 0, '2019-05-11 04:49:02', NULL);
INSERT INTO `user_apps` VALUES (1357, 694, 4669, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1358, 694, 4677, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1359, 694, 4668, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1360, 694, 4676, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1361, 694, 4671, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1362, 694, 4672, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1363, 694, 4675, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1364, 694, 4673, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1365, 694, 4670, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1366, 694, 4674, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1367, 694, 4679, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1368, 694, 4678, 0, 0, 1, 0, '2019-05-11 04:49:03', NULL);
INSERT INTO `user_apps` VALUES (1643, 705, 4649, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1644, 705, 4652, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1645, 705, 4658, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1646, 705, 4654, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1647, 705, 4653, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1648, 705, 4661, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1649, 705, 4657, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1650, 705, 4656, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1651, 705, 4651, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1652, 705, 4664, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1653, 705, 9686, 0, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1654, 705, 15926, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1655, 705, 15706, 0, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1656, 705, 4660, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1657, 705, 4662, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1658, 705, 4655, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1659, 705, 15929, 1, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1660, 705, 4666, 0, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1661, 705, 4663, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1662, 705, 4650, 1, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1663, 705, 4665, 1, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1664, 705, 4659, 0, 0, 0, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1665, 705, 4673, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1666, 705, 4670, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1667, 705, 4678, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1668, 705, 4677, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1669, 705, 4671, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1670, 705, 4668, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1671, 705, 4675, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1672, 705, 4676, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1673, 705, 4679, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1674, 705, 4669, 1, 1, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1675, 705, 4674, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1676, 705, 4672, 0, 0, 1, 0, '2019-05-11 10:33:34', NULL);
INSERT INTO `user_apps` VALUES (1713, 703, 4649, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1714, 703, 4652, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1715, 703, 4657, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1716, 703, 4654, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1717, 703, 4656, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1718, 703, 4661, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1719, 703, 4653, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1720, 703, 4651, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1721, 703, 4655, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1722, 703, 4662, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1723, 703, 4659, 0, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1724, 703, 4658, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1725, 703, 4663, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1726, 703, 4666, 0, 1, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1727, 703, 4665, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1728, 703, 4660, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1729, 703, 15926, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1730, 703, 9686, 0, 1, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1731, 703, 16067, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1732, 703, 15929, 1, 1, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1733, 703, 4664, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1734, 703, 15706, 0, 1, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1735, 703, 4650, 1, 1, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1736, 703, 9684, 1, 0, 0, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1737, 703, 4671, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1738, 703, 4675, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1739, 703, 4674, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1740, 703, 4672, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1741, 703, 4676, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1742, 703, 4669, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1743, 703, 4670, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1744, 703, 4673, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1745, 703, 4668, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1746, 703, 4678, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1747, 703, 4677, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1748, 703, 4679, 0, 0, 1, 0, '2019-05-11 10:45:45', NULL);
INSERT INTO `user_apps` VALUES (1749, 702, 4654, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1750, 702, 4660, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1751, 702, 4659, 0, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1752, 702, 4652, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1753, 702, 4653, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1754, 702, 4657, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1755, 702, 4663, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1756, 702, 4655, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1757, 702, 4651, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1758, 702, 4658, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1759, 702, 4662, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1760, 702, 4665, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1761, 702, 4664, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1762, 702, 4666, 0, 1, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1763, 702, 4656, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1764, 702, 4661, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1765, 702, 4649, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1766, 702, 15926, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1767, 702, 4650, 1, 1, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1768, 702, 9686, 0, 1, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1769, 702, 16067, 1, 0, 0, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1770, 702, 15929, 1, 1, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1771, 702, 15706, 0, 1, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1772, 702, 4670, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1773, 702, 4669, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1774, 702, 4675, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1775, 702, 4671, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1776, 702, 4676, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1777, 702, 4672, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1778, 702, 4679, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1779, 702, 4674, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1780, 702, 4673, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1781, 702, 4678, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1782, 702, 4668, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1783, 702, 4677, 0, 0, 1, 0, '2019-05-11 10:57:47', NULL);
INSERT INTO `user_apps` VALUES (1784, 701, 4654, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1785, 701, 4657, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1786, 701, 4652, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1787, 701, 4660, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1788, 701, 4666, 0, 1, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1789, 701, 4661, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1790, 701, 4665, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1791, 701, 15926, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1792, 701, 4662, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1793, 701, 4664, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1794, 701, 4655, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1795, 701, 4649, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1796, 701, 4651, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1797, 701, 4653, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1798, 701, 4658, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1799, 701, 4656, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1800, 701, 4663, 1, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1801, 701, 4659, 0, 0, 0, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1802, 701, 9686, 0, 1, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1803, 701, 4650, 1, 1, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1804, 701, 15929, 1, 1, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1805, 701, 15706, 0, 1, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1806, 701, 4669, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1807, 701, 4673, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1808, 701, 4671, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1809, 701, 4668, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1810, 701, 4674, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1811, 701, 4675, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1812, 701, 4678, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1813, 701, 4670, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1814, 701, 4679, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1815, 701, 4672, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1816, 701, 4676, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1817, 701, 4677, 0, 0, 1, 0, '2019-05-11 11:03:03', NULL);
INSERT INTO `user_apps` VALUES (1818, 698, 4651, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1819, 698, 4652, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1820, 698, 4654, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1821, 698, 4653, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1822, 698, 4658, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1823, 698, 4649, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1824, 698, 4659, 0, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1825, 698, 4657, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1826, 698, 4656, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1827, 698, 4660, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1828, 698, 4655, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1829, 698, 4661, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1830, 698, 4662, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1831, 698, 4663, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1832, 698, 4665, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1833, 698, 15926, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1834, 698, 4664, 1, 0, 0, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1835, 698, 9686, 0, 1, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1836, 698, 4666, 0, 1, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1837, 698, 4650, 1, 1, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1838, 698, 15929, 1, 1, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1839, 698, 15706, 0, 1, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1840, 698, 4668, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1841, 698, 4670, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1842, 698, 4669, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1843, 698, 4671, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1844, 698, 4676, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1845, 698, 4672, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1846, 698, 4678, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1847, 698, 4674, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1848, 698, 4673, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1849, 698, 4677, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1850, 698, 4675, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1851, 698, 4679, 0, 0, 1, 0, '2019-05-11 11:13:03', NULL);
INSERT INTO `user_apps` VALUES (1976, 696, 4649, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1977, 696, 4654, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1978, 696, 4651, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1979, 696, 4652, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1980, 696, 4655, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1981, 696, 4660, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1982, 696, 4656, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1983, 696, 4653, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1984, 696, 4658, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1985, 696, 4657, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1986, 696, 4661, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1987, 696, 16445, 0, 1, 1, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1988, 696, 4662, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1989, 696, 4663, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1990, 696, 4666, 0, 1, 1, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1991, 696, 4664, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1992, 696, 4665, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1993, 696, 15926, 1, 1, 0, 0, '2019-05-14 10:11:45', NULL);
INSERT INTO `user_apps` VALUES (1994, 695, 4654, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (1995, 695, 4653, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (1996, 695, 4651, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (1997, 695, 4652, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (1998, 695, 4660, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (1999, 695, 4659, 1, 1, 1, 0, '2019-05-14 12:08:41', NULL);
INSERT INTO `user_apps` VALUES (2000, 695, 4663, 1, 1, 0, 0, '2019-05-14 12:08:41', NULL);
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
INSERT INTO `user_apps` VALUES (2130, 700, 4656, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2131, 700, 4654, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2132, 700, 4651, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2133, 700, 4653, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2134, 700, 4649, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2135, 700, 4655, 1, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2136, 700, 4657, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2137, 700, 4652, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2138, 700, 4661, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2139, 700, 4650, 1, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2140, 700, 15926, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2141, 700, 4666, 0, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2142, 700, 4660, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2143, 700, 4658, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2144, 700, 4659, 1, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2145, 700, 4665, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2146, 700, 16445, 0, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2147, 700, 15706, 0, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2148, 700, 4664, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2149, 700, 4663, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2150, 700, 15929, 1, 1, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2151, 700, 4662, 1, 0, 0, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2152, 700, 4674, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2153, 700, 4671, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2154, 700, 4668, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2155, 700, 4670, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2156, 700, 4672, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2157, 700, 4669, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2158, 700, 4673, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2159, 700, 4675, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2160, 700, 4677, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2161, 700, 4676, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2162, 700, 4679, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2163, 700, 4678, 0, 0, 1, 0, '2019-05-15 11:01:54', NULL);
INSERT INTO `user_apps` VALUES (2608, 708, 4656, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2609, 708, 4651, 1, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2610, 708, 4658, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2611, 708, 4662, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2612, 708, 4661, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2613, 708, 4660, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2614, 708, 4657, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2615, 708, 4653, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2616, 708, 4655, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2617, 708, 4652, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2618, 708, 4659, 0, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2619, 708, 15929, 1, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2620, 708, 9686, 0, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2621, 708, 4665, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2622, 708, 4663, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2623, 708, 4664, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2624, 708, 15706, 0, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2625, 708, 4650, 1, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2626, 708, 15926, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2627, 708, 4666, 0, 1, 1, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2628, 708, 4654, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2629, 708, 4649, 1, 0, 0, 0, '2019-05-15 17:21:39', NULL);
INSERT INTO `user_apps` VALUES (2630, 708, 4668, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2631, 708, 4675, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2632, 708, 4671, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2633, 708, 4669, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2634, 708, 4670, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2635, 708, 4677, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2636, 708, 4674, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2637, 708, 4672, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2638, 708, 4676, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2639, 708, 4678, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2640, 708, 4679, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);
INSERT INTO `user_apps` VALUES (2641, 708, 4673, 0, 0, 1, 0, '2019-05-15 17:21:40', NULL);

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
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE,
  CONSTRAINT `users_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE NO ACTION ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 26 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (8, 'ID439304', 'Hamza', 'hamza.dawood007@gmail.com', '14ed94dc091babb2e13bce976edbd662', 4, 225, '2019-04-24 16:35:47', '2019-04-25 17:20:58');
INSERT INTO `users` VALUES (16, 'ID250548', 'asdda', 'asdsaas@gmaolc.co', 'fc249b5df5e4e0305895838563353478', 4, 227, '2019-04-25 16:46:46', NULL);
INSERT INTO `users` VALUES (17, 'ID546095', 'asdasd', 'sdasd@gmail.com', 'a181f093edad08b2282925c337af0ea3', 4, 227, '2019-04-25 16:48:27', NULL);
INSERT INTO `users` VALUES (18, 'ID950193', 'asddsa', 'asdasd@gmail.com', 'ad793d2f3f93e04649d419c309973af1', 4, 227, '2019-04-25 16:49:32', NULL);
INSERT INTO `users` VALUES (19, 'ID423004', 'asdasdsa', 'assadd@gmail.com', 'b6b425fa54f8228e29e9191e5ae173ae', 4, 224, '2019-04-25 16:50:26', '2019-04-25 17:40:47');
INSERT INTO `users` VALUES (20, 'ID833302', 'adeel', 'adeel@sunztech.com', '74ff5a6e073e39bfdeb6c160bab51618', 4, 231, '2019-04-29 12:59:19', NULL);
INSERT INTO `users` VALUES (21, 'ID887432', 'zaid', 'zaid@vortexapp.ca', 'b4f8b3feab152e88e3dfa453be3a8b49', 4, 224, '2019-04-29 16:34:23', NULL);
INSERT INTO `users` VALUES (22, 'ID708145', 'Mehran', 'imuhammadmehran@gmail.com', '368fbe6cd496a2579957eb53334908d3', 4, 232, '2019-04-30 08:01:59', NULL);
INSERT INTO `users` VALUES (23, 'ID158097', 'usman', 'usman@gmail.com', '14e6b5b1ee03eb2bec679875be4e2fcf', 4, 232, '2019-04-30 08:02:13', NULL);
INSERT INTO `users` VALUES (24, 'ID488322', 'paris', 'paris@gmail.com', '1f9e01e07f7abe8958ee96c219fa91ce', 4, 229, '2019-05-02 12:34:11', NULL);
INSERT INTO `users` VALUES (25, 'ID605116', 'hamza', 'hamza@gmail.com', 'a3362c1edc9dc6ee0b3afbf00090c1c3', 4, 154, '2019-05-11 10:19:22', NULL);

-- ----------------------------
-- Table structure for usr_acc
-- ----------------------------
DROP TABLE IF EXISTS `usr_acc`;
CREATE TABLE `usr_acc`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NULL DEFAULT NULL,
  `user_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 94 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------
INSERT INTO `usr_acc` VALUES (86, 700, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, '2019/05/14', 6, '2019/11/14', '8933490', 'active', 1, 1, 'wipe', '', 0, 0, NULL, NULL, 0, 0, 10, 'Testing purpose', '2019-05-11 04:47:24', '2019-05-14 15:30:52');
INSERT INTO `usr_acc` VALUES (93, 708, 'ID488322', NULL, 'usman@gmail.com', 222, 222, '433523', 'test154645', '2019/05/15', NULL, '2019/08/15', NULL, 'active', 1, NULL, NULL, '', 0, 0, NULL, 'usman hafeez', 0, 0, NULL, NULL, '2019-05-15 16:03:48', '2019-05-15 16:04:32');

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
) ENGINE = InnoDB AUTO_INCREMENT = 9 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;
