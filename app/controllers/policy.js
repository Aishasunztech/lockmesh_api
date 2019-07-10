const { sql } = require('../../config/database');

const MsgConstants = require('../../constants/MsgConstants');
const app_Constants = require('../../constants/Application');
const helpers = require('../../helper/general_helper');
const device_helpers = require('../../helper/device_helpers');

// constants
// const ADMIN = "admin";
// const DEALER = "dealer";
// const SDEALER = "sdealer";
// const AUTO_UPDATE_ADMIN = "auto_update_admin";
// let usr_acc_query_text = "usr_acc.id, usr_acc.user_id, usr_acc.device_id as usr_device_id,usr_acc.account_email,usr_acc.account_name,usr_acc.dealer_id,usr_acc.dealer_id,usr_acc.prnt_dlr_id,usr_acc.link_code,usr_acc.client_id,usr_acc.start_date,usr_acc.expiry_months,usr_acc.expiry_date,usr_acc.activation_code,usr_acc.status,usr_acc.device_status,usr_acc.activation_status,usr_acc.account_status,usr_acc.unlink_status,usr_acc.transfer_status,usr_acc.dealer_name,usr_acc.prnt_dlr_name,usr_acc.del_status,usr_acc.note,usr_acc.validity, usr_acc.batch_no"

var data;

exports.getPolicies = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let userId = verify.user.id;
        let userType = await helpers.getUserType(userId);
        let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        //   console.log('user id si', user_acc_id);
        let where = "";
        let isValid = true;
        let policies = [];

        if (user_acc_id != undefined || user_acc_id != '' || user_acc_id != null) {
            where = where + " user_acc_id='" + user_acc_id + "'";

        } else {
            isValid = false;
        }
        if (isValid) {
            if (verify.user.user_type === app_Constants.ADMIN) {
                let query = "SELECT * FROM policy where delete_status=0";
                sql.query(query, async (error, results) => {
                    if (results.length) {
                        let adminRoleId = await helpers.getuserTypeIdByName(app_Constants.ADMIN);
                        let dealerCount = await helpers.dealerCount(adminRoleId);

                        for (var i = 0; i < results.length; i++) {
                            // console.log('push apps', results[i].push_apps)
                            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                            let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
                            let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
                            let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                            let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                            let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            dta = {
                                id: results[i].id,
                                policy_name: results[i].policy_name,
                                policy_note: results[i].policy_note,
                                status: results[i].status,
                                dealer_permission: permissions,
                                permission_count: permissionC,
                                // app_list: results[i].apk_list,
                                command_name: results[i].command_name,
                                controls: controls,
                                secure_apps: secure_apps,
                                push_apps: push_apps,
                                app_list: app_list2,
                                dealer_id: results[i].dealer_id
                            }
                            policies.push(dta);
                        }
                    }
                    data = {
                        "status": true,
                        "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
                        "policies": policies
                    };
                    // console.log(data);
                    res.send(data);
                });
            } else {
                // console.log(verify.user, "select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0")
                // sql.query("select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0", async function (error, results) {
                let myquery = "select policy_id from dealer_policies where dealer_id='" + verify.user.id + "'";
                // console.log(myquery, '1 query');
                let permittedids = await sql.query(myquery);
                let prrr = [];
                if (permittedids && permittedids.length) {
                    for (let item of permittedids) {
                        prrr.push(item.policy_id)
                    }
                }
                // console.log(prrr, 'permited ids');
                // console.log('2 query',"select * from policy where (dealer_id='" + verify.user.id + "' OR id IN ("+prrr+")) AND delete_status=0")
                let query = ''
                if (prrr.length) {
                    query = "select * from policy where (dealer_id='" + verify.user.id + "' OR id IN (" + prrr + ")) AND delete_status=0"
                }
                else {
                    query = "select * from policy where dealer_id='" + verify.user.id + "' AND delete_status=0"
                }
                sql.query(query, async function (error, results) {

                    if (error) {
                        console.log(error)
                    }
                    if (results.length > 0) {
                        // console.log(results);
                        let dealerRole = await helpers.getuserTypeIdByName(app_Constants.DEALER);
                        let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
                        let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

                        let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
                        let dealerCount = sdealerList.length;
                        for (var i = 0; i < results.length; i++) {
                            let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
                            let Sdealerpermissions = permissions.filter(function (item) {

                                for (let i = 0; i < sdealerList.length; i++) {
                                    if (
                                        item === sdealerList[i].dealer_id
                                    ) {
                                        return item
                                    }
                                }
                            })

                            // console.log(permissions,'sdealer list',Sdealerpermissions)




                            let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                            // console.log(permissions, 'permissions',Sdealerpermissions, 'sealerpermissions', permissionCount, 'permision count', )
                            let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                            let controls = (results[i].controls !== undefined && results[i].controls !== 'undefined' && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
                            let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== 'undefined' && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
                            let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== 'undefined' && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
                            let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== 'undefined' && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
                            let is_default = (results[i].id === default_policy_id) ? true : false
                            dta = {
                                id: results[i].id,
                                policy_name: results[i].policy_name,
                                policy_note: results[i].policy_note,
                                status: results[i].status,
                                dealer_permission: permissions,
                                permission_count: permissionC,
                                // app_list: results[i].apk_list,
                                command_name: results[i].command_name,
                                controls: controls,
                                secure_apps: secure_apps,
                                push_apps: push_apps,
                                app_list: app_list2,
                                is_default: is_default,
                                dealer_id: results[i].dealer_id
                            }
                            policies.push(dta);
                        }
                        return res.json({
                            "status": true,
                            "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
                            "policies": policies
                        });

                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // No result found",
                            policies: []
                        }
                        res.send(data);
                    }
                });
            }
        } else {
            data = {
                "status": false,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], MsgConstants.INVALID_USER), // Invalid User',
                "policies": []
            };
            res.send(data);
        }
    }

}

// async function (req, res) {
//     var verify = req.decoded;
//     // if (verify.status === true) {
//         if(verify) {
//         let userId = verify.user.id;
//         let userType = await helpers.getUserType(userId);
//         let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
//         //   console.log('user id si', user_acc_id);
//         let where = "";
//         let isValid = true;
//         let policies = [];

//         if (user_acc_id != undefined || user_acc_id != '' || user_acc_id != null) {
//             where = where + " user_acc_id='" + user_acc_id + "'";

//         } else {
//             isValid = false;
//         }
//         if (isValid) {
//             if (verify.user.user_type === app_Constants.ADMIN) {
//                 let query = "SELECT * FROM policy where delete_status=0";
//                 sql.query(query, async (error, results) => {
//                     if (results.length) {
//                         let adminRoleId = await helpers.getuserTypeIdByName(app_Constants.ADMIN);
//                         let dealerCount = await helpers.dealerCount(adminRoleId);

//                         for (var i = 0; i < results.length; i++) {
//                             // console.log('push apps', results[i].push_apps)
//                             let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
//                             let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
//                             let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
//                             let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
//                             let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
//                             let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
//                             let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
//                             dta = {
//                                 id: results[i].id,
//                                 policy_name: results[i].policy_name,
//                                 policy_note: results[i].policy_note,
//                                 status: results[i].status,
//                                 dealer_permission: permissions,
//                                 permission_count: permissionC,
//                                 // app_list: results[i].apk_list,
//                                 command_name: results[i].command_name,
//                                 controls: controls,
//                                 secure_apps: secure_apps,
//                                 push_apps: push_apps,
//                                 app_list: app_list2,
//                                 dealer_id: results[i].dealer_id
//                             }
//                             policies.push(dta);
//                         }
//                     }
//                     data = {
//                         "status": true,
//                         "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
//                         "policies": policies
//                     };
//                     // console.log(data);
//                     res.send(data);
//                 });
//             } else {
//                 // console.log(verify.user, "select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0")
//                 // sql.query("select policy.* from policy left join dealer_policies on policy.id = dealer_policies.policy_id where (dealer_policies.dealer_id='" + verify.user.id + "' OR policy.dealer_id = " + verify.user.id + ") AND policy.delete_status=0", async function (error, results) {
//                 let myquery = "select policy_id from dealer_policies where dealer_id='" + verify.user.id + "'";
//                 // console.log(myquery, '1 query');
//                 let permittedids = await sql.query(myquery);
//                 let prrr = [];
//                 if (permittedids && permittedids.length) {
//                     for (let item of permittedids) {
//                         prrr.push(item.policy_id)
//                     }
//                 }
//                 // console.log(prrr, 'permited ids');
//                 // console.log('2 query',"select * from policy where (dealer_id='" + verify.user.id + "' OR id IN ("+prrr+")) AND delete_status=0")
//                var sQry = "select * from policy where (dealer_id='" + verify.user.id + "' OR id IN (" + prrr + ")) AND delete_status=0";
//                console.log('sQry is: ', sQry);
//                 sql.query(sQry, async function (error, results) {

//                     if (error) {
//                         console.log(error)
//                     }
//                     console.log('result is: ', results);
//                     if (results.length > 0) {
//                         // console.log(results);
//                         let dealerRole = await helpers.getuserTypeIdByName(Constants.DEALER);
//                         let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
//                         let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

//                         let sdealerList = await sql.query("select dealer_id from dealers WHERE connected_dealer = '" + verify.user.id + "'")
//                         let dealerCount = sdealerList.length;
//                         for (var i = 0; i < results.length; i++) {
//                             let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : JSON.parse('[]');
//                             let Sdealerpermissions = permissions.filter(function (item) {

//                                 for (let i = 0; i < sdealerList.length; i++) {
//                                     if (
//                                         item === sdealerList[i].dealer_id
//                                     ) {
//                                         return item
//                                     }
//                                 }
//                             })

//                             // console.log(permissions,'sdealer list',Sdealerpermissions)




//                             let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
//                             // console.log(permissions, 'permissions',Sdealerpermissions, 'sealerpermissions', permissionCount, 'permision count', )
//                             let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
//                             let controls = (results[i].controls !== undefined && results[i].controls !== 'undefined' && results[i].controls !== null) ? JSON.parse(results[i].controls) : JSON.parse('[]');
//                             let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== 'undefined' && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : JSON.parse('[]');
//                             let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== 'undefined' && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : JSON.parse('[]');
//                             let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== 'undefined' && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : JSON.parse('[]');
//                             let is_default = (results[i].id === default_policy_id) ? true : false
//                             dta = {
//                                 id: results[i].id,
//                                 policy_name: results[i].policy_name,
//                                 policy_note: results[i].policy_note,
//                                 status: results[i].status,
//                                 dealer_permission: permissions,
//                                 permission_count: permissionC,
//                                 // app_list: results[i].apk_list,
//                                 command_name: results[i].command_name,
//                                 controls: controls,
//                                 secure_apps: secure_apps,
//                                 push_apps: push_apps,
//                                 app_list: app_list2,
//                                 is_default: is_default,
//                                 dealer_id: results[i].dealer_id
//                             }
//                             policies.push(dta);
//                         }
//                         return res.json({
//                             "status": true,
//                             "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful',
//                             "policies": policies
//                         });

//                     } else {
//                         data = {
//                             status: false,
//                             msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], MsgConstants.NO_DATA_FOUND), // No result found",
//                             policies: []
//                         }
//                         res.send(data);
//                     }
//                 });
//             }
//         } else {
//             data = {
//                 "status": false,
//                 "msg": await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], MsgConstants.INVALID_USER), // Invalid User',
//                 "policies": []
//             };
//             res.send(data);
//         }
//     }

// }


exports.changePolicyStatus =  async function (req, res) {
    var verify = req.decoded;
    
    // if (verify.status === true) {
        if(verify) {
        let id = req.body.id;
        let value = req.body.value == true ? 1 : 0;
        let key = req.body.key;

        let query = "UPDATE policy SET " + key + " = '" + value + "' WHERE id='" + id + "'";


        sql.query(query, async function (error, result) {

            if (error) {
                console.log(error);
            }
            // console.log(result, 'relstsdf')
            if (result.affectedRows) {
                data = {
                    "status": true,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], MsgConstants.SUCCESS), // successful'
                };
                res.send(data);
            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], MsgConstants.ERROR), // error'
                };
                res.send(data);
            }

        });
    }
}


exports.savePolicyChanges =  async function (req, res) {
    var verify = req.decoded;
    
    // if (verify.status === true) {
        if(verify) {
        // console.log('body of kth e', req.body);
        let record = req.body;
        let id = record.id;
        let push_apps = record.push_apps;
        let controls = record.controls;
        let permissions = record.permissions;
        let app_list = record.app_list;
        let policy_note = record.policy_note;
        let policy_name = record.policy_name;
        // console.log(record,'id id', id)


        let query = "UPDATE policy SET push_apps = '" + push_apps + "', controls = '" + controls + "', permissions = '" + permissions + "', app_list = '" + app_list + "', policy_note = '" + policy_note + "', policy_name = '" + policy_name + "' WHERE id='" + id + "'";
        // console.log('qerury', query)
        sql.query(query, async function (error, result) {
            console.log(result, 'relstsdf');
            if (error) {
                console.log(error);
            }
            if (result.affectedRows) {
                data = {
                    "status": true,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.PLCY_UP_SUCC], MsgConstants.PLCY_UP_SUCC), // Policy Updated Successfully
                };
                res.send(data);
            } else {
                data = {
                    "status": false,
                    "msg": await helpers.convertToLang(req.translation[MsgConstants.ERROR], MsgConstants.ERROR), // error'
                };
                res.send(data);
            }

        });
    }
}


exports.checkPolicyName =  async function (req, res) {
    var verify = req.decoded;
    
    if (verify) {
        try {
            let policy_name = req.body.name !== undefined ? req.body.name : null;
            let policy_id = req.body.policy_id;
            console.log(policy_id, 'policy id is')
            let loggedDealerId = verify.user.id;
            let loggedDealerType = verify.user.user_type;
            let connectedDealer = verify.user.connected_dealer;
            let except_id = "";
            let checkExistingQ = "SELECT policy_name FROM policy WHERE policy_name='" + policy_name + "' AND delete_status = 0 " + except_id;
            if (loggedDealerType === app_Constants.ADMIN) {
                if (policy_id != '') {
                    console.log('if called')
                    except_id = " AND id !='" + policy_id + "'";
                    checkExistingQ = checkExistingQ + except_id;
                }

            } else if (loggedDealerType === app_Constants.DEALER) {
                if (policy_id !== '') {
                    except_id = " AND id !='" + policy_id + "'";
                }
                let subDealerQ = "SELECT dealer_id FROM dealers WHERE connected_dealer=" + loggedDealerId;
                let subDealers = await sql.query(subDealerQ);
                let subDealerArray = [];
                subDealers.map((dealer) => {
                    subDealerArray.push(dealer.dealer_id)
                });
                if (subDealerArray.length) {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id in (" + subDealerArray.join() + "))" + except_id
                } else {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " )" + except_id
                }
            } else if (loggedDealerType === app_Constants.SDEALER) {
                checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id = " + connectedDealer + ")" + except_id;
            }
            let checkExisting = await sql.query(checkExistingQ);
            console.log(checkExistingQ, 'query is')
            if (checkExisting.length) {
                data = {
                    status: false,
                };
                res.send(data);
                return;
            }
            else {
                data = {
                    status: true,
                };
                res.send(data);
                return;
            }
        } catch (error) {
            console.log(error);
        }

    }
}


exports.savePolicy =  async function (req, res) {
    try {
        var verify = req.decoded;
        
        // if (verify.status !== undefined && verify.status == true) {
            if(verify) {
            let policy_name = req.body.data.policy_name !== undefined ? req.body.data.policy_name : null;
            if (policy_name !== null) {
                let policy_note = req.body.data.policy_note !== undefined ? req.body.data.policy_note : null;
                let push_apps = null;
                let app_list = null;
                let secure_apps = null;
                if (req.body.data.push_apps !== undefined) {
                    req.body.data.push_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    push_apps = JSON.stringify(req.body.data.push_apps);
                }

                if (req.body.data.app_list !== undefined) {
                    req.body.data.app_list.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    app_list = JSON.stringify(req.body.data.app_list);
                }

                if (req.body.data.secure_apps !== undefined) {
                    req.body.data.secure_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        // app.enable = (app.enable!==undefined)? app.enable: false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    secure_apps = JSON.stringify(req.body.data.secure_apps);
                }

                let system_permissions = req.body.data.system_permissions !== undefined ? JSON.stringify(req.body.data.system_permissions) : null;

                let loggedDealerId = verify.user.id;
                let loggedDealerType = verify.user.user_type;
                let connectedDealer = verify.user.connected_dealer;
                let checkExistingQ = "SELECT policy_name FROM policy WHERE policy_name='" + policy_name + "' AND delete_status = 0 ";
                // let checkExisting = await sql.query(checkExistingQ);

                if (loggedDealerType === app_Constants.ADMIN) {

                } else if (loggedDealerType === app_Constants.DEALER) {
                    let subDealerQ = "SELECT dealer_id FROM dealers WHERE connected_dealer=" + loggedDealerId;
                    let subDealers = await sql.query(subDealerQ);
                    let subDealerArray = [];
                    subDealers.map((dealer) => {
                        subDealerArray.push(dealer.dealer_id)
                    });
                    if (subDealerArray.length) {
                        checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id in (" + subDealerArray.join() + "))"
                    } else {
                        checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " )"
                    }
                } else if (loggedDealerType === app_Constants.SDEALER) {
                    checkExistingQ = checkExistingQ + " AND (dealer_type='" + app_Constants.ADMIN + "' OR dealer_id=" + loggedDealerId + " OR dealer_id = " + connectedDealer + ")";
                }
                let checkExisting = await sql.query(checkExistingQ);
                if (checkExisting.length) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NAME_ALRDY_TKN], MsgConstants.PLCY_NAME_ALRDY_TKN), // Policy name has already been taken

                    };
                    res.send(data);
                    return;
                }
                var command_name = '#' + policy_name.replace(/ /g, "_");

                var applyQuery = "INSERT INTO policy (policy_name, policy_note, command_name, app_list, push_apps, controls, permissions, dealer_id, dealer_type, dealers,status) VALUES ('" + policy_name + "', '" + policy_note + "', '" + command_name + "', '" + app_list + "', '" + push_apps + "', '" + system_permissions + "', '" + secure_apps + "', '" + loggedDealerId + "', '" + loggedDealerType + "', '[]',1)";

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) {
                        console.log(err)
                    }
                    // console.log('query/........... ', applyQuery)

                    if (rslts.affectedRows) {
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_SAV_SUCC], MsgConstants.PLCY_SAV_SUCC), // Policy Saved Successfully

                        };
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NOT_SAV], MsgConstants.PLCY_NOT_SAV), // Policy Couldn\'t be saved'
                        }
                    }
                    res.send(data);
                    return;
                })
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NOT_SAV], MsgConstants.PLCY_NOT_SAV), // Policy Couldn\'t be saved'
                }
                res.send(data);
                return;
            }

        }
    } catch (error) {
        console.log(error)
    }

}


exports.applyPolicy = async function (req, res) {
    try {
        var verify = req.decoded;
        // if (verify.status !== undefined && verify.status == true) {
            if(verify) {
            let device_id = req.params.device_id;
            let dealer_id = verify.user.id
            let userAccId = req.body.userAccId;
            let policy_id = req.body.policyId;
            if (device_id !== null || device_id !== '' || device_id !== undefined || device_id !== 'undefined' || policy_id !== null || policy_id !== '' || policy_id !== undefined || policy_id !== 'undefined') {

                let getPolicyQ = "SELECT * FROM policy WHERE id =" + policy_id;
                let policy = await sql.query(getPolicyQ)

                if (policy.length) {
                    policy = helpers.refactorPolicy(policy);

                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + userAccId + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                    sql.query(applyQuery, async function (err, policyApplied) {
                        if (err) {
                            console.log(err)
                        }

                        if (policyApplied && policyApplied.affectedRows) {

                            let isOnline = await device_helpers.isDeviceOnline(device_id, policy[0]);
                            // var loadDeviceQ = "UPDATE devices set is_push_apps=1 WHERE device_id='" + device_id + "'";
                            var loadDeviceQ = "INSERT INTO policy_queue_jobs (policy_id,device_id,is_in_process) " + " VALUES ('" + policy_id + "','" + device_id + "',1)"
                            // console.log(loadDeviceQ)
                            await sql.query(loadDeviceQ)
                            if (isOnline) {
                                require("../bin/www").getPolicy(device_id, policy[0]);

                                data = {
                                    status: true,
                                    online: true,
                                };
                            } else {
                                require("../bin/www").getPolicy(device_id, policy[0]);
                                data = {
                                    status: true,

                                };
                            }
                            res.send(data);
                            return;
                        } else {
                            data = {
                                status: false,
                                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], MsgConstants.ERROR_PROC), // Error while Processing',
                            };
                            res.send(data);
                        }

                    });
                } else {

                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

exports.setDefaultPolicy =  async function (req, res) {
    try {
        var verify = req.decoded;
        
        // if (verify.status !== undefined && verify.status == true) {
            if(verify) {
            let enable = req.body.enable
            let policy_id = req.body.policy_id

            let default_policy = await sql.query("SELECT * FROM default_policies WHERE dealer_id = '" + verify.user.id + "'")
            if (default_policy.length) {
                if (enable) {
                    sql.query("UPDATE default_policies SET policy_id = '" + policy_id + "' WHERE dealer_id = '" + verify.user.id + "'")
                }
                else {
                    sql.query("DELETE FROM default_policies WHERE dealer_id = '" + verify.user.id + "' AND policy_id = '" + policy_id + "'")
                }
            } else {
                sql.query("INSERT INTO default_policies (dealer_id , policy_id) VALUES (" + verify.user.id + " , " + policy_id + " )")
            }
            data = {
                "status": true,
                "msg": await helpers.convertToLang(req.translation[MsgConstants.DEFAULT_POLICY_CHANGED_SUCCESSFULLY], MsgConstants.DEFAULT_POLICY_CHANGED_SUCCESSFULLY), // Default policy changed successfully'
            };
            res.send(data);
        }
    } catch (error) {
        console.log(error);
    }
}

