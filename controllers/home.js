const User = require('./user')
const Word = require('../models/word')

String.prototype.capitalize = function() {
    return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase()
}

async function get(ctx) {
    console.log('GET request successfully')
    await console.log(ctx.request)
    const email = ctx.cookies.get('email')
    const wordCount = await Word.count({ $or: [{ user: null }, { user: email }] }, function(err, cnt) {
        if (err) console.error(err)
        return cnt
    })
    const todayWord = await new Promise((resolve, reject) => {
        Word.findOne({ $or: [{ user: null }, { user: email }] })
            .skip(getRandomInt(0, wordCount))
            .exec(function(err, doc) {
                if (err) reject(err)
                resolve(doc)
            })
    })
    if (email && email != '') {
        let doc = await User.findUser(email)
        ctx.render('index.html', {
            title: 'Vocabularist',
            username: doc.name,
            word: todayWord.word.capitalize(),
            meaning: todayWord.meaning,
            page1: 'active'
        })
    } else
        ctx.render('index.html', {
            title: 'Vocabularist',
            word: todayWord.word.capitalize(),
            meaning: todayWord.meaning,
            page1: 'active'
        })
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min
}

async function post(ctx) {
    console.log('POST request successfully')
    await console.log(ctx.request)
}

module.exports = {
    get,
    post
}
