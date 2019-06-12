const nodemailer = require('nodemailer');

/** SMTP Email **/
const smtpTransport = nodemailer.createTransport({
    host: "smtp.office365.com",
    secureConnection: true,
    // logger: true,
    // debug: true,
    connectionTimeout: 600000,
    greetingTimeout: 300000,
    port: 587,
    auth: {
        user: "admin@lockmesh.com",
        pass: "34e@2!2xder"
    }
});

module.exports.sendEmail = (subject, message, to, callback) => {
    let cb = callback;
    subject = "Lockmesh.com Team - " + subject
    let mailOptions = {
        from: "admin@lockmesh.com",
        to: to,
        subject: subject,
        html: message
    };
    smtpTransport.sendMail(mailOptions, cb);
}
module.exports = smtpTransport;