/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50724
 Source Host           : localhost:3306
 Source Schema         : webportal_db

 Target Server Type    : MySQL
 Target Server Version : 50724
 File Encoding         : 65001

 Date: 19/03/2019 11:58:50
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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 46 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 39 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_general_ci ROW_FORMAT = Compact;

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
) ENGINE = InnoDB AUTO_INCREMENT = 19 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of apk_details
-- ----------------------------
INSERT INTO `apk_details` VALUES (10, 'Asdfsfadfafds', 'logo-1541742769793.jpg', 'apk-1542148768616.apk', NULL, NULL, 'Off', '2018-11-13 22:39:42', '2019-03-05 17:50:21', 0);
INSERT INTO `apk_details` VALUES (11, 'Barry', 'logo-1551716361712.jpg', 'apk-1542172518850.apk', NULL, NULL, 'Off', '2018-11-14 05:15:24', '2019-03-04 21:20:30', 0);
INSERT INTO `apk_details` VALUES (12, 'barry', 'logo-1541742769793.jpg', 'apk-1542172972010.apk', NULL, NULL, 'Off', '2018-11-14 05:17:47', '2019-02-18 18:35:43', 1);
INSERT INTO `apk_details` VALUES (13, 'test', 'logo-1541742769793.jpg', 'apk-1542172673064.apk', NULL, NULL, 'Off', '2018-11-14 05:17:56', '2019-02-16 10:55:04', 1);
INSERT INTO `apk_details` VALUES (14, 'hello', 'logo-1544793519925.jpg', 'apk-1544793519931.apk', NULL, NULL, 'Off', '2018-12-14 18:18:41', '2019-02-22 12:49:17', 0);
INSERT INTO `apk_details` VALUES (15, 'hello', 'logo-1547271136553.jpg', 'apk-1547271138509.apk', NULL, NULL, 'Off', '2019-01-12 05:32:18', '2019-02-15 17:05:45', 1);
INSERT INTO `apk_details` VALUES (16, 'hello', 'logo-1547271161142.jpg', 'apk-1547271163347.apk', NULL, NULL, 'Off', '2019-01-12 05:32:43', '2019-02-15 17:05:40', 1);
INSERT INTO `apk_details` VALUES (17, 'Marco', 'logo-1547397288311.jpg', 'apk-1547397289373.apk', NULL, NULL, 'On', '2019-01-13 16:34:50', '2019-02-11 16:47:35', 1);
INSERT INTO `apk_details` VALUES (18, 'Wechat', 'logo-1548822163674.jpg', 'apk-1548822163676.apk', NULL, NULL, 'On', '2019-01-30 04:23:14', '2019-02-21 14:56:44', 1);

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
) ENGINE = InnoDB AUTO_INCREMENT = 6292 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of apps_info
-- ----------------------------
INSERT INTO `apps_info` VALUES (1407, 'com.android.calendarCalendar', 'Calendar', 'com.android.calendar', 'icon_Calendar.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1408, 'com.android.settingsSettings', 'Settings', 'com.android.settings', 'icon_Settings.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1409, 'com.android.deskclockClock', 'Clock', 'com.android.deskclock', 'icon_Clock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1410, 'com.android.contactsDialer', 'Dialer', 'com.android.contacts', 'icon_Dialer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1411, 'com.android.contactsContacts', 'Contacts', 'com.android.contacts', 'icon_Contacts.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1412, 'com.android.chromeChrome', 'Chrome', 'com.android.chrome', 'icon_Chrome.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1413, 'com.android.emailEmail', 'Email', 'com.android.email', 'icon_Email.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1414, 'com.android.mmsMessaging', 'Messaging', 'com.android.mms', 'icon_Messaging.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1415, 'com.android.mediacenterMusic', 'Music', 'com.android.mediacenter', 'icon_Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1416, 'com.android.gallery3dGallery', 'Gallery', 'com.android.gallery3d', 'icon_Gallery.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1417, 'com.android.vendingPlay Store', 'Play Store', 'com.android.vending', 'icon_Play Store.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1418, 'com.example.android.notepadNotepad', 'Notepad', 'com.example.android.notepad', 'icon_Notepad.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1419, 'com.google.android.apps.docsDrive', 'Drive', 'com.google.android.apps.docs', 'icon_Drive.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1420, 'com.google.android.apps.docs.editors.docsDocs', 'Docs', 'com.google.android.apps.docs.editors.docs', 'icon_Docs.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1421, 'com.google.android.apps.docs.editors.sheetsSheets', 'Sheets', 'com.google.android.apps.docs.editors.sheets', 'icon_Sheets.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1422, 'com.google.android.apps.docs.editors.slidesSlides', 'Slides', 'com.google.android.apps.docs.editors.slides', 'icon_Slides.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1423, 'com.google.android.apps.mapsMaps', 'Maps', 'com.google.android.apps.maps', 'icon_Maps.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1424, 'com.google.android.apps.tachyonDuo', 'Duo', 'com.google.android.apps.tachyon', 'icon_Duo.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1425, 'com.google.android.musicPlay Music', 'Play Music', 'com.google.android.music', 'icon_Play Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1426, 'com.google.android.youtubeYouTube', 'YouTube', 'com.google.android.youtube', 'icon_YouTube.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1427, 'com.google.android.gmGmail', 'Gmail', 'com.google.android.gm', 'icon_Gmail.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1428, 'com.android.documentsuiDownloads', 'Downloads', 'com.android.documentsui', 'icon_Downloads.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1429, 'com.android.hwmirrorMirror', 'Mirror', 'com.android.hwmirror', 'icon_Mirror.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1430, 'com.google.android.apps.photosPhotos', 'Photos', 'com.google.android.apps.photos', 'icon_Photos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1431, 'com.android.calculator2Calculator', 'Calculator', 'com.android.calculator2', 'icon_Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1432, 'com.huawei.himovie.overseasHUAWEI Video', 'HUAWEI Video', 'com.huawei.himovie.overseas', 'icon_HUAWEI Video.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1433, 'com.huawei.hidiskFiles', 'Files', 'com.huawei.hidisk', 'icon_Files.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1434, 'com.android.soundrecorderRecorder', 'Recorder', 'com.android.soundrecorder', 'icon_Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1435, 'com.android.stkSIM Toolkit', 'SIM Toolkit', 'com.android.stk', 'icon_SIM Toolkit.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1436, 'com.android.systemuiFlashlight', 'Flashlight', 'com.android.systemui', 'icon_Flashlight.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1437, 'com.google.android.googlequicksearchboxGoogle', 'Google', 'com.google.android.googlequicksearchbox', 'icon_Google.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1438, 'com.hicloud.android.clonePhone Clone', 'Phone Clone', 'com.hicloud.android.clone', 'icon_Phone Clone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1439, 'com.ubercabUber', 'Uber', 'com.ubercab', 'icon_Uber.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1440, 'com.huawei.KoBackupBackup & restore', 'Backup & restore', 'com.huawei.KoBackup', 'icon_Backup & restore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1441, 'com.huawei.android.FMRadioFM Radio', 'FM Radio', 'com.huawei.android.FMRadio', 'icon_FM Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1442, 'com.huawei.android.hwoucSystem update', 'System update', 'com.huawei.android.hwouc', 'icon_System update.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1443, 'com.huawei.android.thememanagerThemes', 'Themes', 'com.huawei.android.thememanager', 'icon_Themes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1444, 'com.huawei.appmarketAppGallery', 'AppGallery', 'com.huawei.appmarket', 'icon_AppGallery.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1445, 'com.huawei.android.totemweatherappWeather', 'Weather', 'com.huawei.android.totemweatherapp', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1446, 'com.huawei.cameraCamera', 'Camera', 'com.huawei.camera', 'icon_Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1447, 'com.huawei.compassCompass', 'Compass', 'com.huawei.compass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1448, 'com.huawei.healthHealth', 'Health', 'com.huawei.health', 'icon_Health.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1449, 'com.asana.appAsana', 'Asana', 'com.asana.app', 'icon_Asana.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1450, 'com.google.android.inputmethod.latinGboard', 'Gboard', 'com.google.android.inputmethod.latin', 'icon_Gboard.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1451, 'com.islam360Islam360', 'Islam360', 'com.islam360', 'icon_Islam360.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1452, 'com.mustakbilMustakbil', 'Mustakbil', 'com.mustakbil', 'icon_Mustakbil.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1453, 'com.touchtype.swiftkeySwiftKey Keyboard', 'SwiftKey Keyboard', 'com.touchtype.swiftkey', 'icon_SwiftKey Keyboard.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1454, 'com.stupeflix.replayQuik', 'Quik', 'com.stupeflix.replay', 'icon_Quik.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1455, 'com.huawei.systemmanagerPhone Manager', 'Phone Manager', 'com.huawei.systemmanager', 'icon_Phone Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1456, 'com.olx.pkOLX Pakistan', 'OLX Pakistan', 'com.olx.pk', 'icon_OLX Pakistan.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1457, 'com.huawei.phoneserviceHiCare', 'HiCare', 'com.huawei.phoneservice', 'icon_HiCare.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1458, 'com.payoneer.androidPayoneer', 'Payoneer', 'com.payoneer.android', 'icon_Payoneer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1459, 'com.secureportal.barryappMDM Client', 'MDM Client', 'com.secureportal.barryapp', 'icon_MDM Client.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1460, 'com.ahlesunnatpakahlesunnatpak', 'ahlesunnatpak', 'com.ahlesunnatpak', 'icon_ahlesunnatpak.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1461, 'com.skype.raiderSkype', 'Skype', 'com.skype.raider', 'icon_Skype.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1462, 'com.vortexlocker.appScreen Locker', 'Screen Locker', 'com.vortexlocker.app', 'icon_Screen Locker.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1463, 'com.whatsappWhatsApp', 'WhatsApp', 'com.whatsapp', 'icon_WhatsApp.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1464, 'com.zong.customercareMy Zong', 'My Zong', 'com.zong.customercare', 'icon_My Zong.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1465, 'com.facebook.orcaMessenger', 'Messenger', 'com.facebook.orca', 'icon_Messenger.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1466, 'com.facebook.katanaFacebook', 'Facebook', 'com.facebook.katana', 'icon_Facebook.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1467, 'com.careem.acmaCareem', 'Careem', 'com.careem.acma', 'icon_Careem.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1468, 'com.scb.pk.bmwSC', 'SC', 'com.scb.pk.bmw', 'icon_SC.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1469, 'com.android.soundrecorderSound Recorder', 'Sound Recorder', 'com.android.soundrecorder', 'icon_Sound Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1470, 'com.android.musicMusic', 'Music', 'com.android.music', 'icon_Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1471, 'com.android.dialerPhone', 'Phone', 'com.android.dialer', 'icon_Phone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1472, 'cn.sh.hct.showThemes', 'Themes', 'cn.sh.hct.show', 'icon_Themes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1473, 'com.p00YouTube Without Google Play Services', 'YouTube Without Google Play Services', 'com.p00', 'icon_YouTube Without Google Play Services.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1474, 'com.mediatek.cameraCamera', 'Camera', 'com.mediatek.camera', 'icon_Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1475, 'com.NESmiketysonspunchoutclassic.nesNES punch out', 'NES punch out', 'com.NESmiketysonspunchoutclassic.nes', 'icon_NES punch out.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1476, 'teatv.videoplayer.moviesguideTeaTV', 'TeaTV', 'teatv.videoplayer.moviesguide', 'icon_TeaTV.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1477, 'com.miui.calculatorCalculator', 'Calculator', 'com.miui.calculator', 'icon_Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1478, 'com.hct.fileexplorerFile Explorer', 'File Explorer', 'com.hct.fileexplorer', 'icon_File Explorer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1479, 'com.androits.gps.test.proAndroiTS GPS Test', 'AndroiTS GPS Test', 'com.androits.gps.test.pro', 'icon_AndroiTS GPS Test.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1480, 'com.vapp.aide.intlParallel Space', 'Parallel Space', 'com.vapp.aide.intl', 'icon_Parallel Space.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1481, 'app.screen.offLower Brightness', 'Lower Brightness', 'app.screen.off', 'icon_Lower Brightness.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1482, 'com.android.fmradioFM Radio', 'FM Radio', 'com.android.fmradio', 'icon_FM Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1483, 'cn.wps.noteWPS Note', 'WPS Note', 'cn.wps.note', 'icon_WPS Note.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1484, 'com.alibaba.aliexpresshdAliExpress', 'AliExpress', 'com.alibaba.aliexpresshd', 'icon_AliExpress.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1485, 'com.atechnos.pdfPdf Reader 7.0+', 'Pdf Reader 7.0+', 'com.atechnos.pdf', 'icon_Pdf Reader 7.0+.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1486, 'com.deepsailer.chinavpnChina VPN Free', 'China VPN Free', 'com.deepsailer.chinavpn', 'icon_China VPN Free.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1487, 'com.gameshippo.audiocutterAudio Cutter', 'Audio Cutter', 'com.gameshippo.audiocutter', 'icon_Audio Cutter.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1488, 'com.gappstudio.docxread.docxreader2abhishekDocx Reader', 'Docx Reader', 'com.gappstudio.docxread.docxreader2abhishek', 'icon_Docx Reader.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1489, 'com.github.shadowsocksShadowsocks', 'Shadowsocks', 'com.github.shadowsocks', 'icon_Shadowsocks.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1490, 'cm.aptoide.ptAptoide', 'Aptoide', 'cm.aptoide.pt', 'icon_Aptoide.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1491, 'com.happybluefin.android.devicecheckDeviceCheck', 'DeviceCheck', 'com.happybluefin.android.devicecheck', 'icon_DeviceCheck.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1492, 'com.jrzheng.supervpnfreeSuperVPN', 'SuperVPN', 'com.jrzheng.supervpnfree', 'icon_SuperVPN.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1493, 'com.alibaba.intl.android.apps.poseidonAlibaba.com', 'Alibaba.com', 'com.alibaba.intl.android.apps.poseidon', 'icon_Alibaba.com.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1494, 'com.linpusime.android.linpuskbdSimplified Chinese Keyboard', 'Simplified Chinese Keyboard', 'com.linpusime.android.linpuskbd', 'icon_Simplified Chinese Keyboard.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1495, 'com.mobike.mobikeappMobike', 'Mobike', 'com.mobike.mobikeapp', 'icon_Mobike.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1496, 'com.mxtech.videoplayer.adMX Player', 'MX Player', 'com.mxtech.videoplayer.ad', 'icon_MX Player.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1497, 'com.nitroxenon.yesplayerYesPlayer', 'YesPlayer', 'com.nitroxenon.yesplayer', 'icon_YesPlayer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1498, 'com.nordvpn.androidNordVPN', 'NordVPN', 'com.nordvpn.android', 'icon_NordVPN.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1499, 'com.nitroxenon.terrariulTerrarium TV Robot MOD lite', 'Terrarium TV Robot MOD lite', 'com.nitroxenon.terrariul', 'icon_Terrarium TV Robot MOD lite.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1500, 'com.pdfviewer.readerPDF Viewer-Reader For Android', 'PDF Viewer-Reader For Android', 'com.pdfviewer.reader', 'icon_PDF Viewer-Reader For Android.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1501, 'com.pdfs.pdfreader.pdfviewerPDF Viewer', 'PDF Viewer', 'com.pdfs.pdfreader.pdfviewer', 'icon_PDF Viewer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1502, 'com.tdo.showboxShow Box', 'Show Box', 'com.tdo.showbox', 'icon_Show Box.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1503, 'com.rahul.videoderbetaVideoder', 'Videoder', 'com.rahul.videoderbeta', 'icon_Videoder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1504, 'com.tencent.mmWeChat', 'WeChat', 'com.tencent.mm', 'icon_WeChat.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1505, 'free.vpn.unblock.proxy.vpnproSnap VPN', 'Snap VPN', 'free.vpn.unblock.proxy.vpnpro', 'icon_Snap VPN.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1506, 'com.vortexsecure.androidEncrypted Chat', 'Encrypted Chat', 'com.vortexsecure.android', 'icon_Encrypted Chat.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1507, 'mobi.omegacentauri.SpeakerBoostSpeaker Boost', 'Speaker Boost', 'mobi.omegacentauri.SpeakerBoost', 'icon_Speaker Boost.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1508, 'org.telegram.messengerTelegram', 'Telegram', 'org.telegram.messenger', 'icon_Telegram.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1509, 'com.android.mmsMessages', 'Messages', 'com.android.mms', 'icon_Messages.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1510, 'com.google.android.apps.magazinesPlay Newsstand', 'Play Newsstand', 'com.google.android.apps.magazines', 'icon_Play Newsstand.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1511, 'com.google.android.apps.walletnfcrelAndroid Pay', 'Android Pay', 'com.google.android.apps.walletnfcrel', 'icon_Android Pay.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1512, 'com.android.emailMail', 'Mail', 'com.android.email', 'icon_Mail.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1513, 'com.android.browserBrowser', 'Browser', 'com.android.browser', 'icon_Browser.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1514, 'com.google.android.videosPlay Movies & TV', 'Play Movies & TV', 'com.google.android.videos', 'icon_Play Movies & TV.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1515, 'com.aedesign.deskclockClock', 'Clock', 'com.aedesign.deskclock', 'icon_Clock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1516, 'com.SettingSettings', 'Settings', 'com.Setting', 'icon_Settings.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1517, 'com.android.applewatchWatch', 'Watch', 'com.android.applewatch', 'icon_Watch.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1518, 'com.google.android.apps.booksPlay Books', 'Play Books', 'com.google.android.apps.books', 'icon_Play Books.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1519, 'com.android.myfindfriendsFind Friends', 'Find Friends', 'com.android.myfindfriends', 'icon_Find Friends.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1520, 'com.android.myfindiphoneFind iPhone', 'Find iPhone', 'com.android.myfindiphone', 'icon_Find iPhone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1521, 'com.android.facetimeFaceTime', 'FaceTime', 'com.android.facetime', 'icon_FaceTime.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1522, 'com.mediatek.filemanagerFile Manager', 'File Manager', 'com.mediatek.filemanager', 'icon_File Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1523, 'com.google.android.play.gamesPlay Games', 'Play Games', 'com.google.android.play.games', 'icon_Play Games.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1524, 'com.example.promptTips', 'Tips', 'com.example.prompt', 'icon_Tips.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1525, 'com.yahoo.mobile.client.android.financeFinance', 'Finance', 'com.yahoo.mobile.client.android.finance', 'icon_Finance.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1526, 'com.autonavi.minimapAmap', 'Amap', 'com.autonavi.minimap', 'icon_Amap.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1527, 'com.android.sec.calculatorCalculator', 'Calculator', 'com.android.sec.calculator', 'icon_Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1528, 'com.android.iphoneCompassCompass', 'Compass', 'com.android.iphoneCompass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1529, 'com.health.gulihealthHealth', 'Health', 'com.health.gulihealth', 'icon_Health.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1530, 'com.example.android.notepadNotes', 'Notes', 'com.example.android.notepad', 'icon_Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1531, 'com.iphone.reminderReminders', 'Reminders', 'com.iphone.reminder', 'icon_Reminders.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1532, 'com.iphone.voiceremenberios7Voice Memos', 'Voice Memos', 'com.iphone.voiceremenberios7', 'icon_Voice Memos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1533, 'com.joy7.apple.appstoreApp Store', 'App Store', 'com.joy7.apple.appstore', 'icon_App Store.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1534, 'com.yahoo.mobile.client.android.weatherWeather', 'Weather', 'com.yahoo.mobile.client.android.weather', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1535, 'com.rim.mobilefusion.clientUEM Client', 'UEM Client', 'com.rim.mobilefusion.client', 'icon_UEM Client.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1536, 'com.srz.unlimited.wiperEmergency Wipe', 'Emergency Wipe', 'com.srz.unlimited.wiper', 'icon_Emergency Wipe.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1537, 'com.armorSec.androidArmorSec', 'ArmorSec', 'com.armorSec.android', 'icon_ArmorSec.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1538, 'ca.unlimitedwireless.encryptednotesEncrypted Notes', 'Encrypted Notes', 'ca.unlimitedwireless.encryptednotes', 'icon_Encrypted Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1539, 'ca.unlimitedwireless.mailpgpMail', 'Mail', 'ca.unlimitedwireless.mailpgp', 'icon_Mail.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1540, 'com.example.homeHome', 'Home', 'com.example.home', 'icon_Home.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1541, 'com.android.gallery3dPhoto', 'Photo', 'com.android.gallery3d', 'icon_Photo.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1542, 'com.sztuyue.app.storeAppStore', 'AppStore', 'com.sztuyue.app.store', 'icon_AppStore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1543, 'com.android.systemmanagerSystem Manager', 'System Manager', 'com.android.systemmanager', 'icon_System Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1544, 'com.google.android.googlequicksearchboxVoice Search', 'Voice Search', 'com.google.android.googlequicksearchbox', 'icon_Voice Search.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1545, 'com.adups.fotaWireless Update', 'Wireless Update', 'com.adups.fota', 'icon_Wireless Update.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1546, 'com.hct.stepcountPedometer', 'Pedometer', 'com.hct.stepcount', 'icon_Pedometer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1547, 'com.st.nfc.dta.mobileSTNFCDta', 'STNFCDta', 'com.st.nfc.dta.mobile', 'icon_STNFCDta.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1548, 'ca.unlimitedwireless.encryptednotesEncrypted-Notes', 'Encrypted-Notes', 'ca.unlimitedwireless.encryptednotes', 'icon_Encrypted-Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1549, 'com.securechat.androidSecureChat', 'SecureChat', 'com.securechat.android', 'icon_SecureChat.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1550, 'com.cyanogenmod.filemanagerFile Manager', 'File Manager', 'com.cyanogenmod.filemanager', 'icon_File Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1551, 'com.android.cameraCamera', 'Camera', 'com.android.camera', 'icon_Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1552, 'com.android.contactsPeople', 'People', 'com.android.contacts', 'icon_People.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1553, 'com.vphone.launcherNox Launcher', 'Nox Launcher', 'com.vphone.launcher', 'icon_Nox Launcher.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1554, 'com.google.android.gmsGoogle Settings', 'Google Settings', 'com.google.android.gms', 'icon_Google Settings.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1555, 'com.android.providers.downloads.uiDownloads', 'Downloads', 'com.android.providers.downloads.ui', 'icon_Downloads.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1556, 'com.vphone.helpercom.vphone.helper.MainActivity', 'com.vphone.helper.MainActivity', 'com.vphone.helper', 'icon_com.vphone.helper.MainActivity.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1557, 'com.facebook.liteLite', 'Lite', 'com.facebook.lite', 'icon_Lite.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1558, 'com.global.foodpanda.androidfoodpanda', 'foodpanda', 'com.global.foodpanda.android', 'icon_foodpanda.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1559, 'com.google.android.apps.messagingMessages', 'Messages', 'com.google.android.apps.messaging', 'icon_Messages.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1560, 'com.google.android.deskclockClock', 'Clock', 'com.google.android.deskclock', 'icon_Clock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1561, 'com.google.android.dialerPhone', 'Phone', 'com.google.android.dialer', 'icon_Phone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1562, 'com.google.android.calendarCalendar', 'Calendar', 'com.google.android.calendar', 'icon_Calendar.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1563, 'com.google.android.contactsContacts', 'Contacts', 'com.google.android.contacts', 'icon_Contacts.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1564, 'com.google.android.calculatorCalculator', 'Calculator', 'com.google.android.calculator', 'icon_Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1565, 'com.telenor.capp.weatherWeatherApp', 'WeatherApp', 'com.telenor.capp.weather', 'icon_WeatherApp.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1566, 'com.facebook.mliteLite', 'Lite', 'com.facebook.mlite', 'icon_Lite.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1567, 'com.example.myapplicationMy Application', 'My Application', 'com.example.myapplication', 'icon_My Application.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1568, 'com.example.webviewappIdreesia', 'Idreesia', 'com.example.webviewapp', 'icon_Idreesia.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1569, 'com.lenovo.anyshare.gpsSHAREit', 'SHAREit', 'com.lenovo.anyshare.gps', 'icon_SHAREit.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1570, 'com.android.camera2Camera', 'Camera', 'com.android.camera2', 'icon_Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1571, 'co.copperhead.pdfviewerPDF Viewer', 'PDF Viewer', 'co.copperhead.pdfviewer', 'icon_PDF Viewer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1572, 'com.android.documentsuiFiles', 'Files', 'com.android.documentsui', 'icon_Files.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1573, 'com.stevesoltys.backupBackup', 'Backup', 'com.stevesoltys.backup', 'icon_Backup.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1574, 'org.chromium.chromeChromium', 'Chromium', 'org.chromium.chrome', 'icon_Chromium.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1575, 'ws.xsoh.etarEtar', 'Etar', 'ws.xsoh.etar', 'icon_Etar.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1576, 'org.smssecure.smssecureSilence', 'Silence', 'org.smssecure.smssecure', 'icon_Silence.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1577, 'org.sufficientlysecure.localcalendarOffline Calendar', 'Offline Calendar', 'org.sufficientlysecure.localcalendar', 'icon_Offline Calendar.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1578, 'org.fdroid.fdroidF-Droid', 'F-Droid', 'org.fdroid.fdroid', 'icon_F-Droid.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1579, 'org.secuso.privacyfriendlynetmonitorNet Monitor', 'Net Monitor', 'org.secuso.privacyfriendlynetmonitor', 'icon_Net Monitor.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1580, 'com.vortex_secure.sys_ctrlssys_ctrls', 'sys_ctrls', 'com.vortex_secure.sys_ctrls', 'icon_sys_ctrls.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1581, 'com.pickytestPicky Assist', 'Picky Assist', 'com.pickytest', 'icon_Picky Assist.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1582, 'com.android.quicksearchboxSearch', 'Search', 'com.android.quicksearchbox', 'icon_Search.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1583, 'com.android.cellbroadcastreceiverCell Broadcasts', 'Cell Broadcasts', 'com.android.cellbroadcastreceiver', 'icon_Cell Broadcasts.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1584, 'com.coloros.alarmclockClock', 'Clock', 'com.coloros.alarmclock', 'icon_Clock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1585, 'com.oppo.musicMusic', 'Music', 'com.oppo.music', 'icon_Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1586, 'com.coloros.gallery3dPhotos', 'Photos', 'com.coloros.gallery3d', 'icon_Photos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1587, 'com.coloros.videoVideo', 'Video', 'com.coloros.video', 'icon_Video.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1588, 'com.android.contactsPhone', 'Phone', 'com.android.contacts', 'icon_Phone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1589, 'com.coloros.soundrecorderSound Recorder', 'Sound Recorder', 'com.coloros.soundrecorder', 'icon_Sound Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1590, 'com.oppo.cameraCamera', 'Camera', 'com.oppo.camera', 'icon_Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1591, 'com.coloros.safecenterSecurity Center', 'Security Center', 'com.coloros.safecenter', 'icon_Security Center.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1592, 'com.google.android.talkHangouts', 'Hangouts', 'com.google.android.talk', 'icon_Hangouts.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1593, 'com.coloros.backuprestoreBackup and Restore', 'Backup and Restore', 'com.coloros.backuprestore', 'icon_Backup and Restore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1594, 'com.caf.fmradioFM Radio', 'FM Radio', 'com.caf.fmradio', 'icon_FM Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1595, 'com.coloros.filemanagerFiles', 'Files', 'com.coloros.filemanager', 'icon_Files.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1596, 'com.nearme.themespaceTheme Store', 'Theme Store', 'com.nearme.themespace', 'icon_Theme Store.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1597, 'com.coloros.compassCompass', 'Compass', 'com.coloros.compass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1598, 'com.truecallerTruecaller', 'Truecaller', 'com.truecaller', 'icon_Truecaller.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1599, 'com.google.android.keepKeep Notes', 'Keep Notes', 'com.google.android.keep', 'icon_Keep Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1600, 'com.coloros.weatherWeather', 'Weather', 'com.coloros.weather', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1601, 'cn.wps.moffice_engWPS Office', 'WPS Office', 'cn.wps.moffice_eng', 'icon_WPS Office.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1602, 'com.swingman.gameSwing Star', 'Swing Star', 'com.swingman.game', 'icon_Swing Star.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1603, 'com.whatsapp.w4bWA Business', 'WA Business', 'com.whatsapp.w4b', 'icon_WA Business.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1604, 'com.google.android.apps.ads.publisherAdSense', 'AdSense', 'com.google.android.apps.ads.publisher', 'icon_AdSense.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1605, 'com.instagram.androidInstagram', 'Instagram', 'com.instagram.android', 'icon_Instagram.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1606, 'org.videolan.vlcVLC', 'VLC', 'org.videolan.vlc', 'icon_VLC.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1607, 'com.google.android.apps.plusGoogle+', 'Google+', 'com.google.android.apps.plus', 'icon_Google+.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1608, 'com.google.earthEarth', 'Earth', 'com.google.earth', 'icon_Earth.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1609, 'com.teamviewer.teamviewer.market.mobileTeamViewer', 'TeamViewer', 'com.teamviewer.teamviewer.market.mobile', 'icon_TeamViewer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1610, 'com.google.android.apps.translateTranslate', 'Translate', 'com.google.android.apps.translate', 'icon_Translate.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1611, 'com.Alienforcegames.ChessFusionFreeReal Chess', 'Real Chess', 'com.Alienforcegames.ChessFusionFree', 'icon_Real Chess.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1612, 'com.fanzetech.holyquranHoly Quran', 'Holy Quran', 'com.fanzetech.holyquran', 'icon_Holy Quran.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1613, 'com.twitter.androidTwitter', 'Twitter', 'com.twitter.android', 'icon_Twitter.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1614, 'com.gamestar.perfectpianoPerfect Piano', 'Perfect Piano', 'com.gamestar.perfectpiano', 'icon_Perfect Piano.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1615, 'com.overlook.android.fingFing', 'Fing', 'com.overlook.android.fing', 'icon_Fing.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1616, 'com.shazam.androidShazam', 'Shazam', 'com.shazam.android', 'icon_Shazam.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1617, 'com.e_deen.hadith6in1freeHadith Free', 'Hadith Free', 'com.e_deen.hadith6in1free', 'icon_Hadith Free.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1618, 'com.microsoft.office.outlookOutlook', 'Outlook', 'com.microsoft.office.outlook', 'icon_Outlook.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1619, 'com.joeware.android.gpulumeraCandyCamera', 'CandyCamera', 'com.joeware.android.gpulumera', 'icon_CandyCamera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1620, 'com.estrongs.android.popES File Explorer', 'ES File Explorer', 'com.estrongs.android.pop', 'icon_ES File Explorer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1621, 'com.smule.singandroidSmule', 'Smule', 'com.smule.singandroid', 'icon_Smule.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1622, 'com.quran.labs.androidquranQuran', 'Quran', 'com.quran.labs.androidquran', 'icon_Quran.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1623, 'me.aflak.librariesSys_ctrls', 'Sys_ctrls', 'me.aflak.libraries', 'icon_Sys_ctrls.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1624, 'com.adhan.alarm.offlineAdhan alarm offline', 'Adhan alarm offline', 'com.adhan.alarm.offline', 'icon_Adhan alarm offline.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1625, 'com.android.bbkmusici Music', 'i Music', 'com.android.bbkmusic', 'icon_i Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1626, 'com.vivo.galleryAlbums', 'Albums', 'com.vivo.gallery', 'icon_Albums.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1627, 'com.android.VideoPlayerVideos', 'Videos', 'com.android.VideoPlayer', 'icon_Videos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1628, 'com.android.bbksoundrecorderRecorder', 'Recorder', 'com.android.bbksoundrecorder', 'icon_Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1629, 'com.bbk.calendarCalendar', 'Calendar', 'com.bbk.calendar', 'icon_Calendar.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1630, 'com.android.filemanagerFile Manager', 'File Manager', 'com.android.filemanager', 'icon_File Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1631, 'com.iqoo.securei Manager', 'i Manager', 'com.iqoo.secure', 'icon_i Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1632, 'com.vivo.FMRadioFM Radio', 'FM Radio', 'com.vivo.FMRadio', 'icon_FM Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1633, 'com.bbk.cloudvivoCloud', 'vivoCloud', 'com.bbk.cloud', 'icon_vivoCloud.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1634, 'com.vivo.browserBrowser', 'Browser', 'com.vivo.browser', 'icon_Browser.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1635, 'com.vivo.appstoreV-Appstore', 'V-Appstore', 'com.vivo.appstore', 'icon_V-Appstore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1636, 'com.android.notesNotes', 'Notes', 'com.android.notes', 'icon_Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1637, 'com.android.bbkcalculatorCalculator', 'Calculator', 'com.android.bbkcalculator', 'icon_Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1638, 'com.android.BBKClockClock', 'Clock', 'com.android.BBKClock', 'icon_Clock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1639, 'com.vivo.compassCompass', 'Compass', 'com.vivo.compass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1640, 'com.vivo.weatherWeather', 'Weather', 'com.vivo.weather', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1641, 'com.android.bbk.lockscreen3Lock', 'Lock', 'com.android.bbk.lockscreen3', 'icon_Lock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1642, 'com.eE', 'E', 'com.e', 'icon_E.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1643, 'com.vivo.websiteFeedback', 'Feedback', 'com.vivo.website', 'icon_Feedback.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1644, 'com.vivo.websitevivo.com', 'vivo.com', 'com.vivo.website', 'icon_vivo.com.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1645, 'com.f_projectF_project', 'F_project', 'com.f_project', 'icon_F_project.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1646, 'com.randomsoft.best.urdu.poetry.tenthousandplus10000+ Urdu Poetry', '10000+ Urdu Poetry', 'com.randomsoft.best.urdu.poetry.tenthousandplus', 'icon_10000+ Urdu Poetry.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1647, 'com.nemo.vidmateVidMate', 'VidMate', 'com.nemo.vidmate', 'icon_VidMate.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1648, 'com.techlogix.mobilinkcustomerJazzCash', 'JazzCash', 'com.techlogix.mobilinkcustomer', 'icon_JazzCash.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1649, 'com.vivo.easyshareEasyShare', 'EasyShare', 'com.vivo.easyshare', 'icon_EasyShare.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1650, 'com.bbk.themei Theme', 'i Theme', 'com.bbk.theme', 'icon_i Theme.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1651, 'com.vivo.emailEmail', 'Email', 'com.vivo.email', 'icon_Email.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1653, 'com.android.calendarCalendar1', 'Calendar1', 'com.android.calendar1', NULL, '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1690, 'com.alibaba.wireless????', '????', 'com.alibaba.wireless', 'icon_????.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1699, 'com.taobao.taobao????', '????', 'com.taobao.taobao', 'icon_????.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1706, 'com.tencent.map????', '????', 'com.tencent.map', 'icon_????.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (1712, 'me.aflak.librariesSys_ctrls v1.1', 'Sys_ctrls v1.1', 'me.aflak.libraries', 'icon_Sys_ctrls v1.1.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3698, 'com.android.thememanagerThemes', 'Themes', 'com.android.thememanager', 'icon_Themes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3714, 'com.mi.android.globalFileexplorerFile Manager', 'File Manager', 'com.mi.android.globalFileexplorer', 'icon_File Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3715, 'com.miui.calculatorMi Calculator', 'Mi Calculator', 'com.miui.calculator', 'icon_Mi Calculator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3716, 'com.miui.galleryGallery', 'Gallery', 'com.miui.gallery', 'icon_Gallery.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3717, 'com.miui.notesNotes', 'Notes', 'com.miui.notes', 'icon_Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3718, 'com.miui.weather2Weather', 'Weather', 'com.miui.weather2', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3719, 'com.xiaomi.scannerScanner', 'Scanner', 'com.xiaomi.scanner', 'icon_Scanner.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3724, 'com.miui.bugreportFeedback', 'Feedback', 'com.miui.bugreport', 'icon_Feedback.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3725, 'com.miui.compassCompass', 'Compass', 'com.miui.compass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3726, 'com.miui.fmFM Radio', 'FM Radio', 'com.miui.fm', 'icon_FM Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3727, 'com.miui.playerMusic', 'Music', 'com.miui.player', 'icon_Music.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3728, 'com.miui.screenrecorderScreen Recorder', 'Screen Recorder', 'com.miui.screenrecorder', 'icon_Screen Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3729, 'com.miui.securitycenterSecurity', 'Security', 'com.miui.securitycenter', 'icon_Security.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3730, 'com.miui.videoplayerMi Video', 'Mi Video', 'com.miui.videoplayer', 'icon_Mi Video.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3731, 'com.xiaomi.midropMi Drop', 'Mi Drop', 'com.xiaomi.midrop', 'icon_Mi Drop.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3733, 'com.ceyhan.setsHidden Settings', 'Hidden Settings', 'com.ceyhan.sets', 'icon_Hidden Settings.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3734, 'com.duokan.phone.remotecontrollerMi Remote', 'Mi Remote', 'com.duokan.phone.remotecontroller', 'icon_Mi Remote.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3735, 'com.google.android.inputmethod.pinyinGoogle Pinyin Input', 'Google Pinyin Input', 'com.google.android.inputmethod.pinyin', 'icon_Google Pinyin Input.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3736, 'com.miui.enbbsMIUI Forum', 'MIUI Forum', 'com.miui.enbbs', 'icon_MIUI Forum.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (3780, 'com.example.javatestJavaTest', 'JavaTest', 'com.example.javatest', 'icon_JavaTest.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4047, 'com.coloros.soundrecorderRecorder', 'Recorder', 'com.coloros.soundrecorder', 'icon_Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4055, 'com.coloros.videoVideos', 'Videos', 'com.coloros.video', 'icon_Videos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4065, 'com.google.android.ogyoutubeOGYouTube', 'OGYouTube', 'com.google.android.ogyoutube', 'icon_OGYouTube.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4066, 'com.venticake.retricaRetrica', 'Retrica', 'com.venticake.retrica', 'icon_Retrica.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4068, 'com.android.fmradioRadio', 'Radio', 'com.android.fmradio', 'icon_Radio.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4071, 'com.coloros.backuprestoreBackup & Restore', 'Backup & Restore', 'com.coloros.backuprestore', 'icon_Backup & Restore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4073, 'com.coloros.safecenterPhone Manager', 'Phone Manager', 'com.coloros.safecenter', 'icon_Phone Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4077, 'android.com.foodiesofmultanFoodiesOfMultan', 'FoodiesOfMultan', 'android.com.foodiesofmultan', 'icon_FoodiesOfMultan.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4078, 'android.com.fbdownFB Down', 'FB Down', 'android.com.fbdown', 'icon_FB Down.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4081, 'android.com.whatsappstatusWhatsApp Status', 'WhatsApp Status', 'android.com.whatsappstatus', 'icon_WhatsApp Status.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4082, 'aratechies.fastvideodownloader.videodownloaderforfacebookVideo Downloader', 'Video Downloader', 'aratechies.fastvideodownloader.videodownloaderforfacebook', 'icon_Video Downloader.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4083, 'android.com.mediacollectMedia Collect', 'Media Collect', 'android.com.mediacollect', 'icon_Media Collect.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4084, 'bestfreelivewallpapers.new_year_2015_fireworksPhoto Frames', 'Photo Frames', 'bestfreelivewallpapers.new_year_2015_fireworks', 'icon_Photo Frames.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4086, 'com.abdulrazzaq.cabcab', 'cab', 'com.abdulrazzaq.cab', 'icon_cab.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4087, 'camera2.com.camera2practiceCamera2 Practice', 'Camera2 Practice', 'camera2.com.camera2practice', 'icon_Camera2 Practice.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4088, 'com.abdulrazzaq.camera2exerciseCamera 2 Exercise', 'Camera 2 Exercise', 'com.abdulrazzaq.camera2exercise', 'icon_Camera 2 Exercise.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4089, 'com.abdulrazzaq.mycabmyCAB', 'myCAB', 'com.abdulrazzaq.mycab', 'icon_myCAB.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4090, 'com.abdulrazzaq.googlemapsgoogleplacesGoogleMapsGooglePlaces', 'GoogleMapsGooglePlaces', 'com.abdulrazzaq.googlemapsgoogleplaces', 'icon_GoogleMapsGooglePlaces.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4091, 'com.abdulrazzaq.selffirebaseSelf Firebase', 'Self Firebase', 'com.abdulrazzaq.selffirebase', 'icon_Self Firebase.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4093, 'com.android.completedatabaseComplete Database', 'Complete Database', 'com.android.completedatabase', 'icon_Complete Database.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4094, 'com.coloros.filemanagerFile Manager', 'File Manager', 'com.coloros.filemanager', 'icon_File Manager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4095, 'com.android.mykeyboardCustome KeyBoard', 'Custome KeyBoard', 'com.android.mykeyboard', 'icon_Custome KeyBoard.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4096, 'com.blogspot.atifsoftwares.mobilepackagespakistanMobile Packages Pakistan', 'Mobile Packages Pakistan', 'com.blogspot.atifsoftwares.mobilepackagespakistan', 'icon_Mobile Packages Pakistan.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4097, 'com.brainplow.brainplow.coursefrenzyCourseFrenzy', 'CourseFrenzy', 'com.brainplow.brainplow.coursefrenzy', 'icon_CourseFrenzy.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4098, 'com.brilliantminds39.bookNTS PPSC FPSC Free Download Books', 'NTS PPSC FPSC Free Download Books', 'com.brilliantminds39.book', 'icon_NTS PPSC FPSC Free Download Books.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4099, 'com.danielkim.soundrecorderSound Recorder', 'Sound Recorder', 'com.danielkim.soundrecorder', 'icon_Sound Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4100, 'com.example.hp.checkvolleyCheckVolley', 'CheckVolley', 'com.example.hp.checkvolley', 'icon_CheckVolley.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4101, 'com.eyefilter.nightmode.bluelightfilterBlue Light Filter - Night Mode', 'Blue Light Filter - Night Mode', 'com.eyefilter.nightmode.bluelightfilter', 'icon_Blue Light Filter - Night Mode.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4102, 'com.example.hp.myapplicationMy Application', 'My Application', 'com.example.hp.myapplication', 'icon_My Application.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4103, 'com.fingersoft.hillclimbHill Climb Racing', 'Hill Climb Racing', 'com.fingersoft.hillclimb', 'icon_Hill Climb Racing.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4108, 'com.foodiesofmultan.appFoodies of Multan', 'Foodies of Multan', 'com.foodiesofmultan.app', 'icon_Foodies of Multan.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4109, 'com.google.android.ogyoutubeDownloads', 'Downloads', 'com.google.android.ogyoutube', 'icon_Downloads.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4110, 'com.fiverr.fiverrFiverr', 'Fiverr', 'com.fiverr.fiverr', 'icon_Fiverr.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4111, 'com.heagoo.apkeditorAPK Editor', 'APK Editor', 'com.heagoo.apkeditor', 'icon_APK Editor.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4113, 'com.happyhollow.flash.torchlightFlashLight', 'FlashLight', 'com.happyhollow.flash.torchlight', 'icon_FlashLight.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4115, 'com.redbox.tvRedBoxTV', 'RedBoxTV', 'com.redbox.tv', 'icon_RedBoxTV.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4117, 'com.reelo.reeloReeLO', 'ReeLO', 'com.reelo.reelo', 'icon_ReeLO.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4118, 'com.pluralsightPluralsight', 'Pluralsight', 'com.pluralsight', 'icon_Pluralsight.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4119, 'com.outthinking.weightlossformen30-Day Weight Loss', '30-Day Weight Loss', 'com.outthinking.weightlossformen', 'icon_30-Day Weight Loss.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4120, 'com.rsupport.mvagentMobizen', 'Mobizen', 'com.rsupport.mvagent', 'icon_Mobizen.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4122, 'com.shzlabs.statussaverStatusSaver', 'StatusSaver', 'com.shzlabs.statussaver', 'icon_StatusSaver.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4123, 'com.sonylivSonyLIV', 'SonyLIV', 'com.sonyliv', 'icon_SonyLIV.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4124, 'com.sunnatMy Application', 'My Application', 'com.sunnat', 'icon_My Application.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4125, 'com.tayu.tau.pedometerPedometer', 'Pedometer', 'com.tayu.tau.pedometer', 'icon_Pedometer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4126, 'com.teamtreehouse.androidTreehouse', 'Treehouse', 'com.teamtreehouse.android', 'icon_Treehouse.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4127, 'com.techx.fbdownloaderFbDownloader', 'FbDownloader', 'com.techx.fbdownloader', 'icon_FbDownloader.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4128, 'com.techx.statussaverStatusSaver', 'StatusSaver', 'com.techx.statussaver', 'icon_StatusSaver.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4129, 'com.thesofttech.photocompress.androidappPhoto Compress', 'Photo Compress', 'com.thesofttech.photocompress.androidapp', 'icon_Photo Compress.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4132, 'main.com.locationupdatesLocation Updates', 'Location Updates', 'main.com.locationupdates', 'icon_Location Updates.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4133, 'com.zozo.zosmsZoSms', 'ZoSms', 'com.zozo.zosms', 'icon_ZoSms.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4134, 'com.youdao.hindictU-Dictionary', 'U-Dictionary', 'com.youdao.hindict', 'icon_U-Dictionary.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4135, 'main.com.sendtowhatsappSendToWhatsApp', 'SendToWhatsApp', 'main.com.sendtowhatsapp', 'icon_SendToWhatsApp.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4136, 'man.fit.workout.routine.muscle.trainingManFIT', 'ManFIT', 'man.fit.workout.routine.muscle.training', 'icon_ManFIT.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4137, 'ninja.wpapp.paperjobscomPakistan Jobs', 'Pakistan Jobs', 'ninja.wpapp.paperjobscom', 'icon_Pakistan Jobs.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4138, 'org.horaapps.leafpic.debugLeaks', 'Leaks', 'org.horaapps.leafpic.debug', 'icon_Leaks.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4139, 'pk.com.telenor.phoenixEasypaisa', 'Easypaisa', 'pk.com.telenor.phoenix', 'icon_Easypaisa.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4140, 'org.horaapps.leafpic.debugLeafPic (debug)', 'LeafPic (debug)', 'org.horaapps.leafpic.debug', 'icon_LeafPic (debug).png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4141, 'mcdevs.testpreparationPPSC Test Preparation Book', 'PPSC Test Preparation Book', 'mcdevs.testpreparation', 'icon_PPSC Test Preparation Book.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4142, 'pluralsight.com.codingwithmitchstoreGesturesTEST', 'GesturesTEST', 'pluralsight.com.codingwithmitchstore', 'icon_GesturesTEST.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4529, 'com.android.settingsFingerprint', 'Fingerprint', 'com.android.settings', 'icon_Fingerprint.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4549, 'com.mediatek.datatransferBackup and Restore', 'Backup and Restore', 'com.mediatek.datatransfer', 'icon_Backup and Restore.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4550, 'com.mediatek.videoplayerVideo Player', 'Video Player', 'com.mediatek.videoplayer', 'icon_Video Player.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4551, 'com.transsion.XOSLauncherXOS Launcher', 'XOS Launcher', 'com.transsion.XOSLauncher', 'icon_XOS Launcher.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4556, 'com.android.userguideUser Guide', 'User Guide', 'com.android.userguide', 'icon_User Guide.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4559, 'com.infinix.powercenterXPower', 'XPower', 'com.infinix.powercenter', 'icon_XPower.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4560, 'com.infinix.xshareXShare', 'XShare', 'com.infinix.xshare', 'icon_XShare.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4562, 'com.mediatek.notebookNotes', 'Notes', 'com.mediatek.notebook', 'icon_Notes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4563, 'com.mediatek.systemupdateSystem Update', 'System Update', 'com.mediatek.systemupdate', 'icon_System Update.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4564, 'com.reallytek.compassCompass', 'Compass', 'com.reallytek.compass', 'icon_Compass.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4565, 'com.rlk.feedbackFeedback', 'Feedback', 'com.rlk.feedback', 'icon_Feedback.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4566, 'com.rlk.miXAccount', 'XAccount', 'com.rlk.mi', 'icon_XAccount.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4567, 'com.transsion.mobilebutlerXManager', 'XManager', 'com.transsion.mobilebutler', 'icon_XManager.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4568, 'com.rlk.weathersWeather', 'Weather', 'com.rlk.weathers', 'icon_Weather.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4569, 'com.rlk.xcloudXCloud', 'XCloud', 'com.rlk.xcloud', 'icon_XCloud.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4571, 'com.alkarradatech.whiteboardWhite Board', 'White Board', 'com.alkarradatech.whiteboard', 'icon_White Board.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4575, 'com.transsion.xsecurityXSecurity', 'XSecurity', 'com.transsion.xsecurity', 'icon_XSecurity.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4576, 'com.trassion.infinix.xclubXClub', 'XClub', 'com.trassion.infinix.xclub', 'icon_XClub.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4577, 'com.xui.xhideXHide', 'XHide', 'com.xui.xhide', 'icon_XHide.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4579, 'com.king.candycrushsagaCandy Crush Saga', 'Candy Crush Saga', 'com.king.candycrushsaga', 'icon_Candy Crush Saga.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (4584, 'miniaps.blogspot.com.blockcalculationBlock Calculation', 'Block Calculation', 'miniaps.blogspot.com.blockcalculation', 'icon_Block Calculation.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5072, 'com.dropbox.androidDropbox', 'Dropbox', 'com.dropbox.android', 'icon_Dropbox.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5074, 'filemanager.explorer.cabinet.archiveFile Explorer', 'File Explorer', 'filemanager.explorer.cabinet.archive', 'icon_File Explorer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5082, 'com.sh.haocheng.ulefoneUlefone', 'Ulefone', 'com.sh.haocheng.ulefone', 'icon_Ulefone.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5083, 'air.bg.lan.MonopoliRento 3D', 'Rento 3D', 'air.bg.lan.Monopoli', 'icon_Rento 3D.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5084, 'at.nk.tools.iTranslateiTranslate', 'iTranslate', 'at.nk.tools.iTranslate', 'icon_iTranslate.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5086, 'com.LoopGames.DominoDomino', 'Domino', 'com.LoopGames.Domino', 'icon_Domino.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5087, 'com.adobe.readerAdobe Acrobat', 'Adobe Acrobat', 'com.adobe.reader', 'icon_Adobe Acrobat.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5089, 'com.amego.nesemulatortitaniumgames_punchout_bPunch to Out Emulator', 'Punch to Out Emulator', 'com.amego.nesemulatortitaniumgames_punchout_b', 'icon_Punch to Out Emulator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5090, 'com.mediatek.videoplayerVideos', 'Videos', 'com.mediatek.videoplayer', 'icon_Videos.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5091, 'com.app.free.studio.lockscreenLock screen(live wallpaper)', 'Lock screen(live wallpaper)', 'com.app.free.studio.lockscreen', 'icon_Lock screen(live wallpaper).png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5092, 'com.andrwq.recorderSmart Recorder', 'Smart Recorder', 'com.andrwq.recorder', 'icon_Smart Recorder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5093, 'com.appdoctor.tapemeasure.onlineruler.scalerulerSmart Ruler', 'Smart Ruler', 'com.appdoctor.tapemeasure.onlineruler.scaleruler', 'icon_Smart Ruler.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5094, 'cn.sh.hct.hcttorchTorch', 'Torch', 'cn.sh.hct.hcttorch', 'icon_Torch.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5095, 'com.battlecreek.proseriesPro Series', 'Pro Series', 'com.battlecreek.proseries', 'icon_Pro Series.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5096, 'com.digitalchemy.calculator.freedecimalCalculator Plus', 'Calculator Plus', 'com.digitalchemy.calculator.freedecimal', 'icon_Calculator Plus.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5097, 'com.codegene.femicodes.smartcameratranslatorCamera Translate', 'Camera Translate', 'com.codegene.femicodes.smartcameratranslator', 'icon_Camera Translate.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5100, 'com.eastgrams.linenotesLineNotes', 'LineNotes', 'com.eastgrams.linenotes', 'icon_LineNotes.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5102, 'com.ext.uiApk Extractor', 'Apk Extractor', 'com.ext.ui', 'icon_Apk Extractor.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5103, 'com.fast.free.unblock.secure.vpnSecure VPN', 'Secure VPN', 'com.fast.free.unblock.secure.vpn', 'icon_Secure VPN.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5104, 'com.freelancer.android.messengerFreelancer', 'Freelancer', 'com.freelancer.android.messenger', 'icon_Freelancer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5105, 'com.digitalchemy.flashlightFlashlight Plus', 'Flashlight Plus', 'com.digitalchemy.flashlight', 'icon_Flashlight Plus.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5106, 'com.gears42.surelockSureLock', 'SureLock', 'com.gears42.surelock', 'icon_SureLock.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5107, 'com.gears42.surelockSureMDM Nix', 'SureMDM Nix', 'com.gears42.surelock', 'icon_SureMDM Nix.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5109, 'com.google.android.apps.authenticator2Authenticator', 'Authenticator', 'com.google.android.apps.authenticator2', 'icon_Authenticator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5111, 'com.image.translate.cameratranslatorCamera Translator', 'Camera Translator', 'com.image.translate.cameratranslator', 'icon_Camera Translator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5112, 'com.meltingsource.DocsViewerDocs Viewer', 'Docs Viewer', 'com.meltingsource.DocsViewer', 'icon_Docs Viewer.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5114, 'com.train.cht.chttrainsChina Train Booking', 'China Train Booking', 'com.train.cht.chttrains', 'icon_China Train Booking.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5117, 'com.promobitech.mobilock.proMobiLock Pro', 'MobiLock Pro', 'com.promobitech.mobilock.pro', 'icon_MobiLock Pro.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5118, 'com.privateinternetaccess.androidPIA VPN', 'PIA VPN', 'com.privateinternetaccess.android', 'icon_PIA VPN.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5120, 'com.vortexsecure.imsicatcherAIMSICD', 'AIMSICD', 'com.vortexsecure.imsicatcher', 'icon_AIMSICD.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5122, 'com.zentertain.photoeditorPhoto Editor Pro', 'Photo Editor Pro', 'com.zentertain.photoeditor', 'icon_Photo Editor Pro.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5124, 'me.gfuil.bmapBmap', 'Bmap', 'me.gfuil.bmap', 'icon_Bmap.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5125, 'mobi.infolife.uninstallerEasy Uninstaller', 'Easy Uninstaller', 'mobi.infolife.uninstaller', 'icon_Easy Uninstaller.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5126, 'nu.lower.brightnessLower Brightness', 'Lower Brightness', 'nu.lower.brightness', 'icon_Lower Brightness.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5127, 'com.socialnmobile.dictapps.notepad.color.noteColorNote', 'ColorNote', 'com.socialnmobile.dictapps.notepad.color.note', 'icon_ColorNote.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5128, 'com.travelchinaguide.chinatrainsV2China Trains', 'China Trains', 'com.travelchinaguide.chinatrainsV2', 'icon_China Trains.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5129, 'com.vinson.shrinkerLit Photo', 'Lit Photo', 'com.vinson.shrinker', 'icon_Lit Photo.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5131, 'org.getlantern.lanternLantern', 'Lantern', 'org.getlantern.lantern', 'icon_Lantern.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (5133, 'tw.mobileapp.qrcode.bannerQR Code Reader', 'QR Code Reader', 'tw.mobileapp.qrcode.banner', 'icon_QR Code Reader.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6104, 'com.abdulrazzaq.stepperlibraryStepper Library', 'Stepper Library', 'com.abdulrazzaq.stepperlibrary', 'icon_Stepper Library.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6105, 'com.abdulrazzaq.compresscameraCompress Camera', 'Compress Camera', 'com.abdulrazzaq.compresscamera', 'icon_Compress Camera.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6111, 'com.brokenreality.planemerger.androidMerge Plane', 'Merge Plane', 'com.brokenreality.planemerger.android', 'icon_Merge Plane.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6115, 'com.e.androidappwidgetAndroid App Widget', 'Android App Widget', 'com.e.androidappwidget', 'icon_Android App Widget.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6116, 'com.digidust.elokence.akinator.freemiumAkinator', 'Akinator', 'com.digidust.elokence.akinator.freemium', 'icon_Akinator.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6118, 'com.gerald.colorcodefinderColor code finder', 'Color code finder', 'com.gerald.colorcodefinder', 'icon_Color code finder.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6127, 'com.myapplicationFragmentExample 1', 'FragmentExample 1', 'com.myapplication', 'icon_FragmentExample 1.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6141, 'io.voodoo.paper2Paper.io 2', 'Paper.io 2', 'io.voodoo.paper2', 'icon_Paper.io 2.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6189, 'com.superplusgames.hosandroidHills of Steel', 'Hills of Steel', 'com.superplusgames.hosandroid', 'icon_Hills of Steel.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6194, 'com.zhiliaoapp.musicallyTikTok', 'TikTok', 'com.zhiliaoapp.musically', 'icon_TikTok.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6236, 'com.example.whatsappmarketingWhatsAppMarketing', 'WhatsAppMarketing', 'com.example.whatsappmarketing', 'icon_WhatsAppMarketing.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6277, 'com.codefish.sqeditSKEDit', 'SKEDit', 'com.codefish.sqedit', 'icon_SKEDit.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6280, 'com.example.whatsappmarketingWhatsapp Marketing', 'Whatsapp Marketing', 'com.example.whatsappmarketing', 'icon_Whatsapp Marketing.png', '2019-03-18 16:56:03', NULL);
INSERT INTO `apps_info` VALUES (6291, 'xyz.hexene.localvpnLocal VPN', 'Local VPN', 'xyz.hexene.localvpn', 'icon_Local VPN.png', '2019-03-18 16:56:03', NULL);

-- ----------------------------
-- Table structure for chat_ids
-- ----------------------------
DROP TABLE IF EXISTS `chat_ids`;
CREATE TABLE `chat_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `chat_id` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT '0',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `chat_id_unique`(`chat_id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 82 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of chat_ids
-- ----------------------------
INSERT INTO `chat_ids` VALUES (4, '10', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (25, '2', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (26, '7', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (28, '5', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (29, '6', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (31, '8', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (32, '9', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (33, '11', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (34, '13', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (36, '12', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (37, '5141281294', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (38, '5141281298', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (39, '5141281289', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (40, '5141281290', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (41, '5141281295', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (42, '5141281296', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (43, '5141281297', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (44, '5141281288', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (45, '5141281291', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (46, '5141281292', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (47, '5141281293', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (48, '5141281299', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (49, '5141281300', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (50, '5141281307', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (51, '5141281306', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (52, '5141281304', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (53, '5141281309', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (54, '5141281311', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (55, '5141281312', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (56, '5141281313', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (57, '5141281314', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (58, '5141281308', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (59, '5141281315', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (60, '5141281316', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (61, '5141281301', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (62, '5141281302', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (63, '5141281303', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (64, '5141281317', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (65, '5141281305', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (66, '5141281322', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (67, '5141281310', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (68, '5141281324', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (69, '5141281325', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (70, '5141281326', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (71, '5141281327', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (72, '5141281328', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (73, '5141281318', '1', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (74, '5141281320', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (75, '5141281319', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (76, '5141281330', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (77, '5141281329', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (78, '5141281321', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (79, '5141281323', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (80, '5141281331', '0', '2019-03-18 16:58:53', NULL);
INSERT INTO `chat_ids` VALUES (81, '100', '0', '2019-03-18 16:58:53', NULL);

-- ----------------------------
-- Table structure for commands
-- ----------------------------
DROP TABLE IF EXISTS `commands`;
CREATE TABLE `commands`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `cmd_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `is_reciprocal` tinyint(4) NOT NULL DEFAULT 0,
  `resiprocal_id` int(11) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 13 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of commands
-- ----------------------------
INSERT INTO `commands` VALUES (1, 'apply', 0, 0);
INSERT INTO `commands` VALUES (2, 'undo', 0, 0);
INSERT INTO `commands` VALUES (3, 'redo', 0, 0);
INSERT INTO `commands` VALUES (4, 'clear_all', 0, 0);
INSERT INTO `commands` VALUES (5, 'push', 0, 0);
INSERT INTO `commands` VALUES (6, 'pull', 0, 0);
INSERT INTO `commands` VALUES (7, 'load_profile', 0, 0);
INSERT INTO `commands` VALUES (8, 'save_profile', 0, 0);
INSERT INTO `commands` VALUES (9, 'load_history', 0, 0);
INSERT INTO `commands` VALUES (10, 'load_policy', 0, 0);
INSERT INTO `commands` VALUES (11, 'disable', 0, 0);
INSERT INTO `commands` VALUES (12, 'save_policy', 0, 0);

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
) ENGINE = InnoDB AUTO_INCREMENT = 34 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dealer_dropdown_list
-- ----------------------------
INSERT INTO `dealer_dropdown_list` VALUES (23, 154, '[\"DEVICE ID\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"STATUS\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (24, 180, '[{\"id\":1,\"itemName\":\"Device ID\"},{\"id\":2,\"itemName\":\"Name\"},{\"id\":3,\"itemName\":\"Account Email\"},{\"id\":4,\"itemName\":\"PGP Email\"},{\"id\":5,\"itemName\":\"Chat ID\"},{\"id\":6,\"itemName\":\"Client ID\"},{\"id\":7,\"itemName\":\"Dealer Pin\"},{\"id\":8,\"itemName\":\"Mac Address\"},{\"id\":10,\"itemName\":\"SIM ID\"},{\"id\":11,\"itemName\":\"IMEI\"},{\"id\":12,\"itemName\":\"SIM No\"},{\"id\":13,\"itemName\":\"IMEI 2\"},{\"id\":14,\"itemName\":\"SIM No 2\"},{\"id\":15,\"itemName\":\"Serial Number\"},{\"id\":16,\"itemName\":\"Status\"},{\"id\":17,\"itemName\":\"Model\"},{\"id\":18,\"itemName\":\"Start Date\"},{\"id\":19,\"itemName\":\"Expiry Date\"},{\"id\":20,\"itemName\":\"Dealer Name\"},{\"id\":21,\"itemName\":\"Online\"},{\"id\":22,\"itemName\":\"S Dealer\"},{\"id\":23,\"itemName\":\"S Dealer Name\"}]', 'devices', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (25, 154, '[\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\",\"DEALER ID\",\"DEALER NAME\"]', 'sdealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (26, 154, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\"]', 'dealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (27, 154, '[\"APK\",\"APP NAME\",\"APP LOGO\",\"APP STATUS\"]', 'apk', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (28, 189, '[\"ACTIONS\"]', 'devices', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (29, 189, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\",\"PARENT DEALER\",\"PARENT DEALER ID\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (30, 189, '[\"ACTIONS\"]', 'dealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (31, 204, '[\"DEVICE ID\",\"DEVICE NAME\",\"ACCOUNT EMAIL\",\"ACTIVATION CODE\",\"PGP EMAIL\",\"CHAT ID\",\"CLIENT ID\",\"DEALER ID\",\"DEALER PIN\",\"MAC ADDRESS\",\"SIM ID\",\"IMEI 1\",\"SIM 1\",\"IMEI 2\",\"SIM 2\",\"SERIAL NUMBER\",\"STATUS\",\"MODEL\",\"START DATE\",\"EXPIRY DATE\",\"DEALER NAME\",\"ONLINE\",\"S-DEALER\",\"S-DEALER NAME\"]', 'devices', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (32, 204, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');
INSERT INTO `dealer_dropdown_list` VALUES (33, 204, '[\"DEALER ID\",\"DEALER NAME\",\"DEALER EMAIL\",\"DEALER PIN\",\"CONNECTED DEVICES\",\"TOKENS\",\"PARENT DEALER\",\"PARENT DEALER ID\"]', 'sdealer', '2019-03-19 11:56:32', '2019-03-19 11:56:32');

-- ----------------------------
-- Table structure for dealer_pagination
-- ----------------------------
DROP TABLE IF EXISTS `dealer_pagination`;
CREATE TABLE `dealer_pagination`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `dealer_id` int(10) NOT NULL,
  `record_per_page` int(10) NOT NULL,
  `type` enum('devices','dealer','sdealer','apk') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'devices',
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Fixed;

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
) ENGINE = InnoDB AUTO_INCREMENT = 211 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of dealers
-- ----------------------------
INSERT INTO `dealers` VALUES (154, 'Neha', 'Kashyap', 0, 'admin', 'admin@gmail.com', 'e6e061838856bf47e1de730719fb2609', '', 1, 0, NULL, '2019-02-08 09:50:04', '2019-02-08 09:50:04');
INSERT INTO `dealers` VALUES (189, NULL, NULL, 0, 'usman', 'usman@sunztech.com', '5e2298c85aac34a2ff3e4610eb4dbce0', '606248', 2, 0, NULL, '2019-03-05 10:53:16', '2019-03-05 10:53:16');
INSERT INTO `dealers` VALUES (191, NULL, NULL, 0, 'salman', 'salman@sunztech.com', '1cb1e9cc9df9116b710c76a75bc011cc', '189184', 2, 0, NULL, '2019-03-08 18:00:42', '2019-03-08 18:00:42');
INSERT INTO `dealers` VALUES (193, NULL, NULL, 189, 'salman khan', 'samznight@gmail.com', '5c1cbdd399bbb2a6116e36bf8dc9f95a', '226295', 3, 0, NULL, '2019-03-08 18:39:14', '2019-03-08 18:39:14');
INSERT INTO `dealers` VALUES (195, NULL, NULL, 0, 'testing', 'newu@mail-cart.com', '9fa48bbd844c45960b07a59612055dc3', '379799', 2, 0, NULL, '2019-03-08 19:03:03', '2019-03-08 19:03:03');
INSERT INTO `dealers` VALUES (196, NULL, NULL, 0, 'sdklfjslk', 'usman@freeweb.email', '771e8103951d969169f6e7d024868533', '021993', 2, 0, NULL, '2019-03-08 19:06:02', '2019-03-08 19:06:02');
INSERT INTO `dealers` VALUES (197, NULL, NULL, 0, 'hello usman', 'usman12@alpha-web.net', 'adac19e69ec6acda492fc82946852bc5', '485234', 2, 0, NULL, '2019-03-08 19:08:28', '2019-03-08 19:08:28');
INSERT INTO `dealers` VALUES (198, NULL, NULL, 0, 'usman', 'usman123@alpha-web.net', 'e2b48fa0c4dc67dfd8f45ab1c4ad2ec7', '881795', 2, 0, NULL, '2019-03-08 19:11:27', '2019-03-08 19:11:27');
INSERT INTO `dealers` VALUES (199, NULL, NULL, 0, 'usman', 'usman1234@alpha-web.net', '8d1ca799021736da5f5e6fb8ef3c6103', '664915', 2, 0, NULL, '2019-03-08 19:13:36', '2019-03-08 19:13:36');
INSERT INTO `dealers` VALUES (204, NULL, NULL, 0, 'usman', 'usmanhafeez147@gmail.com', '3239e8133da538aa18a39f74a8e1b1cc', '786218', 2, 0, NULL, '2019-03-09 09:01:39', '2019-03-09 09:01:39');
INSERT INTO `dealers` VALUES (205, NULL, NULL, 204, 'usman', 'usman12345@alpha-web.net', '71ffeef77e9af9ee598c50204acfcbd7', '979810', 3, 0, NULL, '2019-03-09 14:33:54', '2019-03-09 14:33:54');
INSERT INTO `dealers` VALUES (206, NULL, NULL, 0, 'usman', 'usman12356@gmail.com', 'e1d9790b54d3dd815b600d566d1f496c', '690555', 2, 0, NULL, '2019-03-14 17:24:03', '2019-03-14 17:24:03');
INSERT INTO `dealers` VALUES (207, NULL, NULL, 0, 'usman', 'usmanother@gmail.com', '09552ac4174d7c21311b72ce9ddd8159', '876925', 2, 0, NULL, '2019-03-14 17:24:23', '2019-03-14 17:24:23');
INSERT INTO `dealers` VALUES (208, NULL, NULL, 0, 'mehran', 'mehranother@gmail.com', '240791f1440900bc05b7c3e96c22c85d', '625406', 2, 0, '', '2019-03-14 17:24:41', '2019-03-14 17:24:41');
INSERT INTO `dealers` VALUES (209, NULL, NULL, 0, 'usman', 'arfan@gmail.com', 'dcc3c113521009f6dad3c3249869fbf8', '158909', 2, 0, NULL, '2019-03-15 15:23:41', '2019-03-15 15:23:41');
INSERT INTO `dealers` VALUES (210, NULL, NULL, 0, 'arfan', 'arfan123@gmail.com', 'a70019722ea494e59ef74a035b7fcf36', '066222', 2, 0, NULL, '2019-03-15 15:24:31', '2019-03-15 15:24:31');

-- ----------------------------
-- Table structure for device_controls
-- ----------------------------
DROP TABLE IF EXISTS `device_controls`;
CREATE TABLE `device_controls`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `control_name` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device_controls
-- ----------------------------
INSERT INTO `device_controls` VALUES (1, 'wifi');
INSERT INTO `device_controls` VALUES (2, 'bluetooth');
INSERT INTO `device_controls` VALUES (3, 'hotspot');
INSERT INTO `device_controls` VALUES (4, 'location services');
INSERT INTO `device_controls` VALUES (5, 'screen capture');
INSERT INTO `device_controls` VALUES (6, 'block calls');

-- ----------------------------
-- Table structure for device_history
-- ----------------------------
DROP TABLE IF EXISTS `device_history`;
CREATE TABLE `device_history`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `dealer_id` int(11) NULL DEFAULT 0,
  `device_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `app_list` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `setting` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `controls` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `passwords` text CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL,
  `type` enum('policy','profile','history') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL DEFAULT 'history',
  `status` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 519 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of device_history
-- ----------------------------
INSERT INTO `device_history` VALUES (513, '', 0, 'KLEV719137', '[{\"id\":4574,\"app_id\":1407,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.android.calendar\"},{\"id\":4583,\"app_id\":1408,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":4575,\"app_id\":1409,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.deskclock\"},{\"id\":4577,\"app_id\":1410,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Dialer\",\"uniqueName\":\"com.android.contactsDialer\",\"icon\":\"icon_Dialer.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4578,\"app_id\":1411,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4576,\"app_id\":1412,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":4573,\"app_id\":1413,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"packageName\":\"com.android.email\"},{\"id\":4581,\"app_id\":1414,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"packageName\":\"com.android.mms\"},{\"id\":4582,\"app_id\":1415,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Music\",\"uniqueName\":\"com.android.mediacenterMusic\",\"icon\":\"icon_Music.png\",\"packageName\":\"com.android.mediacenter\"},{\"id\":4580,\"app_id\":1416,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"packageName\":\"com.android.gallery3d\"},{\"id\":4579,\"app_id\":1417,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":4584,\"app_id\":1418,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Notepad\",\"uniqueName\":\"com.example.android.notepadNotepad\",\"icon\":\"icon_Notepad.png\",\"packageName\":\"com.example.android.notepad\"},{\"id\":4585,\"app_id\":1419,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":4593,\"app_id\":1420,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Docs\",\"uniqueName\":\"com.google.android.apps.docs.editors.docsDocs\",\"icon\":\"icon_Docs.png\",\"packageName\":\"com.google.android.apps.docs.editors.docs\"},{\"id\":4588,\"app_id\":1421,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Sheets\",\"uniqueName\":\"com.google.android.apps.docs.editors.sheetsSheets\",\"icon\":\"icon_Sheets.png\",\"packageName\":\"com.google.android.apps.docs.editors.sheets\"},{\"id\":4587,\"app_id\":1422,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Slides\",\"uniqueName\":\"com.google.android.apps.docs.editors.slidesSlides\",\"icon\":\"icon_Slides.png\",\"packageName\":\"com.google.android.apps.docs.editors.slides\"},{\"id\":4600,\"app_id\":1423,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":4586,\"app_id\":1424,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":4592,\"app_id\":1425,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":4602,\"app_id\":1426,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":4595,\"app_id\":1427,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":4603,\"app_id\":1428,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Downloads\",\"uniqueName\":\"com.android.documentsuiDownloads\",\"icon\":\"icon_Downloads.png\",\"packageName\":\"com.android.documentsui\"},{\"id\":4599,\"app_id\":1429,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mirror\",\"uniqueName\":\"com.android.hwmirrorMirror\",\"icon\":\"icon_Mirror.png\",\"packageName\":\"com.android.hwmirror\"},{\"id\":4589,\"app_id\":1430,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":4601,\"app_id\":1431,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"packageName\":\"com.android.calculator2\"},{\"id\":4596,\"app_id\":1432,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HUAWEI Video\",\"uniqueName\":\"com.huawei.himovie.overseasHUAWEI Video\",\"icon\":\"icon_HUAWEI Video.png\",\"packageName\":\"com.huawei.himovie.overseas\"},{\"id\":4594,\"app_id\":1433,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Files\",\"uniqueName\":\"com.huawei.hidiskFiles\",\"icon\":\"icon_Files.png\",\"packageName\":\"com.huawei.hidisk\"},{\"id\":4606,\"app_id\":1434,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Recorder\",\"uniqueName\":\"com.android.soundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.soundrecorder\"},{\"id\":4605,\"app_id\":1435,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"packageName\":\"com.android.stk\"},{\"id\":4597,\"app_id\":1436,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Flashlight\",\"uniqueName\":\"com.android.systemuiFlashlight\",\"icon\":\"icon_Flashlight.png\",\"packageName\":\"com.android.systemui\"},{\"id\":4604,\"app_id\":1437,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":4598,\"app_id\":1438,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Clone\",\"uniqueName\":\"com.hicloud.android.clonePhone Clone\",\"icon\":\"icon_Phone Clone.png\",\"packageName\":\"com.hicloud.android.clone\"},{\"id\":4590,\"app_id\":1439,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Uber\",\"uniqueName\":\"com.ubercabUber\",\"icon\":\"icon_Uber.png\",\"packageName\":\"com.ubercab\"},{\"id\":4608,\"app_id\":1440,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Backup & restore\",\"uniqueName\":\"com.huawei.KoBackupBackup & restore\",\"icon\":\"icon_Backup & restore.png\",\"packageName\":\"com.huawei.KoBackup\"},{\"id\":4607,\"app_id\":1441,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"FM Radio\",\"uniqueName\":\"com.huawei.android.FMRadioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.huawei.android.FMRadio\"},{\"id\":4610,\"app_id\":1442,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"System update\",\"uniqueName\":\"com.huawei.android.hwoucSystem update\",\"icon\":\"icon_System update.png\",\"packageName\":\"com.huawei.android.hwouc\"},{\"id\":4611,\"app_id\":1443,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Themes\",\"uniqueName\":\"com.huawei.android.thememanagerThemes\",\"icon\":\"icon_Themes.png\",\"packageName\":\"com.huawei.android.thememanager\"},{\"id\":4616,\"app_id\":1444,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"AppGallery\",\"uniqueName\":\"com.huawei.appmarketAppGallery\",\"icon\":\"icon_AppGallery.png\",\"packageName\":\"com.huawei.appmarket\"},{\"id\":4609,\"app_id\":1445,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Weather\",\"uniqueName\":\"com.huawei.android.totemweatherappWeather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.huawei.android.totemweatherapp\"},{\"id\":4591,\"app_id\":1446,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Camera\",\"uniqueName\":\"com.huawei.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.huawei.camera\"},{\"id\":4617,\"app_id\":1447,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Compass\",\"uniqueName\":\"com.huawei.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.huawei.compass\"},{\"id\":4620,\"app_id\":1448,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Health\",\"uniqueName\":\"com.huawei.healthHealth\",\"icon\":\"icon_Health.png\",\"packageName\":\"com.huawei.health\"},{\"id\":4622,\"app_id\":1449,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Asana\",\"uniqueName\":\"com.asana.appAsana\",\"icon\":\"icon_Asana.png\",\"packageName\":\"com.asana.app\"},{\"id\":4628,\"app_id\":1450,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gboard\",\"uniqueName\":\"com.google.android.inputmethod.latinGboard\",\"icon\":\"icon_Gboard.png\",\"packageName\":\"com.google.android.inputmethod.latin\"},{\"id\":4625,\"app_id\":1451,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Islam360\",\"uniqueName\":\"com.islam360Islam360\",\"icon\":\"icon_Islam360.png\",\"packageName\":\"com.islam360\"},{\"id\":4629,\"app_id\":1452,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mustakbil\",\"uniqueName\":\"com.mustakbilMustakbil\",\"icon\":\"icon_Mustakbil.png\",\"packageName\":\"com.mustakbil\"},{\"id\":4626,\"app_id\":1453,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SwiftKey Keyboard\",\"uniqueName\":\"com.touchtype.swiftkeySwiftKey Keyboard\",\"icon\":\"icon_SwiftKey Keyboard.png\",\"packageName\":\"com.touchtype.swiftkey\"},{\"id\":4614,\"app_id\":1454,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Quik\",\"uniqueName\":\"com.stupeflix.replayQuik\",\"icon\":\"icon_Quik.png\",\"packageName\":\"com.stupeflix.replay\"},{\"id\":4627,\"app_id\":1455,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Manager\",\"uniqueName\":\"com.huawei.systemmanagerPhone Manager\",\"icon\":\"icon_Phone Manager.png\",\"packageName\":\"com.huawei.systemmanager\"},{\"id\":4630,\"app_id\":1456,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"OLX Pakistan\",\"uniqueName\":\"com.olx.pkOLX Pakistan\",\"icon\":\"icon_OLX Pakistan.png\",\"packageName\":\"com.olx.pk\"},{\"id\":4619,\"app_id\":1457,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HiCare\",\"uniqueName\":\"com.huawei.phoneserviceHiCare\",\"icon\":\"icon_HiCare.png\",\"packageName\":\"com.huawei.phoneservice\"},{\"id\":4633,\"app_id\":1458,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Payoneer\",\"uniqueName\":\"com.payoneer.androidPayoneer\",\"icon\":\"icon_Payoneer.png\",\"packageName\":\"com.payoneer.android\"},{\"id\":4634,\"app_id\":1459,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"MDM Client\",\"uniqueName\":\"com.secureportal.barryappMDM Client\",\"icon\":\"icon_MDM Client.png\",\"packageName\":\"com.secureportal.barryapp\"},{\"id\":4618,\"app_id\":1460,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"ahlesunnatpak\",\"uniqueName\":\"com.ahlesunnatpakahlesunnatpak\",\"icon\":\"icon_ahlesunnatpak.png\",\"packageName\":\"com.ahlesunnatpak\"},{\"id\":4635,\"app_id\":1461,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Skype\",\"uniqueName\":\"com.skype.raiderSkype\",\"icon\":\"icon_Skype.png\",\"packageName\":\"com.skype.raider\"},{\"id\":4624,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":4637,\"app_id\":1463,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"},{\"id\":4631,\"app_id\":1464,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"My Zong\",\"uniqueName\":\"com.zong.customercareMy Zong\",\"icon\":\"icon_My Zong.png\",\"packageName\":\"com.zong.customercare\"},{\"id\":4632,\"app_id\":1465,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":4621,\"app_id\":1466,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Facebook\",\"uniqueName\":\"com.facebook.katanaFacebook\",\"icon\":\"icon_Facebook.png\",\"packageName\":\"com.facebook.katana\"},{\"id\":4613,\"app_id\":1467,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Careem\",\"uniqueName\":\"com.careem.acmaCareem\",\"icon\":\"icon_Careem.png\",\"packageName\":\"com.careem.acma\"},{\"id\":4636,\"app_id\":1468,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SC\",\"uniqueName\":\"com.scb.pk.bmwSC\",\"icon\":\"icon_SC.png\",\"packageName\":\"com.scb.pk.bmw\"},{\"id\":4623,\"app_id\":1504,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WeChat\",\"uniqueName\":\"com.tencent.mmWeChat\",\"icon\":\"icon_WeChat.png\",\"packageName\":\"com.tencent.mm\"},{\"id\":4612,\"app_id\":1624,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Adhan alarm offline\",\"uniqueName\":\"com.adhan.alarm.offlineAdhan alarm offline\",\"icon\":\"icon_Adhan alarm offline.png\",\"packageName\":\"com.adhan.alarm.offline\"},{\"id\":4615,\"app_id\":3780,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"JavaTest\",\"uniqueName\":\"com.example.javatestJavaTest\",\"icon\":\"icon_JavaTest.png\",\"packageName\":\"com.example.javatest\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'history', 0, '2019-03-06 15:45:40', '2019-03-15 16:29:26');
INSERT INTO `device_history` VALUES (514, '', 0, 'KLEV719137', '[{\"id\":4574,\"app_id\":1407,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.android.calendar\"},{\"id\":4583,\"app_id\":1408,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":4575,\"app_id\":1409,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.deskclock\"},{\"id\":4577,\"app_id\":1410,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Dialer\",\"uniqueName\":\"com.android.contactsDialer\",\"icon\":\"icon_Dialer.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4578,\"app_id\":1411,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4576,\"app_id\":1412,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":4573,\"app_id\":1413,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"packageName\":\"com.android.email\"},{\"id\":4581,\"app_id\":1414,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"packageName\":\"com.android.mms\"},{\"id\":4582,\"app_id\":1415,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Music\",\"uniqueName\":\"com.android.mediacenterMusic\",\"icon\":\"icon_Music.png\",\"packageName\":\"com.android.mediacenter\"},{\"id\":4580,\"app_id\":1416,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"packageName\":\"com.android.gallery3d\"},{\"id\":4579,\"app_id\":1417,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":4584,\"app_id\":1418,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Notepad\",\"uniqueName\":\"com.example.android.notepadNotepad\",\"icon\":\"icon_Notepad.png\",\"packageName\":\"com.example.android.notepad\"},{\"id\":4585,\"app_id\":1419,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":4593,\"app_id\":1420,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Docs\",\"uniqueName\":\"com.google.android.apps.docs.editors.docsDocs\",\"icon\":\"icon_Docs.png\",\"packageName\":\"com.google.android.apps.docs.editors.docs\"},{\"id\":4588,\"app_id\":1421,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Sheets\",\"uniqueName\":\"com.google.android.apps.docs.editors.sheetsSheets\",\"icon\":\"icon_Sheets.png\",\"packageName\":\"com.google.android.apps.docs.editors.sheets\"},{\"id\":4587,\"app_id\":1422,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Slides\",\"uniqueName\":\"com.google.android.apps.docs.editors.slidesSlides\",\"icon\":\"icon_Slides.png\",\"packageName\":\"com.google.android.apps.docs.editors.slides\"},{\"id\":4600,\"app_id\":1423,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":4586,\"app_id\":1424,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":4592,\"app_id\":1425,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":4602,\"app_id\":1426,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":4595,\"app_id\":1427,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":4603,\"app_id\":1428,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Downloads\",\"uniqueName\":\"com.android.documentsuiDownloads\",\"icon\":\"icon_Downloads.png\",\"packageName\":\"com.android.documentsui\"},{\"id\":4599,\"app_id\":1429,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mirror\",\"uniqueName\":\"com.android.hwmirrorMirror\",\"icon\":\"icon_Mirror.png\",\"packageName\":\"com.android.hwmirror\"},{\"id\":4589,\"app_id\":1430,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":4601,\"app_id\":1431,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"packageName\":\"com.android.calculator2\"},{\"id\":4596,\"app_id\":1432,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HUAWEI Video\",\"uniqueName\":\"com.huawei.himovie.overseasHUAWEI Video\",\"icon\":\"icon_HUAWEI Video.png\",\"packageName\":\"com.huawei.himovie.overseas\"},{\"id\":4594,\"app_id\":1433,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Files\",\"uniqueName\":\"com.huawei.hidiskFiles\",\"icon\":\"icon_Files.png\",\"packageName\":\"com.huawei.hidisk\"},{\"id\":4606,\"app_id\":1434,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Recorder\",\"uniqueName\":\"com.android.soundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.soundrecorder\"},{\"id\":4605,\"app_id\":1435,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"packageName\":\"com.android.stk\"},{\"id\":4597,\"app_id\":1436,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Flashlight\",\"uniqueName\":\"com.android.systemuiFlashlight\",\"icon\":\"icon_Flashlight.png\",\"packageName\":\"com.android.systemui\"},{\"id\":4604,\"app_id\":1437,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":4598,\"app_id\":1438,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Clone\",\"uniqueName\":\"com.hicloud.android.clonePhone Clone\",\"icon\":\"icon_Phone Clone.png\",\"packageName\":\"com.hicloud.android.clone\"},{\"id\":4590,\"app_id\":1439,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Uber\",\"uniqueName\":\"com.ubercabUber\",\"icon\":\"icon_Uber.png\",\"packageName\":\"com.ubercab\"},{\"id\":4608,\"app_id\":1440,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Backup & restore\",\"uniqueName\":\"com.huawei.KoBackupBackup & restore\",\"icon\":\"icon_Backup & restore.png\",\"packageName\":\"com.huawei.KoBackup\"},{\"id\":4607,\"app_id\":1441,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"FM Radio\",\"uniqueName\":\"com.huawei.android.FMRadioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.huawei.android.FMRadio\"},{\"id\":4610,\"app_id\":1442,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"System update\",\"uniqueName\":\"com.huawei.android.hwoucSystem update\",\"icon\":\"icon_System update.png\",\"packageName\":\"com.huawei.android.hwouc\"},{\"id\":4611,\"app_id\":1443,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Themes\",\"uniqueName\":\"com.huawei.android.thememanagerThemes\",\"icon\":\"icon_Themes.png\",\"packageName\":\"com.huawei.android.thememanager\"},{\"id\":4616,\"app_id\":1444,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"AppGallery\",\"uniqueName\":\"com.huawei.appmarketAppGallery\",\"icon\":\"icon_AppGallery.png\",\"packageName\":\"com.huawei.appmarket\"},{\"id\":4609,\"app_id\":1445,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Weather\",\"uniqueName\":\"com.huawei.android.totemweatherappWeather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.huawei.android.totemweatherapp\"},{\"id\":4591,\"app_id\":1446,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Camera\",\"uniqueName\":\"com.huawei.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.huawei.camera\"},{\"id\":4617,\"app_id\":1447,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Compass\",\"uniqueName\":\"com.huawei.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.huawei.compass\"},{\"id\":4620,\"app_id\":1448,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Health\",\"uniqueName\":\"com.huawei.healthHealth\",\"icon\":\"icon_Health.png\",\"packageName\":\"com.huawei.health\"},{\"id\":4622,\"app_id\":1449,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Asana\",\"uniqueName\":\"com.asana.appAsana\",\"icon\":\"icon_Asana.png\",\"packageName\":\"com.asana.app\"},{\"id\":4628,\"app_id\":1450,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gboard\",\"uniqueName\":\"com.google.android.inputmethod.latinGboard\",\"icon\":\"icon_Gboard.png\",\"packageName\":\"com.google.android.inputmethod.latin\"},{\"id\":4625,\"app_id\":1451,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Islam360\",\"uniqueName\":\"com.islam360Islam360\",\"icon\":\"icon_Islam360.png\",\"packageName\":\"com.islam360\"},{\"id\":4629,\"app_id\":1452,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mustakbil\",\"uniqueName\":\"com.mustakbilMustakbil\",\"icon\":\"icon_Mustakbil.png\",\"packageName\":\"com.mustakbil\"},{\"id\":4626,\"app_id\":1453,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SwiftKey Keyboard\",\"uniqueName\":\"com.touchtype.swiftkeySwiftKey Keyboard\",\"icon\":\"icon_SwiftKey Keyboard.png\",\"packageName\":\"com.touchtype.swiftkey\"},{\"id\":4614,\"app_id\":1454,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Quik\",\"uniqueName\":\"com.stupeflix.replayQuik\",\"icon\":\"icon_Quik.png\",\"packageName\":\"com.stupeflix.replay\"},{\"id\":4627,\"app_id\":1455,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Manager\",\"uniqueName\":\"com.huawei.systemmanagerPhone Manager\",\"icon\":\"icon_Phone Manager.png\",\"packageName\":\"com.huawei.systemmanager\"},{\"id\":4630,\"app_id\":1456,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"OLX Pakistan\",\"uniqueName\":\"com.olx.pkOLX Pakistan\",\"icon\":\"icon_OLX Pakistan.png\",\"packageName\":\"com.olx.pk\"},{\"id\":4619,\"app_id\":1457,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HiCare\",\"uniqueName\":\"com.huawei.phoneserviceHiCare\",\"icon\":\"icon_HiCare.png\",\"packageName\":\"com.huawei.phoneservice\"},{\"id\":4633,\"app_id\":1458,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Payoneer\",\"uniqueName\":\"com.payoneer.androidPayoneer\",\"icon\":\"icon_Payoneer.png\",\"packageName\":\"com.payoneer.android\"},{\"id\":4634,\"app_id\":1459,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"MDM Client\",\"uniqueName\":\"com.secureportal.barryappMDM Client\",\"icon\":\"icon_MDM Client.png\",\"packageName\":\"com.secureportal.barryapp\"},{\"id\":4618,\"app_id\":1460,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"ahlesunnatpak\",\"uniqueName\":\"com.ahlesunnatpakahlesunnatpak\",\"icon\":\"icon_ahlesunnatpak.png\",\"packageName\":\"com.ahlesunnatpak\"},{\"id\":4635,\"app_id\":1461,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Skype\",\"uniqueName\":\"com.skype.raiderSkype\",\"icon\":\"icon_Skype.png\",\"packageName\":\"com.skype.raider\"},{\"id\":4624,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":4637,\"app_id\":1463,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"},{\"id\":4631,\"app_id\":1464,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"My Zong\",\"uniqueName\":\"com.zong.customercareMy Zong\",\"icon\":\"icon_My Zong.png\",\"packageName\":\"com.zong.customercare\"},{\"id\":4632,\"app_id\":1465,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":4621,\"app_id\":1466,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Facebook\",\"uniqueName\":\"com.facebook.katanaFacebook\",\"icon\":\"icon_Facebook.png\",\"packageName\":\"com.facebook.katana\"},{\"id\":4613,\"app_id\":1467,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Careem\",\"uniqueName\":\"com.careem.acmaCareem\",\"icon\":\"icon_Careem.png\",\"packageName\":\"com.careem.acma\"},{\"id\":4636,\"app_id\":1468,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SC\",\"uniqueName\":\"com.scb.pk.bmwSC\",\"icon\":\"icon_SC.png\",\"packageName\":\"com.scb.pk.bmw\"},{\"id\":4623,\"app_id\":1504,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WeChat\",\"uniqueName\":\"com.tencent.mmWeChat\",\"icon\":\"icon_WeChat.png\",\"packageName\":\"com.tencent.mm\"},{\"id\":4612,\"app_id\":1624,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Adhan alarm offline\",\"uniqueName\":\"com.adhan.alarm.offlineAdhan alarm offline\",\"icon\":\"icon_Adhan alarm offline.png\",\"packageName\":\"com.adhan.alarm.offline\"},{\"id\":4615,\"app_id\":3780,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"JavaTest\",\"uniqueName\":\"com.example.javatestJavaTest\",\"icon\":\"icon_JavaTest.png\",\"packageName\":\"com.example.javatest\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'history', 0, '2019-03-06 16:30:23', '2019-03-15 16:29:26');
INSERT INTO `device_history` VALUES (515, '', 0, 'KLEV719137', '[{\"id\":4574,\"app_id\":1407,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.android.calendar\"},{\"id\":4583,\"app_id\":1408,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":4575,\"app_id\":1409,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.deskclock\"},{\"id\":4577,\"app_id\":1410,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Dialer\",\"uniqueName\":\"com.android.contactsDialer\",\"icon\":\"icon_Dialer.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4578,\"app_id\":1411,\"guest\":true,\"encrypted\":true,\"enable\":false,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4576,\"app_id\":1412,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":4573,\"app_id\":1413,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"packageName\":\"com.android.email\"},{\"id\":4581,\"app_id\":1414,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"packageName\":\"com.android.mms\"},{\"id\":4582,\"app_id\":1415,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Music\",\"uniqueName\":\"com.android.mediacenterMusic\",\"icon\":\"icon_Music.png\",\"packageName\":\"com.android.mediacenter\"},{\"id\":4580,\"app_id\":1416,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"packageName\":\"com.android.gallery3d\"},{\"id\":4579,\"app_id\":1417,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":4584,\"app_id\":1418,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Notepad\",\"uniqueName\":\"com.example.android.notepadNotepad\",\"icon\":\"icon_Notepad.png\",\"packageName\":\"com.example.android.notepad\"},{\"id\":4585,\"app_id\":1419,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":4593,\"app_id\":1420,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Docs\",\"uniqueName\":\"com.google.android.apps.docs.editors.docsDocs\",\"icon\":\"icon_Docs.png\",\"packageName\":\"com.google.android.apps.docs.editors.docs\"},{\"id\":4588,\"app_id\":1421,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Sheets\",\"uniqueName\":\"com.google.android.apps.docs.editors.sheetsSheets\",\"icon\":\"icon_Sheets.png\",\"packageName\":\"com.google.android.apps.docs.editors.sheets\"},{\"id\":4587,\"app_id\":1422,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Slides\",\"uniqueName\":\"com.google.android.apps.docs.editors.slidesSlides\",\"icon\":\"icon_Slides.png\",\"packageName\":\"com.google.android.apps.docs.editors.slides\"},{\"id\":4600,\"app_id\":1423,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":4586,\"app_id\":1424,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":4592,\"app_id\":1425,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":4602,\"app_id\":1426,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":4595,\"app_id\":1427,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":4603,\"app_id\":1428,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Downloads\",\"uniqueName\":\"com.android.documentsuiDownloads\",\"icon\":\"icon_Downloads.png\",\"packageName\":\"com.android.documentsui\"},{\"id\":4599,\"app_id\":1429,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mirror\",\"uniqueName\":\"com.android.hwmirrorMirror\",\"icon\":\"icon_Mirror.png\",\"packageName\":\"com.android.hwmirror\"},{\"id\":4589,\"app_id\":1430,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":4601,\"app_id\":1431,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"packageName\":\"com.android.calculator2\"},{\"id\":4596,\"app_id\":1432,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HUAWEI Video\",\"uniqueName\":\"com.huawei.himovie.overseasHUAWEI Video\",\"icon\":\"icon_HUAWEI Video.png\",\"packageName\":\"com.huawei.himovie.overseas\"},{\"id\":4594,\"app_id\":1433,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Files\",\"uniqueName\":\"com.huawei.hidiskFiles\",\"icon\":\"icon_Files.png\",\"packageName\":\"com.huawei.hidisk\"},{\"id\":4606,\"app_id\":1434,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Recorder\",\"uniqueName\":\"com.android.soundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.soundrecorder\"},{\"id\":4605,\"app_id\":1435,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"packageName\":\"com.android.stk\"},{\"id\":4597,\"app_id\":1436,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Flashlight\",\"uniqueName\":\"com.android.systemuiFlashlight\",\"icon\":\"icon_Flashlight.png\",\"packageName\":\"com.android.systemui\"},{\"id\":4604,\"app_id\":1437,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":4598,\"app_id\":1438,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Clone\",\"uniqueName\":\"com.hicloud.android.clonePhone Clone\",\"icon\":\"icon_Phone Clone.png\",\"packageName\":\"com.hicloud.android.clone\"},{\"id\":4590,\"app_id\":1439,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Uber\",\"uniqueName\":\"com.ubercabUber\",\"icon\":\"icon_Uber.png\",\"packageName\":\"com.ubercab\"},{\"id\":4608,\"app_id\":1440,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Backup & restore\",\"uniqueName\":\"com.huawei.KoBackupBackup & restore\",\"icon\":\"icon_Backup & restore.png\",\"packageName\":\"com.huawei.KoBackup\"},{\"id\":4607,\"app_id\":1441,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"FM Radio\",\"uniqueName\":\"com.huawei.android.FMRadioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.huawei.android.FMRadio\"},{\"id\":4610,\"app_id\":1442,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"System update\",\"uniqueName\":\"com.huawei.android.hwoucSystem update\",\"icon\":\"icon_System update.png\",\"packageName\":\"com.huawei.android.hwouc\"},{\"id\":4611,\"app_id\":1443,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Themes\",\"uniqueName\":\"com.huawei.android.thememanagerThemes\",\"icon\":\"icon_Themes.png\",\"packageName\":\"com.huawei.android.thememanager\"},{\"id\":4616,\"app_id\":1444,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"AppGallery\",\"uniqueName\":\"com.huawei.appmarketAppGallery\",\"icon\":\"icon_AppGallery.png\",\"packageName\":\"com.huawei.appmarket\"},{\"id\":4609,\"app_id\":1445,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Weather\",\"uniqueName\":\"com.huawei.android.totemweatherappWeather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.huawei.android.totemweatherapp\"},{\"id\":4591,\"app_id\":1446,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Camera\",\"uniqueName\":\"com.huawei.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.huawei.camera\"},{\"id\":4617,\"app_id\":1447,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Compass\",\"uniqueName\":\"com.huawei.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.huawei.compass\"},{\"id\":4620,\"app_id\":1448,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Health\",\"uniqueName\":\"com.huawei.healthHealth\",\"icon\":\"icon_Health.png\",\"packageName\":\"com.huawei.health\"},{\"id\":4622,\"app_id\":1449,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Asana\",\"uniqueName\":\"com.asana.appAsana\",\"icon\":\"icon_Asana.png\",\"packageName\":\"com.asana.app\"},{\"id\":4628,\"app_id\":1450,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gboard\",\"uniqueName\":\"com.google.android.inputmethod.latinGboard\",\"icon\":\"icon_Gboard.png\",\"packageName\":\"com.google.android.inputmethod.latin\"},{\"id\":4625,\"app_id\":1451,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Islam360\",\"uniqueName\":\"com.islam360Islam360\",\"icon\":\"icon_Islam360.png\",\"packageName\":\"com.islam360\"},{\"id\":4629,\"app_id\":1452,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Mustakbil\",\"uniqueName\":\"com.mustakbilMustakbil\",\"icon\":\"icon_Mustakbil.png\",\"packageName\":\"com.mustakbil\"},{\"id\":4626,\"app_id\":1453,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SwiftKey Keyboard\",\"uniqueName\":\"com.touchtype.swiftkeySwiftKey Keyboard\",\"icon\":\"icon_SwiftKey Keyboard.png\",\"packageName\":\"com.touchtype.swiftkey\"},{\"id\":4614,\"app_id\":1454,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Quik\",\"uniqueName\":\"com.stupeflix.replayQuik\",\"icon\":\"icon_Quik.png\",\"packageName\":\"com.stupeflix.replay\"},{\"id\":4627,\"app_id\":1455,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone Manager\",\"uniqueName\":\"com.huawei.systemmanagerPhone Manager\",\"icon\":\"icon_Phone Manager.png\",\"packageName\":\"com.huawei.systemmanager\"},{\"id\":4630,\"app_id\":1456,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"OLX Pakistan\",\"uniqueName\":\"com.olx.pkOLX Pakistan\",\"icon\":\"icon_OLX Pakistan.png\",\"packageName\":\"com.olx.pk\"},{\"id\":4619,\"app_id\":1457,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"HiCare\",\"uniqueName\":\"com.huawei.phoneserviceHiCare\",\"icon\":\"icon_HiCare.png\",\"packageName\":\"com.huawei.phoneservice\"},{\"id\":4633,\"app_id\":1458,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Payoneer\",\"uniqueName\":\"com.payoneer.androidPayoneer\",\"icon\":\"icon_Payoneer.png\",\"packageName\":\"com.payoneer.android\"},{\"id\":4634,\"app_id\":1459,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"MDM Client\",\"uniqueName\":\"com.secureportal.barryappMDM Client\",\"icon\":\"icon_MDM Client.png\",\"packageName\":\"com.secureportal.barryapp\"},{\"id\":4618,\"app_id\":1460,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"ahlesunnatpak\",\"uniqueName\":\"com.ahlesunnatpakahlesunnatpak\",\"icon\":\"icon_ahlesunnatpak.png\",\"packageName\":\"com.ahlesunnatpak\"},{\"id\":4635,\"app_id\":1461,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Skype\",\"uniqueName\":\"com.skype.raiderSkype\",\"icon\":\"icon_Skype.png\",\"packageName\":\"com.skype.raider\"},{\"id\":4624,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":4637,\"app_id\":1463,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"},{\"id\":4631,\"app_id\":1464,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"My Zong\",\"uniqueName\":\"com.zong.customercareMy Zong\",\"icon\":\"icon_My Zong.png\",\"packageName\":\"com.zong.customercare\"},{\"id\":4632,\"app_id\":1465,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":4621,\"app_id\":1466,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Facebook\",\"uniqueName\":\"com.facebook.katanaFacebook\",\"icon\":\"icon_Facebook.png\",\"packageName\":\"com.facebook.katana\"},{\"id\":4613,\"app_id\":1467,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Careem\",\"uniqueName\":\"com.careem.acmaCareem\",\"icon\":\"icon_Careem.png\",\"packageName\":\"com.careem.acma\"},{\"id\":4636,\"app_id\":1468,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SC\",\"uniqueName\":\"com.scb.pk.bmwSC\",\"icon\":\"icon_SC.png\",\"packageName\":\"com.scb.pk.bmw\"},{\"id\":4623,\"app_id\":1504,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WeChat\",\"uniqueName\":\"com.tencent.mmWeChat\",\"icon\":\"icon_WeChat.png\",\"packageName\":\"com.tencent.mm\"},{\"id\":4612,\"app_id\":1624,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Adhan alarm offline\",\"uniqueName\":\"com.adhan.alarm.offlineAdhan alarm offline\",\"icon\":\"icon_Adhan alarm offline.png\",\"packageName\":\"com.adhan.alarm.offline\"},{\"id\":4615,\"app_id\":3780,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"JavaTest\",\"uniqueName\":\"com.example.javatestJavaTest\",\"icon\":\"icon_JavaTest.png\",\"packageName\":\"com.example.javatest\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'history', 0, '2019-03-06 16:30:49', '2019-03-15 16:29:26');
INSERT INTO `device_history` VALUES (516, '', 0, 'KLEV719137', '[{\"id\":4574,\"app_id\":1407,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.android.calendar\"},{\"id\":4583,\"app_id\":1408,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":4575,\"app_id\":1409,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.deskclock\"},{\"id\":4577,\"app_id\":1410,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Dialer\",\"uniqueName\":\"com.android.contactsDialer\",\"icon\":\"icon_Dialer.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4578,\"app_id\":1411,\"guest\":true,\"encrypted\":true,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4576,\"app_id\":1412,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":4573,\"app_id\":1413,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Email\",\"uniqueName\":\"com.android.emailEmail\",\"icon\":\"icon_Email.png\",\"packageName\":\"com.android.email\"},{\"id\":4581,\"app_id\":1414,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"packageName\":\"com.android.mms\"},{\"id\":4582,\"app_id\":1415,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.android.mediacenterMusic\",\"icon\":\"icon_Music.png\",\"packageName\":\"com.android.mediacenter\"},{\"id\":4580,\"app_id\":1416,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.android.gallery3dGallery\",\"icon\":\"icon_Gallery.png\",\"packageName\":\"com.android.gallery3d\"},{\"id\":4579,\"app_id\":1417,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":4584,\"app_id\":1418,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Notepad\",\"uniqueName\":\"com.example.android.notepadNotepad\",\"icon\":\"icon_Notepad.png\",\"packageName\":\"com.example.android.notepad\"},{\"id\":4585,\"app_id\":1419,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":4593,\"app_id\":1420,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Docs\",\"uniqueName\":\"com.google.android.apps.docs.editors.docsDocs\",\"icon\":\"icon_Docs.png\",\"packageName\":\"com.google.android.apps.docs.editors.docs\"},{\"id\":4588,\"app_id\":1421,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Sheets\",\"uniqueName\":\"com.google.android.apps.docs.editors.sheetsSheets\",\"icon\":\"icon_Sheets.png\",\"packageName\":\"com.google.android.apps.docs.editors.sheets\"},{\"id\":4587,\"app_id\":1422,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Slides\",\"uniqueName\":\"com.google.android.apps.docs.editors.slidesSlides\",\"icon\":\"icon_Slides.png\",\"packageName\":\"com.google.android.apps.docs.editors.slides\"},{\"id\":4600,\"app_id\":1423,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":4586,\"app_id\":1424,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":4592,\"app_id\":1425,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":4602,\"app_id\":1426,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":4595,\"app_id\":1427,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":4603,\"app_id\":1428,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Downloads\",\"uniqueName\":\"com.android.documentsuiDownloads\",\"icon\":\"icon_Downloads.png\",\"packageName\":\"com.android.documentsui\"},{\"id\":4599,\"app_id\":1429,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Mirror\",\"uniqueName\":\"com.android.hwmirrorMirror\",\"icon\":\"icon_Mirror.png\",\"packageName\":\"com.android.hwmirror\"},{\"id\":4589,\"app_id\":1430,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":4601,\"app_id\":1431,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Calculator\",\"uniqueName\":\"com.android.calculator2Calculator\",\"icon\":\"icon_Calculator.png\",\"packageName\":\"com.android.calculator2\"},{\"id\":4596,\"app_id\":1432,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"HUAWEI Video\",\"uniqueName\":\"com.huawei.himovie.overseasHUAWEI Video\",\"icon\":\"icon_HUAWEI Video.png\",\"packageName\":\"com.huawei.himovie.overseas\"},{\"id\":4594,\"app_id\":1433,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Files\",\"uniqueName\":\"com.huawei.hidiskFiles\",\"icon\":\"icon_Files.png\",\"packageName\":\"com.huawei.hidisk\"},{\"id\":4606,\"app_id\":1434,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Recorder\",\"uniqueName\":\"com.android.soundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.soundrecorder\"},{\"id\":4605,\"app_id\":1435,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"packageName\":\"com.android.stk\"},{\"id\":4597,\"app_id\":1436,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Flashlight\",\"uniqueName\":\"com.android.systemuiFlashlight\",\"icon\":\"icon_Flashlight.png\",\"packageName\":\"com.android.systemui\"},{\"id\":4604,\"app_id\":1437,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":4598,\"app_id\":1438,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Phone Clone\",\"uniqueName\":\"com.hicloud.android.clonePhone Clone\",\"icon\":\"icon_Phone Clone.png\",\"packageName\":\"com.hicloud.android.clone\"},{\"id\":4590,\"app_id\":1439,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Uber\",\"uniqueName\":\"com.ubercabUber\",\"icon\":\"icon_Uber.png\",\"packageName\":\"com.ubercab\"},{\"id\":4608,\"app_id\":1440,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Backup & restore\",\"uniqueName\":\"com.huawei.KoBackupBackup & restore\",\"icon\":\"icon_Backup & restore.png\",\"packageName\":\"com.huawei.KoBackup\"},{\"id\":4607,\"app_id\":1441,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.huawei.android.FMRadioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.huawei.android.FMRadio\"},{\"id\":4610,\"app_id\":1442,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"System update\",\"uniqueName\":\"com.huawei.android.hwoucSystem update\",\"icon\":\"icon_System update.png\",\"packageName\":\"com.huawei.android.hwouc\"},{\"id\":4611,\"app_id\":1443,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Themes\",\"uniqueName\":\"com.huawei.android.thememanagerThemes\",\"icon\":\"icon_Themes.png\",\"packageName\":\"com.huawei.android.thememanager\"},{\"id\":4616,\"app_id\":1444,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"AppGallery\",\"uniqueName\":\"com.huawei.appmarketAppGallery\",\"icon\":\"icon_AppGallery.png\",\"packageName\":\"com.huawei.appmarket\"},{\"id\":4609,\"app_id\":1445,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Weather\",\"uniqueName\":\"com.huawei.android.totemweatherappWeather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.huawei.android.totemweatherapp\"},{\"id\":4591,\"app_id\":1446,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.huawei.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.huawei.camera\"},{\"id\":4617,\"app_id\":1447,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Compass\",\"uniqueName\":\"com.huawei.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.huawei.compass\"},{\"id\":4620,\"app_id\":1448,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Health\",\"uniqueName\":\"com.huawei.healthHealth\",\"icon\":\"icon_Health.png\",\"packageName\":\"com.huawei.health\"},{\"id\":4622,\"app_id\":1449,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Asana\",\"uniqueName\":\"com.asana.appAsana\",\"icon\":\"icon_Asana.png\",\"packageName\":\"com.asana.app\"},{\"id\":4628,\"app_id\":1450,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Gboard\",\"uniqueName\":\"com.google.android.inputmethod.latinGboard\",\"icon\":\"icon_Gboard.png\",\"packageName\":\"com.google.android.inputmethod.latin\"},{\"id\":4625,\"app_id\":1451,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Islam360\",\"uniqueName\":\"com.islam360Islam360\",\"icon\":\"icon_Islam360.png\",\"packageName\":\"com.islam360\"},{\"id\":4629,\"app_id\":1452,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Mustakbil\",\"uniqueName\":\"com.mustakbilMustakbil\",\"icon\":\"icon_Mustakbil.png\",\"packageName\":\"com.mustakbil\"},{\"id\":4626,\"app_id\":1453,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"SwiftKey Keyboard\",\"uniqueName\":\"com.touchtype.swiftkeySwiftKey Keyboard\",\"icon\":\"icon_SwiftKey Keyboard.png\",\"packageName\":\"com.touchtype.swiftkey\"},{\"id\":4614,\"app_id\":1454,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Quik\",\"uniqueName\":\"com.stupeflix.replayQuik\",\"icon\":\"icon_Quik.png\",\"packageName\":\"com.stupeflix.replay\"},{\"id\":4627,\"app_id\":1455,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Phone Manager\",\"uniqueName\":\"com.huawei.systemmanagerPhone Manager\",\"icon\":\"icon_Phone Manager.png\",\"packageName\":\"com.huawei.systemmanager\"},{\"id\":4630,\"app_id\":1456,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"OLX Pakistan\",\"uniqueName\":\"com.olx.pkOLX Pakistan\",\"icon\":\"icon_OLX Pakistan.png\",\"packageName\":\"com.olx.pk\"},{\"id\":4619,\"app_id\":1457,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"HiCare\",\"uniqueName\":\"com.huawei.phoneserviceHiCare\",\"icon\":\"icon_HiCare.png\",\"packageName\":\"com.huawei.phoneservice\"},{\"id\":4633,\"app_id\":1458,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Payoneer\",\"uniqueName\":\"com.payoneer.androidPayoneer\",\"icon\":\"icon_Payoneer.png\",\"packageName\":\"com.payoneer.android\"},{\"id\":4634,\"app_id\":1459,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"MDM Client\",\"uniqueName\":\"com.secureportal.barryappMDM Client\",\"icon\":\"icon_MDM Client.png\",\"packageName\":\"com.secureportal.barryapp\"},{\"id\":4618,\"app_id\":1460,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"ahlesunnatpak\",\"uniqueName\":\"com.ahlesunnatpakahlesunnatpak\",\"icon\":\"icon_ahlesunnatpak.png\",\"packageName\":\"com.ahlesunnatpak\"},{\"id\":4635,\"app_id\":1461,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Skype\",\"uniqueName\":\"com.skype.raiderSkype\",\"icon\":\"icon_Skype.png\",\"packageName\":\"com.skype.raider\"},{\"id\":4624,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":4637,\"app_id\":1463,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"},{\"id\":4631,\"app_id\":1464,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"My Zong\",\"uniqueName\":\"com.zong.customercareMy Zong\",\"icon\":\"icon_My Zong.png\",\"packageName\":\"com.zong.customercare\"},{\"id\":4632,\"app_id\":1465,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":4621,\"app_id\":1466,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Facebook\",\"uniqueName\":\"com.facebook.katanaFacebook\",\"icon\":\"icon_Facebook.png\",\"packageName\":\"com.facebook.katana\"},{\"id\":4613,\"app_id\":1467,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Careem\",\"uniqueName\":\"com.careem.acmaCareem\",\"icon\":\"icon_Careem.png\",\"packageName\":\"com.careem.acma\"},{\"id\":4636,\"app_id\":1468,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"SC\",\"uniqueName\":\"com.scb.pk.bmwSC\",\"icon\":\"icon_SC.png\",\"packageName\":\"com.scb.pk.bmw\"},{\"id\":4623,\"app_id\":1504,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"WeChat\",\"uniqueName\":\"com.tencent.mmWeChat\",\"icon\":\"icon_WeChat.png\",\"packageName\":\"com.tencent.mm\"},{\"id\":4612,\"app_id\":1624,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"Adhan alarm offline\",\"uniqueName\":\"com.adhan.alarm.offlineAdhan alarm offline\",\"icon\":\"icon_Adhan alarm offline.png\",\"packageName\":\"com.adhan.alarm.offline\"},{\"id\":4615,\"app_id\":3780,\"guest\":false,\"encrypted\":false,\"enable\":true,\"label\":\"JavaTest\",\"uniqueName\":\"com.example.javatestJavaTest\",\"icon\":\"icon_JavaTest.png\",\"packageName\":\"com.example.javatest\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'history', 0, '2019-03-06 17:47:32', '2019-03-15 16:29:26');
INSERT INTO `device_history` VALUES (517, '', 0, 'FSLC780799', '[{\"id\":4946,\"app_id\":1408,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":4945,\"app_id\":1411,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":4929,\"app_id\":1412,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":4934,\"app_id\":1417,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":4939,\"app_id\":1419,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":4940,\"app_id\":1423,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":4938,\"app_id\":1424,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":4949,\"app_id\":1425,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":4950,\"app_id\":1426,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":4943,\"app_id\":1427,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":4941,\"app_id\":1430,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":4952,\"app_id\":1437,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":4958,\"app_id\":1460,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"ahlesunnatpak\",\"uniqueName\":\"com.ahlesunnatpakahlesunnatpak\",\"icon\":\"icon_ahlesunnatpak.png\",\"packageName\":\"com.ahlesunnatpak\"},{\"id\":4978,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":4979,\"app_id\":1463,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"},{\"id\":4981,\"app_id\":1465,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":4966,\"app_id\":1466,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Facebook\",\"uniqueName\":\"com.facebook.katanaFacebook\",\"icon\":\"icon_Facebook.png\",\"packageName\":\"com.facebook.katana\"},{\"id\":4944,\"app_id\":1471,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Phone\",\"uniqueName\":\"com.android.dialerPhone\",\"icon\":\"icon_Phone.png\",\"packageName\":\"com.android.dialer\"},{\"id\":4972,\"app_id\":1496,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"MX Player\",\"uniqueName\":\"com.mxtech.videoplayer.adMX Player\",\"icon\":\"icon_MX Player.png\",\"packageName\":\"com.mxtech.videoplayer.ad\"},{\"id\":4942,\"app_id\":1509,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Messages\",\"uniqueName\":\"com.android.mmsMessages\",\"icon\":\"icon_Messages.png\",\"packageName\":\"com.android.mms\"},{\"id\":4973,\"app_id\":1523,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Play Games\",\"uniqueName\":\"com.google.android.play.gamesPlay Games\",\"icon\":\"icon_Play Games.png\",\"packageName\":\"com.google.android.play.games\"},{\"id\":4935,\"app_id\":1551,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Camera\",\"uniqueName\":\"com.android.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.android.camera\"},{\"id\":4967,\"app_id\":1569,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"SHAREit\",\"uniqueName\":\"com.lenovo.anyshare.gpsSHAREit\",\"icon\":\"icon_SHAREit.png\",\"packageName\":\"com.lenovo.anyshare.gps\"},{\"id\":4953,\"app_id\":1598,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Truecaller\",\"uniqueName\":\"com.truecallerTruecaller\",\"icon\":\"icon_Truecaller.png\",\"packageName\":\"com.truecaller\"},{\"id\":4965,\"app_id\":1601,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"WPS Office\",\"uniqueName\":\"cn.wps.moffice_engWPS Office\",\"icon\":\"icon_WPS Office.png\",\"packageName\":\"cn.wps.moffice_eng\"},{\"id\":4930,\"app_id\":1625,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"i Music\",\"uniqueName\":\"com.android.bbkmusici Music\",\"icon\":\"icon_i Music.png\",\"packageName\":\"com.android.bbkmusic\"},{\"id\":4932,\"app_id\":1626,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Albums\",\"uniqueName\":\"com.vivo.galleryAlbums\",\"icon\":\"icon_Albums.png\",\"packageName\":\"com.vivo.gallery\"},{\"id\":4933,\"app_id\":1627,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Videos\",\"uniqueName\":\"com.android.VideoPlayerVideos\",\"icon\":\"icon_Videos.png\",\"packageName\":\"com.android.VideoPlayer\"},{\"id\":4931,\"app_id\":1628,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Recorder\",\"uniqueName\":\"com.android.bbksoundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.bbksoundrecorder\"},{\"id\":4937,\"app_id\":1629,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calendar\",\"uniqueName\":\"com.bbk.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.bbk.calendar\"},{\"id\":4948,\"app_id\":1630,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"File Manager\",\"uniqueName\":\"com.android.filemanagerFile Manager\",\"icon\":\"icon_File Manager.png\",\"packageName\":\"com.android.filemanager\"},{\"id\":4956,\"app_id\":1631,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"i Manager\",\"uniqueName\":\"com.iqoo.securei Manager\",\"icon\":\"icon_i Manager.png\",\"packageName\":\"com.iqoo.secure\"},{\"id\":4959,\"app_id\":1632,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"FM Radio\",\"uniqueName\":\"com.vivo.FMRadioFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.vivo.FMRadio\"},{\"id\":4954,\"app_id\":1633,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"vivoCloud\",\"uniqueName\":\"com.bbk.cloudvivoCloud\",\"icon\":\"icon_vivoCloud.png\",\"packageName\":\"com.bbk.cloud\"},{\"id\":4960,\"app_id\":1634,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Browser\",\"uniqueName\":\"com.vivo.browserBrowser\",\"icon\":\"icon_Browser.png\",\"packageName\":\"com.vivo.browser\"},{\"id\":4961,\"app_id\":1635,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"V-Appstore\",\"uniqueName\":\"com.vivo.appstoreV-Appstore\",\"icon\":\"icon_V-Appstore.png\",\"packageName\":\"com.vivo.appstore\"},{\"id\":4955,\"app_id\":1636,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Notes\",\"uniqueName\":\"com.android.notesNotes\",\"icon\":\"icon_Notes.png\",\"packageName\":\"com.android.notes\"},{\"id\":4957,\"app_id\":1637,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Calculator\",\"uniqueName\":\"com.android.bbkcalculatorCalculator\",\"icon\":\"icon_Calculator.png\",\"packageName\":\"com.android.bbkcalculator\"},{\"id\":4947,\"app_id\":1638,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Clock\",\"uniqueName\":\"com.android.BBKClockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.BBKClock\"},{\"id\":4963,\"app_id\":1639,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Compass\",\"uniqueName\":\"com.vivo.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.vivo.compass\"},{\"id\":4968,\"app_id\":1640,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Weather\",\"uniqueName\":\"com.vivo.weatherWeather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.vivo.weather\"},{\"id\":4969,\"app_id\":1641,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Lock\",\"uniqueName\":\"com.android.bbk.lockscreen3Lock\",\"icon\":\"icon_Lock.png\",\"packageName\":\"com.android.bbk.lockscreen3\"},{\"id\":4970,\"app_id\":1642,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"E\",\"uniqueName\":\"com.eE\",\"icon\":\"icon_E.png\",\"packageName\":\"com.e\"},{\"id\":4971,\"app_id\":1643,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Feedback\",\"uniqueName\":\"com.vivo.websiteFeedback\",\"icon\":\"icon_Feedback.png\",\"packageName\":\"com.vivo.website\"},{\"id\":4964,\"app_id\":1644,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"vivo.com\",\"uniqueName\":\"com.vivo.websitevivo.com\",\"icon\":\"icon_vivo.com.png\",\"packageName\":\"com.vivo.website\"},{\"id\":4977,\"app_id\":1645,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"F_project\",\"uniqueName\":\"com.f_projectF_project\",\"icon\":\"icon_F_project.png\",\"packageName\":\"com.f_project\"},{\"id\":4951,\"app_id\":1647,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"VidMate\",\"uniqueName\":\"com.nemo.vidmateVidMate\",\"icon\":\"icon_VidMate.png\",\"packageName\":\"com.nemo.vidmate\"},{\"id\":4976,\"app_id\":1648,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"JazzCash\",\"uniqueName\":\"com.techlogix.mobilinkcustomerJazzCash\",\"icon\":\"icon_JazzCash.png\",\"packageName\":\"com.techlogix.mobilinkcustomer\"},{\"id\":4975,\"app_id\":1649,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"EasyShare\",\"uniqueName\":\"com.vivo.easyshareEasyShare\",\"icon\":\"icon_EasyShare.png\",\"packageName\":\"com.vivo.easyshare\"},{\"id\":4936,\"app_id\":1650,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"i Theme\",\"uniqueName\":\"com.bbk.themei Theme\",\"icon\":\"icon_i Theme.png\",\"packageName\":\"com.bbk.theme\"},{\"id\":4962,\"app_id\":1651,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Email\",\"uniqueName\":\"com.vivo.emailEmail\",\"icon\":\"icon_Email.png\",\"packageName\":\"com.vivo.email\"},{\"id\":4974,\"app_id\":6189,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"Hills of Steel\",\"uniqueName\":\"com.superplusgames.hosandroidHills of Steel\",\"icon\":\"icon_Hills of Steel.png\",\"packageName\":\"com.superplusgames.hosandroid\"},{\"id\":4980,\"app_id\":6194,\"guest\":false,\"encrypted\":false,\"enable\":false,\"label\":\"TikTok\",\"uniqueName\":\"com.zhiliaoapp.musicallyTikTok\",\"icon\":\"icon_TikTok.png\",\"packageName\":\"com.zhiliaoapp.musically\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'history', 0, '2019-03-12 11:38:01', '2019-03-15 16:29:26');
INSERT INTO `device_history` VALUES (518, 'my profile', 204, '', '[{\"id\":5037,\"app_id\":1407,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Calendar\",\"uniqueName\":\"com.android.calendarCalendar\",\"icon\":\"icon_Calendar.png\",\"packageName\":\"com.android.calendar\"},{\"id\":5038,\"app_id\":1513,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Browser\",\"uniqueName\":\"com.android.browserBrowser\",\"icon\":\"icon_Browser.png\",\"packageName\":\"com.android.browser\"},{\"id\":5039,\"app_id\":1409,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Clock\",\"uniqueName\":\"com.android.deskclockClock\",\"icon\":\"icon_Clock.png\",\"packageName\":\"com.android.deskclock\"},{\"id\":5040,\"app_id\":3698,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Themes\",\"uniqueName\":\"com.android.thememanagerThemes\",\"icon\":\"icon_Themes.png\",\"packageName\":\"com.android.thememanager\"},{\"id\":5041,\"app_id\":1417,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Play Store\",\"uniqueName\":\"com.android.vendingPlay Store\",\"icon\":\"icon_Play Store.png\",\"packageName\":\"com.android.vending\"},{\"id\":5042,\"app_id\":1551,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Camera\",\"uniqueName\":\"com.android.cameraCamera\",\"icon\":\"icon_Camera.png\",\"packageName\":\"com.android.camera\"},{\"id\":5043,\"app_id\":1512,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Mail\",\"uniqueName\":\"com.android.emailMail\",\"icon\":\"icon_Mail.png\",\"packageName\":\"com.android.email\"},{\"id\":5044,\"app_id\":1412,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Chrome\",\"uniqueName\":\"com.android.chromeChrome\",\"icon\":\"icon_Chrome.png\",\"packageName\":\"com.android.chrome\"},{\"id\":5045,\"app_id\":1588,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Phone\",\"uniqueName\":\"com.android.contactsPhone\",\"icon\":\"icon_Phone.png\",\"packageName\":\"com.android.contacts\"},{\"id\":5046,\"app_id\":1414,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Messaging\",\"uniqueName\":\"com.android.mmsMessaging\",\"icon\":\"icon_Messaging.png\",\"packageName\":\"com.android.mms\"},{\"id\":5047,\"app_id\":1411,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Contacts\",\"uniqueName\":\"com.android.contactsContacts\",\"icon\":\"icon_Contacts.png\",\"packageName\":\"com.android.contacts\"},{\"id\":5048,\"app_id\":1419,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Drive\",\"uniqueName\":\"com.google.android.apps.docsDrive\",\"icon\":\"icon_Drive.png\",\"packageName\":\"com.google.android.apps.docs\"},{\"id\":5049,\"app_id\":1592,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Hangouts\",\"uniqueName\":\"com.google.android.talkHangouts\",\"icon\":\"icon_Hangouts.png\",\"packageName\":\"com.google.android.talk\"},{\"id\":5050,\"app_id\":1425,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Play Music\",\"uniqueName\":\"com.google.android.musicPlay Music\",\"icon\":\"icon_Play Music.png\",\"packageName\":\"com.google.android.music\"},{\"id\":5051,\"app_id\":1430,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Photos\",\"uniqueName\":\"com.google.android.apps.photosPhotos\",\"icon\":\"icon_Photos.png\",\"packageName\":\"com.google.android.apps.photos\"},{\"id\":5052,\"app_id\":1423,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Maps\",\"uniqueName\":\"com.google.android.apps.mapsMaps\",\"icon\":\"icon_Maps.png\",\"packageName\":\"com.google.android.apps.maps\"},{\"id\":5053,\"app_id\":3717,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Notes\",\"uniqueName\":\"com.miui.notesNotes\",\"icon\":\"icon_Notes.png\",\"packageName\":\"com.miui.notes\"},{\"id\":5054,\"app_id\":1424,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Duo\",\"uniqueName\":\"com.google.android.apps.tachyonDuo\",\"icon\":\"icon_Duo.png\",\"packageName\":\"com.google.android.apps.tachyon\"},{\"id\":5055,\"app_id\":1408,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Settings\",\"uniqueName\":\"com.android.settingsSettings\",\"icon\":\"icon_Settings.png\",\"packageName\":\"com.android.settings\"},{\"id\":5056,\"app_id\":3719,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Scanner\",\"uniqueName\":\"com.xiaomi.scannerScanner\",\"icon\":\"icon_Scanner.png\",\"packageName\":\"com.xiaomi.scanner\"},{\"id\":5057,\"app_id\":3715,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Mi Calculator\",\"uniqueName\":\"com.miui.calculatorMi Calculator\",\"icon\":\"icon_Mi Calculator.png\",\"packageName\":\"com.miui.calculator\"},{\"id\":5058,\"app_id\":1426,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"YouTube\",\"uniqueName\":\"com.google.android.youtubeYouTube\",\"icon\":\"icon_YouTube.png\",\"packageName\":\"com.google.android.youtube\"},{\"id\":5059,\"app_id\":3714,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"File Manager\",\"uniqueName\":\"com.mi.android.globalFileexplorerFile Manager\",\"icon\":\"icon_File Manager.png\",\"packageName\":\"com.mi.android.globalFileexplorer\"},{\"id\":5060,\"app_id\":3716,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Gallery\",\"uniqueName\":\"com.miui.galleryGallery\",\"icon\":\"icon_Gallery.png\",\"packageName\":\"com.miui.gallery\"},{\"id\":5061,\"app_id\":1427,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Gmail\",\"uniqueName\":\"com.google.android.gmGmail\",\"icon\":\"icon_Gmail.png\",\"packageName\":\"com.google.android.gm\"},{\"id\":5062,\"app_id\":1555,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Downloads\",\"uniqueName\":\"com.android.providers.downloads.uiDownloads\",\"icon\":\"icon_Downloads.png\",\"packageName\":\"com.android.providers.downloads.ui\"},{\"id\":5063,\"app_id\":1434,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Recorder\",\"uniqueName\":\"com.android.soundrecorderRecorder\",\"icon\":\"icon_Recorder.png\",\"packageName\":\"com.android.soundrecorder\"},{\"id\":5064,\"app_id\":3718,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Weather\",\"uniqueName\":\"com.miui.weather2Weather\",\"icon\":\"icon_Weather.png\",\"packageName\":\"com.miui.weather2\"},{\"id\":5065,\"app_id\":3724,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Feedback\",\"uniqueName\":\"com.miui.bugreportFeedback\",\"icon\":\"icon_Feedback.png\",\"packageName\":\"com.miui.bugreport\"},{\"id\":5066,\"app_id\":1437,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Google\",\"uniqueName\":\"com.google.android.googlequicksearchboxGoogle\",\"icon\":\"icon_Google.png\",\"packageName\":\"com.google.android.googlequicksearchbox\"},{\"id\":5067,\"app_id\":1435,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"SIM Toolkit\",\"uniqueName\":\"com.android.stkSIM Toolkit\",\"icon\":\"icon_SIM Toolkit.png\",\"packageName\":\"com.android.stk\"},{\"id\":5068,\"app_id\":3731,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Mi Drop\",\"uniqueName\":\"com.xiaomi.midropMi Drop\",\"icon\":\"icon_Mi Drop.png\",\"packageName\":\"com.xiaomi.midrop\"},{\"id\":5069,\"app_id\":3725,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Compass\",\"uniqueName\":\"com.miui.compassCompass\",\"icon\":\"icon_Compass.png\",\"packageName\":\"com.miui.compass\"},{\"id\":5070,\"app_id\":3726,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"FM Radio\",\"uniqueName\":\"com.miui.fmFM Radio\",\"icon\":\"icon_FM Radio.png\",\"packageName\":\"com.miui.fm\"},{\"id\":5071,\"app_id\":3727,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Music\",\"uniqueName\":\"com.miui.playerMusic\",\"icon\":\"icon_Music.png\",\"packageName\":\"com.miui.player\"},{\"id\":5072,\"app_id\":3728,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Screen Recorder\",\"uniqueName\":\"com.miui.screenrecorderScreen Recorder\",\"icon\":\"icon_Screen Recorder.png\",\"packageName\":\"com.miui.screenrecorder\"},{\"id\":5073,\"app_id\":3729,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Security\",\"uniqueName\":\"com.miui.securitycenterSecurity\",\"icon\":\"icon_Security.png\",\"packageName\":\"com.miui.securitycenter\"},{\"id\":5074,\"app_id\":3730,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Mi Video\",\"uniqueName\":\"com.miui.videoplayerMi Video\",\"icon\":\"icon_Mi Video.png\",\"packageName\":\"com.miui.videoplayer\"},{\"id\":5075,\"app_id\":1601,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"WPS Office\",\"uniqueName\":\"cn.wps.moffice_engWPS Office\",\"icon\":\"icon_WPS Office.png\",\"packageName\":\"cn.wps.moffice_eng\"},{\"id\":5076,\"app_id\":1567,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"My Application\",\"uniqueName\":\"com.example.myapplicationMy Application\",\"icon\":\"icon_My Application.png\",\"packageName\":\"com.example.myapplication\"},{\"id\":5077,\"app_id\":1566,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Lite\",\"uniqueName\":\"com.facebook.mliteLite\",\"icon\":\"icon_Lite.png\",\"packageName\":\"com.facebook.mlite\"},{\"id\":5078,\"app_id\":6280,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Whatsapp Marketing\",\"uniqueName\":\"com.example.whatsappmarketingWhatsapp Marketing\",\"icon\":\"icon_Whatsapp Marketing.png\",\"packageName\":\"com.example.whatsappmarketing\"},{\"id\":5079,\"app_id\":6277,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"SKEDit\",\"uniqueName\":\"com.codefish.sqeditSKEDit\",\"icon\":\"icon_SKEDit.png\",\"packageName\":\"com.codefish.sqedit\"},{\"id\":5080,\"app_id\":3733,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Hidden Settings\",\"uniqueName\":\"com.ceyhan.setsHidden Settings\",\"icon\":\"icon_Hidden Settings.png\",\"packageName\":\"com.ceyhan.sets\"},{\"id\":5081,\"app_id\":1465,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Messenger\",\"uniqueName\":\"com.facebook.orcaMessenger\",\"icon\":\"icon_Messenger.png\",\"packageName\":\"com.facebook.orca\"},{\"id\":5082,\"app_id\":3734,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Mi Remote\",\"uniqueName\":\"com.duokan.phone.remotecontrollerMi Remote\",\"icon\":\"icon_Mi Remote.png\",\"packageName\":\"com.duokan.phone.remotecontroller\"},{\"id\":5083,\"app_id\":4129,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Photo Compress\",\"uniqueName\":\"com.thesofttech.photocompress.androidappPhoto Compress\",\"icon\":\"icon_Photo Compress.png\",\"packageName\":\"com.thesofttech.photocompress.androidapp\"},{\"id\":5084,\"app_id\":3735,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Google Pinyin Input\",\"uniqueName\":\"com.google.android.inputmethod.pinyinGoogle Pinyin Input\",\"icon\":\"icon_Google Pinyin Input.png\",\"packageName\":\"com.google.android.inputmethod.pinyin\"},{\"id\":5085,\"app_id\":1535,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"UEM Client\",\"uniqueName\":\"com.rim.mobilefusion.clientUEM Client\",\"icon\":\"icon_UEM Client.png\",\"packageName\":\"com.rim.mobilefusion.client\"},{\"id\":5086,\"app_id\":1461,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Skype\",\"uniqueName\":\"com.skype.raiderSkype\",\"icon\":\"icon_Skype.png\",\"packageName\":\"com.skype.raider\"},{\"id\":5087,\"app_id\":3736,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"MIUI Forum\",\"uniqueName\":\"com.miui.enbbsMIUI Forum\",\"icon\":\"icon_MIUI Forum.png\",\"packageName\":\"com.miui.enbbs\"},{\"id\":5088,\"app_id\":6291,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"Local VPN\",\"uniqueName\":\"xyz.hexene.localvpnLocal VPN\",\"icon\":\"icon_Local VPN.png\",\"packageName\":\"xyz.hexene.localvpn\"},{\"id\":5089,\"app_id\":1453,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"SwiftKey Keyboard\",\"uniqueName\":\"com.touchtype.swiftkeySwiftKey Keyboard\",\"icon\":\"icon_SwiftKey Keyboard.png\",\"packageName\":\"com.touchtype.swiftkey\"},{\"id\":5090,\"app_id\":1462,\"guest\":false,\"encrypted\":true,\"enable\":true,\"label\":\"Screen Locker\",\"uniqueName\":\"com.vortexlocker.appScreen Locker\",\"icon\":\"icon_Screen Locker.png\",\"packageName\":\"com.vortexlocker.app\"},{\"id\":5091,\"app_id\":1463,\"guest\":true,\"encrypted\":false,\"enable\":true,\"label\":\"WhatsApp\",\"uniqueName\":\"com.whatsappWhatsApp\",\"icon\":\"icon_WhatsApp.png\",\"packageName\":\"com.whatsapp\"}]', NULL, '{}', '{\"admin_password\":null,\"guest_password\":null,\"encrypted_password\":null,\"duress_password\":null}', 'profile', 0, '2019-03-18 11:33:45', NULL);

-- ----------------------------
-- Table structure for device_sim_ids
-- ----------------------------
DROP TABLE IF EXISTS `device_sim_ids`;
CREATE TABLE `device_sim_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `sim_id` int(11) NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `sim_id`(`sim_id`) USING BTREE,
  CONSTRAINT `device_sim_ids_ibfk_1` FOREIGN KEY (`sim_id`) REFERENCES `sim_ids` (`id`) ON DELETE RESTRICT ON UPDATE RESTRICT
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for devices
-- ----------------------------
DROP TABLE IF EXISTS `devices`;
CREATE TABLE `devices`  (
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
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `device_id`(`device_id`) USING BTREE,
  UNIQUE INDEX `unique_email`(`email`) USING BTREE,
  UNIQUE INDEX `unique_pgp_email`(`pgp_email`) USING BTREE,
  UNIQUE INDEX `unique_chat_id`(`chat_id`) USING BTREE,
  UNIQUE INDEX `unique_activation_code`(`activation_code`) USING BTREE,
  INDEX `dealer_id`(`dealer_id`) USING BTREE,
  INDEX `connected_dealer`(`connected_dealer`) USING BTREE,
  INDEX `client_id`(`client_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 610 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of devices
-- ----------------------------
INSERT INTO `devices` VALUES (608, 204, 0, '8', 'test154645', 'JLRK703454', NULL, 'usman', 'usman@gmail.com', 'example3@domain.com', NULL, 'asdfasdf', '192.168.18.152', NULL, '8992041508173614556f', '866037035765283', NULL, 'null', '866037035765291', 'b8dad6c40304', 'EC:D0:9F:21:D9:C8', NULL, NULL, NULL, NULL, '5795068', 1, 'off', 1, 1, 'active', '', 0, NULL, NULL, 12, '2020/03/16', '2019-03-16 16:31:39', '2019-03-16 18:30:58');
INSERT INTO `devices` VALUES (609, 204, 0, '9', 'samz', 'WAZC447487', NULL, 'usman', 'usman12321312@gmail.com', 'example4@domain.com', NULL, 'huawie', '192.168.18.152', NULL, '8992041508173614556f', '866037035765283', NULL, 'null', '866037035765291', 'b8dad6c40304', 'EC:D0:9F:21:D9:C8', NULL, NULL, NULL, NULL, '5358702', 1, 'On', 1, 0, 'active', '', 0, NULL, NULL, 12, '2020/03/18', '2019-03-18 10:37:43', '2019-03-18 10:38:39');

-- ----------------------------
-- Table structure for pgp_emails
-- ----------------------------
DROP TABLE IF EXISTS `pgp_emails`;
CREATE TABLE `pgp_emails`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `pgp_email` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `created_at` timestamp(0) NULL DEFAULT NULL,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `unique_pgp_emails`(`pgp_email`) USING BTREE
) ENGINE = MyISAM AUTO_INCREMENT = 92 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of pgp_emails
-- ----------------------------
INSERT INTO `pgp_emails` VALUES (11, 'example1@domain.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (12, 'example2@domain.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (14, 'example4@domain.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (19, 'example9@domain.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (20, 'example10@domain.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (25, 'xyz@test.com', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (26, 'example1245@domain.com', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (27, 'salman@sunztech.com', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (28, '124poi@titansecure.biz', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (29, 'saira@sss.com', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (30, 'nomee@msn.com', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (31, '1619DKV@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (32, '3669NBQ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (33, '2675DKN@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (34, '5147DXT@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (35, '5412JJN@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (36, '4338GQG@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (37, '8244SRE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (38, '2954PAJ@ARMORSEC.XYZ', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (39, '6845YAY@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (40, '4967GCM@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (41, '7992PFY@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (42, '5373SAJ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (43, '1233NPX@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (44, '7921MKT@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (45, '2188PBW@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (46, '2535MPM@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (47, '4511AXM@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (48, '4254PMS@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (49, '4437CZC@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (50, '8729YAM@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (51, '7497CXZ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (52, '5464NJF@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (53, '6362MBN@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (54, '9498NBS@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (55, '9643NZE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (56, '5752CXB@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (57, '8837ZRE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (58, '9347SKJ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (59, '3789NZU@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (60, '7245BCB@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (61, '9279GBS@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (62, '3754ZUB@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (63, '1747BBV@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (64, '2474VJS@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (65, '4288DXZ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (66, '1976JSN@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (67, '2458VZC@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (68, '1842WKX@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (69, '8931APD@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (70, '5438DNE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (71, '8478YXA@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (72, '4134PTE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (73, '1879TWV@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (74, '2196GNW@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (75, '4763XEK@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (76, '4337VZF@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (77, '9437TPJ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (78, '4347HVE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (79, '5225CHG@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (80, '2583AUF@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (81, '5734TXZ@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (82, '6497NVE@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (83, '3371GCF@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (84, '5945VEC@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (85, '7574XDR@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (86, '8497KRA@ARMORSEC.XYZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (87, '955MNH@TITANSECURE.BIZ', 1, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (88, '358GTR@TITANSECURE.BIZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (89, '349VFT@TITANSECURE.BIZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (90, '791BFT@TITANSECURE.BIZ', 0, NULL, NULL);
INSERT INTO `pgp_emails` VALUES (91, '599NGT@TITANSECURE.BIZ', 0, NULL, NULL);

-- ----------------------------
-- Table structure for profiles
-- ----------------------------
DROP TABLE IF EXISTS `profiles`;
CREATE TABLE `profiles`  (
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
-- Table structure for screen_lock_devices
-- ----------------------------
DROP TABLE IF EXISTS `screen_lock_devices`;
CREATE TABLE `screen_lock_devices`  (
  `dev_id` int(11) NOT NULL AUTO_INCREMENT,
  `imei` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `start_date` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `end_date` varchar(60) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`dev_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 48 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of screen_lock_devices
-- ----------------------------
INSERT INTO `screen_lock_devices` VALUES (42, '862103035266906', '2018-10-08 10:36:12', '2018-10-12 10:36:12');
INSERT INTO `screen_lock_devices` VALUES (43, '867344034644389', '2018-10-08 16:11:15', '2018-10-12 16:11:15');
INSERT INTO `screen_lock_devices` VALUES (44, '867344034644389', '2018-10-08 16:11:15', '2018-10-12 16:11:15');
INSERT INTO `screen_lock_devices` VALUES (45, '351558071797775', '2018-10-08 16:39:15', '2018-10-12 16:39:15');
INSERT INTO `screen_lock_devices` VALUES (46, '351558071797775', '2018-10-08 16:39:15', '2018-10-12 16:39:15');
INSERT INTO `screen_lock_devices` VALUES (47, '358998071625282', '2018-10-08 21:11:00', '2018-10-12 21:11:00');

-- ----------------------------
-- Table structure for sim_ids
-- ----------------------------
DROP TABLE IF EXISTS `sim_ids`;
CREATE TABLE `sim_ids`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `sim_id` varchar(100) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `used` tinyint(4) NOT NULL DEFAULT 0,
  `start_date` datetime(0) NULL DEFAULT NULL,
  `expiry_date` datetime(0) NULL DEFAULT NULL,
  `created_at` timestamp(0) NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` timestamp(0) NULL DEFAULT NULL ON UPDATE CURRENT_TIMESTAMP(0),
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `sim_id_UNIQUE`(`sim_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 61 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = MyISAM AUTO_INCREMENT = 311 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tbl_device_settings
-- ----------------------------
INSERT INTO `tbl_device_settings` VALUES (298, 'PNQV771788', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":false}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (246, 'LGCE661532', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":false}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (237, 'CAUD646336', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (310, 'KUBX441550', '{}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (232, 'KLEV719137', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (231, 'TTNT137322', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (230, 'BBFY534166', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-03-15 16:33:59', NULL);
INSERT INTO `tbl_device_settings` VALUES (229, 'QBMU218689', '{\"bluetooth_status\":false,\"call_status\":false,\"hotspot_status\":false,\"screenshot_status\":false,\"wifi_status\":true}', '2019-03-15 16:33:59', NULL);

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
-- Table structure for user_app_profiles
-- ----------------------------
DROP TABLE IF EXISTS `user_app_profiles`;
CREATE TABLE `user_app_profiles`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` varchar(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL,
  `profile_id` int(11) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

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
) ENGINE = InnoDB AUTO_INCREMENT = 5092 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user_apps
-- ----------------------------
INSERT INTO `user_apps` VALUES (5037, 608, 1407, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5038, 608, 1513, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5039, 608, 1409, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5040, 608, 3698, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5041, 608, 1417, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5042, 608, 1551, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5043, 608, 1512, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5044, 608, 1412, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5045, 608, 1588, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5046, 608, 1414, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5047, 608, 1411, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5048, 608, 1419, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5049, 608, 1592, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5050, 608, 1425, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5051, 608, 1430, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5052, 608, 1423, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5053, 608, 3717, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5054, 608, 1424, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5055, 608, 1408, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5056, 608, 3719, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5057, 608, 3715, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5058, 608, 1426, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5059, 608, 3714, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5060, 608, 3716, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5061, 608, 1427, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5062, 608, 1555, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5063, 608, 1434, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5064, 608, 3718, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5065, 608, 3724, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5066, 608, 1437, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5067, 608, 1435, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5068, 608, 3731, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5069, 608, 3725, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5070, 608, 3726, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5071, 608, 3727, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5072, 608, 3728, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5073, 608, 3729, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5074, 608, 3730, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5075, 608, 1601, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5076, 608, 1567, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5077, 608, 1566, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5078, 608, 6280, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5079, 608, 6277, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5080, 608, 3733, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5081, 608, 1465, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5082, 608, 3734, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5083, 608, 4129, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5084, 608, 3735, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5085, 608, 1535, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5086, 608, 1461, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5087, 608, 3736, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5088, 608, 6291, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5089, 608, 1453, 1, 0, 0, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5090, 608, 1462, 0, 1, 1, '2019-03-18 16:54:54', NULL);
INSERT INTO `user_apps` VALUES (5091, 608, 1463, 1, 0, 0, '2019-03-18 16:54:54', NULL);

-- ----------------------------
-- Table structure for user_device_controls
-- ----------------------------
DROP TABLE IF EXISTS `user_device_controls`;
CREATE TABLE `user_device_controls`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `device_control_id` int(11) NOT NULL,
  `enable` tinyint(4) NOT NULL DEFAULT 0,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 CHARACTER SET = latin1 COLLATE = latin1_swedish_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Table structure for user_device_passwords
-- ----------------------------
DROP TABLE IF EXISTS `user_device_passwords`;
CREATE TABLE `user_device_passwords`  (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `device_id` int(11) NOT NULL,
  `guest` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `encrypted` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  `code` varchar(255) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
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
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb4 COLLATE = utf8mb4_unicode_ci ROW_FORMAT = Compact;

-- ----------------------------
-- Records of user_roles
-- ----------------------------
INSERT INTO `user_roles` VALUES (1, 'admin', 1);
INSERT INTO `user_roles` VALUES (2, 'dealer', 1);
INSERT INTO `user_roles` VALUES (3, 'sdealer', 1);

SET FOREIGN_KEY_CHECKS = 1;
