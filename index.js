const fastify = require("fastify")();
const { InfluxDB } = require('@influxdata/influxdb-client')

fastify.listen(7003, '0.0.0.0');
fastify.post('/', (req, reply) => {
    console.log(req.body)
    salvaDB()

})


console.log('vai')


function salvaDB() {

    // You can generate a Token from the "Tokens Tab" in the UI
    // You can generate a Token from the "Tokens Tab" in the UI
    // You can generate an API token from the "API Tokens Tab" in the UI
    const token = 'kH-YUi7GYHvtPsxcZXQ1S3DmHHf-YeoI8Sx_7Tvm2zxJndDVpTvzgUWAN-a8YMYL94WuDg1LNbwz7x2zTf689g=='
    const org = 'Bressan-Marion'
    const bucket = 'testpy'

    const client = new InfluxDB({ url: 'http://localhost:8086', token: token })

    const { Point } = require('@influxdata/influxdb-client')
    const writeApi = client.getWriteApi(org, bucket)
    writeApi.useDefaultTags({ host: 'host1' })

    const point = new Point('mem').floatField('used_percent', 23.43234543)
    writeApi.writePoint(point)

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

// const queryApi = client.getQueryApi(org)