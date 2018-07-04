const Koa = require('koa')
const app = new Koa()
const bodyParser = require('koa-bodyparser')
const config = require('./config')
const db = require('./utils/db')
const isProduction = process.env.NODE_ENV === 'production'

// initialize database connection
const mongoose = require('mongoose')
mongoose.Promise = require('bluebird')
mongoose.connect('mongodb://localhost:27017/vocabularist')
mongoose.connection.on('open', () => console.debug('Concted to database successfully!'))

// time-recording middleware
app.use(async (ctx, next) => {
    console.log(`Process ${ctx.request.method} ${ctx.request.url}...`)
    var start = new Date().getTime(),
        execTime
    await next()
    execTime = new Date().getTime() - start
    ctx.response.set('X-Response-Time', `${execTime}ms`)
})

if (!isProduction) {
    let staticFiles = require('./middlewares/static-files')
    app.use(staticFiles('/assets/', __dirname + '/assets'))
}

// koa-bodyparser middleware
app.use(bodyParser())

// initialize templating middleware
const templating = require('./middlewares/templating')
app.use(
    templating('views', {
        noCache: !isProduction,
        watch: !isProduction
    })
)

const router = require('./routes')
app.use(router.routes(), router.allowedMethods())

// initialize wordbank
// db.clear_wordbank()
db.init_wordbank(3500)
db.init_wordbook()

app.listen(config.port, config.host, () => console.debug(`Listening on port ${config.port}`))
