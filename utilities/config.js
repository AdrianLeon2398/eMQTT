module.exports = {
  kafka: {
    TOPIC: 'otp-request',
    BROKERS: ['192.168.0.100:9092',],
    GROUPID: 'request-in',
    CLIENTID: 'consumer-svrlogicw01'
  },
  mysql: {
    host: "192.168.0.100",
    user: "rootuser",
    password: "ODLTemi[1meV-QHn",
    database: "storage",
    maintable: "usuarios"
  }
}
