var HOST_NAME = process.env.HOST_NAME;
var APP_ENV = process.env.APP_ENV;

// App Info
var APP_TITLE = "LockMesh Dev";
var URL = "http://localhost:3000";

var USERNAME = '';
var PASSWORD = '';


// set default utc-1 timezone for testing
var TIME_ZONE =  "Europe/London"; // "Asia/Karachi";
var TIME_ZONE_OFFSET = '+0:00';

// Database
var DB_HOST = "localhost";
var DB_NAME = "lockmesh_db";
var DB_USERNAME = "root";
var DB_PASSWORD = "";


// Email
var SMTP_FROM_EMAIL = "admin@lockmesh.com";
var SMTP_FROM_NAME = "Admin";

// Device ID and Dealer Pin
var DEVICE_ID_SYSTEM_LETTER = "L";
var DEVICE_ID_SYSTEM_LETTER_INDEX = 2;

var DEALER_PIN_SYSTEM_LETTER = "6";
var DEALER_PIN_SYSTEM_LETTER_INDEX = 4;

var STAFF_ID_SYSTEM_LETTER = '1';
var STAFF_ID_SYSTEM_LETTER_INDEX = 1;


// SA APIS AND CREDENTIALS
var SUPERADMIN_URL = "http://localhost:8042";
var SUPERADMIN_URL_API = "http://localhost:8042";
var SA_USERNAME = 'whiteLabelAdmin!786@gmial.com';
var SA_PASSWORD = 'whiteLabel@Admin!786';

// TWILIO CREDENTIALS
const accountSid = 'AC2383c4b776efb51c86cc6f9a5cdb4e89';
const authToken = '8f09f2ebc98338bff27e0ac73ea71a23';
let twilioClient = require('twilio')(accountSid, authToken);

// FIXER CREDENTIALS
var FIXER_API_KEY= '96035c5c5b46baea5a96b84930eaed79';
var BASE_CURRENCY = 'USD';

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
			TIME_ZONE = 'Europe/London';

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
			TIME_ZONE = 'Europe/London';

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
			TIME_ZONE = 'Europe/London';

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
			TIME_ZONE = 'Europe/London';

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
			TIME_ZONE = 'Europe/London';

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
} else {
	HOST_NAME = 'localhost',
	APP_ENV = 'local'
}


module.exports.SUPERADMIN_URL = SUPERADMIN_URL
module.exports.SUPERADMIN_URL_API = SUPERADMIN_URL_API
module.exports = {
	// APP INFO Constants
	HOST_NAME: HOST_NAME,
	APP_TITLE: APP_TITLE,
	APP_ENV: APP_ENV,
	HOST: URL,
	PORT: 3000,
	
	TIME_ZONE: TIME_ZONE,
	TIME_ZONE_OFFSET: TIME_ZONE_OFFSET,
	SECRET: "kepitsecretwithauth!@#",
	EXPIRES_IN: "86400s", // 24 Hours
	DASHBOARD_EXPIRES_IN: '10800s', //3 Hours
	MOBILE_EXPIRES_IN: '10800s', //3 Hours
	
	// APP Credentials
	USERNAME: USERNAME,
	PASSWORD: PASSWORD,

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

	// Twilio credentials
	twilioClient: twilioClient,

	// Fixer API key
	FIXER_API_KEY: FIXER_API_KEY,
	BASE_CURRENCY: BASE_CURRENCY,

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

	VALIDATE_SIM_ID: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/validate_sim_id`,

	REQUEST_FOR_CREDITS: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/request_for_credits`,

	RESYNC_IDS: `${
		this.SUPERADMIN_URL_API
		}/api/v1/users/resync_ids`,

	SUPERADMIN_USER_CREDENTIALS: {
		email: SA_USERNAME,
		password: SA_PASSWORD
	}

};