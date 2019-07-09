module.exports = {
	APP_TITLE: 'Lockmesh',
	HOST: "http://localhost:3000",
	SECRET: 'kepitsecretwithauth!@#',
  	// EXPIRES_IN: '3s',
  	EXPIRES_IN: '86400s',

	// SMTP Constants
	SMTP_HOST: 'smtp.office365.com',
	SMTP_PORT: 587,
	SMTP_USERNAME: "admin@lockmesh.com",
	SMTP_PASSWORD: "34e@2!2xder",

	SMTP_FROM_EMAIL: "admin@lockmesh.com",
	SMTP_FROM_NAME: "Super Admin",
	SMTP_COMMON_SUBJECT: "Lockmesh.com - ",

	// Database Constants
	DB_HOST: "localhost",
	DB_NAME: "lockmesh_db",
	DB_USERNAME: "root",
	DB_PASSWORD: "",

	// Fixer API key
	FIXER_API_KEY: '96035c5c5b46baea5a96b84930eaed79',
	BASE_CURRENCY: 'USD',

	// SUPERADMIN URLs
	SUPERADMIN_LOGIN_URL: 'http://localhost:8042/api/v1/auth/white_label_login',
	UPDATE_DEVICE_SUPERADMIN_URL: 'http://localhost:8042/api/v1/users/update_device_details',
	REQUEST_FOR_CREDITS: 'http://localhost:8042/api/v1/users/request_for_credits',
	SUPERADMIN_USER_CREDENTIALS: {
		email: 'whiteLabelAdmin!786@gmial.com',
		password: 'whiteLabel@Admin!786'
	}
};