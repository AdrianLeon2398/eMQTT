const config = require('./utilities/config')
const logger = require('./utilities/logger');
const showBanner = require('node-banner');
const { Kafka } = require('kafkajs')
var express = require('express');
var cors = require('cors')
var app = express();
var PORT = 3000;
app.use(express.json(),cors());

const client = new Kafka({
    brokers: config.kafka.BROKERS,
    clientId: config.kafka.CLIENTID
  })

//const topic = config.kafka.TOPIC
const topic = 'creation-user'
const producer = client.producer()

app.use(express.json());
	
app.post('/newuser', function (req, res) {
	console.log(req.body)

    const sendMessage = async (producer, topic) => {
        await producer.connect()
      
        payloads = {
            topic: topic,
            messages: [
              { key: 'Creation User Request', value: JSON.stringify(req.body) }
            ]
          }
          console.log('payloads=', payloads)
          producer.send(payloads)
      }
    
    sendMessage(producer, topic)
	res.end();
})

app.listen(PORT, function(err){
	if (err) console.log(err);
	
  (async () => {
    await showBanner('Web Layer Processor');
  })();


});