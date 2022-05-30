# eMQTT
Free open source solution to monitorize MQTT of Mosquito broker


#Create the cron job to process the new request to create a mqtt user in the brojer

* * * * * /usr/bin/node /home/rootuser/Documents/api/src/LBatch_user.js >> /eMQTT/logs/batch.log
