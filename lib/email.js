var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');
var constants = require('../config/constants');

var transporter = nodemailer.createTransport(smtpTransport({
	host: constants.SMTP_HOST,
	port: constants.SMTP_PORT,

	// secureConnection: true,
	
	// tls: true,
	// tls: {
	// 	ciphers: 'SSLv3',
	// 	rejectUnauthorized: false
	// },
	// requireTLS: true
	// authMethod : 'PLAIN',

	// logger: true,
	// debug: true,

	connectionTimeout: 600000,
	greetingTimeout: 300000,

	auth: {
		user: constants.SMTP_USERNAME,
		pass: constants.SMTP_PASSWORD
	}
}));



exports.sendEmail = function (subject, message, to, callback, attachment = null) {
	let cb = callback;
	subject = `${constants.SMTP_COMMON_SUBJECT} ${subject}`

	let mailOptions = {
		from: constants.SMTP_FROM_EMAIL,
		to: to,
		subject: subject,
		html: message,
		attachments: attachment ? [{ filename: attachment.fileName, path: attachment.file, contentType: 'application/pdf' }] : null
	};
	// console.log("hello smtp", smtpTransport);
	transporter.sendMail(mailOptions, cb);
}