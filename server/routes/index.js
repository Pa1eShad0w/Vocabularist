const router = require('koa-router')()
const controllers = require('../controllers')


router.get('/', controllers.home.get)
router.post('/', controllers.home.post)

module.exports = router
