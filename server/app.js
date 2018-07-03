const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const config = require('./config')

const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/vocabularist')
mongoose.connection.on('open', () => console.debug('Connected to database successfully!'))

app.use(bodyParser())

const router = require('./routes')
app.use(router.routes(), router.allowedMethods())

app.listen(config.port, () => console.debug(`Listing on port ${config.port}`))
