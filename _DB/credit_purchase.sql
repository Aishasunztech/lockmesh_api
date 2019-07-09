/*
Navicat MySQL Data Transfer

Source Server         : New Connection
Source Server Version : 50505
Source Host           : localhost:3306
Source Database       : lockmesh_db

Target Server Type    : MYSQL
Target Server Version : 50505
File Encoding         : 65001

Date: 2019-06-25 12:17:37
*/

SET FOREIGN_KEY_CHECKS=0;

-- ----------------------------
-- Table structure for credit_purchase
-- ----------------------------
DROP TABLE IF EXISTS `credit_purchase`;
CREATE TABLE `credit_purchase` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `credits` int(11) NOT NULL,
  `usd_price` decimal(10,0) DEFAULT NULL,
  `currency_price` decimal(10,0) DEFAULT NULL,
  `payment_method` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of credit_purchase
-- ----------------------------

-- ----------------------------
-- Table structure for dealer_credits
-- ----------------------------
DROP TABLE IF EXISTS `dealer_credits`;
CREATE TABLE `dealer_credits` (
  `id` int(11) NOT NULL,
  `dealer_id` int(11) DEFAULT NULL,
  `credits` int(11) DEFAULT NULL,
  `created_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- ----------------------------
-- Records of dealer_credits
-- ----------------------------
