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

 Date: 03/05/2019 16:30:06
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for acc_action_history
-- ----------------------------
DROP TABLE IF EXISTS `acc_action_history`;
CREATE TABLE `acc_action_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `action` enum('DELETE','SUSPENDED','UNLINKED','EXPIRED','ACTIVE','FLAGGED','UNFLAGGED','TRANSFER','Pre-activated') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
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
) ENGINE = InnoDB AUTO_INCREMENT = 77 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `acc_action_history` VALUES (14, 'UNLINKED', 'DEQM506647', 'vortext test', 'pk9lIyZQzI0RRJs3AAPF', 'vortext100', '192.168.18.160', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'mehran@gmail.com', 222, 222, '433523', '12542', '', NULL, '', 'null', '', 0, NULL, 'undefined', '', 1, 0, 'usman hafeez', 'usman hafeez', 28, '2675DKN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 07:58:36', NULL);
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
INSERT INTO `acc_action_history` VALUES (25, 'UNLINKED', 'DDAF250244', 'null', 'FnSEbfoUa4-morPaAAPS', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '1348771', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 46, '7921MKT@ARMORSEC.XYZ', 'N/A', 'N/A', 1, 'Unlinked', '2019-05-01 04:54:02', '2019-05-01 04:54:02');
INSERT INTO `acc_action_history` VALUES (26, 'SUSPENDED', 'DDAF250244', 'null', 'Fj8PLAgJZVEWKG55AAAv', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 09:30:14', NULL);
INSERT INTO `acc_action_history` VALUES (27, 'ACTIVE', 'DDAF250244', 'null', 'Fj8PLAgJZVEWKG55AAAv', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 09:30:19', NULL);
INSERT INTO `acc_action_history` VALUES (28, 'SUSPENDED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 09:35:50', NULL);
INSERT INTO `acc_action_history` VALUES (29, 'ACTIVE', 'DDAF250244', 'null', 'NvmNy0CzZFEQtgzAAAA3', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '7409656', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 09:37:54', NULL);
INSERT INTO `acc_action_history` VALUES (30, 'UNLINKED', 'DDAF250244', 'null', 'NvmNy0CzZFEQtgzAAAA3', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '7409656', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 55, '6362MBN@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 09:39:26', NULL);
INSERT INTO `acc_action_history` VALUES (31, 'UNLINKED', 'DDAF250244', 'null', 'LxnNiNynHYBEo8mFAABM', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '1490199', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 53, '7497CXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 10:05:04', NULL);
INSERT INTO `acc_action_history` VALUES (32, 'UNLINKED', 'DDAF250244', 'null', 'ZC-EtSFXomkWCDtSAABW', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '5630814', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 49, '4254PMS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 10:10:58', NULL);
INSERT INTO `acc_action_history` VALUES (33, 'SUSPENDED', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 10:43:34', NULL);
INSERT INTO `acc_action_history` VALUES (34, 'ACTIVE', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 10:43:43', NULL);
INSERT INTO `acc_action_history` VALUES (35, 'SUSPENDED', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 10:43:52', NULL);
INSERT INTO `acc_action_history` VALUES (36, 'ACTIVE', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 3, '2019/07/30', '0225517', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 10:43:59', NULL);
INSERT INTO `acc_action_history` VALUES (37, 'UNLINKED', 'DDAF250244', 'null', 'QGRUrAyrUZu3CvS_AABa', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '0225517', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 50, '4511AXM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 12:16:12', NULL);
INSERT INTO `acc_action_history` VALUES (38, 'UNLINKED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '3121419', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 54, '5464NJF@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:04:07', NULL);
INSERT INTO `acc_action_history` VALUES (39, 'UNLINKED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '1232445', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 52, '8729YAM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:15:57', NULL);
INSERT INTO `acc_action_history` VALUES (40, 'UNLINKED', 'DDAF250244', 'null', 'CCxfOlGh9e7EWadVAAAK', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '5640681', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 51, '4437CZC@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:29:15', NULL);
INSERT INTO `acc_action_history` VALUES (41, 'UNLINKED', 'DDAF250244', 'null', 'LebIQoblwqVoWxhoAAAL', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '6361564', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 47, '2188PBW@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:30:37', NULL);
INSERT INTO `acc_action_history` VALUES (42, 'UNLINKED', 'DDAF250244', 'null', 'ulTlEyO51vP7NhndAAAM', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 3, '', '8517262', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 48, '2535MPM@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:37:20', NULL);
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
INSERT INTO `acc_action_history` VALUES (53, 'UNLINKED', 'DDAF250244', 'null', 'D9urFFmJlWU92N7bAAAN', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '0494318', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 56, '5752CXB@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:39:34', NULL);
INSERT INTO `acc_action_history` VALUES (54, 'UNLINKED', 'DDAF250244', 'null', 'c9LG38kds1A2bRaFAAAO', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 0, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '0664192', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 61, '7245BCB@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:40:46', NULL);
INSERT INTO `acc_action_history` VALUES (55, 'SUSPENDED', 'DDAF250244', 'null', '5njrdxdT9eIKXDubAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 12, '2020/04/30', '4721576', 'active', 1, 1, 'undefined', 'suspended', 0, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Suspended', '2019-04-30 13:42:31', NULL);
INSERT INTO `acc_action_history` VALUES (56, 'ACTIVE', 'DDAF250244', 'null', '5njrdxdT9eIKXDubAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'On', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '2019/04/30', 12, '2020/04/30', '4721576', 'active', 1, 1, 'undefined', '', 0, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Active', '2019-04-30 13:42:36', NULL);
INSERT INTO `acc_action_history` VALUES (57, 'UNLINKED', 'DDAF250244', 'null', '5njrdxdT9eIKXDubAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, 'null', 'null', '', 12, '', '4721576', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 65, '2474VJS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:42:41', NULL);
INSERT INTO `acc_action_history` VALUES (58, 'UNLINKED', 'DDAF250244', 'null', '76wPPa50aXazHQ9ZAAAA', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '2915866', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 64, '4288DXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:55:02', NULL);
INSERT INTO `acc_action_history` VALUES (59, 'UNLINKED', 'DDAF250244', 'null', '-J9LEuItZedxiAZUAAAB', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '7240531', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 63, '1747BBV@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 13:59:23', NULL);
INSERT INTO `acc_action_history` VALUES (60, 'UNLINKED', 'DDAF250244', 'null', '4na1i7-yiv9io3G4AAAG', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '8609465', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 62, '9279GBS@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 14:04:57', NULL);
INSERT INTO `acc_action_history` VALUES (61, 'UNLINKED', 'DDAF250244', 'null', 'null', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '7683594', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 60, '8837ZRE@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 14:17:17', NULL);
INSERT INTO `acc_action_history` VALUES (62, 'UNLINKED', 'DDAF250244', 'null', 'DJzPcjERcFgrfRvlAAAP', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 12, '', '8257071', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 59, '9347SKJ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-04-30 14:37:04', NULL);
INSERT INTO `acc_action_history` VALUES (63, 'UNLINKED', 'YISC356974', 'usman', 'KcYah_fgohUgDIsRAAGc', 'null', '192.168.1.145', '8992042306182528852f', '354444076293150', '8992042306182528811f', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', 'null', 'off', 1, '', 'null', 0, NULL, 'usman1231@gmail.com', 225, 0, '541763', 'null', '', NULL, '', 'null', '', 0, NULL, 'undefined', '', 1, 0, 'Hamza Dawood', 'null', 29, '791BFT@TITANSECURE.BIZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-05-01 04:52:44', NULL);
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
INSERT INTO `acc_action_history` VALUES (74, 'UNLINKED', 'DDAF250244', 'null', 'Zk2aPd4v39GHZLQkAAAB', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 232, 0, '674794', 'null', '', 6, '', '8752917', '', 0, NULL, 'undefined', '', 1, 0, 'Muhammad mehran', 'null', 74, '5734TXZ@ARMORSEC.XYZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-05-01 14:15:18', NULL);
INSERT INTO `acc_action_history` VALUES (75, 'UNLINKED', 'DDAF250244', 'null', 'xHCLClpjvTNHT7smAAAB', 'null', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'null', 227, 0, '753909', 'null', '', 1, '', '1437179', '', 0, NULL, 'undefined', '', 1, 0, 'Hamza123', 'null', 30, '1619DKV@ARMORSEC.XYZ', '8', '6', NULL, 'Unlinked', '2019-05-01 14:52:45', NULL);
INSERT INTO `acc_action_history` VALUES (76, 'UNLINKED', 'DDAF250244', 'fasfa', 'null', 'asdas', '192.168.0.106', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', 'null', 'off', 1, '', 'null', 0, NULL, 'asd@gmail.com', 225, 0, '541763', 'adasd', '', 0, '', '9275599', '', 0, NULL, 'undefined', '', 1, 0, 'Hamza Dawood', 'null', 27, '349VFT@TITANSECURE.BIZ', 'N/A', 'N/A', NULL, 'Unlinked', '2019-05-03 15:47:16', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 54 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 42 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Dynamic;

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
  `version_code` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `version_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `package_name` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `details` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `dealers` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `status` enum('Off','On') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'Off',
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `created` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `modified` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `id`(`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 52 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (51, 'usman hafeez', 'logo-1556882157657.jpg', 'apk-1556882153852.apk', 'basic', '1', '4.39', 'com.vortexlocker.app', '{\"versionCode\":1,\"versionName\":\"4.39\",\"package\":\"com.vortexlocker.app\",\"platformBuildVersionCode\":1,\"platformBuildVersionName\":1082948321,\"usesPermissions\":[{\"name\":\"android.permission.BIND_ACCESSIBILITY_SERVICE\"},{\"name\":\"android.permission.KILL_BACKGROUND_PROCESSES\"},{\"name\":\"android.permission.REORDER_TASKS\"},{\"name\":\"android.permission.STATUS_BAR\"},{\"name\":\"android.permission.EXPAND_STATUS_BAR\"},{\"name\":\"android.permission.INTERNAL_SYSTEM_WINDOW\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"android.permission.READ_PHONE_STATE\"},{\"name\":\"android.permission.ACCESS_WIFI_STATE\"},{\"name\":\"android.permission.CHANGE_WIFI_STATE\"},{\"name\":\"android.permission.ACCESS_NETWORK_STATE\"},{\"name\":\"android.permission.CHANGE_NETWORK_STATE\"},{\"name\":\"android.permission.WRITE_SETTINGS\"},{\"name\":\"android.permission.INTERNET\"},{\"name\":\"Manifest.permission.ANSWER_PHONE_CALLS\"},{\"name\":\"android.permission.BLUETOOTH\"},{\"name\":\"android.permission.CALL_PHONE\"},{\"name\":\"android.permission.BLUETOOTH_ADMIN\"},{\"name\":\"android.permission.DISABLE_KEYGUARD\"},{\"name\":\"android.permission.RECEIVE_BOOT_COMPLETED\"},{\"name\":\"android.permission.EXPAND_STATUS_BAR\"},{\"name\":\"android.permission.GET_TASKS\"},{\"name\":\"android.permission.SYSTEM_ALERT_WINDOW\"},{\"name\":\"android.permission.TYPE_APPLICATION_OVERLAY\"},{\"name\":\"android.permission.WAKE_LOCK\"}],\"permissions\":[],\"permissionTrees\":[],\"permissionGroups\":[],\"instrumentation\":null,\"usesSdk\":{\"minSdkVersion\":18,\"targetSdkVersion\":27},\"usesConfiguration\":null,\"usesFeatures\":[],\"supportsScreens\":null,\"compatibleScreens\":[],\"supportsGlTextures\":[],\"application\":{\"theme\":\"resourceId:0x7f0e0006\",\"label\":\"resourceId:0x7f0d001d\",\"icon\":\"resourceId:0x7f0c0000\",\"name\":\"com.vortexlocker.app.app.MyApplication\",\"debuggable\":true,\"allowBackup\":true,\"supportsRtl\":true,\"activities\":[{\"name\":\"com.vortexlocker.app.launcher.MainActivity\",\"enabled\":true,\"taskAffinity\":\"a.s.s\",\"launchMode\":2,\"screenOrientation\":1,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.HOME\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.launcher.FakeLauncherActivity\",\"enabled\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.HOME\"},{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.SettingsActivity\",\"launchMode\":1,\"screenOrientation\":1,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.permissions.StepperActivity\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.SetUpLockActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":5,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.appSelection.AppSelectionActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":3,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.ManagePasswords\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"theme\":\"resourceId:0x7f0e0041\",\"name\":\"com.theartofdev.edmodo.cropper.CropImageActivity\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settingsMenu.SettingsMenuActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.codeSetting.CodeSettingActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.codeSetting.installApps.InstallAppsActivity\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.codeSetting.Sim.SimActivity\",\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f0d001d\",\"name\":\"com.vortexlocker.app.mdm.MainActivity\",\"screenOrientation\":1,\"windowSoftInputMode\":3,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.mdm.ui.LinkDeviceActivity\",\"screenOrientation\":1,\"intentFilters\":[],\"metaData\":[]}],\"activityAliases\":[],\"launcherActivities\":[{\"name\":\"com.vortexlocker.app.settings.SettingsActivity\",\"launchMode\":1,\"screenOrientation\":1,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.MAIN\"}],\"categories\":[{\"name\":\"android.intent.category.LAUNCHER\"}],\"data\":[]}],\"metaData\":[]}],\"services\":[{\"name\":\"com.vortexlocker.app.utils.LifecycleReceiverService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.service.LockScreenService\",\"enabled\":true,\"exported\":true,\"intentFilters\":[],\"metaData\":[]},{\"label\":\"resourceId:0x7f0d001d\",\"name\":\"com.vortexlocker.app.service.DeviceNotificationListener\",\"permission\":\"android.permission.BIND_NOTIFICATION_LISTENER_SERVICE\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.service.notification.NotificationListenerService\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.socket.service.SocketService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.mdm.utils.LifecycleReceiverService\",\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.SystemAlarmService\",\"enabled\":\"resourceId:0x7f040004\",\"exported\":false,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemjob.SystemJobService\",\"permission\":\"android.permission.BIND_JOB_SERVICE\",\"enabled\":\"resourceId:0x7f040005\",\"exported\":true,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]}],\"receivers\":[{\"name\":\"com.vortexlocker.app.ReBootReciever\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.QUICKBOOT_POWERON\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.socket.receiver.MdmEventReciever\",\"intentFilters\":[{\"actions\":[{\"name\":\"com.secureportal.barryapp.app_linked_success\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.ShutDownReceiver\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_SHUTDOWN\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.MyAdmin\",\"permission\":\"android.permission.BIND_DEVICE_ADMIN\",\"intentFilters\":[{\"actions\":[{\"name\":\"android.app.action.DEVICE_ADMIN_ENABLED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[{\"name\":\"android.app.device_admin\",\"resource\":\"resourceId:0x7f100001\"}]},{\"name\":\"com.vortexlocker.app.utils.AppInstallReciever\",\"enabled\":true,\"priority\":100,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.PACKAGE_ADDED\"},{\"name\":\"android.intent.action.PACKAGE_INSTALL\"},{\"name\":\"android.intent.action.PACKAGE_REMOVED\"}],\"categories\":[],\"data\":[{\"scheme\":\"package\"}]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.settings.disableCalls.PhoneCallReceiver\",\"enabled\":true,\"exported\":true,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.PHONE_STATE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"com.vortexlocker.app.socket.receiver.DeviceStatusReceiver\",\"enabled\":true,\"exported\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"}],\"categories\":[{\"name\":\"android.intent.category.DEFAULT\"}],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.utils.ForceStopRunnable$BroadcastReceiver\",\"enabled\":true,\"exported\":false,\"directBootAware\":false,\"intentFilters\":[],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryChargingProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.ACTION_POWER_CONNECTED\"},{\"name\":\"android.intent.action.ACTION_POWER_DISCONNECTED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$BatteryNotLowProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BATTERY_OKAY\"},{\"name\":\"android.intent.action.BATTERY_LOW\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$StorageNotLowProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.DEVICE_STORAGE_LOW\"},{\"name\":\"android.intent.action.DEVICE_STORAGE_OK\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxy$NetworkStateProxy\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.net.conn.CONNECTIVITY_CHANGE\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.RescheduleReceiver\",\"enabled\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"android.intent.action.BOOT_COMPLETED\"},{\"name\":\"android.intent.action.TIME_SET\"},{\"name\":\"android.intent.action.TIMEZONE_CHANGED\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]},{\"name\":\"androidx.work.impl.background.systemalarm.ConstraintProxyUpdateReceiver\",\"enabled\":\"resourceId:0x7f040004\",\"exported\":false,\"directBootAware\":false,\"intentFilters\":[{\"actions\":[{\"name\":\"androidx.work.impl.background.systemalarm.UpdateProxies\"}],\"categories\":[],\"data\":[]}],\"metaData\":[]}],\"providers\":[{\"name\":\"android.support.v4.content.FileProvider\",\"exported\":false,\"authorities\":\"com.vortexlocker.app\",\"grantUriPermissions\":[],\"metaData\":[{\"name\":\"android.support.FILE_PROVIDER_PATHS\",\"resource\":\"resourceId:0x7f100002\"}],\"pathPermissions\":[]},{\"name\":\"androidx.work.impl.WorkManagerInitializer\",\"exported\":false,\"multiprocess\":true,\"authorities\":\"com.vortexlocker.app.workmanager-init\",\"directBootAware\":false,\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]},{\"name\":\"android.arch.lifecycle.ProcessLifecycleOwnerInitializer\",\"exported\":false,\"multiprocess\":true,\"authorities\":\"com.vortexlocker.app.lifecycle-trojan\",\"grantUriPermissions\":[],\"metaData\":[],\"pathPermissions\":[]}],\"usesLibraries\":[],\"metaDatas\":[{\"name\":\"io.fabric.ApiKey\",\"value\":\"0681a8885d07f744d26521d50a0995b0dcef653c\"}]}}', NULL, 'On', 0, '2019-05-03 16:16:02', '2019-05-03 16:16:06');

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
  `extension` tinyint(4) NOT NULL DEFAULT 0,
  `visible` tinyint(4) NOT NULL DEFAULT 1,
  `default_app` tinyint(4) NOT NULL DEFAULT 0,
  `extension_id` int(11) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_name_constraints`(`unique_name`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15979 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `apps_info` VALUES (4667, 'com.titanlocker.secureTitan Locker', 'Titan Locker', 'com.titanlocker.secure', 'icon_Titan Locker.png', 0, 1, 0, 0, '2019-04-22 12:49:21', '2019-05-03 16:09:58');
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
INSERT INTO `apps_info` VALUES (13122, 'com.zonarmr.mtkengineermodeMTK Engineer Mode', 'Engineer Mode 12', 'com.zonarmr.mtkengineermode', 'icon_MTK Engineer Mode.png', 0, 1, 0, 0, '2019-04-30 08:56:25', '2019-05-01 13:26:23');
INSERT INTO `apps_info` VALUES (15628, 'com.secureClear.SecureClearActivitySecure Clear', 'Secure Clear', 'com.secureClear.SecureClearActivity', 'icon_Secure Clear.png', 1, 1, 0, 0, '2019-05-01 13:51:31', NULL);
INSERT INTO `apps_info` VALUES (15658, 'com.secure.systemcontrolSystem Control', 'System Control', 'com.secure.systemcontrol', 'icon_System Control.png', 0, 1, 0, 0, '2019-05-03 15:06:12', NULL);
INSERT INTO `apps_info` VALUES (15659, 'com.vortexlocker.apScreen Locker', 'Screen Locker', 'com.vortexlocker.ap', 'icon_Screen Locker.png', 0, 1, 1, 0, '2019-05-03 15:06:12', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 11 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_ids
-- ----------------------------
INSERT INTO `chat_ids` VALUES (1, NULL, '6', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:44');
INSERT INTO `chat_ids` VALUES (2, NULL, '1', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:47');
INSERT INTO `chat_ids` VALUES (3, NULL, '7', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:49');
INSERT INTO `chat_ids` VALUES (4, NULL, '4', 1, '2019-04-22 17:34:23', '2019-04-22 17:34:49');
INSERT INTO `chat_ids` VALUES (5, NULL, '8', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:16');
INSERT INTO `chat_ids` VALUES (6, 31, '10', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:17');
INSERT INTO `chat_ids` VALUES (7, 32, '5', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:17');
INSERT INTO `chat_ids` VALUES (8, 33, '3', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:18');
INSERT INTO `chat_ids` VALUES (9, 34, '2', 1, '2019-04-22 17:34:23', '2019-04-22 12:50:18');
INSERT INTO `chat_ids` VALUES (10, 35, '9', 1, '2019-04-22 17:34:23', '2019-04-22 12:52:12');

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
) ENGINE = InnoDB AUTO_INCREMENT = 329 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_apks
-- ----------------------------
INSERT INTO `dealer_apks` VALUES (253, 222, 29);
INSERT INTO `dealer_apks` VALUES (243, 222, 30);
INSERT INTO `dealer_apks` VALUES (328, 222, 41);
INSERT INTO `dealer_apks` VALUES (252, 223, 29);
INSERT INTO `dealer_apks` VALUES (242, 223, 30);
INSERT INTO `dealer_apks` VALUES (327, 223, 41);
INSERT INTO `dealer_apks` VALUES (251, 224, 29);
INSERT INTO `dealer_apks` VALUES (280, 224, 30);
INSERT INTO `dealer_apks` VALUES (326, 224, 41);
INSERT INTO `dealer_apks` VALUES (250, 225, 29);
INSERT INTO `dealer_apks` VALUES (288, 225, 30);
INSERT INTO `dealer_apks` VALUES (325, 225, 41);
INSERT INTO `dealer_apks` VALUES (249, 226, 29);
INSERT INTO `dealer_apks` VALUES (324, 226, 41);
INSERT INTO `dealer_apks` VALUES (312, 227, 29);
INSERT INTO `dealer_apks` VALUES (323, 227, 41);
INSERT INTO `dealer_apks` VALUES (322, 228, 41);
INSERT INTO `dealer_apks` VALUES (321, 229, 41);
INSERT INTO `dealer_apks` VALUES (320, 230, 41);

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
  INDEX `id`(`id`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `id_2`(`id`) USING BTREE,
  CONSTRAINT `dealer_dropdown_list_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE CASCADE ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 120 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (85, 154, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\",\"SHOW ON DEVICE\"]', 'apk', '2019-04-02 16:14:22', '2019-04-27 23:42:19');
INSERT INTO `dealer_dropdown_list` VALUES (86, 154, '[\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"S-DEALER NAME\",\"DEVICE ID\"]', 'devices', '2019-04-02 16:18:12', '2019-05-03 15:08:42');
INSERT INTO `dealer_dropdown_list` VALUES (87, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'dealer', '2019-04-03 15:23:12', '2019-04-26 04:45:07');
INSERT INTO `dealer_dropdown_list` VALUES (88, 154, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'sdealer', '2019-04-03 15:23:15', '2019-04-26 04:45:06');
INSERT INTO `dealer_dropdown_list` VALUES (89, 222, '[\"DEVICE ID\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\",\"MODE\",\"FLAGGED\"]', 'devices', '2019-04-08 12:11:22', '2019-04-25 07:24:04');
INSERT INTO `dealer_dropdown_list` VALUES (90, 222, '[\"ACTIONS\"]', 'sdealer', '2019-04-08 12:13:36', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (91, 223, '[\"ACTIONS\"]', 'devices', '2019-04-10 09:46:55', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (92, 223, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 09:48:00', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (93, 223, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 09:48:00', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (94, 224, '[\"DEVICE ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-10 21:08:53', '2019-04-29 16:42:57');
INSERT INTO `dealer_dropdown_list` VALUES (95, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (96, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (97, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (98, 224, '[\"ACTIONS\"]', 'sdealer', '2019-04-10 21:09:26', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (99, 226, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-12 07:12:13', '2019-04-12 07:12:31');
INSERT INTO `dealer_dropdown_list` VALUES (100, 225, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-12 10:20:43', '2019-04-12 11:08:03');
INSERT INTO `dealer_dropdown_list` VALUES (101, 225, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-04-12 11:19:59', '2019-04-12 11:20:03');
INSERT INTO `dealer_dropdown_list` VALUES (102, 225, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-04-12 11:20:00', '2019-04-12 11:20:03');
INSERT INTO `dealer_dropdown_list` VALUES (103, 225, '[\"APP STATUS\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-04-18 06:30:34', '2019-04-18 06:30:37');
INSERT INTO `dealer_dropdown_list` VALUES (104, 222, '[\"SHOW ON DEVICE\",\"APK\",\"APP NAME\",\"APP LOGO\"]', 'apk', '2019-04-23 14:52:11', '2019-04-23 14:52:16');
INSERT INTO `dealer_dropdown_list` VALUES (105, 228, '[\"ACTIONS\",\"DEVICE ID\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"IMEI 1\",\"IMEI 2\",\"SERIAL NUMBER\",\"MODEL\"]', 'devices', '2019-04-24 17:25:13', '2019-04-24 17:44:30');
INSERT INTO `dealer_dropdown_list` VALUES (106, 228, '[\"ACTIONS\"]', 'apk', '2019-04-24 17:29:17', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (107, 228, '[\"ACTIONS\"]', 'sdealer', '2019-04-24 17:31:53', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (108, 228, '[\"ACTIONS\"]', 'sdealer', '2019-04-24 17:31:53', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (109, 224, '[\"ACTIONS\"]', 'apk', '2019-04-25 01:53:39', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (110, 230, '[\"DEVICE ID\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-27 23:15:38', '2019-04-27 23:27:46');
INSERT INTO `dealer_dropdown_list` VALUES (111, 229, '[\"DEVICE ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-27 23:24:38', '2019-04-29 16:19:43');
INSERT INTO `dealer_dropdown_list` VALUES (112, 229, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-04-27 23:26:50', '2019-04-27 23:27:19');
INSERT INTO `dealer_dropdown_list` VALUES (113, 229, '[\"ACTIONS\"]', 'apk', '2019-04-27 23:27:33', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (114, 231, '[\"DEVICE ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-29 09:48:50', '2019-04-29 13:01:32');
INSERT INTO `dealer_dropdown_list` VALUES (115, 232, '[\"DEVICE ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-30 07:59:55', '2019-04-30 08:03:35');
INSERT INTO `dealer_dropdown_list` VALUES (116, 232, '[\"DEVICE ID\",\"REMAINING DAYS\",\"FLAGGED\",\"STATUS\",\"MODE\",\"DEVICE NAME\",\"ACTIVATION CODE\",\"ACCOUNT EMAIL\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-04-30 07:59:55', '2019-04-30 08:03:35');
INSERT INTO `dealer_dropdown_list` VALUES (117, 232, '[\"ACTIONS\"]', 'sdealer', '2019-04-30 08:08:53', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (118, 232, '[\"ACTIONS\"]', 'sdealer', '2019-04-30 08:08:53', NULL);
INSERT INTO `dealer_dropdown_list` VALUES (119, 232, '[\"ACTIONS\"]', 'apk', '2019-04-30 08:09:09', NULL);

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
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  CONSTRAINT `dealer_pagination_ibfk_1` FOREIGN KEY (`dealer_id`) REFERENCES `dealers` (`dealer_id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 25 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealer_pagination
-- ----------------------------
INSERT INTO `dealer_pagination` VALUES (4, 154, 20, 'devices', '2019-04-02 16:18:12', '2019-04-25 08:31:25');
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
INSERT INTO `dealer_pagination` VALUES (15, 228, 10, 'devices', '2019-04-24 17:43:55', NULL);
INSERT INTO `dealer_pagination` VALUES (16, 230, 10, 'devices', '2019-04-27 23:22:23', NULL);
INSERT INTO `dealer_pagination` VALUES (17, 229, 10, 'devices', '2019-04-27 23:24:38', NULL);
INSERT INTO `dealer_pagination` VALUES (18, 229, 10, 'sdealer', '2019-04-27 23:27:13', NULL);
INSERT INTO `dealer_pagination` VALUES (19, 231, 10, 'devices', '2019-04-29 09:52:13', NULL);
INSERT INTO `dealer_pagination` VALUES (20, 154, 20, 'users', '2019-04-29 16:10:09', '2019-05-01 05:38:02');
INSERT INTO `dealer_pagination` VALUES (21, 224, 10, 'users', '2019-04-29 16:36:26', NULL);
INSERT INTO `dealer_pagination` VALUES (22, 232, 10, 'devices', '2019-04-30 08:00:32', NULL);
INSERT INTO `dealer_pagination` VALUES (23, 232, 10, 'users', '2019-04-30 08:08:52', NULL);
INSERT INTO `dealer_pagination` VALUES (24, 229, 10, 'users', '2019-04-30 16:11:07', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 233 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (222, NULL, NULL, 0, 'usman hafeez', 'usmanhafeez147@gmail.com', '2533c78aefde655b722ae07760bee9bb', '433523', 2, 0, NULL, '2019-04-03 15:23:26', '2019-04-03 15:23:26');
INSERT INTO `dealers` VALUES (223, NULL, NULL, 0, 'Barry', 'barrybarrygood@hotmail.com', 'b3af9d5ab1e2964e69b523a20e9690c8', '610192', 2, 0, NULL, '2019-04-10 09:14:30', '2019-04-10 09:14:30');
INSERT INTO `dealers` VALUES (224, NULL, NULL, 0, 'zaid', 'zaid@vortexapp.ca', 'e920be62c02a7d5549be410f1f31366b', '417695', 2, 0, NULL, '2019-04-10 21:06:51', '2019-04-10 21:06:51');
INSERT INTO `dealers` VALUES (225, NULL, NULL, 0, 'Hamza Dawood', 'hamza.dawood007@gmail.com', '6fc6be5e9df393f5a184c74b2c48ef70', '541763', 2, 0, NULL, '2019-04-11 10:39:50', '2019-04-11 10:39:50');
INSERT INTO `dealers` VALUES (226, NULL, NULL, 0, 'Arfan ali', 'arawan77rb@gmail.com', 'c3c6b034a0622448ec602efda5c0964f', '262165', 2, 0, NULL, '2019-04-12 07:10:40', '2019-04-12 07:10:40');
INSERT INTO `dealers` VALUES (227, NULL, NULL, 225, 'Hamza123', 'hamza.jutt004@gmail.com', 'e43a2b055b93736a42bcf71f257398ec', '753909', 3, 0, NULL, '2019-04-18 06:31:19', '2019-04-18 06:31:19');
INSERT INTO `dealers` VALUES (228, NULL, NULL, 0, 'Omegamoon', 'omegamoon@gmail.com', '78db4f647cbd8a14782b620b8e305242', '187854', 2, 0, NULL, '2019-04-24 16:55:43', '2019-04-24 16:55:43');
INSERT INTO `dealers` VALUES (229, NULL, NULL, 0, 'titan', 'dealer@titansecure.mobi', '66cd3187390abbb19fea16e5ed7b1eaf', '690957', 2, 0, NULL, '2019-04-27 23:10:08', '2019-04-27 23:10:08');
INSERT INTO `dealers` VALUES (230, NULL, NULL, 229, 'titan-subdealer', 'subdealer@titansecure.mobi', '7eb95339f4ae8e0a0b1d7f606c2c728e', '428146', 3, 0, NULL, '2019-04-27 23:11:11', '2019-04-27 23:11:11');
INSERT INTO `dealers` VALUES (231, NULL, NULL, 0, 'Adeel', 'adeel@sunztech.com', 'a96e1e296399f5c9f704b9088c6e9785', '166778', 2, 0, NULL, '2019-04-29 09:47:08', '2019-04-29 09:47:08');
INSERT INTO `dealers` VALUES (232, NULL, NULL, 0, 'Muhammad mehran', 'imuhammadmehran@gmail.com', '3484962edfa5bfbe1994f61592804085', '674794', 2, 0, NULL, '2019-04-30 07:59:15', '2019-04-30 07:59:15');

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
  `push_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `pull_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('push_apps','pull_apps','history','') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_acc_id`(`user_acc_id`) USING BTREE,
  CONSTRAINT `device_history_ibfk_1` FOREIGN KEY (`user_acc_id`) REFERENCES `usr_acc` (`id`) ON DELETE CASCADE ON UPDATE NO ACTION
) ENGINE = InnoDB AUTO_INCREMENT = 94 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device_history
-- ----------------------------
INSERT INTO `device_history` VALUES (71, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, NULL, NULL, 'history', 0, '2019-04-17 17:51:17', NULL);
INSERT INTO `device_history` VALUES (72, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, NULL, NULL, 'history', 0, '2019-04-18 07:57:55', NULL);
INSERT INTO `device_history` VALUES (73, 25, '[{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, NULL, NULL, 'history', 0, '2019-04-18 07:58:45', NULL);
INSERT INTO `device_history` VALUES (74, 25, '[{\"id\":57,\"app_id\":40,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', NULL, NULL, NULL, 'history', 0, '2019-04-18 08:13:29', NULL);
INSERT INTO `device_history` VALUES (75, 25, '[{\"id\":61,\"app_id\":36,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":58,\"app_id\":37,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":60,\"app_id\":38,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Sound Recorder\",\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":59,\"app_id\":39,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":57,\"app_id\":40,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":67,\"app_id\":41,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":64,\"app_id\":42,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":65,\"app_id\":43,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":62,\"app_id\":44,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Cell Broadcasts\",\"uniqueName\":\"com.android.cellbroadcastreceiverCell Broadcasts\",\"icon\":\"icon_Cell Broadcasts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.cellbroadcastreceiver\"},{\"id\":70,\"app_id\":45,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.android.fmradioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.fmradio\"},{\"id\":69,\"app_id\":46,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Search\",\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":71,\"app_id\":47,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":73,\"app_id\":48,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"System software updates\",\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":77,\"app_id\":49,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Launcher Changer\",\"uniqueName\":\"com.launcher.changeLauncher Changer\",\"icon\":\"icon_Launcher Changer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.launcher.change\"},{\"id\":74,\"app_id\":50,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":75,\"app_id\":51,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.vortexlocker.app\"},{\"id\":72,\"app_id\":52,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":66,\"app_id\":53,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":63,\"app_id\":54,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":68,\"app_id\":55,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":76,\"app_id\":56,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":78,\"app_id\":78,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"VPN 2017\",\"uniqueName\":\"com.wxy.vpn2017VPN 2017\",\"icon\":\"icon_VPN 2017.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.wxy.vpn2017\"},{\"id\":79,\"app_id\":2861,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SecureMenu\",\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"icon\":\"Settings.png\",\"extension\":1,\"extension_id\":0,\"packageName\":\"com.secureSetting.SecureSettingsMainSecure Settings\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{}', '[]', NULL, NULL, 'history', 0, '2019-04-20 13:20:29', NULL);
INSERT INTO `device_history` VALUES (93, 44, '[{\"id\":536,\"app_id\":4649,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Music\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.musicMusic\",\"icon\":\"icon_Music.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.music\"},{\"id\":551,\"app_id\":4650,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Secure Settings\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"icon\":\"icon_Secure Settings.png\",\"extension\":1,\"extension_id\":0,\"packageName\":\"com.secureSetting.SecureSettingsMain\"},{\"id\":530,\"app_id\":4651,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Browser\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.browser\"},{\"id\":537,\"app_id\":4652,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Calendar\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calendar\"},{\"id\":529,\"app_id\":4653,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Contacts\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.contacts\"},{\"id\":533,\"app_id\":4654,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.deskclock\"},{\"id\":534,\"app_id\":4655,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Phone\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.dialer\"},{\"id\":531,\"app_id\":4656,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Email\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.email\"},{\"id\":532,\"app_id\":4657,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Gallery\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.gallery3d\"},{\"id\":540,\"app_id\":4658,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Messaging\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.mms\"},{\"id\":535,\"app_id\":4659,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"default_app\":0,\"visible\":0,\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":544,\"app_id\":4660,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Sound Recorder\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.soundrecorderSound Recorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.soundrecorder\"},{\"id\":539,\"app_id\":4661,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Camera\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.mediatek.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.camera\"},{\"id\":542,\"app_id\":4662,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Calculator\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.calculator2\"},{\"id\":538,\"app_id\":4663,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Search\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.quicksearchboxSearch\",\"icon\":\"icon_Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.quicksearchbox\"},{\"id\":543,\"app_id\":4664,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"SIM Toolkit\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.stk\"},{\"id\":546,\"app_id\":4665,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"System software updates\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.mediatek.systemupdateSystem software updates\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.mediatek.systemupdate\"},{\"id\":548,\"app_id\":4666,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"UEM Client\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":550,\"app_id\":4667,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Titan Locker\",\"default_app\":1,\"visible\":1,\"uniqueName\":\"com.titanlocker.secureTitan Locker\",\"icon\":\"icon_Titan Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.titanlocker.secure\"},{\"id\":541,\"app_id\":9684,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Secure VPN\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.secure.vpnSecure VPN\",\"icon\":\"icon_Secure VPN.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.secure.vpn\"},{\"id\":547,\"app_id\":10116,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Mail\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"ca.unlimitedwireless.mailpgpMail\",\"icon\":\"icon_Mail.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"ca.unlimitedwireless.mailpgp\"},{\"id\":549,\"app_id\":10118,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Emergency Wipe\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.srz.unlimited.wiperEmergency Wipe\",\"icon\":\"icon_Emergency Wipe.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.srz.unlimited.wiper\"},{\"id\":545,\"app_id\":10121,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Encrypted Notes\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"ca.unlimitedwireless.encryptednotesEncrypted Notes\",\"icon\":\"icon_Encrypted Notes.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"ca.unlimitedwireless.encryptednotes\"},{\"id\":552,\"app_id\":10123,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Titan Secure\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.titansecure.titan1Titan Secure\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.titansecure.titan1\"},{\"id\":587,\"app_id\":12692,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Signal\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"org.thoughtcrime.securesmsSignal\",\"icon\":\"icon_Signal.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"org.thoughtcrime.securesms\"},{\"id\":588,\"app_id\":12852,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"WhatsApp\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.whatsapp\"},{\"id\":620,\"app_id\":13122,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Engineer Mode 12\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.zonarmr.mtkengineermodeMTK Engineer Mode\",\"icon\":\"icon_MTK Engineer Mode.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.zonarmr.mtkengineermodeMTK Engineer Mode\"}]', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":false}', '[{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsBattery\",\"guest\":0,\"label\":\"Battery\",\"icon\":\"icon_Battery.png\",\"encrypted\":1,\"id\":525,\"device_id\":662,\"app_id\":4668,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure Settingswi-fi\",\"guest\":0,\"label\":\"wi-fi\",\"icon\":\"icon_wi-fi.png\",\"encrypted\":1,\"id\":524,\"device_id\":662,\"app_id\":4669,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsBluetooth\",\"guest\":0,\"label\":\"Bluetooth\",\"icon\":\"icon_Bluetooth.png\",\"encrypted\":0,\"id\":520,\"device_id\":662,\"app_id\":4670,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards\",\"guest\":0,\"label\":\"SIM Cards\",\"icon\":\"icon_SIM Cards.png\",\"encrypted\":1,\"id\":518,\"device_id\":662,\"app_id\":4671,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsData Roaming\",\"guest\":0,\"label\":\"Data Roaming\",\"icon\":\"icon_Data Roaming.png\",\"encrypted\":1,\"id\":519,\"device_id\":662,\"app_id\":4672,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsMobile Data\",\"guest\":0,\"label\":\"Mobile Data\",\"icon\":\"icon_Mobile Data.png\",\"encrypted\":1,\"id\":526,\"device_id\":662,\"app_id\":4673,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsHotspot\",\"guest\":0,\"label\":\"Hotspot\",\"icon\":\"icon_Hotspot.png\",\"encrypted\":0,\"id\":521,\"device_id\":662,\"app_id\":4674,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock\",\"guest\":0,\"label\":\"Finger Print + Lock\",\"icon\":\"icon_Finger Print + Lock.png\",\"encrypted\":1,\"id\":522,\"device_id\":662,\"app_id\":4675,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsBrightness\",\"guest\":0,\"label\":\"Brightness\",\"icon\":\"icon_Brightness.png\",\"encrypted\":1,\"id\":517,\"device_id\":662,\"app_id\":4676,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsSleep\",\"guest\":0,\"label\":\"Sleep\",\"icon\":\"icon_Sleep.png\",\"encrypted\":1,\"id\":527,\"device_id\":662,\"app_id\":4677,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsSound\",\"guest\":0,\"label\":\"Sound\",\"icon\":\"icon_Sound.png\",\"encrypted\":1,\"id\":528,\"device_id\":662,\"app_id\":4678,\"default_app\":0},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"uniqueExtension\":\"com.secureSetting.SecureSettingsMainSecure SettingsDate & Time\",\"guest\":0,\"label\":\"Date & Time\",\"icon\":\"icon_Date & Time.png\",\"encrypted\":1,\"id\":523,\"device_id\":662,\"app_id\":4679,\"default_app\":0}]', NULL, NULL, 'history', 0, '2019-05-02 11:47:11', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 694 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (636, 'OCSP875142', 'BCP100', NULL, 'null', '192.168.1.107', 'null', '496953409506566', 'null', '014705682480304', '0123456789ABCDEF', '00:A0:4D:9F:BD:D0', NULL, 'On', 1, '', NULL, 0, '2019-04-10 09:47:46', '2019-04-19 21:56:19');
INSERT INTO `devices` VALUES (637, 'VSGV427807', 'BCP100', NULL, 'null', '192.168.0.128', NULL, '354444076296294', NULL, '354444076296302', 'VSP1001901S00329', '00:27:15:2C:ED:27', NULL, 'On', 0, '', NULL, 1, '2019-04-10 21:07:15', '2019-04-10 21:23:10');
INSERT INTO `devices` VALUES (638, 'UHLZ092101', 'BCP', NULL, 'undefined', '192.168.0.156', 'null', '354444076292574', 'null', '354444076292582', 'VSP1001901S00143', '00:27:15:B5:5B:12', NULL, 'off', 1, '', NULL, 0, '2019-04-10 21:12:15', '2019-04-10 22:05:59');
INSERT INTO `devices` VALUES (640, 'NEEQ709111', 'hamza', NULL, 'asdas', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-12 11:53:12', NULL);
INSERT INTO `devices` VALUES (645, 'EFSQ525740', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:50:17', NULL);
INSERT INTO `devices` VALUES (646, 'YKXC068779', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:50:17', NULL);
INSERT INTO `devices` VALUES (647, 'MBLA726004', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:50:18', NULL);
INSERT INTO `devices` VALUES (648, 'JUXJ589924', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:50:18', NULL);
INSERT INTO `devices` VALUES (649, 'EOAM062623', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:52:12', NULL);
INSERT INTO `devices` VALUES (650, 'CMUE170194', 'N/A', NULL, 'N/A', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-22 12:52:12', '2019-04-23 04:59:34');
INSERT INTO `devices` VALUES (651, 'RJHM431602', 'Alfred E. Neuman', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-24 17:31:20', NULL);
INSERT INTO `devices` VALUES (652, 'YEBI610571', 'zaid', NULL, 'undefined', '192.168.0.147', 'null', '354444076293812', 'null', '354444076293820', 'VSP1001901S00205', '00:27:15:1A:85:31', NULL, 'off', 0, '', NULL, 0, '2019-04-25 02:26:15', '2019-04-25 02:34:42');
INSERT INTO `devices` VALUES (653, 'RYHA705659', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-26 11:01:11', NULL);
INSERT INTO `devices` VALUES (654, 'LPVV312681', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-26 11:01:11', NULL);
INSERT INTO `devices` VALUES (655, 'WUDV285228', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-26 11:01:12', NULL);
INSERT INTO `devices` VALUES (656, 'JVFJ270038', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-26 11:01:12', NULL);
INSERT INTO `devices` VALUES (657, 'MHKC883156', 'sebas', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-27 05:36:58', NULL);
INSERT INTO `devices` VALUES (658, 'HNFI517627', 'test1', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-27 23:25:18', NULL);
INSERT INTO `devices` VALUES (659, 'NZNH883530', '1641', NULL, 'null', '192.168.0.180', NULL, '354444076297771', NULL, '354444076297789', 'VSP1001901S00403', '00:27:15:32:4D:B7', NULL, 'off', 0, '', NULL, 0, '2019-04-28 01:08:04', '2019-04-28 02:39:44');
INSERT INTO `devices` VALUES (660, 'PDJS422924', 'test1', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-28 19:38:15', NULL);
INSERT INTO `devices` VALUES (661, NULL, 'Adeel', NULL, 'undefined', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-29 13:01:11', NULL);
INSERT INTO `devices` VALUES (662, 'CABC611976', 'titanlyon', NULL, 'undefined', '192.168.1.108', 'null', '354444076297037', 'null', '354444076297045', 'VSP1001901S00366', '00:27:15:F1:03:DD', NULL, 'off', 1, '', NULL, 0, '2019-04-29 16:12:20', '2019-04-30 19:49:46');
INSERT INTO `devices` VALUES (663, 'FBED031936', 'zaid', '_aty6K7Jg05OexWCAAPm', 'undefined', '26.67.230.34', '8901260852293381554', '356338090435516', 'null', 'null', 'R28K52MSDSM', '48:C7:96:41:74:19', NULL, 'On', 1, '', NULL, 0, '2019-04-29 16:35:26', '2019-04-30 08:14:53');
INSERT INTO `devices` VALUES (675, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-30 13:38:00', NULL);
INSERT INTO `devices` VALUES (676, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-04-30 13:38:00', NULL);
INSERT INTO `devices` VALUES (684, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:43', NULL);
INSERT INTO `devices` VALUES (685, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:43', NULL);
INSERT INTO `devices` VALUES (686, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:43', NULL);
INSERT INTO `devices` VALUES (687, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:43', NULL);
INSERT INTO `devices` VALUES (688, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:44', NULL);
INSERT INTO `devices` VALUES (689, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:44', NULL);
INSERT INTO `devices` VALUES (690, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 'off', 0, '', NULL, 0, '2019-05-01 05:35:44', NULL);
INSERT INTO `devices` VALUES (691, 'DDAF250244', NULL, NULL, NULL, '192.168.1.130', 'null', '354444076298332', 'null', '354444076298340', 'VSP1001901S00431', '00:27:15:2E:8E:BD', NULL, 'off', 1, '', NULL, 0, '2019-05-01 05:35:44', '2019-05-03 16:27:29');
INSERT INTO `devices` VALUES (693, 'AECE977918', NULL, NULL, NULL, '192.168.0.101', '8992042306182528852f', '354444076293150', '8992042306182528811f', '354444076293168', 'VSP1001901S00172', '00:27:15:3D:FF:C8', NULL, 'off', 1, '', NULL, 0, '2019-05-01 05:35:44', '2019-05-01 17:21:16');

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
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of imei_history
-- ----------------------------
INSERT INTO `imei_history` VALUES (1, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '354444076293168', '354444076293150', '354444076293168', '354444076293150', '2019-04-23 16:26:33', '2019-04-23 17:31:49');
INSERT INTO `imei_history` VALUES (2, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293167', '354444076293145', '2019-04-23 16:26:33', '2019-04-23 17:43:17');
INSERT INTO `imei_history` VALUES (3, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293150', '354444076293178', '2019-04-23 16:26:33', '2019-04-23 17:43:20');
INSERT INTO `imei_history` VALUES (4, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293170', '354444076293115', '2019-04-23 16:26:33', '2019-04-23 17:43:27');
INSERT INTO `imei_history` VALUES (5, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293171', '354444076293123', '2019-04-23 16:26:33', '2019-04-23 17:43:32');
INSERT INTO `imei_history` VALUES (6, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293172', '354444076293149', '2019-04-23 16:26:33', '2019-04-23 17:43:36');
INSERT INTO `imei_history` VALUES (7, 'YISC356974', 'VSP1001901S00172', '00:27:15:3D:FF:C8', '', '', '354444076293176', '354444076293175', '2019-04-23 16:26:33', '2019-04-23 17:43:41');

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
) ENGINE = MyISAM AUTO_INCREMENT = 105 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `login_history` VALUES (103, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1Njc3NTI0NiwiZXhwIjoxNTU2ODYxNjQ2fQ.6Ha9td9_UcLY7DcngZ3BtC_16qWMkXUkPXP09N6NW9g', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-02 10:34:06', NULL);
INSERT INTO `login_history` VALUES (104, NULL, '154', NULL, 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyIjp7ImlkIjoxNTQsImRlYWxlcl9pZCI6MTU0LCJlbWFpbCI6ImFkbWluQGdtYWlsLmNvbSIsImxhc3ROYW1lIjoiS2FzaHlhcCIsIm5hbWUiOiJhZG1pbiIsImZpcnN0TmFtZSI6Ik5laGEiLCJkZWFsZXJfbmFtZSI6ImFkbWluIiwiZGVhbGVyX2VtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwibGlua19jb2RlIjoiIiwiY29ubmVjdGVkX2RlYWxlciI6MCwiY29ubmVjdGVkX2RldmljZXMiOlt7InRvdGFsIjoiMCJ9XSwiYWNjb3VudF9zdGF0dXMiOm51bGwsInVzZXJfdHlwZSI6ImFkbWluIiwiY3JlYXRlZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJtb2RpZmllZCI6IjIwMTktMDItMDggMDk6NTA6MDQiLCJpcF9hZGRyZXNzIjoiOjoxIn0sImlhdCI6MTU1Njg2MjI2NiwiZXhwIjoxNTU2OTQ4NjY2fQ.xujZ_fNv4m2Bz2YMEdSXDUFiMGwlBRRqdSmUJd7EihA', '86400s', '::1', NULL, 'admin', 'token', 1, '2019-05-03 10:44:26', NULL);

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
INSERT INTO `pgp_emails` VALUES (126, 22, '599NGT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-10 09:47:46');
INSERT INTO `pgp_emails` VALUES (127, NULL, '349VFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-18 06:33:05');
INSERT INTO `pgp_emails` VALUES (128, NULL, '791BFT@TITANSECURE.BIZ', 1, '2019-04-08 10:58:08', '2019-04-22 11:56:31');
INSERT INTO `pgp_emails` VALUES (129, NULL, '1619DKV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:16');
INSERT INTO `pgp_emails` VALUES (130, 31, '5438DNE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:17');
INSERT INTO `pgp_emails` VALUES (131, NULL, '2675DKN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-19 05:37:55');
INSERT INTO `pgp_emails` VALUES (132, 32, '3754ZUB@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:17');
INSERT INTO `pgp_emails` VALUES (133, 33, '4338GQG@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:18');
INSERT INTO `pgp_emails` VALUES (134, 34, '3669NBQ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:50:18');
INSERT INTO `pgp_emails` VALUES (135, 35, '5147DXT@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:52:12');
INSERT INTO `pgp_emails` VALUES (136, 36, '8244SRE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-22 12:52:12');
INSERT INTO `pgp_emails` VALUES (137, 37, '5412JJN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:08', '2019-04-24 17:31:20');
INSERT INTO `pgp_emails` VALUES (138, NULL, '4134PTE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 02:51:07');
INSERT INTO `pgp_emails` VALUES (139, 35, '2954PAJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:11');
INSERT INTO `pgp_emails` VALUES (140, 36, '6845YAY@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:11');
INSERT INTO `pgp_emails` VALUES (141, 38, '7992PFY@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-25 02:26:15');
INSERT INTO `pgp_emails` VALUES (142, 37, '4967GCM@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:12');
INSERT INTO `pgp_emails` VALUES (143, NULL, '5373SAJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-22 12:36:40');
INSERT INTO `pgp_emails` VALUES (144, 38, '1233NPX@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-26 11:01:12');
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
INSERT INTO `pgp_emails` VALUES (156, 25, '9498NBS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-10 23:35:14');
INSERT INTO `pgp_emails` VALUES (157, 66, '3789NZU@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (158, 67, '9643NZE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (159, NULL, '9347SKJ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (160, NULL, '8837ZRE@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (161, NULL, '7245BCB@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (162, NULL, '9279GBS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (163, NULL, '1747BBV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (164, NULL, '4288DXZ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (165, NULL, '2474VJS@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-04-30 13:38:00');
INSERT INTO `pgp_emails` VALUES (166, 68, '1976JSN@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:43');
INSERT INTO `pgp_emails` VALUES (167, 69, '1879TWV@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (168, 70, '2458VZC@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (169, 71, '1842WKX@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (170, 72, '5225CHG@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (171, 73, '4337VZF@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (172, NULL, '5734TXZ@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
INSERT INTO `pgp_emails` VALUES (173, 75, '4763XEK@ARMORSEC.XYZ', 1, '2019-04-08 10:58:09', '2019-05-01 05:35:44');
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
INSERT INTO `pgp_emails` VALUES (185, NULL, 'test3@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-05-01 04:52:57');
INSERT INTO `pgp_emails` VALUES (186, 44, 'test6@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-29 16:12:20');
INSERT INTO `pgp_emails` VALUES (187, 41, 'test5@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-28 01:11:33');
INSERT INTO `pgp_emails` VALUES (188, 45, 'test9@titansecure.biz', 1, '2019-04-27 23:19:20', '2019-04-29 16:35:26');
INSERT INTO `pgp_emails` VALUES (189, NULL, 'test7@titansecure.biz', 0, '2019-04-27 23:19:20', NULL);
INSERT INTO `pgp_emails` VALUES (190, NULL, 'test8@titansecure.biz', 0, '2019-04-27 23:19:20', NULL);
INSERT INTO `pgp_emails` VALUES (191, NULL, 'test4@titansecure.biz', 0, '2019-04-27 23:19:20', NULL);
INSERT INTO `pgp_emails` VALUES (192, NULL, 'test1@titansecure.biz', 0, '2019-04-27 23:19:20', '2019-04-29 06:19:43');
INSERT INTO `pgp_emails` VALUES (193, NULL, 'test2@titansecure.biz', 0, '2019-04-27 23:19:20', NULL);

-- ----------------------------
-- Table structure for policy
-- ----------------------------
DROP TABLE IF EXISTS `policy`;
CREATE TABLE `policy`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `policy_name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `policy_note` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT NULL,
  `command_name` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `permissions` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `push_apps` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `dealers` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `delete_status` tinyint(4) NOT NULL DEFAULT 0,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of policy
-- ----------------------------
INSERT INTO `policy` VALUES (2, 'my policy', 'hello policy', 154, '#my_policy', '[{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Secure Settings\",\"subExtension\":[{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Battery\",\"icon\":\"icon_Battery.png\",\"id\":4668,\"app_id\":4668,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"wi-fi\",\"icon\":\"icon_wi-fi.png\",\"id\":4669,\"app_id\":4669,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Bluetooth\",\"icon\":\"icon_Bluetooth.png\",\"id\":4670,\"app_id\":4670,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"SIM Cards\",\"icon\":\"icon_SIM Cards.png\",\"id\":4671,\"app_id\":4671,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Data Roaming\",\"icon\":\"icon_Data Roaming.png\",\"id\":4672,\"app_id\":4672,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Mobile Data\",\"icon\":\"icon_Mobile Data.png\",\"id\":4673,\"app_id\":4673,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Hotspot\",\"icon\":\"icon_Hotspot.png\",\"id\":4674,\"app_id\":4674,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Finger Print + Lock\",\"icon\":\"icon_Finger Print + Lock.png\",\"id\":4675,\"app_id\":4675,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Brightness\",\"icon\":\"icon_Brightness.png\",\"id\":4676,\"app_id\":4676,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Sleep\",\"icon\":\"icon_Sleep.png\",\"id\":4677,\"app_id\":4677,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Sound\",\"icon\":\"icon_Sound.png\",\"id\":4678,\"app_id\":4678,\"default_app\":0,\"encrypted\":1,\"isChanged\":true},{\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Date & Time\",\"icon\":\"icon_Date & Time.png\",\"id\":4679,\"app_id\":4679,\"default_app\":0,\"encrypted\":1,\"isChanged\":true}]},{\"uniqueName\":\"com.secureClear.SecureClearActivitySecure Clear\",\"label\":\"Secure Clear\",\"subExtension\":[]}]', '[{\"id\":4649,\"unique_name\":\"com.android.musicMusic\",\"label\":\"Music\",\"package_name\":\"com.android.music\",\"icon\":\"icon_Music.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true,\"encrypted\":true,\"enable\":true},{\"id\":4650,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"label\":\"Secure Settings\",\"package_name\":\"com.secureSetting.SecureSettingsMain\",\"icon\":\"icon_Secure Settings.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4651,\"unique_name\":\"com.android.browserBrowser\",\"label\":\"Browser\",\"package_name\":\"com.android.browser\",\"icon\":\"icon_Browser.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4652,\"unique_name\":\"com.android.calendarCalendar\",\"label\":\"Calendar\",\"package_name\":\"com.android.calendar\",\"icon\":\"icon_Calendar.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4653,\"unique_name\":\"com.android.contactsContacts\",\"label\":\"Contacts\",\"package_name\":\"com.android.contacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4654,\"unique_name\":\"com.android.deskclockClock\",\"label\":\"Clock\",\"package_name\":\"com.android.deskclock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4655,\"unique_name\":\"com.android.dialerPhone\",\"label\":\"Phone\",\"package_name\":\"com.android.dialer\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4656,\"unique_name\":\"com.android.emailEmail\",\"label\":\"Email\",\"package_name\":\"com.android.email\",\"icon\":\"icon_Email.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4657,\"unique_name\":\"com.android.gallery3dGallery\",\"label\":\"Gallery\",\"package_name\":\"com.android.gallery3d\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4658,\"unique_name\":\"com.android.mmsMessaging\",\"label\":\"Messaging\",\"package_name\":\"com.android.mms\",\"icon\":\"icon_Messaging.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4659,\"unique_name\":\"com.android.settingsSettings\",\"label\":\"Settings\",\"package_name\":\"com.android.settings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"visible\":0,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4660,\"unique_name\":\"com.android.soundrecorderSound Recorder\",\"label\":\"Sound Recorder\",\"package_name\":\"com.android.soundrecorder\",\"icon\":\"icon_Sound Recorder.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4661,\"unique_name\":\"com.mediatek.cameraCamera\",\"label\":\"Camera\",\"package_name\":\"com.mediatek.camera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4662,\"unique_name\":\"com.android.calculator2Calculator\",\"label\":\"Calculator\",\"package_name\":\"com.android.calculator2\",\"icon\":\"icon_Calculator.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4663,\"unique_name\":\"com.android.quicksearchboxSearch\",\"label\":\"Search\",\"package_name\":\"com.android.quicksearchbox\",\"icon\":\"icon_Search.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4664,\"unique_name\":\"com.android.stkSIM Toolkit\",\"label\":\"SIM Toolkit\",\"package_name\":\"com.android.stk\",\"icon\":\"icon_SIM Toolkit.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4665,\"unique_name\":\"com.mediatek.systemupdateSystem software updates\",\"label\":\"System software updates\",\"package_name\":\"com.mediatek.systemupdate\",\"icon\":\"icon_System software updates.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4666,\"unique_name\":\"com.rim.mobilefusion.clientUEM Client\",\"label\":\"UEM Client\",\"package_name\":\"com.rim.mobilefusion.client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4667,\"unique_name\":\"com.titanlocker.secureTitan Locker\",\"label\":\"Titan Locker\",\"package_name\":\"com.titanlocker.secure\",\"icon\":\"icon_Titan Locker.png\",\"extension\":0,\"visible\":1,\"default_app\":1,\"extension_id\":0,\"created_at\":\"2019-04-22 12:49:21\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4668,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBattery\",\"label\":\"Battery\",\"package_name\":null,\"icon\":\"icon_Battery.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4669,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure Settingswi-fi\",\"label\":\"wi-fi\",\"package_name\":null,\"icon\":\"icon_wi-fi.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4670,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBluetooth\",\"label\":\"Bluetooth\",\"package_name\":null,\"icon\":\"icon_Bluetooth.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4671,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSIM Cards\",\"label\":\"SIM Cards\",\"package_name\":null,\"icon\":\"icon_SIM Cards.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4672,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsData Roaming\",\"label\":\"Data Roaming\",\"package_name\":null,\"icon\":\"icon_Data Roaming.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4673,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsMobile Data\",\"label\":\"Mobile Data\",\"package_name\":null,\"icon\":\"icon_Mobile Data.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4674,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsHotspot\",\"label\":\"Hotspot\",\"package_name\":null,\"icon\":\"icon_Hotspot.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4675,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsFinger Print + Lock\",\"label\":\"Finger Print + Lock\",\"package_name\":null,\"icon\":\"icon_Finger Print + Lock.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4676,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsBrightness\",\"label\":\"Brightness\",\"package_name\":null,\"icon\":\"icon_Brightness.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4677,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSleep\",\"label\":\"Sleep\",\"package_name\":null,\"icon\":\"icon_Sleep.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4678,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsSound\",\"label\":\"Sound\",\"package_name\":null,\"icon\":\"icon_Sound.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":4679,\"unique_name\":\"com.secureSetting.SecureSettingsMainSecure SettingsDate & Time\",\"label\":\"Date & Time\",\"package_name\":null,\"icon\":\"icon_Date & Time.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":4650,\"created_at\":\"2019-04-22 12:49:22\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":9684,\"unique_name\":\"com.secure.vpnSecure VPN\",\"label\":\"Secure VPN\",\"package_name\":\"com.secure.vpn\",\"icon\":\"icon_Secure VPN.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-26 02:51:19\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":9686,\"unique_name\":\"com.vortexlocker.appScreen Locker\",\"label\":\"Screen Locker\",\"package_name\":\"com.vortexlocker.app\",\"icon\":\"icon_Screen Locker.png\",\"extension\":0,\"visible\":1,\"default_app\":1,\"extension_id\":0,\"created_at\":\"2019-04-26 02:51:19\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":10116,\"unique_name\":\"ca.unlimitedwireless.mailpgpMail\",\"label\":\"Mail\",\"package_name\":\"ca.unlimitedwireless.mailpgp\",\"icon\":\"icon_Mail.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":10118,\"unique_name\":\"com.srz.unlimited.wiperEmergency Wipe\",\"label\":\"Emergency Wipe\",\"package_name\":\"com.srz.unlimited.wiper\",\"icon\":\"icon_Emergency Wipe.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":10121,\"unique_name\":\"ca.unlimitedwireless.encryptednotesEncrypted Notes\",\"label\":\"Encrypted Notes\",\"package_name\":\"ca.unlimitedwireless.encryptednotes\",\"icon\":\"icon_Encrypted Notes.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":10123,\"unique_name\":\"com.titansecure.titan1Titan Secure\",\"label\":\"Titan Secure\",\"package_name\":\"com.titansecure.titan1\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-28 01:12:00\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12544,\"unique_name\":\"com.sec.android.app.clockpackageClock\",\"label\":\"Clock\",\"package_name\":\"com.sec.android.app.clockpackage\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12545,\"unique_name\":\"com.sec.android.gallery3dGallery\",\"label\":\"Gallery\",\"package_name\":\"com.sec.android.gallery3d\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12547,\"unique_name\":\"com.samsung.android.contactsContacts\",\"label\":\"Contacts\",\"package_name\":\"com.samsung.android.contacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12548,\"unique_name\":\"com.samsung.android.contactsPhone\",\"label\":\"Phone\",\"package_name\":\"com.samsung.android.contacts\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12549,\"unique_name\":\"com.samsung.android.messagingMessages\",\"label\":\"Messages\",\"package_name\":\"com.samsung.android.messaging\",\"icon\":\"icon_Messages.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12550,\"unique_name\":\"com.sec.android.app.cameraCamera\",\"label\":\"Camera\",\"package_name\":\"com.sec.android.app.camera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12551,\"unique_name\":\"com.google.android.googlequicksearchboxVoice Search\",\"label\":\"Voice Search\",\"package_name\":\"com.google.android.googlequicksearchbox\",\"icon\":\"icon_Voice Search.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12552,\"unique_name\":\"com.google.android.googlequicksearchboxGoogle\",\"label\":\"Google\",\"package_name\":\"com.google.android.googlequicksearchbox\",\"icon\":\"icon_Google.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12553,\"unique_name\":\"com.samsung.attvvmVisual Voicemail\",\"label\":\"Visual Voicemail\",\"package_name\":\"com.samsung.attvvm\",\"icon\":\"icon_Visual Voicemail.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12554,\"unique_name\":\"com.sec.android.app.myfilesMy Files\",\"label\":\"My Files\",\"package_name\":\"com.sec.android.app.myfiles\",\"icon\":\"icon_My Files.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12555,\"unique_name\":\"com.synchronoss.dcs.att.r2gSetup & Transfer\",\"label\":\"Setup & Transfer\",\"package_name\":\"com.synchronoss.dcs.att.r2g\",\"icon\":\"icon_Setup & Transfer.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12558,\"unique_name\":\"com.codeproof.device.securityCodeproof® MDM\",\"label\":\"Codeproof® MDM\",\"package_name\":\"com.codeproof.device.security\",\"icon\":\"icon_Codeproof® MDM.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12562,\"unique_name\":\"com.titansecure.bizTitan Secure\",\"label\":\"Titan Secure\",\"package_name\":\"com.titansecure.biz\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 16:38:43\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12692,\"unique_name\":\"org.thoughtcrime.securesmsSignal\",\"label\":\"Signal\",\"package_name\":\"org.thoughtcrime.securesms\",\"icon\":\"icon_Signal.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 20:35:59\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":12852,\"unique_name\":\"com.whatsappWhatsApp\",\"label\":\"WhatsApp\",\"package_name\":\"com.whatsapp\",\"icon\":\"icon_WhatsApp.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-29 20:56:49\",\"updated_at\":null,\"isChanged\":true,\"guest\":true},{\"id\":13122,\"unique_name\":\"com.zonarmr.mtkengineermodeMTK Engineer Mode\",\"label\":\"Engineer Mode 12\",\"package_name\":\"com.zonarmr.mtkengineermode\",\"icon\":\"icon_MTK Engineer Mode.png\",\"extension\":0,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-04-30 08:56:25\",\"updated_at\":\"2019-05-01 13:26:23\",\"isChanged\":true,\"guest\":true},{\"id\":15628,\"unique_name\":\"com.secureClear.SecureClearActivitySecure Clear\",\"label\":\"Secure Clear\",\"package_name\":\"com.secureClear.SecureClearActivity\",\"icon\":\"icon_Secure Clear.png\",\"extension\":1,\"visible\":1,\"default_app\":0,\"extension_id\":0,\"created_at\":\"2019-05-01 13:51:31\",\"updated_at\":null,\"isChanged\":true,\"guest\":true}]', '[{\"apk_id\":41,\"apk_name\":\"test\",\"logo\":\"logo-1556025836499.jpg\",\"apk\":\"apk-1556100855479.apk\",\"package_name\":\"com.titanlocker.secure\",\"guest\":true,\"encrypted\":true,\"enable\":false,\"apk_status\":\"Off\",\"deleteable\":false,\"isChanged\":true}]', '{\"wifi_status\":true,\"bluetooth_status\":true,\"screenshot_status\":true,\"location_status\":false,\"hotspot_status\":false}', NULL, 0, NULL, '2019-05-03 09:48:13', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
INSERT INTO `sim_ids` VALUES (9, 31, '11', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:17');
INSERT INTO `sim_ids` VALUES (10, 32, '7', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:17');
INSERT INTO `sim_ids` VALUES (11, 33, '3', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:18');
INSERT INTO `sim_ids` VALUES (12, 34, '12', 1, '26-3-2019', '26-4-2019', '2019-04-22 17:34:31', '2019-04-22 12:50:18');

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
) ENGINE = MyISAM AUTO_INCREMENT = 2768 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_app_permissions
-- ----------------------------
INSERT INTO `user_app_permissions` VALUES (2679, 'CABC611976', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":false}', '2019-04-30 15:46:06', NULL);
INSERT INTO `user_app_permissions` VALUES (2403, 'NZNH883530', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-28 02:38:21', NULL);
INSERT INTO `user_app_permissions` VALUES (2434, 'DEQM506647', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-30 07:58:06', NULL);
INSERT INTO `user_app_permissions` VALUES (2767, 'DDAF250244', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-05-03 16:11:20', NULL);
INSERT INTO `user_app_permissions` VALUES (2413, 'FBED031936', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-04-29 17:04:14', '2019-05-01 05:33:40');
INSERT INTO `user_app_permissions` VALUES (2737, 'AECE977918', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-05-01 17:21:01', NULL);
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
) ENGINE = InnoDB AUTO_INCREMENT = 2101 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (397, 643, 4649, 1, 1, 1, 0, '2019-04-22 12:49:22', '2019-05-01 13:59:22');
INSERT INTO `user_apps` VALUES (398, 643, 4650, 1, 0, 0, 0, '2019-04-22 12:49:22', '2019-05-01 13:59:04');
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
INSERT INTO `user_apps` VALUES (517, 662, 4676, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (518, 662, 4671, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (519, 662, 4672, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (520, 662, 4670, 0, 0, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (521, 662, 4674, 0, 0, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (522, 662, 4675, 0, 1, 1, 0, '2019-04-29 16:19:51', '2019-04-30 04:57:59');
INSERT INTO `user_apps` VALUES (523, 662, 4679, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (524, 662, 4669, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (525, 662, 4668, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (526, 662, 4673, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (527, 662, 4677, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (528, 662, 4678, 0, 1, 1, 0, '2019-04-29 16:19:51', NULL);
INSERT INTO `user_apps` VALUES (529, 662, 4653, 1, 0, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (530, 662, 4651, 1, 1, 1, 0, '2019-04-29 16:19:52', '2019-04-29 20:59:52');
INSERT INTO `user_apps` VALUES (531, 662, 4656, 1, 0, 0, 0, '2019-04-29 16:19:52', '2019-04-29 20:35:59');
INSERT INTO `user_apps` VALUES (532, 662, 4657, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-04-29 20:35:59');
INSERT INTO `user_apps` VALUES (533, 662, 4654, 1, 0, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (534, 662, 4655, 1, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (535, 662, 4659, 0, 1, 1, 0, '2019-04-29 16:19:52', '2019-04-29 20:35:59');
INSERT INTO `user_apps` VALUES (536, 662, 4649, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (537, 662, 4652, 1, 0, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (538, 662, 4663, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (539, 662, 4661, 1, 0, 1, 0, '2019-04-29 16:19:52', '2019-04-29 20:35:59');
INSERT INTO `user_apps` VALUES (540, 662, 4658, 1, 0, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (541, 662, 9684, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (542, 662, 4662, 1, 0, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (543, 662, 4664, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (544, 662, 4660, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (545, 662, 10121, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (546, 662, 4665, 1, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (547, 662, 10116, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (548, 662, 4666, 0, 0, 0, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (549, 662, 10118, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (550, 662, 4667, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (551, 662, 4650, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
INSERT INTO `user_apps` VALUES (552, 662, 10123, 0, 1, 1, 0, '2019-04-29 16:19:52', NULL);
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
INSERT INTO `user_apps` VALUES (588, 662, 12852, 0, 1, 1, 0, '2019-04-29 20:56:49', '2019-04-30 04:37:17');
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
INSERT INTO `user_apps` VALUES (1142, 693, 4649, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1143, 693, 4653, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1144, 693, 4654, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1145, 693, 4656, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1146, 693, 4652, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1147, 693, 4655, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1148, 693, 4658, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1149, 693, 4651, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1150, 693, 4660, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1151, 693, 4661, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1152, 693, 4657, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1153, 693, 9686, 0, 1, 1, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1154, 693, 4663, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1155, 693, 4664, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1156, 693, 4662, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1157, 693, 4665, 1, 0, 0, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1158, 693, 4650, 1, 1, 1, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1159, 693, 4666, 0, 1, 1, 0, '2019-05-01 05:37:08', NULL);
INSERT INTO `user_apps` VALUES (1196, 692, 4652, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1197, 692, 4651, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1198, 692, 4659, 0, 0, 0, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1199, 692, 4654, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1200, 692, 4653, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1201, 692, 4655, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1202, 692, 4656, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1203, 692, 4649, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1204, 692, 4661, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1205, 692, 4660, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1206, 692, 4657, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1207, 692, 4658, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1208, 692, 4663, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1209, 692, 4666, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1210, 692, 4662, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1211, 692, 4665, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1212, 692, 4664, 1, 1, 1, 0, '2019-05-01 14:08:35', NULL);
INSERT INTO `user_apps` VALUES (1216, 692, 4668, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1217, 692, 4675, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1218, 692, 4669, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1219, 692, 4670, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1220, 692, 4671, 1, 1, 1, 0, '2019-05-01 14:08:36', NULL);
INSERT INTO `user_apps` VALUES (1221, 692, 4672, 1, 1, 1, 0, '2019-05-01 14:08:36', NULL);
INSERT INTO `user_apps` VALUES (1222, 692, 4674, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1223, 692, 4673, 1, 1, 1, 0, '2019-05-01 14:08:36', NULL);
INSERT INTO `user_apps` VALUES (1224, 692, 4677, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1225, 692, 4676, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1226, 692, 4678, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1227, 692, 4679, 0, 0, 1, 0, '2019-05-01 14:08:36', '2019-05-01 14:13:40');
INSERT INTO `user_apps` VALUES (1241, 692, 15628, 1, 1, 1, 0, '2019-05-01 14:09:54', NULL);
INSERT INTO `user_apps` VALUES (1244, 692, 9686, 1, 1, 1, 0, '2019-05-01 14:09:54', NULL);
INSERT INTO `user_apps` VALUES (1245, 692, 4650, 1, 1, 1, 0, '2019-05-01 14:09:54', NULL);
INSERT INTO `user_apps` VALUES (1348, 644, 4670, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1349, 644, 4669, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1350, 644, 4676, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1351, 644, 4679, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1352, 644, 4678, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1353, 644, 4673, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1354, 644, 4671, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1355, 644, 4672, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1356, 644, 4674, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1357, 644, 4677, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1358, 644, 4675, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1359, 644, 4668, 1, 1, 1, 0, '2019-05-01 14:27:38', '2019-05-01 14:35:49');
INSERT INTO `user_apps` VALUES (1360, 644, 4651, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1361, 644, 4652, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1362, 644, 4659, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1363, 644, 4653, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1364, 644, 4654, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1365, 644, 4655, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1366, 644, 4656, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1367, 644, 4657, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1368, 644, 4658, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1369, 644, 4649, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1370, 644, 4661, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1371, 644, 4660, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1372, 644, 15628, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1373, 644, 4666, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1374, 644, 4665, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1375, 644, 9686, 0, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1376, 644, 4650, 1, 1, 1, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1377, 644, 4662, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1378, 644, 4663, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1379, 644, 4664, 0, 0, 0, 0, '2019-05-01 14:27:38', NULL);
INSERT INTO `user_apps` VALUES (1648, 641, 4671, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:10');
INSERT INTO `user_apps` VALUES (1649, 641, 4669, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-01 14:59:01');
INSERT INTO `user_apps` VALUES (1650, 641, 4670, 0, 0, 1, 0, '2019-05-01 14:58:31', NULL);
INSERT INTO `user_apps` VALUES (1651, 641, 4678, 0, 0, 1, 0, '2019-05-01 14:58:31', NULL);
INSERT INTO `user_apps` VALUES (1652, 641, 4679, 0, 0, 1, 0, '2019-05-01 14:58:31', NULL);
INSERT INTO `user_apps` VALUES (1653, 641, 4676, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:10');
INSERT INTO `user_apps` VALUES (1654, 641, 4673, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:10');
INSERT INTO `user_apps` VALUES (1655, 641, 4675, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1656, 641, 4677, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:10');
INSERT INTO `user_apps` VALUES (1657, 641, 4668, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:10');
INSERT INTO `user_apps` VALUES (1658, 641, 4672, 1, 1, 1, 0, '2019-05-01 14:58:31', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1659, 641, 4674, 0, 0, 1, 0, '2019-05-01 14:58:31', NULL);
INSERT INTO `user_apps` VALUES (1660, 641, 4659, 0, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1661, 641, 4649, 0, 0, 0, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1662, 641, 4655, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:45:57');
INSERT INTO `user_apps` VALUES (1663, 641, 4653, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1664, 641, 4654, 0, 0, 0, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1665, 641, 4657, 0, 0, 0, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1666, 641, 4656, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1667, 641, 4658, 0, 0, 0, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1668, 641, 4651, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:45:57');
INSERT INTO `user_apps` VALUES (1669, 641, 4652, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1670, 641, 4660, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1671, 641, 4662, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:45:57');
INSERT INTO `user_apps` VALUES (1672, 641, 4663, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:45:57');
INSERT INTO `user_apps` VALUES (1673, 641, 4661, 0, 0, 0, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1674, 641, 4650, 1, 1, 1, 0, '2019-05-01 14:58:33', '2019-05-03 15:45:57');
INSERT INTO `user_apps` VALUES (1675, 641, 9686, 0, 1, 1, 0, '2019-05-01 14:58:33', NULL);
INSERT INTO `user_apps` VALUES (1676, 641, 15628, 0, 1, 1, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1677, 641, 4666, 0, 1, 1, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1678, 641, 4664, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1679, 641, 4665, 1, 0, 0, 0, '2019-05-01 14:58:33', '2019-05-03 15:06:12');
INSERT INTO `user_apps` VALUES (1750, 693, 15628, 1, 1, 1, 0, '2019-05-01 17:20:53', NULL);
INSERT INTO `user_apps` VALUES (1783, 641, 15659, 0, 1, 1, 0, '2019-05-03 15:06:12', NULL);
INSERT INTO `user_apps` VALUES (1812, 641, 15658, 1, 1, 1, 0, '2019-05-03 15:45:57', NULL);
INSERT INTO `user_apps` VALUES (1829, 691, 4659, 1, 1, 1, 0, '2019-05-03 15:48:06', '2019-05-03 15:58:23');
INSERT INTO `user_apps` VALUES (1830, 691, 4653, 1, 0, 0, 0, '2019-05-03 15:48:06', NULL);
INSERT INTO `user_apps` VALUES (1831, 691, 4652, 1, 0, 0, 0, '2019-05-03 15:48:06', NULL);
INSERT INTO `user_apps` VALUES (1832, 691, 4651, 1, 0, 0, 0, '2019-05-03 15:48:06', NULL);
INSERT INTO `user_apps` VALUES (1833, 691, 4654, 1, 0, 0, 0, '2019-05-03 15:48:06', NULL);
INSERT INTO `user_apps` VALUES (1834, 691, 4649, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1835, 691, 4655, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1836, 691, 4658, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1837, 691, 4657, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1838, 691, 4656, 1, 1, 0, 0, '2019-05-03 15:48:07', '2019-05-03 15:58:23');
INSERT INTO `user_apps` VALUES (1839, 691, 4662, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1840, 691, 4660, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1841, 691, 4664, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1842, 691, 4663, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1843, 691, 4661, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1844, 691, 4665, 1, 0, 0, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1845, 691, 4666, 0, 1, 1, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1846, 691, 15659, 0, 1, 1, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1847, 691, 4650, 1, 1, 1, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1848, 691, 15658, 1, 1, 1, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1849, 691, 15628, 0, 1, 1, 0, '2019-05-03 15:48:07', NULL);
INSERT INTO `user_apps` VALUES (1871, 691, 4670, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1872, 691, 4675, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1873, 691, 4671, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1874, 691, 4672, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1875, 691, 4673, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1876, 691, 4674, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1877, 691, 4669, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1878, 691, 4679, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1879, 691, 4676, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1880, 691, 4678, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1881, 691, 4668, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (1882, 691, 4677, 1, 1, 1, 0, '2019-05-03 15:48:12', NULL);
INSERT INTO `user_apps` VALUES (2030, 691, 4667, 1, 0, 0, 0, '2019-05-03 16:09:58', NULL);

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
) ENGINE = InnoDB AUTO_INCREMENT = 24 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 76 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr_acc
-- ----------------------------
INSERT INTO `usr_acc` VALUES (22, 636, NULL, NULL, 'hhh@hhh.com', 222, 0, '433523', 'null', '', 6, '', '4247339', '', 0, 0, 'wipe', '', 0, 0, NULL, NULL, 1, 0, NULL, NULL, '2019-04-10 09:47:46', '2019-04-25 17:23:59');
INSERT INTO `usr_acc` VALUES (23, 637, NULL, NULL, NULL, 224, 0, '417695', NULL, NULL, NULL, NULL, NULL, '', 0, NULL, NULL, '', 0, 0, NULL, NULL, 0, 0, NULL, NULL, '2019-04-10 21:07:15', '2019-04-25 17:23:59');
INSERT INTO `usr_acc` VALUES (24, 638, NULL, NULL, 'zaid@zaid.com', NULL, 0, NULL, 'undefined', '', 6, '', '7802345', '', 0, 0, 'wipe', '', 1, 0, NULL, NULL, 0, 0, NULL, NULL, '2019-04-10 21:12:15', '2019-04-25 17:23:59');
INSERT INTO `usr_acc` VALUES (25, 639, NULL, NULL, 'zaid@canadaworldapps.com', 224, 0, '417695', 'N/A', '2019/04/16', 6, '2020/04/16', '9170111', 'active', 1, NULL, 'wipe', '', 0, 0, NULL, NULL, 0, 0, NULL, NULL, '2019-04-10 23:35:14', '2019-04-25 17:23:59');
INSERT INTO `usr_acc` VALUES (26, 640, NULL, NULL, 'hamza@gmail.com', 225, 0, NULL, 'adasd', NULL, 3, NULL, '1414300', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, NULL, NULL, '2019-04-12 11:53:12', '2019-04-25 17:23:59');
INSERT INTO `usr_acc` VALUES (31, 645, NULL, NULL, NULL, 227, 0, NULL, NULL, NULL, 1, '2019/05/25', '3808428', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 10, 'testing', '2019-04-25 16:34:06', NULL);
INSERT INTO `usr_acc` VALUES (32, 646, NULL, NULL, NULL, 227, 0, NULL, NULL, NULL, 1, '2019/05/25', '4508733', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 10, 'testing', '2019-04-25 16:34:06', NULL);
INSERT INTO `usr_acc` VALUES (33, 647, NULL, NULL, NULL, 227, 0, NULL, NULL, NULL, 1, '2019/05/25', '6984936', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 10, 'testing', '2019-04-25 16:34:06', NULL);
INSERT INTO `usr_acc` VALUES (34, 648, NULL, NULL, NULL, 227, 0, NULL, NULL, NULL, 1, '2019/05/25', '3948282', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 10, 'testing', '2019-04-25 16:34:06', '2019-04-25 17:24:00');
INSERT INTO `usr_acc` VALUES (35, 653, NULL, NULL, NULL, 222, 0, NULL, NULL, NULL, 1, '2019/05/26', '2348766', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 2, 'for my users', '2019-04-26 11:01:11', NULL);
INSERT INTO `usr_acc` VALUES (36, 654, NULL, NULL, NULL, 222, 0, NULL, NULL, NULL, 1, '2019/05/26', '9149504', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 2, 'for my users', '2019-04-26 11:01:11', NULL);
INSERT INTO `usr_acc` VALUES (37, 655, NULL, NULL, NULL, 222, 0, NULL, NULL, NULL, 1, '2019/05/26', '8992753', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 2, 'for my users', '2019-04-26 11:01:12', NULL);
INSERT INTO `usr_acc` VALUES (38, 656, NULL, NULL, NULL, 222, 0, NULL, NULL, NULL, 1, '2019/05/26', '0651188', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 2, 'for my users', '2019-04-26 11:01:12', NULL);
INSERT INTO `usr_acc` VALUES (39, 657, NULL, NULL, 'ss@gmail.com', 224, 0, NULL, 'undefined', NULL, 12, '2020/04/27', '7585791', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 30, 'fhfhh', '2019-04-27 05:36:58', '2019-04-29 16:33:59');
INSERT INTO `usr_acc` VALUES (40, 658, NULL, NULL, 'test@gmail.com', 229, 0, NULL, '1', NULL, 3, '2019/07/27', '8344795', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 10, 'testing', '2019-04-27 23:25:18', '2019-04-28 19:37:17');
INSERT INTO `usr_acc` VALUES (41, 659, NULL, NULL, '1641uiq@titansecure.biz', NULL, 230, '428146', 'null', '', NULL, '', NULL, '', 0, NULL, 'wipe', '', 1, 0, NULL, 'titan-subdealer', 0, 0, NULL, NULL, '2019-04-28 01:08:04', '2019-04-28 02:49:26');
INSERT INTO `usr_acc` VALUES (42, 660, NULL, NULL, 'test1@titansecure.biz', 229, 0, NULL, 'undefined', NULL, 3, '2019/07/28', '3995110', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 10, 'testing', '2019-04-28 19:38:15', '2019-04-29 06:19:43');
INSERT INTO `usr_acc` VALUES (43, 661, 'ID833302', NULL, 'adeel@sunztech.com', 231, 0, NULL, 'N/A', '2019/04/29', 0, '2019/05/06', '8586223', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 3, 'testing', '2019-04-29 13:01:11', '2019-05-01 04:52:57');
INSERT INTO `usr_acc` VALUES (44, 662, 'ID833302', NULL, 'titanlyon@titansecure.biz', 229, 0, NULL, 'undefined', '2019/04/29', 3, '2019/07/29', '5634666', 'active', 1, 1, 'wipe', '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-04-29 16:12:20', '2019-04-29 16:17:09');
INSERT INTO `usr_acc` VALUES (45, 663, 'ID887432', NULL, 'Tsupport@titansecure.biz', 224, 0, NULL, 'undefined', '2019/04/29', 6, '2019/10/29', '5759705', 'active', 1, 1, NULL, '', 0, 0, NULL, NULL, 0, 0, 15, '', '2019-04-29 16:35:26', '2019-04-29 16:45:22');
INSERT INTO `usr_acc` VALUES (57, 675, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 12, '2020/04/30', '4346035', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 7, '', '2019-04-30 13:38:00', '2019-05-01 04:54:32');
INSERT INTO `usr_acc` VALUES (58, 676, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 12, '2020/04/30', '7803190', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 1, 0, 7, '', '2019-04-30 13:38:00', '2019-05-01 04:54:32');
INSERT INTO `usr_acc` VALUES (66, 684, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '9380453', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:43', NULL);
INSERT INTO `usr_acc` VALUES (67, 685, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '0021097', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:43', NULL);
INSERT INTO `usr_acc` VALUES (68, 686, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '4165191', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:43', NULL);
INSERT INTO `usr_acc` VALUES (69, 687, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '7964696', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:43', NULL);
INSERT INTO `usr_acc` VALUES (70, 688, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '2062394', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:44', NULL);
INSERT INTO `usr_acc` VALUES (71, 689, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '2714726', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:44', NULL);
INSERT INTO `usr_acc` VALUES (72, 690, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, NULL, 6, '2019/11/01', '6340400', '', 0, 0, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:44', NULL);
INSERT INTO `usr_acc` VALUES (73, 691, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, '2019/05/03', 6, '2019/11/03', '3113884', 'active', 1, 1, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:44', '2019-05-03 15:48:02');
INSERT INTO `usr_acc` VALUES (75, 693, 'ID708145', NULL, NULL, 232, 0, NULL, NULL, '2019/05/01', 6, '2019/11/01', '6688603', 'active', 1, 1, NULL, '', 0, 0, NULL, NULL, 0, 0, 30, '', '2019-05-01 05:35:44', '2019-05-01 05:37:03');

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
) ENGINE = InnoDB AUTO_INCREMENT = 2 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of usr_acc_profile
-- ----------------------------
INSERT INTO `usr_acc_profile` VALUES (1, 'zaid', NULL, 0, 45, '[{\"id\":586,\"app_id\":4650,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Secure Settings\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.secureSetting.SecureSettingsMainSecure Settings\",\"icon\":\"icon_Secure Settings.png\",\"extension\":1,\"extension_id\":0,\"packageName\":\"com.secureSetting.SecureSettingsMain\"},{\"id\":565,\"app_id\":4659,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"default_app\":0,\"visible\":0,\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.android.settings\"},{\"id\":577,\"app_id\":4666,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"UEM Client\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":583,\"app_id\":4667,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Titan Locker\",\"default_app\":1,\"visible\":1,\"uniqueName\":\"com.titanlocker.secureTitan Locker\",\"icon\":\"icon_Titan Locker.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.titanlocker.secure\"},{\"id\":584,\"app_id\":9684,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Secure VPN\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.secure.vpnSecure VPN\",\"icon\":\"icon_Secure VPN.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.secure.vpn\"},{\"id\":580,\"app_id\":10116,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Mail\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"ca.unlimitedwireless.mailpgpMail\",\"icon\":\"icon_Mail.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"ca.unlimitedwireless.mailpgp\"},{\"id\":581,\"app_id\":10118,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Emergency Wipe\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.srz.unlimited.wiperEmergency Wipe\",\"icon\":\"icon_Emergency Wipe.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.srz.unlimited.wiper\"},{\"id\":570,\"app_id\":10121,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Encrypted Notes\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"ca.unlimitedwireless.encryptednotesEncrypted Notes\",\"icon\":\"icon_Encrypted Notes.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"ca.unlimitedwireless.encryptednotes\"},{\"id\":585,\"app_id\":10123,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Titan Secure\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.titansecure.titan1Titan Secure\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.titansecure.titan1\"},{\"id\":566,\"app_id\":12544,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.sec.android.app.clockpackageClock\",\"icon\":\"icon_Clock.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.sec.android.app.clockpackage\"},{\"id\":571,\"app_id\":12545,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Gallery\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.sec.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.sec.android.gallery3d\"},{\"id\":572,\"app_id\":12547,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Contacts\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.samsung.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.samsung.android.contacts\"},{\"id\":568,\"app_id\":12548,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Phone\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.samsung.android.contactsPhone\",\"icon\":\"icon_Phone.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.samsung.android.contacts\"},{\"id\":567,\"app_id\":12549,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Messages\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.samsung.android.messagingMessages\",\"icon\":\"icon_Messages.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.samsung.android.messaging\"},{\"id\":574,\"app_id\":12550,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Camera\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.sec.android.app.cameraCamera\",\"icon\":\"icon_Camera.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.sec.android.app.camera\"},{\"id\":573,\"app_id\":12551,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Voice Search\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.google.android.googlequicksearchboxVoice Search\",\"icon\":\"icon_Voice Search.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":582,\"app_id\":12552,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Google\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":575,\"app_id\":12553,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Visual Voicemail\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.samsung.attvvmVisual Voicemail\",\"icon\":\"icon_Visual Voicemail.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.samsung.attvvm\"},{\"id\":569,\"app_id\":12554,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"My Files\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.sec.android.app.myfilesMy Files\",\"icon\":\"icon_My Files.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.sec.android.app.myfiles\"},{\"id\":576,\"app_id\":12555,\"guest\":true,\"encrypted\":false,\"enable\":false,\"label\":\"Setup & Transfer\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.synchronoss.dcs.att.r2gSetup & Transfer\",\"icon\":\"icon_Setup & Transfer.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.synchronoss.dcs.att.r2g\"},{\"id\":578,\"app_id\":12558,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Codeproof® MDM\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.codeproof.device.securityCodeproof® MDM\",\"icon\":\"icon_Codeproof® MDM.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.codeproof.device.security\"},{\"id\":579,\"app_id\":12562,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Titan Secure\",\"default_app\":0,\"visible\":1,\"uniqueName\":\"com.titansecure.bizTitan Secure\",\"icon\":\"icon_Titan Secure.png\",\"extension\":0,\"extension_id\":0,\"packageName\":\"com.titansecure.biz\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'profile', 0, '2019-04-29 16:44:34', NULL);

SET FOREIGN_KEY_CHECKS = 1;
