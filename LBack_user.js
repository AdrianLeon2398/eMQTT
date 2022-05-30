const { Kafka } = require('kafkajs')
const config = require('./utilities/config')
const logger = require('./utilities/logger');
const showBanner = require('node-banner');
var mysql = require('mysql');
const express = require('express');

const kafka = new Kafka({
  clientId: config.kafka.CLIENTID,
  brokers: config.kafka.BROKERS
})

var con = mysql.createConnection({
  host: config.mysql.host,
  user: config.mysql.user,
  password: config.mysql.password,
  database: config.mysql.database
});

//const topic = config.kafka.TOPIC
const topic = 'creation-user'
const consumer = kafka.consumer({
  groupId: config.kafka.GROUPID
})


con.connect(function(err) {
  if (err) throw err;
});

const run = async () => {
  await consumer.connect()
  await consumer.subscribe({ topic, fromBeginning: true })
  await consumer.run({
    eachMessage: async ({ message }) => {
      try {
        const jsonObj = JSON.parse(message.value.toString())
        let varFilterRequest = FilterRequest(jsonObj)
        
        if (varFilterRequest) {

          let usuario = varFilterRequest.uname
          let password = varFilterRequest.password
          let nombre = varFilterRequest.fname
          let email = varFilterRequest.email
          let privilegio = 'CLI'

          let query = "INSERT INTO "+ ""+config.mysql.maintable+""+" ("  + "id, usuario, password, nombre,email,privilegio)" + "VALUES" + "(NULL" +",'"+ usuario +"','"+ password+ "','" +nombre+"','" +email+"','"+privilegio+"'"+")"
          logger.debug("[Creeating query to storage]: "+query)

          con.query(query, function (err, result) {
            if (err) throw err;
            logger.debug("[Confirmation query to storage]:" + result);
          });
        }
      } catch (error) {
        logger.error("[Confirmation error in storage]:" + error)
      }
    }
  })
}

function FilterRequest(jsonObj) {
  let returnVal = null
  if (jsonObj.flag) {
    logger.debug(`eventId ${jsonObj.tokenId} received!`);
    returnVal = jsonObj
  }

  return returnVal
}

(async () => {
  await showBanner('MQ Consumer');
})();

run().catch(e => console.error(`[example/consumer] ${e.message}`, e))

const errorTypes = ['unhandledRejection', 'uncaughtException']
const signalTraps = ['SIGTERM', 'SIGINT', 'SIGUSR2']

errorTypes.map(type => {
  process.on(type, async e => {
    try {
      console.log(`process.on ${type}`)
      console.error(e)
      await consumer.disconnect()
      process.exit(0)
    } catch (_) {
      process.exit(1)
    }
  })
})

signalTraps.map(type => {
  process.once(type, async () => {
    try {
      await consumer.disconnect()
    } finally {
      process.kill(process.pid, type)
    }
  })
})

module.exports = {
  FilterRequest
}