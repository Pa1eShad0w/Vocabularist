const Word = require('../models/word')
const User = require('./user')

const get = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const words = await Word.find({ user: email }, 'word meaning', function(err, words) {
            if (err) console.error(err)
            return words
        })
        let doc = await User.findUser(email)
        ctx.render('words.html', {
            title: '自定义单词 | Vocabularist',
            words,
            username: doc.name,
            page3: 'active'
        })
    } else {
        ctx.redirect('/')
    }
}

const createWord = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        let doc = await User.findUser(email)
        const body = ctx.request.body
        if (body.word && body.meaning && doc.name) {
            let newWord = new Word({
                word: body.word.toUpperCase(),
                meaning: body.meaning,
                user: email
            })
            await new Promise((resolve, reject) => {
                newWord.save(err => {
                    if (err) reject(err)
                    resolve()
                })
            })
        }
        ctx.redirect('/words')
    } else {
        ctx.redirect('/')
    }
}

const deleteWord = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const body = ctx.request.body
        if (body.word) {
            await Word.deleteOne({ word: body.word, user: email }, err => {
                if (err) console.error(err)
            })
        }
        ctx.redirect('/words')
    } else {
        ctx.redirect('/')
    }
}

const updateWord = async ctx => {
    const body = ctx.request.body
    if (body.word && body.user) {
        await Word.update({ word: body.word, user: body.user }, { meaning: body.meaning }, (err, raw) => {
            if (err) console.error(err)
            console.log(`[Word] "${body.word} updated: ${body.meaning}"`)
        })
    }
}

module.exports = {
    get,
    createWord,
    deleteWord,
    updateWord
}
