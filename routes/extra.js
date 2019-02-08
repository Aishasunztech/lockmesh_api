
/** check device (not using) **/
router.post('/checkdevice', async function(req , res){
    var imei = req.body.imei;
    var mac = req.body.mac;

    var sqls = "select * from devices where mac_address = '" + mac + "'";
    var reslt = await sql.query(sqls);

    if(reslt.length > 0){

        if(reslt[0].unlink_status == 1){
            data = {
                "status" : false,
                "msg" : "device found but not linked",
                "device_id" : reslt[0].device_id
            }
            res.send(data);
        }else{
        if(reslt[0].device_status == 0){
            data = {
                "status" : true,
                "msg" : "Request in process",
                "device_id" : reslt[0].device_id,   
                "dealer_id" : reslt[0].dealer_id         
            }
            res.send(data);
        }else{
            data = {
                "status" : true,
                "msg" : "Device Linked",
                "dealer_id" : reslt[0].dealer_id ,
                "account_status" : reslt[0].status           
            }
            res.send(data);
        }
    }
    }else{
        
        data = {
            "status" : true,
            "msg" : "not linked yet"
        }
        res.send(data);
    }

});




/** Check device for screen device (not using) **/
router.post('/screen/checkdev', async function(req, resp) {
    var imei =  req.body.imei;
    var sql1 = "SELECT * FROM devices WHERE imei = '" + imei + "'";
    //console.log(sql1);  
    var res = await sql.query(sql1);
    console.log(res);
  //  console.log(res[0].expiry_date); 
    if(res.length > 0){
      if(res[0].screen_start_date == null || res[0].screen_start_date == ''){  
        data = {
           "status" : 0 //if my imei number is present but startDate is not there it means I am adding device for the first time 
                   
        };  
    }else{
        var sql2 = "SELECT expiry_date FROM devices WHERE imei = '" + imei + "'";
        var res1 = await sql.query(sql2);
        if(res1[0].expiry_date != null || res1[0].expiry_date == ''){
        data = {
            "status" : 1 , //if the imei number is present and startDate is already present
            "exp_date" : res1[0].expiry_date 
                    
         };
        }else{
            data = {
            "status" : 1 , //if the imei number is present and startDate is already present
            "exp_date" : '' 
            };
        }

    }
        resp.send(data);
    
}else{
    data = {
        "status" : -1,                      //f my imei is not present in your db 
        "message" : "could not access app" 
      
     };      
     resp.send(data);   
  }
});


/** Add start date and fetch expiry date for screen app  (not using) **/
router.post('/screen/adddev', async function(req, resp) {
    var imei =  req.body.imei;
    var sc_start_date = req.body.stdate;
   
  //  console.log(res[0].expiry_date); 
   sql.query("update `devices` set screen_start_date = '" + sc_start_date + "' where imei = '" + imei + "'", async function(error, results, fields) {
        //response.end(JSON.stringify(rows));
        if (error) throw error;

        var sql2 = "SELECT expiry_date FROM devices WHERE imei = '" + imei + "'";
        var res1 = await sql.query(sql2);
        if(res1[0].expiry_date != null || res1[0].expiry_date == ''){
        data = {
            "status" : 1 , //if the imei number is present and startDate is already present
            "exp_date" : res1[0].expiry_date 
                    
         };
        }else{
            data = {
            "status" : 1 , //if the imei number is present and startDate is already present
            "exp_date" : '' 
            };
        }
        
        resp.send(data);
    });     
 
});


/**  Add Info Screen lock (not using) **/
router.post('/screen/addinfo', async function(req, resp) {
    var imei = req.body.imei;
    var start_date = req.body.start_date;
    var end_date =  req.body.end_date;

    sql1 = "INSERT INTO screen_lock_devices (imei,start_date,end_date) values('" + imei + "' , '"+ start_date +"', '" + end_date + "')";
  //  console.log(sql1);
    var deviceInsrt = await sql.query(sql1);    

    var sql3 = "select * from screen_lock_devices where dev_id = '" + deviceInsrt.insertId + "'";

    sql.query(sql3 , function(error, rows) {
        //response.end(JSON.stringify(rows));
        if (error) throw error;
        data = {
            "status": true,
            "msg": "Device Added",
            "start_date": rows[0].start_date,
            "end_date": rows[0].end_date      
            
        };      
        resp.send(data);
    });
    
});

/**  Get Info Screen lock (not using) **/

router.post('/screen/getinfo', async function(req, resp) {
    var imei = req.body.imei;
    var sql1 = "SELECT * FROM screen_lock_devices WHERE imei = '" + imei + "'";
    console.log(sql1);
  
    var res = await sql.query(sql1);
    console.log(res);
  //  console.log(res[0].expiry_date); 
    if(res.length > 0){    
        
        data = {
           "status" : true,
           "start_date": res[0].start_date,
           "end_date": res[0].end_date
        };      
        resp.send(data);
    
}else{
    data = {
        "status" : false,
        "msg" : "Device not found."
     };      
     resp.send(data);

}
});

/** Screen Lock Get Expiry Date **/
/*router.post('/screen/getinfo', async function(req, resp) {
    var imei = req.body.imei;
    var sql1 = "SELECT * FROM screen_lock_devices WHERE imei = '" + imei + "'";
    console.log(sql1);
  
    var res = await sql.query(sql1);
    console.log(res);
  //  console.log(res[0].expiry_date); 
    if(res.length > 0){    
        
        data = {
           "status" : true,
           "start_date": res[0].start_date,
           "end_date": res[0].end_date
        };      
        resp.send(data);
    
}else{
    var dt = datetime.create();
    var start_date = dt.format('Y-m-d H:M:S'); //start date
   // console.log(start_date);
    dt.offsetInDays(60);  
	//dt.offsetInHours(1);
    var formatted = dt.format('Y-m-d H:M:S'); //end date
   // console.log(formatted);
    sql1 = "INSERT INTO screen_lock_devices (imei,start_date,end_date) values('" + imei + "' , '"+ start_date +"', '" + formatted + "')";
  //  console.log(sql1);
    var deviceInsrt = await sql.query(sql1);    

    var sql3 = "select * from screen_lock_devices where dev_id = '" + deviceInsrt.insertId + "'";

    sql.query(sql3 , function(error, rows) {
        //response.end(JSON.stringify(rows));
        if (error) throw error;
        data = {
            "status": true,
            "msg": "Device Added",
            "start_date": rows[0].start_date,
            "end_date": rows[0].end_date           
            
        };      
        resp.send(data);
    });
    
}
});*/

/** Screen Lock Add Device (not using) **/

router.post('/screen/adddevice', async function(req, resp) {
    //res.setHeader('Content-Type', 'application/json');
    console.log(req);
    var imei = req.body.imei;
    var expdate = req.body.expdate;
    
    var sql1 = "SELECT * FROM screen_lock_devices WHERE imei = '" + imei + "'";
    //console.log(sql1);
    var res = await sql.query(sql1);
   // console.log(res); 
   // console.log(res.length);

   // if(res[0].imei !== null && res[0].imei !== ''){
        if(res.length != 0){
       // console.log('yes');
        data = {
            "status": false,
            "msg": "Device already added"            
        };
        resp.send(data);

    }else{
        sql.query('INSERT INTO screen_lock_devices (imei,expiry_date) values(?,?)', [imei , expdate], function(error, rows) {
            //response.end(JSON.stringify(rows));
            if (error) throw error;
            data = {
                "status": true,
                "msg": "Device added"
            };
          
            resp.send(data);
        });
    }

});


// var qury1 = "UPDATE dealers set account_status = 'suspended' where connected_dealer = '" + dealer_id + "'";
//               var rslt = sql.query(qury1);
//               && rslt.affectedRows != 0
//               Dealer and Sub-Dealer suspended successfully.
//                else if(row.affectedRows != 0){
//                     data = {
//                             "status": true,
//                             "msg":'Dealer suspended successfully.',
//                             "data": row
//                             };
//                     res.send(data);
//                    }


router.get('/dealer/devices/:dealer_id', function(req, res) {

    var verify = verifyToken(req , res);
    if(verify.status == true){
        sql.query('select dvc.* , dl.link_code , dl.dealer_name from devices as dvc left join dealers as dl on dvc.dealer_id = dl.dealer_id where dvc.dealer_id =' + req.params.dealer_id , function(error, results, fields) {
            if (error) throw error;
            if(results.length == 0){
                data = {
                    "status": false,
                    "msg": 'No devices linked'
                };
            }else{
                data = {
                    "status": true,
                    "data": results
                };
            }       
            res.send(data);
        }); 
    }
});