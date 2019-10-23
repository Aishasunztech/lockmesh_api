
const { sql } = require('../../config/database');

const Constants = require('../../constants/Application');
const device_helpers = require('../../helpers/device_helpers');
const general_helpers = require('../../helpers/general_helpers');

exports.exchangeCurrency = async function (req, res) {
    let toCr = req.params.toCr;
    let getCurrency = 'SELECT * FROM currencies';
    let currenciesRes = await sql.query(getCurrency);
    // console.log(currenciesRes);
    if (currenciesRes.length) {
        let currencies = JSON.parse(currenciesRes[0].data);
        res.send({
            status: true,
            currency_unit: currencies[toCr]
        })

    } else {
        res.send({
            status: false,
            msg: "Currency Not Found"
        })
    }
}