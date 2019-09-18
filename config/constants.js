const HOST_NAME = process.env.HOST_NAME;
let APP_TITLE = "LockMesh";
let URL = "http://localhost:3000";
let SUPERADMIN_URL = "http://localhsot:8042";

// Database
let DB_HOST = "localhost";
let DB_NAME = "lockmesh_db";
let DB_USERNAME = "root";
let DB_PASSWORD = "";

// Email
let SMTP_FROM_EMAIL = "admin@lockmesh.com";
let SMTP_FROM_NAME = "Admin";

// Device ID and Dealer Pin
let DEVICE_ID_SYSTEM_LETTER = "L";
let DEVICE_ID_SYSTEM_LETTER_INDEX = 2;

let DEALER_PIN_SYSTEM_LETTER = "6";
let DEALER_PIN_SYSTEM_LETTER_INDEX = 4;

let STAFF_ID_SYSTEM_LETTER = '1';
let STAFF_ID_SYSTEM_LETTER_INDEX = 1;

if (HOST_NAME) {
	APP_TITLE = HOST_NAME;
	switch (HOST_NAME) {
		case "":
		case "localhost":
			break;
		case "LockMesh":
			URL = "https://lockmesh.com";
			SUPERADMIN_URL = "https://meshguard.co";

			// Database
			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		case "TitanLocker":
			URL = "https://titansecureserver.com";
			SUPERADMIN_URL = "https://meshguard.co";

			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";

			DEVICE_ID_SYSTEM_LETTER = "T";
			DEALER_PIN_SYSTEM_LETTER = "5";
			STAFF_ID_SYSTEM_LETTER = '2';

			break;
		case "LockMesh Dev":
			URL = "https://dev.lockmesh.com";
			SUPERADMIN_URL = "https://dev.meshguard.co";

			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		default:
			break;
	}
}
// else {
// 	// APP_TITLE = 'LockMesh'
// }

(module.exports.SUPERADMIN_URL = SUPERADMIN_URL),
(module.exports = {
	APP_TITLE: APP_TITLE,
	HOST: URL,
	PORT: "",
	SECRET: "kepitsecretwithauth!@#",
	EXPIRES_IN: "86400s", // 24 Hours
	DASHBOARD_EXPIRES_IN:'10800s', //3 Hours
	MOBILE_EXPIRES_IN:'10800s', //3 Hours
	BASIC_AUTH_USER:"web",
	BASIC_AUTH_PASSWORD:"Google!@#1",

	// SMTP Constants
	SMTP_HOST: "smtp.office365.com",
	SMTP_PORT: 587,
	SMTP_USERNAME: "admin@lockmesh.com",
	SMTP_PASSWORD: "34e@2!2xder",

	SMTP_FROM_EMAIL: SMTP_FROM_EMAIL,
	SMTP_FROM_NAME: SMTP_FROM_NAME,
	SMTP_COMMON_SUBJECT: `${APP_TITLE} -`,

	// Database Constants
	DB_HOST: DB_HOST,
	DB_NAME: DB_NAME,
	DB_USERNAME: DB_USERNAME,
	DB_PASSWORD: DB_PASSWORD,

	DEVICE_ID_SYSTEM_LETTER,
	DEVICE_ID_SYSTEM_LETTER_INDEX,

	DEALER_PIN_SYSTEM_LETTER,
	DEALER_PIN_SYSTEM_LETTER_INDEX,

	STAFF_ID_SYSTEM_LETTER,
	STAFF_ID_SYSTEM_LETTER_INDEX,

	// Fixer API key
	FIXER_API_KEY: "96035c5c5b46baea5a96b84930eaed79",
	BASE_CURRENCY: "USD",

	// SUPERADMIN URLs
	SUPERADMIN_LOGIN_URL: `${
		this.SUPERADMIN_URL
		}/api/v1/auth/white_label_login`,
	UPDATE_DEVICE_SUPERADMIN_URL: `${
		this.SUPERADMIN_URL
		}/api/v1/users/update_device_details`,
	REQUEST_FOR_CREDITS: `${
		this.SUPERADMIN_URL
		}/api/v1/users/request_for_credits`,

	RESYNC_IDS: `${
		this.SUPERADMIN_URL
		}/api/v1/users/resync_ids`,

	SUPERADMIN_USER_CREDENTIALS: {
		email: "whiteLabelAdmin!786@gmial.com",
		password: "whiteLabel@Admin!786"
	}
});
