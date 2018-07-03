const router = require('koa-router')()
const controllers = require('../controllers')

router.get('/', controllers.home.get)
router.post('/', controllers.home.post)

router.get('/user', controllers.user.findUser)
router.post('/user', controllers.user.signUp)
router.delete('/user', controllers.user.deleteUser)

router.get('/word', controllers)

module.exports = router
