module.exports = {


    DUMY_ID: "dumy.id",

    //****************  Dealer **************/ 
    DEALER_ALREADY_REG: "dealer.already.registered.id", // Dealer Already Registered. Please use another email.
    EMAIL_NOT_SENT: "email.not.sent.id", // Email could not sent due to error:
    DEALER_REG_SUCC: "dealer.register.succ.id", // Dealer has been registered successfully
    DEALER_NOT_ADDED: "dealer.not.added.id", // Dealer could not be added
    EMAIL_ALREDY_USED_DEALER: "email.already.use.other.dealer.id", // Email is already in use of other dealer
    RECORD_UPD_SUCC_EMAIL_NOT_SEND: "record.updated.succ.email.not.send.id", // Record updated successfully. Email not sent
    RECORD_UPD_SUCC_EMAIL_SEND: "record.updated.succ.email.send.id", // Record updated successfully. Email has been sent.
    DEALER_DEL_SUCC: "dealer.delete.succ.id", // Dealer deleted successfully.
    INVALID_DEALER: "invalid.dealer.id", // Invalid Dealer.
    DEALER_ADDED_AGAIN: "dealer.added.again.id", // Dealer added again.
    // DEALER_NOT_ADDED: "dealer.not.added.id", // Dealer not added.
    DEALER_SUSP_SUCC: "dealer.suspended.succ.id", // Dealer suspended successfully.
    DEALER_NOT_SUSP: "dealer.not.suspend.id", // Dealer not suspended.
    DELAER_NOT_ACTIV: "dealer.not.activated.id", // Dealer not activated.
    DEALER_ACTIV_SUCC: "dealer.activated.succ.id", // Dealer activated successfully.


    //***************** Users ***************/

    // Auth
    FAILED_AUTH_TOKEN: "failed.auth.token.id", // Failed to authenticate token.
    NO_TOKEN_PROVIDE: "no.token.provide.id", // No token provided.
    DUAL_AUTH_SUCC_ENBL: "dual.auth.succ.enabled.id", // Dual Authentication is Successfully enabled
    DUAL_AUTH_SUCC_DISABL: "dual.auth.succ.disabled.id", // Dual Authentication is Successfully disabled
    DUAL_AUTH_NOT_ENBL: "dual.auth.not.enabled.id", // Dual Authentication could not be enabled

    USER_ALRDY_REG: "user.already.registered.id", // User Already Registered. Please use another email.
    USER_REG_SUCC: "user.registered.succ.id", // User has been registered successfully.
    USER_INFO_CHANGE_SUCC: "user.info.changed.succ.id", // User Info has been changed successfully.
    USER_DEL_SUCC: "user.deleted.succ.id", // User deleted successfully.
    USER_NOT_DEL_SUCC: "user.not.deleted.succ.id", // User not deleted successfully.
    USER_ADD_AGAIN: "user.added.again.id", // User added again successfully.
    USER_NOT_ADD: "user.not.added.id", // User not added try again later.


    ERR_UP_PROFILE: "error.upload.profile.id", // Error While Updating Profile
    PROFILE_UP_SUCC: "profile.uploaded.succ.id", // Profile Updated Successfully
    PASS_CHANGE_SUCC: "pass.change.succ.id", // Password changed successfully.Please check your email.
    PROFILE_SAV_SUCC: "profile.save.succ.id", // Profile Saved Successfully
    PROFILE_NAME_IS_ALREADY_EXIST: "Profile.Name.is.already.Exist.id", // Profile Name is already Exist
    PROFILE_APPLIED_SUCCESSFULLY: "Profile.Applied.Successfully.id", // Profile Applied Successfully
    SETTINGS_APPLIED_SUCCESSFULLY: "Settings.Applied.Successfully.id", // Settings Applied Successfully
    INSERTED_SUCCESSFULLY: "Inserted.Successfully.id", // Inserted Successfully

    NO_DATA_TO_IMPORT: "no.data.to.import.id", // no data to import
    ACCESS_FORBIDDEN: "access.forbidden.id", // access forbidden

    CSV_RELEASED_SUCCESSFULLY: "CSV.Released.Successfully.id", // CSV Released Successfully.
    CSV_NOT_RELEASED: "CSV.Not.Released.id", // CSV Not Released.
    APP_UPLOADED_SUCCESSFULLY: "App.Uploaded.Successfully.id", // Success: App Uploaded Successfully
    UNABLE_TO_READ_APP_PROPERTIES: "Unable.to.read.APP.properties.id", //  Error! Unable to read APP properties
    APP_LOGO_UPLOADED_SUCCESSFULLY: "App.logo.Uploaded.Successfully.id", // Success! App logo Uploaded Successfully.
    UNAUTHORIZED_FILE_UPLOADING_ATTEMPT: "Unauthorized.file.uploading.attempt.id", // Unauthorized file uploading attempt
    UPLOADED_FILE_IS_CORRUPT: "Uploaded.file.is.corrupt.id", // Uploaded file is corrupt
    NOT_ALLOWED_TO_MAKE_REQUEST: "Not.allowed.to.make.request.id", // Not allowed to make request.
    REQUEST_SUBMITTED_SUCCESSFULLY: "Request.submitted.successfully.id", // Request submitted successfully
    REQUEST_NOT_SUBMITTED_SUCCESSFULLY: "Request.not.submitted.successfully.id", // Request not submitted successfully

    APK_IS_UPLOADED: "Apk.is.uploaded.id", //Apk is uploaded
    APK_NOT_DELETED: "Apk.not.deleted.id", // Apk not deleted
    APK_DELETED_SUCCESSFULLY: "Apk.deleted.successfully.id", // Apk deleted successfully
    STATUS_UPDATED: "Status.Updated.id", // Status Changed Sccessfully
    STATUS_NOT_UPDATED: "Status.not.Updated.id", // Status Not Updated

    UPDATE_SUCCESSFULLY: "Update.Successfully.id", // Updated Successfully
    SIM_DELETE_SUCCESSFULLY: "sim.delete.Successfully.id", // Sim Deleted Successfully
    QUERY_ERROR: "Query.Error.id", // Query Error
    SOMETHING_WRONG_DELETE_SIM: "something_wrong_delete_sim.id", // Error: something wrong for delete sim record
    SIM_REGISTERED_SUCCESSFULLY: "Sim.Registered.Successfully.id", // Sim Registered Successfully
    MAXIMUN_2_SIMS_ALLOWED: "Maximun_2_sims_allowed.id", // Sorry! Maximun 2 registrations are allowed for this device
    ALREADY_SIM_REGISTER: "Already_SIM_REGISTER.id", // You have already registered against this device ID and ICC-ID


    PERMISSION_SAVED_SUCCESSFULLY: "Permission.saved.successfully.id", // Permission saved successfully
    PERMISSION_NOT_SAVED: "Permission.couldnt.be.saved.id", // Permission couldn't be saved
    PERMISSION_REMOVED_SUCCESSFULLY: "Permission.Removed.successfully.id", // Permission Removed successfully
    UNINSTALL_PERMISSION_CHANGED: "Uninstall.permission.changed.id", // Uninstall permission changed
    UNINSTALL_PERMISSION_NOT_CHANGED: "Uninstall.permission.not.changed.id", // Uninstall permission not changed
    APPS_TRANSFERED_SUSSECFULLY: "Apps.Transfered.Sussecfully.id", // Apps Transfered Sussecfully
    INVALID_IMEI_NUMBER: "Invalid.IMEI.number.id",// Invalid IMEI number, please make sure you are using a valid IMEI number and try again


    DEFAULT_POLICY_CHANGED_SUCCESSFULLY: "Default.policy.changed.successfully.id", // Default policy changed successfully
    FORCE_UPDATE_HAS_BEEN_APPLIED: "force.update.has.been.applied.id", // force update has been applied
    FORCE_UPDATE_WILL_APPLY: "force.update.will.apply.id", // force update will apply when device will come online
    PAYMENT_HAS_BEEN_DONE: "Payment.has.been.done.id", // Payment has been done

    PRICES_SET_SUCCESSFULLY: "Prices.Set.Successfully.id", // Prices Set Successfully
    PACKAGE_SAVED_SUCCESSFULLY: "Package.Saved.Successfully.id", // Package Saved Successfully

    LANGUAGE_CHANGED_SUCCESSFULLY: "Language.changed.Successfully.id", // Language changed Successfully
    INVALID_DEALER_ID: "Invalid.dealer_id.id", // Invalid dealer_id

    CREDITS_ADDED_SUCCESSFULLY: "Credits.added.successfully.id", // Credits added successfully
    CREDITS_NOT_UPDATED: "Credits.not.updated.id",// Credits not updated please try again
    CREDITS_NOT_ENOUGH_ACCEPT_REQUEST: "credits.not.enough.accept.request.id", // Your credits are not enough to accept a request
    REQUEST_DELETED_SUCCESSFULLY: "Request.deleted.successfully.id", // Request deleted successfully
    REQUEST_NOT_DELETED: "Request.not.deleted.id", // Request not deleted please try again
    REQUEST_IS_ALREADY_DELETED: "Request.is.already.deleted.id", // Request is already deleted

    INVALID_USER: "invalid.user.id", // Invalid User.
    INVALID_USER_AND_PASS: "invalid.user.and.pass.id", // Invalid User and Password.

    // ****************** Devices ***************/
    PRE_ACTIV_ADD_SUCC_EMAIL_SEND: "pre_activation.added.succ.email.send.id", // Pre-activations added succcessfully.Email sends to your account.
    PRE_ACTIV_ADD_SUCC: "pre_activation.succ.add.id", // Pre-activation added succcessfully.
    DEVICE_NOT_ADD: "device.not.added.id", // Device couldn't added
    RECORD_TRANSF_SUCC: "record.transfer.succ.id", // Record Transfered Successfully. 
    ERR_TRANSF: "error.while.transfering.id", // Error While Transfere.
    PGP_EMAIL_ALRDY_TKN: "pgp.email.already.taken.id", // PGP email already taken





    DEVICE_NOT_UNLNK: "device.not.unlinked.id", // Device not unlinked.
    DEVICE_UNLNK_SUCC: "device.unlinked.succ.id", // Device unlinked successfully.
    ACC_NOT_SUSP: "account.not.suspended.id", // Account not suspended.Please try again.
    ACC_SUSP_SUCC: "account.suspend.succ.id", // Account suspended successfully.
    NOT_SUSP_ACC_EXP: "cant.suspend.account.expired.id", // Can't suspend !!! Account Already Expired.
    DEVICE_NOT_ACTIV: "device.not.activate", // Device not activated.Please try again.
    DEVICE_ACTIV_SUCC: "device.activated.succ.id", // Device activated successfully.
    DEVICE_NOT_ACTIV_EXP: "device.not.activated.expired.id", // Device cannnot be activated.It is expired already.
    DEVICE_NOT_WIPE: "device.not.wipe.id", // Device not wiped.Please try again.
    DEVICE_WIPE_SUCC: "device.wipe.succ.id", // Device Wiped successfully.
    DEVICE_NOT_UNFLAG: "device.not.unflaged.id", // Device not Unflagged. Please try again.
    DEVICE_UNFLAG_SUCC: "device.unflag.succ.id", // Device Unflagged successfully.
    DEVICE_NOT_FLAG: "device.not.flaged.id", // Device not Flagged. Please try again.
    DEVICE_FLAG_SUCC: "device.flag.succ.id", // Device Flagged successfully.
    DEVICE_ALRDY_FLAG: "device.already.flaged.id", // Device Already Flagged
    DEVICE_SYNC_SUCC: "device.sync.succ.id", // device synced successfully

    ITEMS_ADDED: "items.added.id", // Items Added.
    ITEMS_UP: "items.updated.id", // Items Updated.
    ITEMS_NOT_UP: "items.not.updated.id", // Items Not Updated.

    PLCY_UP_SUCC: "policy.update.succ.id", // Policy Updated Successfully
    PLCY_NAME_ALRDY_TKN: "policy.name.already.taken.id", // Policy name has already been taken
    PLCY_SAV_SUCC: "policy.save.succ.id", // Policy Saved Successfully
    PLCY_NOT_SAV: "policy.not.save.id", // Policy Couldn\'t be saved




    INVALID_DEVICE_ID: "invalid.deviceID.id", // Invalid device id.
    INVALID_DEVICE: "invalid.device.id", // Invalid device.
    DEVICE_NOT_FOUND: "device.not.found.id", // No Device found
    DEVICE_DEL_SUCC: "device.deleted.succ.id", // Device deleted successfully.
    DEVICE_NOT_DEL: "device.not.delete.id", // Device not deleted.



    //****************** Auth Controllers *****************/ /*NEW
    USER_DOES_NOT_EXIST: "User.does.not.exist.id", // User does not exist
    YOUR_ACCOUNT_IS_SUSPENDED: "Your.account.is.suspended.id", // Your account is suspended
    YOUR_ACCOUNT_IS_DELETED: "Your.account.is.Deleted.id", // Your account is Deleted
    VERIFICATION_CODE_SENT_TO_YOUR_EMAIL: "Verification.Code.sent.to.Your.Email.id", // Verification Code sent to Your Email
    USER_LOGED_IN_SUCCESSFULLY: "User.loged.in.Successfully.id", // User loged in Successfully
    INVALID_VERIFICATION_CODE: "invalid.verification.code.id", // Invalid verification code

    //****************** Device Controllers *****************/ /*NEW
    NEW_DEVICE_NOT_ADDED: "New.Device.Not.Added.id", // New Device Not Added Please try Again


    //****************** Common *****************/
    INVALID_EMAIL_NAME: "invalid.email.or.name.id", // Invalid email or name
    INVALID_EMAIL_OR_PASSWORD: "Invalid.email.or.password.id", // Invalid email or password. Please try again
    RECORD_NOT_UPD: "record.not.updated.id", // Record not updated.
    ENTER_VALID_DETAIL: "enter.valid.detail.id", // Please enter valid details
    RECORD_NOT_DEL: "record.not.delete.id", // Record not deleted.
    RECORD_UPD_SUCC: "record.updated.succ.id", // Record updated successfully.
    NO_DETAIL_FOUND: "no.detail.found.id", // No details found
    SUCCESS: "successful.id", // successful
    ERROR: "error.id", // error
    ERROR_WHILE_UPLOADING: "Error.While.Uploading.id", // Error While Uploading
    UPLOADED_SUCCESSFULLY: "Uploaded.Successfully.id", // Uploaded Successfully
    ERROR_PROC: "error.while.processing.id", // Error while Processing
    NOT_DELETE: "not.deleted.id", // Not Deleted, Try Again!
    NO_DATA_FOUND: "no.data.found.id", // No data found    
    DATA_FOUND: "data.found.id", // Data found    
    FILE_NOT_FOUND: "file.not.found.id", // file not found
    INVALID_DATA: "Invalid.Data.id", // Invalid Data
    PASSWORD_DID_NOT_MATCH: "Password.Did.not.Match.id", // "Password Did not Match. Please Try again"
    PASSWORD_MATCHED_SUCC: "PASSWORD_MATCHED_SUCC.id", // Password Matched Successfully
    APPS_ARE_BEING_PUSHED: "Apps.are.Being.pushed.id", // Apps are Being pushed
    APPS_ARE_BEING_PULLED: "Apps.are.Being.pulled.id", // Apps are Being pulled
    WARNING_DEVICE_OFFLINE: "Warning.Device.Offline.id", // Warning Device Offline
    APPS_PUSHED_TO_DEVICE_ON_BACK_ONLINE: "Apps.pushed.to.device.on.back.online.id", // Apps pushed to device. Action will be performed when device is back online
    APPS_PULLED_TO_DEVICE_ON_BACK_ONLINE: "Apps.PULLED.to.device.on.back.online.id", // Apps PULLED to device. Action will be performed when device is back online
    POLICY_IS_BEING_APPLIED: "Policy.is.Being.applied.id", // Policy is Being applied
    POLICY_APPLIED_TO_DEVICE_ON_BACK_ONLINE: "Policy.Applied.to.device.on.back.online.id", // Policy Applied to device. Action will be performed when device is back online
    WARNING_DEVICE_OFFLINE: "Warning.Device.Offline.id", // Warning Device Offline
    SUCCESSFULLY_WRITTEN_TO: " successfully.written.to.id", //  successfully written to 
    RESTART_DEVICE_REQUIRED_TO_APPLY_IMEI: "Restart.device.required.to.apply.IMEI.id",  // on Device.Restart device is required to apply IMEI.
    WRITE_TO: "write.to.id", // write to
    ACTION_PERFORMED_ON_BACK_ONLINE: "Action performed ON back online.id", // . Action will be performed when device is back online
}