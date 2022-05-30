const config = require('./utilities/config')
const logger = require('./utilities/logger');
const { exec } = require("child_process");
const showBanner = require('node-banner');
var cron = require('node-cron');
var mysql = require('mysql');



var con = mysql.createConnection({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
});

logger.debug("Running scheduling");


con.connect(function(err) {
    if (err) throw err;
  });
con.query("SELECT * FROM mqtt_users WHERE CREATED=0", function (err, result, fields) {
    if (err) throw err;
    for (let index = 0; index < result.length; index++) {
        logger.debug("UserId from DB: "+result[index].id+" - "+"User from DB: "+result[index].user)
        
        var command = "mosquitto_passwd -b /etc/mosquitto/passwd "+result[index].user+" "+result[index].authcode

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.log(`error: ${error.message}`);
                return;
            }
            if (stderr) {
                console.log(`stderr: ${stderr}`);
                return;
            }
            logger.debug("Creation user OK"+" "+result[index].user)
        });

            var sql = "DELETE FROM mqtt_users WHERE id = ?";
            con.query(sql, [result[index].id], function(err, result) {
            if (err) throw err;
            logger.debug("Number of records deleted: " + result.affectedRows)
           
          });          
    }
    con.end();
});

