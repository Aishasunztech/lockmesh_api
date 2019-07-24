
var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require("fs");
var mime = require('mime');
var backupController = require('../app/controllers/backup')
var languageController = require('../app/controllers/language')
const helpers = require('../helper/general_helper');
var MsgConstants = require('../constants/MsgConstants');
var objectsize = require('object-sizeof')
var CryptoJS = require("crypto-js");

/* GET users listing. */
router.get('/', async function (req, res, next) {
    let data = {
        key: 'value'
    }
    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), 'secret key 123');
    console.log(ciphertext.toString());
    
    // Decrypt
    var bytes  = CryptoJS.AES.decrypt(ciphertext.toString(), 'secret key 13');
    var plaintext = bytes.toString(CryptoJS.enc.Utf8);
     
    console.log(plaintext);
    res.send("Test")

    // stripe.tokens.create({
    //     card: {
    //         number: '4242424242424242',
    //         exp_month: 12,
    //         exp_year: 2020,
    //         cvc: '1234'
    //     }
    // }, async function (err, token) {
    //     console.log(err);
    //     console.log(token);
    // });

    // var ip = req.headers['x-forwarded-for']
    // res.send({
    //     ip: ip
    // })

    // var cm = require('csv-mysql');

    // var data = '"1","2","3"\n"4","5","6"';
    // var options = {
    //     mysql: {
    //         host: 'localhost',
    //         user: 'root',
    //         database: 'lockmesh_db',
    //     },
    //     csv: {
    //         comment: '#',
    //         quote: '"'
    //     },
    //     headers: ["c1", "c2", "c3"]
    // }

    // res.send(tablesName)

    // let data1 = await cm.import(options, data, async function (err, rows) {
    //     if (err === null) err = false;
    //     // expect(err).to.equal(false);
    //     // done();
    // });
    // res.send(data1)

    // var clientip = req.socket.remoteAddress;
    // var xffip = req.header('x-real-ip') || req.connection.remoteAddress
    // var ip = xffip ? xffip : clientip;
    // res.send({ client: xffip });

    // let filename = "icon_AdSense.png";
    // let filename = "apk-1541677256487.apk.jpg";
    // var ip_info = get_ip(req);
    // console.log(ip_info.clientIp);
    // res.send({
    //     ip_info
    // })
    // proxy_set_header X-Forwarded-For $remote_addr;
    // res.send('IP = ' + req.connection.remoteAddress + ':' + req.connection.remotePort)
    // console.log(req.headers['x-forwarded-for'])
    // res.send({
    //     data: req.headers['x-forwarded-for']
    // })
    // let file = path.join(__dirname, "../uploads/" + filename);

    // Jimp.read(file)
    //     .then(lenna => {
    //         console.log("success", file)
    //     })
    //     .catch(err => {
    //         console.error("error", err);
    //     });

    // let file = path.join(__dirname, "../uploads/apk-1541677256487.apk");
    // let packageName = await helpers.getAPKPackageName(file);
    // let versionName = await helpers.getAPKVersionName(file);
    // let versionCode = await helpers.getAPKVersionCode(file);
    // let label = await helpers.getAPKLabel(file);
    // res.send({
    //     packageName: packageName,
    //     versionName: versionName,
    //     versionCode: versionCode,
    //     label: label
    // });
    // res.send(mime.getExtension(filename));

    // helpers.resetDB();
    // apk-ScreenLocker v3.31.apk

    // const unzip = zlib.createGunzip();
    // fileContents.pipe(unzip).pipe(writeStream);

    // const directoryFiles = fs.readdirSync(path.join(__dirname, "../"));

    // res.send(directoryFiles);
    // directoryFiles.forEach(filename => {
    // const fileContents = fs.createReadStream(`./data/${filename}`);
    // const writeStream = fs.createWriteStream(`./data/${filename.slice(0, -3)}`);
    // const unzip = zlib.createGunzip();
    // fileContents.pipe(unzip).pipe(writeStream);
    // });

    // var zip = new AdmZip(path.join(__dirname, "../uploads/apk-ScreenLocker v3.31.apk"));
    // var zipEntries = await zip.getEntries();
    // console.log(zipEntries.length)
    // res.send(zipEntries);
    // for (var i = 0; i < zipEntries.length; i++) {
    //   if (zipEntries[i].entryName.match(/readme/))
    //     console.log(zip.readAsText(zipEntries[i]));
    // }
});

/** Get back up DB File **/
router.get("/getBackupFile/:file", backupController.getBackupFiles);

/** Get image logo **/
router.get("/getFile/:file", async function (req, res) {
    // let verify = await verifyToken(req, res);
    // if (verify.status) {
    if (fs.existsSync(path.join(__dirname, "../uploads/" + req.params.file))) {
        let file = path.join(__dirname, "../uploads/" + req.params.file);
        let fileMimeType = mime.getType(file);
        let filetypes = /jpeg|jpg|apk|png/;
        // Do something
        // if (filetypes.test(fileMimeType)) {
        // res.set('Content-Type', fileMimeType); // mimeType eg. 'image/bmp'
        res.sendFile(path.join(__dirname, "../uploads/" + req.params.file));
        // } else {
        //     res.send({
        //         "status": false,
        //         "msg": await helpers.convertToLang(req.translation[MsgConstants.DEALER_ACTIV_SUCC], MsgConstants.DEALER_ACTIV_SUCC), // file not found"
        //     })
        // }
    } else {
        data = {
            "status": false,
            "msg": "file not found", //  await helpers.convertToLang(req.translation[MsgConstants.FILE_NOT_FOUND], MsgConstants.FILE_NOT_FOUND),
        }
        res.send(data)
    }
    // }

});

router.get('/languages', languageController.languages)

module.exports = router;
