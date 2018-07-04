const router = require('koa-router')()
const controllers = require('../controllers')

router.get('/', controllers.home.get)
router.post('/', controllers.home.post)

router.get('/user', controllers.user.checkUser)
router.post('/user', controllers.user.register)
router.delete('/user', controllers.user.deleteUser)
router.post('/login', controllers.user.login)
router.get('/logout', controllers.user.logout)

router.get('/wordbooks', controllers.wordbook.get)
router.post('/wordbooks', controllers.wordbook.post)
router.post('/wordbooks/delete', controllers.wordbook.deleteWordbook)
router.get('/wordbooks/new', controllers.wordbook.newWordbook)

router.get('/words', controllers.word.get)
router.post('/words', controllers.word.createWord)
router.post('/words/delete', controllers.word.deleteWord)

router.get('/revision', controllers.revision.get)
router.post('/revision', controllers.revision.post)

router.get('/wordbooks/:wordbook', controllers.revision.learn)

module.exports = router
