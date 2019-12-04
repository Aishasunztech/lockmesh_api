const { sql } = require('../../config/database');
var empty = require('is-empty');
const constants = require("../../constants/Application");
const general_helpers = require('../../helper/general_helper');

const device_helpers = require('../../helper/device_helpers');

let usr_acc_query_text = constants.usr_acc_query_text;

exports.getDashboardData = async function (req, res) {
    var verify = req.decoded; // await verifyToken(req, res);
    // var where_con = "";
    let dashboardData = {};

    if (verify) {
        let loggedUserType = verify.user.user_type;

        dealer_role = await general_helpers.getDealerTypeIdByName('dealer');
        sdealer_role = await general_helpers.getDealerTypeIdByName('sdealer');
        if (loggedUserType == constants.ADMIN) {

            let users = await sql.query("select * from users where del_status =0 order by created_at DESC");
            if (users) {
                dashboardData.users = users.length;
            }

            let apkList = await sql.query("select * from apk_details where delete_status=0 AND apk_type != 'permanent' order by id ASC");
            if (apkList) {
                dashboardData.apks = apkList.length;
            }



            let policies = await sql.query("SELECT * FROM policy where delete_status=0");
            if (policies) {
                dashboardData.policies = policies.length;
            }


            if (!empty(dealer_role)) {
                let dealers = await sql.query(`SELECT * FROM dealers WHERE type=${dealer_role} ORDER BY created DESC`);
                if (dealers) {
                    dashboardData.dealers = dealers.length
                }
            }

            if (!empty(sdealer_role)) {
                let sdealers = await sql.query(`SELECT * FROM dealers WHERE type=${sdealer_role} ORDER BY created DESC`);
                // console.log(`SELECT * FROM dealers WHERE type=${sdealer_role} AND connected_dealer =${verify.user.id} ORDER BY created DESC`)
                if (sdealers) {
                    dashboardData.sdealers = sdealers.length
                }
            }


            // console.log(`SELECT devices.* ,${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  ${where_con} ORDER BY devices.id DESC`)
            let devices = await sql.query(`SELECT devices.* ,${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  ORDER BY devices.id DESC`);

            if (devices) {
                // console.log(devices, 'devices are');
                let online_devices = 0;
                let active_devices = 0;
                for (let device of devices) {
                    //    console.log(device_helpers.checkStatus(device)); 

                    if (device.online == 'online') {
                        online_devices += 1;
                    }
                    if (device_helpers.checkStatus(device) == constants.DEVICE_ACTIVATED) {
                        active_devices += 1;
                    }
                }
                dashboardData.activeDevices = active_devices;
                dashboardData.onlineDevices = online_devices;
            }

        } else if (loggedUserType == constants.DEALER) {

            // sdealers
            if (!empty(sdealer_role)) {
                let sdealers = await sql.query(`SELECT * FROM dealers WHERE type=${sdealer_role} AND connected_dealer =${verify.user.id} ORDER BY created DESC`);
                // console.log(`SELECT * FROM dealers WHERE type=${sdealer_role} AND connected_dealer =${verify.user.id} ORDER BY created DESC`)
                if (sdealers) {
                    dashboardData.sdealers = sdealers.length
                }
            }

            // users
            let dealerIds = await sql.query("select dealer_id from dealers where connected_dealer = '" + verify.user.id + "' AND  type = 3 order by created DESC")
            if (dealerIds) {
                let dealer = [verify.user.id]
                // console.log(dealerIds, 'dealer ids');
                if (dealerIds.length) {
                    for (var i = 0; i < dealerIds.length; i++) {
                        var sDealers_id = dealerIds[i].dealer_id;
                        dealer.push(sDealers_id)
                    }
                }
                // console.log("select Count(*) as total_users from users WHERE dealer_id IN (" + dealer.join() + ") AND del_status = 0 order by created_at DESC");
                let results = await sql.query("select  Count(*) as total_users from users WHERE dealer_id IN (" + dealer.join() + ") AND del_status = 0 order by created_at DESC")

                if (results && results.length) {
                    dashboardData.users = results[0].total_users;
                }
            }

            // apks
            // let apkList = await sql.query("select count(*) as total_apks from dealer_apks join apk_details on apk_details.id = dealer_apks.apk_id where dealer_apks.dealer_id='" + verify.user.id + "' AND apk_details.apk_type != 'permanent' AND delete_status = 0");
            let apkList = await sql.query(`SELECT count(*) AS total_apks FROM dealer_permissions JOIN apk_details ON (apk_details.id = dealer_permissions.permission_id) WHERE (dealer_permissions.dealer_id='${verify.user.id}' OR (dealer_permissions.dealer_id = 0 AND dealer_permissions.dealer_type='admin')) AND apk_details.apk_type != 'permanent' AND delete_status = 0 AND dealer_permissions.permission_type = 'apk';`);
            if (apkList && apkList.length) {
                dashboardData.apks = apkList[0].total_apks;
            }

            // devivces
            let devices = await sql.query(`SELECT devices.* ,${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  AND (usr_acc.dealer_id =${verify.user.id} OR usr_acc.prnt_dlr_id = ${verify.user.id}) ORDER BY devices.id DESC`);
            if (devices) {
                // console.log(devices, 'devices are');
                let online_devices = 0;
                let active_devices = 0;
                for (let device of devices) {
                    //    console.log(device_helpers.checkStatus(device)); 

                    if (device.online == 'online') {
                        online_devices += 1;
                    }
                    if (device_helpers.checkStatus(device) == constants.DEVICE_ACTIVATED) {
                        active_devices += 1;
                    }
                }
                dashboardData.activeDevices = active_devices;
                dashboardData.onlineDevices = online_devices;
            }

            // policies
            // let permittedids = await sql.query(`SELECT policy_id FROM dealer_policies WHERE dealer_id='${verify.user.id}'`);

            let condition = '';
            if (loggedUserType === constants.DEALER) {
                condition = ` OR (dealer_id = 0 AND dealer_type = 'admin')`
            }
            else if (loggedUserType === constants.SDEALER) {
                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${verify.user.id}`);
                condition = ` OR (dealer_id = 0 AND (dealer_type='admin' OR (dealer_type='dealer' AND permission_by=${getParentId[0].connected_dealer}))) `
            }
            let permittedids = await sql.query(`SELECT permission_id FROM dealer_permissions WHERE (dealer_id='${verify.user.id}' ${condition}) AND permission_type = 'policy';`);


            let prrr = [];
            if (permittedids && permittedids.length) {
                for (let item of permittedids) {
                    prrr.push(item.permission_id)
                }
            }
            let query = ''
            if (prrr.length) {
                query = "select count(*) as total_policies from policy where (dealer_id='" + verify.user.id + "' OR id IN (" + prrr + ")) AND delete_status=0"
            }
            else {
                query = "select count(*) as total_policies from policy where dealer_id='" + verify.user.id + "' AND delete_status=0"
            }
            
            let policies = await sql.query(query);
            
            if (policies && policies.length) {
                dashboardData.policies = policies[0].total_policies;
            }


            //    link requests 
            let link_requests = await sql.query(`select count(*) as link_requests FROM devices LEFT JOIN usr_acc ON  (devices.id = usr_acc.device_id) WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0  AND (usr_acc.dealer_id =${verify.user.id} OR usr_acc.prnt_dlr_id = ${verify.user.id})  ORDER BY devices.id DESC`)
            if (link_requests && link_requests.length) {
                dashboardData.link_requests = link_requests[0].link_requests;
            }


        } else {
            // devices
            let devices = await sql.query(`SELECT devices.* ,${usr_acc_query_text} FROM devices LEFT JOIN usr_acc ON  ( devices.id = usr_acc.device_id ) LEFT JOIN dealers on (usr_acc.dealer_id = dealers.dealer_id) WHERE devices.reject_status = 0 AND usr_acc.del_status = 0 AND usr_acc.unlink_status = 0  AND (usr_acc.dealer_id =${verify.user.id}) ORDER BY devices.id DESC`);
            if (devices) {
                // console.log(devices, 'devices are');
                let online_devices = 0;
                let active_devices = 0;
                for (let device of devices) {
                    //    console.log(device_helpers.checkStatus(device)); 

                    if (device.online == 'online') {
                        online_devices += 1;
                    }
                    if (device_helpers.checkStatus(device) == constants.DEVICE_ACTIVATED) {
                        active_devices += 1;
                    }
                }
                dashboardData.activeDevices = active_devices;
                dashboardData.onlineDevices = online_devices;
            }

            // users
            let users = await sql.query("select count(*) as total_users from users WHERE dealer_id = '" + verify.user.id + "' AND del_status = 0 order by created_at DESC")
            if (users && users.length) {
                dashboardData.users = users[0].total_users;
            }


            // link requests
            let link_requests = await sql.query(`select count(*) as link_requests FROM devices LEFT JOIN usr_acc ON  (devices.id = usr_acc.device_id) WHERE ((usr_acc.device_status=0 OR usr_acc.device_status="0") AND (usr_acc.unlink_status=0 OR usr_acc.unlink_status="0") AND (usr_acc.activation_status IS NULL)) AND devices.reject_status = 0  AND (usr_acc.dealer_id =${verify.user.id}) ORDER BY devices.id DESC`)
            if (link_requests && link_requests.length) {
                dashboardData.link_requests = link_requests[0].link_requests;
            }
        }

        res.send({
            status: true,
            msg: "Data found",
            data: dashboardData
        });
        return;

    }
};