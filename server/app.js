const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const config = require('./config')


app.use(bodyParser())

const router = require('./routes')
app.use(router.routes())

app.listen(config.port, () => console.debug(`Listing on port ${config.port}`))