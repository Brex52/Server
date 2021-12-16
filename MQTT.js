var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://127.0.0.1')

client.on('connect', function() {
    client.subscribe('drone/+/stato')
})

client.on('message', function(topic, message) {
    //message is Buffer
    console.log(message.toString())
    salvaDB(message)
})


function salvaDB(message) {

    const { InfluxDB } = require('@influxdata/influxdb-client')

    // You can generate an API token from the "API Tokens Tab" in the UI
    const token = 'l_TQNgrbOoZcIDqmUOBzJPpfttZulDD8QunFGIUcmVBDEttQSAFYZsJG8KnkJtWjSI1AfMzWftKty81KwZZPmQ=='
    const org = 'DIQU'
    const bucket = 'drone'

    const client = new InfluxDB({ url: 'http://localhost:8086', token: token })

    const { Point } = require('@influxdata/influxdb-client')
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({ host: 'host1' })

    console.log(message)
    const obj = JSON.parse(message)
    console.log(obj.date)
    console.log(obj)
    const data = new Point('shis')
        .measurement("fakeDrone")
        .intField('id', obj.id)
        .floatField('speed', obj.speed)
        .timestamp(new Date(obj.date))
        .floatField('battery', obj.battery)
        .floatField('positionX', obj.positionX)
        .floatField('positionY', obj.positionY)
    writeApi.writePoint(data)
    writeApi
        .close()
        .then(() => {
            console.log('FINISHED')
        })
        .catch(e => {
            console.error(e)
            console.log('Finished ERROR')
        })

}