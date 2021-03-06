// libraries
var objectsize = require('object-sizeof')

// custom libraries
const { sql } = require('../../config/database');
const sockets = require('../../routes/sockets');

// general helpers
const device_helpers = require('../../helper/device_helpers');
const helpers = require('../../helper/general_helper');
const socket_helpers = require('../../helper/socket_helper');

// constants
const MsgConstants = require('../../constants/MsgConstants');
const app_Constants = require('../../constants/Application');

var data;

exports.getPolicies = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let userId = verify.user.id;
        let loggedUserType = verify.user.user_type;
        // let userType = await helpers.getUserType(userId);

        // let user_acc_id = await device_helpers.getUserAccountId(req.body.device_id);
        // console.log('user id si', user_acc_id);

        // let where = "";
        // let isValid = true;
        let policies = [];

        // if (user_acc_id != undefined || user_acc_id != '' || user_acc_id != null) {
        //     where = where + " user_acc_id='" + user_acc_id + "'";

        // } else {
        //     isValid = false;
        // }
        // if (isValid) {
        // get all dealers under admin or sdealers under dealer
        let userDealers = await helpers.getUserDealers(loggedUserType, userId);
        console.log("userDealers ", userDealers);
        let sdealerList = userDealers.dealerList;
        let dealerCount = userDealers.dealerCount;

        if (loggedUserType === app_Constants.ADMIN) {
            let query = "SELECT * FROM policy WHERE delete_status=0";
            sql.query(query, async (error, results) => {
                if (results.length) {
                    // let adminRoleId = await helpers.getUserTypeIDByName(app_Constants.ADMIN);
                    // let dealerCount = await helpers.dealerCount(adminRoleId);

                    for (var i = 0; i < results.length; i++) {
                        // console.log('push apps', results[i].push_apps)
                        let permissionDealers = await helpers.getDealersAgainstPermissions(results[i].id, 'policy', userId, sdealerList, loggedUserType);

                        results[i].dealers = permissionDealers.allDealers;
                        results[i].statusAll = permissionDealers.statusAll;

                        // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {

                        //     let Update_sdealerList = sdealerList.map((dealer) => {
                        //         return {
                        //             dealer_id: dealer,
                        //             dealer_type: permissionDealers[0].dealer_type,
                        //             permission_by: permissionDealers[0].permission_by
                        //         }
                        //     })
                        //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== userId)
                        //     results[i].dealers = JSON.stringify(final_list);
                        //     results[i].statusAll = true
                        // } else {
                        //     if (permissionDealers.length) {
                        //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== userId)
                        //     }
                        //     results[i].dealers = JSON.stringify(permissionDealers);
                        //     results[i].statusAll = false
                        // }
                        let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];
                        let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : [];
                        let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : [];
                        let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : [];
                        let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : [];
                        let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                        let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        let dealer = await helpers.getDealerByDealerId(results[i].dealer_id)
                        let created_by = '';
                        if (dealer.length) {
                            created_by = results[i].dealer_type === app_Constants.ADMIN ? "ADMIN" : dealer[0].dealer_name + " (" + dealer[0].link_code + ")";
                        } else {
                            created_by = 'N/A';
                        }
                        // console.log(created_by);
                        dta = {
                            id: results[i].id,
                            statusAll: results[i].statusAll,
                            policy_name: results[i].policy_name,
                            policy_note: results[i].policy_note,
                            status: results[i].status,
                            dealer_permission: permissions,
                            permission_count: permissionC,
                            command_name: results[i].command_name,
                            controls: controls,
                            secure_apps: secure_apps,
                            push_apps: push_apps,
                            app_list: app_list2,
                            dealer_id: results[i].dealer_id,
                            object_size: results[i].object_size ? results[i].object_size : 'N/A',
                            policy_size: results[i].policy_size ? results[i].policy_size : 'N/A',
                            created_by: created_by,
                            created_date: results[i].created_at,
                            last_edited: results[i].updated_at,
                        }
                        policies.push(dta);
                    }
                }
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "successful"), // successful',
                    policies: policies
                };
                // console.log(data);
                res.send(data);
                return;
            });
        } else {
            let condition = '';
            if (loggedUserType === app_Constants.DEALER) {
                condition = ` OR (dealer_id = 0 AND dealer_type = 'admin')`
            }
            else if (loggedUserType === app_Constants.SDEALER) {
                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${userId}`);
                condition = ` OR (dealer_id = 0 AND (dealer_type='admin' OR (dealer_type='dealer' AND permission_by=${getParentId[0].connected_dealer}))) `
                // condition = `AND (dealer_type = 'admin' OR dealer_type = 'dealer')`
            }
            let myquery = `SELECT permission_id FROM dealer_permissions WHERE (dealer_id='${userId}' ${condition}) AND permission_type='policy';`;

            console.log("myquery ", myquery);
            let permittedids = await sql.query(myquery);
            let prrr = [];
            if (permittedids && permittedids.length) {
                for (let item of permittedids) {
                    prrr.push(item.permission_id)
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
                    let dealerRole = await helpers.getUserTypeIDByName(app_Constants.DEALER);
                    let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
                    let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

                    for (var i = 0; i < results.length; i++) {
                        let permissionDealers = await helpers.getDealersAgainstPermissions(results[i].id, 'policy', userId, sdealerList, loggedUserType);

                        results[i].dealers = permissionDealers.allDealers;
                        results[i].statusAll = permissionDealers.statusAll;

                        // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {

                        //     let Update_sdealerList = sdealerList.map((dealer) => {
                        //         return {
                        //             dealer_id: dealer,
                        //             dealer_type: permissionDealers[0].dealer_type,
                        //             permission_by: permissionDealers[0].permission_by
                        //         }
                        //     })
                        //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== userId)
                        //     results[i].dealers = JSON.stringify(final_list);
                        //     results[i].statusAll = true
                        // } else {
                        //     if (permissionDealers.length) {
                        //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== userId)
                        //     }
                        //     results[i].dealers = JSON.stringify(permissionDealers);
                        //     results[i].statusAll = false
                        // }

                        let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];
                        // let Sdealerpermissions = permissions.filter((item) => sdealerList.includes(item))

                        // let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                        let permissionCount = (permissions && permissions.length) ? permissions.length : 0;
                        // console.log(permissions, 'permissions',Sdealerpermissions, 'sealerpermissions', permissionCount, 'permision count', )
                        let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        let controls = (results[i].controls !== undefined && results[i].controls !== 'undefined' && results[i].controls !== null) ? JSON.parse(results[i].controls) : [];
                        let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== 'undefined' && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : [];
                        let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== 'undefined' && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : [];
                        let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== 'undefined' && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : [];
                        let is_default = (results[i].id === default_policy_id) ? true : false
                        let dealer = await helpers.getDealerByDealerId(results[i].dealer_id)
                        let created_by = '';
                        if (dealer.length) {
                            created_by = results[i].dealer_type === app_Constants.ADMIN ? "ADMIN" : dealer[0].dealer_name;
                        } else {
                            created_by = 'N/A';
                        }
                        // console.log(created_by);
                        dta = {
                            id: results[i].id,
                            statusAll: results[i].statusAll,
                            policy_name: results[i].policy_name,
                            policy_note: results[i].policy_note,
                            status: results[i].status,
                            dealer_permission: permissions,
                            permission_count: permissionC,
                            command_name: results[i].command_name,
                            controls: controls,
                            secure_apps: secure_apps,
                            push_apps: push_apps,
                            app_list: app_list2,
                            is_default: is_default,
                            dealer_id: results[i].dealer_id,
                            object_size: results[i].object_size ? results[i].object_size : 'N/A',
                            policy_size: results[i].policy_size ? results[i].policy_size : 'N/A',
                            created_by: created_by,
                            created_date: results[i].created_at,
                            last_edited: results[i].updated_at,
                        }
                        policies.push(dta);
                    }

                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "successful"), // successful',
                        policies: policies
                    }
                    return res.json(data);

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No result found",
                        policies: []
                    }
                    res.send(data);
                    return;
                }
            });
        }
        // } else {
        //     data = {
        //         status: false,
        //         msg: await helpers.convertToLang(req.translation[MsgConstants.INVALID_USER], "Invalid User"), // Invalid User',
        //         policies: []
        //     };
        //     res.send(data);
        //     return;
        // }
    }

}

/**
 * @author Usman Hafeez
 * @description #to be fixed, in connect page, only enabled policies should be shown
 * 
 */
exports.getEnabledPolicies = async function (req, res) {
    var verify = req.decoded;
    if (verify) {
        let userId = verify.user.id;
        let loggedUserType = verify.user.user_type;
    
        let policies = [];
        
        // get all dealers under admin or sDealers under dealer
        let userDealers = await helpers.getUserDealers(loggedUserType, userId);
        console.log("userDealers ", userDealers);

        let sdealerList = userDealers.dealerList;
        let dealerCount = userDealers.dealerCount;

        if (loggedUserType === app_Constants.ADMIN) {
            let query = "SELECT * FROM policy WHERE delete_status=0 AND status=1";
            sql.query(query, async (error, results) => {
                if (results.length) {
                    // let adminRoleId = await helpers.getUserTypeIDByName(app_Constants.ADMIN);
                    // let dealerCount = await helpers.dealerCount(adminRoleId);

                    for (var i = 0; i < results.length; i++) {
                        // console.log('push apps', results[i].push_apps)
                        let permissionDealers = await helpers.getDealersAgainstPermissions(results[i].id, 'policy', userId, sdealerList, loggedUserType);

                        results[i].dealers = permissionDealers.allDealers;
                        results[i].statusAll = permissionDealers.statusAll;

                        // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {

                        //     let Update_sdealerList = sdealerList.map((dealer) => {
                        //         return {
                        //             dealer_id: dealer,
                        //             dealer_type: permissionDealers[0].dealer_type,
                        //             permission_by: permissionDealers[0].permission_by
                        //         }
                        //     })
                        //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== userId)
                        //     results[i].dealers = JSON.stringify(final_list);
                        //     results[i].statusAll = true
                        // } else {
                        //     if (permissionDealers.length) {
                        //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== userId)
                        //     }
                        //     results[i].dealers = JSON.stringify(permissionDealers);
                        //     results[i].statusAll = false
                        // }
                        let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];
                        let controls = (results[i].controls !== undefined && results[i].controls !== null) ? JSON.parse(results[i].controls) : [];
                        let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : [];
                        let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : [];
                        let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : [];
                        let permissionCount = (permissions !== undefined && permissions !== null && permissions !== '[]') ? permissions.length : 0;
                        let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        let dealer = await helpers.getDealerByDealerId(results[i].dealer_id)
                        let created_by = '';
                        if (dealer.length) {
                            created_by = results[i].dealer_type === app_Constants.ADMIN ? "ADMIN" : dealer[0].dealer_name + " (" + dealer[0].link_code + ")";
                        } else {
                            created_by = 'N/A';
                        }
                        // console.log(created_by);
                        dta = {
                            id: results[i].id,
                            statusAll: results[i].statusAll,
                            policy_name: results[i].policy_name,
                            policy_note: results[i].policy_note,
                            status: results[i].status,
                            dealer_permission: permissions,
                            permission_count: permissionC,
                            command_name: results[i].command_name,
                            controls: controls,
                            secure_apps: secure_apps,
                            push_apps: push_apps,
                            app_list: app_list2,
                            dealer_id: results[i].dealer_id,
                            object_size: results[i].object_size ? results[i].object_size : 'N/A',
                            policy_size: results[i].policy_size ? results[i].policy_size : 'N/A',
                            created_by: created_by,
                            created_date: results[i].created_at,
                            last_edited: results[i].updated_at,
                        }
                        policies.push(dta);
                    }
                }
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "successful"), // successful',
                    policies: policies
                };
                // console.log(data);
                res.send(data);
                return;
            });
        } else {
            let condition = '';
            if (loggedUserType === app_Constants.DEALER) {
                condition = ` OR (dealer_id = 0 AND dealer_type = 'admin')`
            } else if (loggedUserType === app_Constants.SDEALER) {
                let getParentId = await sql.query(`SELECT connected_dealer FROM dealers WHERE dealer_id = ${userId}`);
                condition = ` OR (dealer_id = 0 AND (dealer_type='admin' OR (dealer_type='dealer' AND permission_by=${getParentId[0].connected_dealer}))) `
                // condition = `AND (dealer_type = 'admin' OR dealer_type = 'dealer')`
            }
            let myquery = `SELECT permission_id FROM dealer_permissions WHERE (dealer_id='${userId}' ${condition}) AND permission_type='policy';`;

            console.log("myquery ", myquery);
            let permittedids = await sql.query(myquery);
            let prrr = [];
            if (permittedids && permittedids.length) {
                for (let item of permittedids) {
                    prrr.push(item.permission_id)
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
                    let dealerRole = await helpers.getUserTypeIDByName(app_Constants.DEALER);
                    let default_policy = await sql.query("SELECT * from default_policies WHERE dealer_id = '" + userId + "'")
                    let default_policy_id = (default_policy.length) ? default_policy[0].policy_id : null

                    for (var i = 0; i < results.length; i++) {
                        let permissionDealers = await helpers.getDealersAgainstPermissions(results[i].id, 'policy', userId, sdealerList, loggedUserType);

                        results[i].dealers = permissionDealers.allDealers;
                        results[i].statusAll = permissionDealers.statusAll;

                        // if (permissionDealers && permissionDealers.length && permissionDealers[0].dealer_id === 0) {

                        //     let Update_sdealerList = sdealerList.map((dealer) => {
                        //         return {
                        //             dealer_id: dealer,
                        //             dealer_type: permissionDealers[0].dealer_type,
                        //             permission_by: permissionDealers[0].permission_by
                        //         }
                        //     })
                        //     let final_list = Update_sdealerList.filter((item) => item.dealer_id !== userId)
                        //     results[i].dealers = JSON.stringify(final_list);
                        //     results[i].statusAll = true
                        // } else {
                        //     if (permissionDealers.length) {
                        //         permissionDealers = permissionDealers.filter((item) => item.dealer_id !== userId)
                        //     }
                        //     results[i].dealers = JSON.stringify(permissionDealers);
                        //     results[i].statusAll = false
                        // }

                        let permissions = (results[i].dealers !== undefined && results[i].dealers !== null) ? JSON.parse(results[i].dealers) : [];
                        // let Sdealerpermissions = permissions.filter((item) => sdealerList.includes(item))

                        // let permissionCount = (Sdealerpermissions !== undefined && Sdealerpermissions !== null && Sdealerpermissions !== '[]') ? Sdealerpermissions.length : 0;
                        let permissionCount = (permissions && permissions.length) ? permissions.length : 0;
                        // console.log(permissions, 'permissions',Sdealerpermissions, 'sealerpermissions', permissionCount, 'permision count', )
                        let permissionC = ((dealerCount == permissionCount) && (permissionCount > 0)) ? "All" : permissionCount.toString();
                        let controls = (results[i].controls !== undefined && results[i].controls !== 'undefined' && results[i].controls !== null) ? JSON.parse(results[i].controls) : [];
                        let push_apps = (results[i].push_apps !== undefined && results[i].push_apps !== 'undefined' && results[i].push_apps !== null) ? JSON.parse(results[i].push_apps) : [];
                        let app_list2 = (results[i].app_list !== undefined && results[i].app_list !== 'undefined' && results[i].app_list !== null) ? JSON.parse(results[i].app_list) : [];
                        let secure_apps = (results[i].permissions !== undefined && results[i].permissions !== 'undefined' && results[i].permissions !== null) ? JSON.parse(results[i].permissions) : [];
                        let is_default = (results[i].id === default_policy_id) ? true : false
                        let dealer = await helpers.getDealerByDealerId(results[i].dealer_id)
                        let created_by = '';
                        if (dealer.length) {
                            created_by = results[i].dealer_type === app_Constants.ADMIN ? "ADMIN" : dealer[0].dealer_name;
                        } else {
                            created_by = 'N/A';
                        }
                        // console.log(created_by);
                        dta = {
                            id: results[i].id,
                            statusAll: results[i].statusAll,
                            policy_name: results[i].policy_name,
                            policy_note: results[i].policy_note,
                            status: results[i].status,
                            dealer_permission: permissions,
                            permission_count: permissionC,
                            command_name: results[i].command_name,
                            controls: controls,
                            secure_apps: secure_apps,
                            push_apps: push_apps,
                            app_list: app_list2,
                            is_default: is_default,
                            dealer_id: results[i].dealer_id,
                            object_size: results[i].object_size ? results[i].object_size : 'N/A',
                            policy_size: results[i].policy_size ? results[i].policy_size : 'N/A',
                            created_by: created_by,
                            created_date: results[i].created_at,
                            last_edited: results[i].updated_at,
                        }
                        policies.push(dta);
                    }

                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "successful"), // successful',
                        policies: policies
                    }
                    return res.json(data);

                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.NO_DATA_FOUND], "No result found"), // No result found",
                        policies: []
                    }
                    res.send(data);
                    return;
                }
            });
        }
    }

}

exports.checkPolicyName = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        try {
            let policy_name = req.body.name !== undefined ? req.body.name : null;
            let policy_id = req.body.policy_id;
            // console.log(policy_id, 'policy id is')
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

exports.changePolicyStatus = async function (req, res) {
    var verify = req.decoded;

    if (verify) {
        let id = req.body.id;
        let value = req.body.value == true || req.body.value == 1 ? 1 : 0;
        let key = req.body.key;

        let query = "UPDATE policy SET " + key + " = '" + value + "' WHERE id='" + id + "'";


        sql.query(query, async function (error, result) {

            if (error) {
                console.log(error);
            }
            // console.log(result, 'relstsdf')
            if (result && result.affectedRows) {
                data = {
                    status: true,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.SUCCESS], "successful"), // successful'
                };
                res.send(data);
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // error'
                };
                res.send(data);
            }

        });
    }
}

exports.savePolicy = async function (req, res) {
    try {
        var verify = req.decoded;

        if (verify) {
            let policy = req.body.data;
            let policy_name = policy.policy_name;

            if (policy_name) {

                let loggedDealerType = verify.user.user_type;
                let loggedDealerId = verify.user.id;
                let connectedDealer = verify.user.connected_dealer;

                let checkExistingQ = `SELECT policy_name FROM policy WHERE policy_name='${policy_name}' AND delete_status = 0 `;

                if (loggedDealerType === app_Constants.ADMIN) {

                } else if (loggedDealerType === app_Constants.DEALER) {
                    let subDealerQ = `SELECT dealer_id FROM dealers WHERE connected_dealer=${loggedDealerId}`;
                    let subDealers = await sql.query(subDealerQ);

                    let subDealerArray = [];
                    subDealers.map((dealer) => {
                        subDealerArray.push(dealer.dealer_id)
                    });

                    if (subDealerArray.length) {
                        checkExistingQ = checkExistingQ + ` AND (dealer_type='${app_Constants.ADMIN}' OR dealer_id=${loggedDealerId} OR dealer_id in (${subDealerArray.join()}))`
                    } else {
                        checkExistingQ = checkExistingQ + ` AND (dealer_type='${app_Constants.ADMIN}' OR dealer_id=${loggedDealerId} )`;
                    }
                } else if (loggedDealerType === app_Constants.SDEALER) {
                    checkExistingQ = checkExistingQ + ` AND (dealer_type='${app_Constants.ADMIN}' OR dealer_id=${loggedDealerId} OR dealer_id = ${connectedDealer})`;
                }

                let checkExisting = await sql.query(checkExistingQ);
                if (checkExisting.length) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NAME_ALRDY_TKN], "Policy name has already been taken"), // Policy name has already been taken

                    };
                    res.send(data);
                    return;
                }

                let policy_note = policy.policy_note !== undefined ? policy.policy_note : null;

                let push_apps = null;
                let app_list = null;
                let secure_apps = null;
                let system_permissions = [];

                let pushAppFileSize = 0;

                // push apps
                if (policy.push_apps && policy.push_apps !== 'null' && policy.push_apps !== 'undefined') {
                    policy.push_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
                        let file_size = helpers.getFileSize(app.apk);
                        pushAppFileSize = pushAppFileSize + file_size;
                    });
                    push_apps = JSON.stringify(policy.push_apps);
                }

                // app_list
                if (policy.app_list && policy.app_list !== 'null' && policy.app_list !== 'undefined') {
                    policy.app_list.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        app.enable = (app.enable !== undefined) ? app.enable : false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    app_list = JSON.stringify(policy.app_list);
                }

                // extensions
                if (policy.secure_apps && policy.secure_apps !== 'null' && policy.secure_apps !== 'undefined') {
                    policy.secure_apps.forEach((app) => {
                        app.guest = (app.guest !== undefined) ? app.guest : false;
                        // app.enable = (app.enable!==undefined)? app.enable: false;
                        app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;

                    });
                    secure_apps = JSON.stringify(policy.secure_apps);
                }

                // system permission
                if (policy.system_permissions && policy.system_permissions !== 'null' && policy.system_permissions !== 'undefined') {
                    policy.system_permissions.forEach(sysPermission => {
                        sysPermission.setting_status = (sysPermission.setting_status) ? true : false

                    })
                    system_permissions = JSON.stringify(policy.system_permissions);
                }


                let pushAppsSize = objectsize(push_apps);
                let appListSize = objectsize(app_list);
                let secureAppsSize = objectsize(secure_apps);
                let sysPermissionSize = objectsize(system_permissions)

                let policyObjSize = helpers.formatBytes(pushAppsSize + appListSize + secureAppsSize + sysPermissionSize)
                let policyActualSize = helpers.formatBytes(pushAppFileSize + appListSize + secureAppsSize + sysPermissionSize);

                var command_name = '#' + policy_name.replace(/ /g, "_");

                var applyQuery = `INSERT INTO policy (policy_name, policy_note, command_name, app_list, push_apps, controls, permissions, dealer_id, dealer_type, dealers, status, object_size, policy_size) VALUES ('${policy_name}', '${policy_note}', '${command_name}', '${app_list}', '${push_apps}', '${system_permissions}', '${secure_apps}', '${loggedDealerId}', '${loggedDealerType}', '[]', 1, '${policyObjSize}', '${policyActualSize}')`;

                sql.query(applyQuery, async function (err, rslts) {
                    if (err) {
                        console.log("policy query error: ", err);
                    }

                    if (rslts && rslts.affectedRows) {
                        await helpers.insertPolicyPushApps(rslts.insertId, policy.push_apps, true);

                        let newPolicy = await sql.query(`SELECT * FROM policy WHERE id = ${rslts.insertId}`);
                        let addedPolicy = {}
                        if (newPolicy.length) {
                            addedPolicy = newPolicy[0]
                        }
                        data = {
                            status: true,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_SAV_SUCC], "Policy Saved Successfully"), // Policy Saved Successfully
                            data: addedPolicy
                        };
                    } else {
                        data = {
                            status: false,
                            msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NOT_SAV], "Policy Couldn\'t be saved"), // Policy Couldn\'t be saved'
                        }
                    }
                    return res.send(data);
                });
            } else {
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_NOT_SAV], "Policy Couldn\'t be saved"), // Policy Couldn\'t be saved'
                }
                return res.send(data);

            }

        }
    } catch (error) {
        console.log(error)
    }

}

exports.savePolicyChanges = async function (req, res) {
    try {
        var verify = req.decoded;
        if (verify) {
            let id = req.body.id;
            if(!id){
                data = {
                    status: false,
                    msg: await helpers.convertToLang(req.translation[''], "Bad request"), // error'
                };
                return res.send(data)
            }

            let push_apps = req.body.push_apps;
            let controls = req.body.controls;
            let permissions = req.body.permissions;
            let app_list = req.body.app_list;
            let policy_note = req.body.policy_note;
            let policy_name = req.body.policy_name;
            var command_name = '#' + policy_name.replace(/ /g, "_");

            let pushAppFileSize = 0;

            if (push_apps) {
                let parsedPushApps = JSON.parse(push_apps);
                parsedPushApps.forEach((app) => {
                    app.guest = (app.guest !== undefined) ? app.guest : false;
                    app.enable = (app.enable !== undefined) ? app.enable : false;
                    app.encrypted = (app.encrypted !== undefined) ? app.encrypted : false;
                    let file_size = helpers.getFileSize(app.apk);
                    pushAppFileSize = pushAppFileSize + file_size;
                });
                push_apps = JSON.stringify(parsedPushApps);
            }

            let pushAppsSize = objectsize(push_apps);
            let appListSize = objectsize(app_list);
            let secureAppsSize = objectsize(permissions);
            let sysPermissionSize = objectsize(controls);

            let policyObjSize = helpers.formatBytes(pushAppsSize + appListSize + secureAppsSize + sysPermissionSize)
            let policyActualSize = helpers.formatBytes(pushAppFileSize + appListSize + secureAppsSize + sysPermissionSize);

            let query = `UPDATE policy SET push_apps = '${push_apps}', controls = '${controls}', permissions = '${permissions}', app_list = '${app_list}', policy_note = '${policy_note}', policy_name = '${policy_name}', command_name='${command_name}', object_size = '${policyObjSize}', policy_size = '${policyActualSize}' WHERE id=?`;

            sql.query(query, [sql.escape(id)],  async function (error, result) {

                if (error) {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // error'
                    };
                    return res.send(data);
                }


                if (result && result.affectedRows) {
                    await helpers.insertPolicyPushApps(id, JSON.parse(push_apps), false);
                    data = {
                        status: true,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.PLCY_UP_SUCC], "Policy Updated Successfully"), // Policy Updated Successfully
                    };
                } else {
                    data = {
                        status: false,
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // error'
                    };
                }
                return res.send(data);

            });
        }
    } catch (error) {
        console.log("save policy error: ",error);
        data = {
            status: false,
            msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR], "ERROR"), // error'
        };
        return res.send(data);

    }
}

exports.applyPolicy = async function (req, res) {
    try {
        var verify = req.decoded;

        if (verify) {
            let device_id = req.params.device_id;
            let dealer_id = verify.user.id
            let userAccId = req.body.userAccId;
            let policy_id = req.body.policyId;
            if (device_id !== null || device_id !== '' || device_id !== undefined || device_id !== 'undefined' || policy_id !== null || policy_id !== '' || policy_id !== undefined || policy_id !== 'undefined') {

                let getPolicyQ = `SELECT * FROM policy WHERE id=${policy_id}`;
                let policy = await sql.query(getPolicyQ)

                if (policy.length) {
                    policy = await helpers.refactorPolicy(policy);

                    var applyQuery = "INSERT INTO device_history (device_id,dealer_id,user_acc_id,policy_name, app_list, controls, permissions, push_apps, type) VALUES ('" + device_id + "'," + dealer_id + "," + userAccId + ", '" + policy[0].policy_name + "','" + policy[0].app_list + "', '" + policy[0].controls + "', '" + policy[0].permissions + "', '" + policy[0].push_apps + "',  'policy')";
                    sql.query(applyQuery, async function (err, policyApplied) {
                        if (err) {
                            console.log("apply policy error: ", err)
                        }

                        if (policyApplied && policyApplied.insertId) {

                            let isOnline = await device_helpers.isDeviceOnline(device_id);

                            var loadDeviceQ = "INSERT INTO policy_queue_jobs (policy_id,device_id,is_in_process) " + " VALUES ('" + policy_id + "','" + device_id + "',1)"

                            await sql.query(loadDeviceQ)
                            if (isOnline) {
                                socket_helpers.getPolicy(sockets.baseIo, policyApplied.insertId, device_id, policy[0]);

                                data = {
                                    status: true,
                                    online: true,
                                    content: "",
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.POLICY_IS_BEING_APPLIED], "Policy is Being applied"), // 'Policy is Being applied,
                                };
                            } else {
                                // socket_helpers.getPolicy(sockets.baseIo, device_id, policy[0]);
                                data = {
                                    status: true,
                                    content: await helpers.convertToLang(req.translation[MsgConstants.POLICY_APPLIED_TO_DEVICE_ON_BACK_ONLINE], "Policy Applied to device. Action will be performed when device is back online"),
                                    msg: await helpers.convertToLang(req.translation[MsgConstants.WARNING_DEVICE_OFFLINE], "Warning Device Offline"), // 'Warning Device Offline,
                                };
                            }
                            return res.send(data);
                        } else {
                            data = {
                                status: false,
                                content: "",
                                msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Processing"), // Error while Processing',
                            };
                            return res.send(data);
                        }

                    });
                } else {
                    data = {
                        status: false,
                        content: "",
                        msg: await helpers.convertToLang(req.translation[MsgConstants.ERROR_PROC], "Error while Processing"), // Error while Processing',
                    };
                    return res.send(data);
                }
            }
        }
    } catch (error) {
        console.log(error)
    }
}

exports.setDefaultPolicy = async function (req, res) {
    try {
        var verify = req.decoded;

        // if (verify.status !== undefined && verify.status == true) {
        if (verify) {
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
                status: true,
                msg: await helpers.convertToLang(req.translation[MsgConstants.DEFAULT_POLICY_CHANGED_SUCCESSFULLY], "Default policy changed successfully"), // Default policy changed successfully'
            };
            res.send(data);
        }
    } catch (error) {
        console.log(error);
    }
}

