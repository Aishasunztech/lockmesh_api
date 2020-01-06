const HOST_NAME = process.env.HOST_NAME;

// App Info
let APP_TITLE = "LockMesh Dev";
let URL = "http://localhost:3000";
let SUPERADMIN_URL = "http://localhost:8042";
let SUPERADMIN_URL_API = "http://localhost:8042";
// set default utc-1 timezone for testing
let TIME_ZONE = "Europe/Berlin"; // "Asia/Karachi";

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
		case "localhost": {
			break;
		}

		case "LockMesh Dev": {
			URL = "https://dev.lockmesh.com";
			SUPERADMIN_URL = "https://dev.meshguard.co";
			SUPERADMIN_URL_API = "https://devapi.meshguard.co"
			TIME_ZONE = 'Europe/Berlin';

			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		}

		case "PreDev": {
			URL = "https://predev.lockmesh.com";
			SUPERADMIN_URL = "https://dev.meshguard.co";
			SUPERADMIN_URL_API = "https://devapi.meshguard.co"
			TIME_ZONE = 'Europe/Berlin';

			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		}

		case "LoadTester": {
			URL = "https://loadtester.lockmesh.com";
			SUPERADMIN_URL = "https://dev.meshguard.co";
			SUPERADMIN_URL_API = "https://devapi.meshguard.co"
			TIME_ZONE = 'Europe/Berlin';

			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		}

		case "LockMesh": {
			URL = "https://lockmesh.com";
			SUPERADMIN_URL = "https://meshguard.co";
			SUPERADMIN_URL_API = "https://api.meshguard.co"
			TIME_ZONE = 'Europe/Berlin';

			// Database
			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";
			break;
		}

		case "TitanLocker": {
			URL = "https://titansecureserver.com";
			SUPERADMIN_URL = "https://meshguard.co";
			SUPERADMIN_URL_API = "https://api.meshguard.co"
			TIME_ZONE = 'Europe/Berlin';

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
		}

		case "CryptPhoneC": {
			URL = "https://cryptc.lockmesh.com";
			SUPERADMIN_URL = "https://meshguard.co";

			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";

			DEVICE_ID_SYSTEM_LETTER = "C";
			DEALER_PIN_SYSTEM_LETTER = "4";
			STAFF_ID_SYSTEM_LETTER = '3';
			break;
		}

		case "CryptPhoneK": {
			URL = "https://cryptk.lockmesh.com";
			SUPERADMIN_URL = "https://meshguard.co";

			// DB_HOST = "localhost";
			// DB_NAME = 'lockmesh_db'
			DB_USERNAME = "web";
			DB_PASSWORD = "Alibaba@40C#";

			// Email
			SMTP_FROM_EMAIL = "admin@lockmesh.com";
			SMTP_FROM_NAME = "Admin";

			DEVICE_ID_SYSTEM_LETTER = "K";
			DEALER_PIN_SYSTEM_LETTER = "3";
			STAFF_ID_SYSTEM_LETTER = '4';
			break;
		}

		default:
			break;
	}
}

module.exports.SUPERADMIN_URL = SUPERADMIN_URL
module.exports.SUPERADMIN_URL_API = SUPERADMIN_URL_API
module.exports = {
	// APP INFO Constants
	APP_TITLE: APP_TITLE,
	TIME_ZONE: TIME_ZONE,
	HOST: URL,
	PORT: "",
	SECRET: "kepitsecretwithauth!@#",
	EXPIRES_IN: "86400s", // 24 Hours
	DASHBOARD_EXPIRES_IN: '10800s', //3 Hours
	MOBILE_EXPIRES_IN: '10800s', //3 Hours

	// BASIC AUTH Constants
	BASIC_AUTH_USER: "web",
	BASIC_AUTH_PASSWORD: "Google!@#1",

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
		this.SUPERADMIN_URL_API
		}/api/v1/auth/white_label_login`,
	UPDATE_DEVICE_SUPERADMIN_URL: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/update_device_details`,
	ADD_CREDITS_SALE_RECORD: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/add_credits_sale_record`,

	CREATE_SERVICE_PRODUCT: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/create-service-product`,

	GENERATE_RANDOM_PGP: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/generate-random-username`,

	CHECK_UNIQUE_PGP: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/check-unique-pgp`,

	REQUEST_FOR_CREDITS: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/request_for_credits`,

	RESYNC_IDS: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/resync_ids`,

	SUPERADMIN_USER_CREDENTIALS: {
		email: "whiteLabelAdmin!786@gmial.com",
		password: "whiteLabel@Admin!786"
	}
};