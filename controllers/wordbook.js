const User = require('./user')
const Wordbook = require('../models/wordbook')
const Word = require('../models/word')

const get = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const defaultWordbooks = await Wordbook.find({ user: null }, 'name description', function(err, wordbooks) {
            if (err) console.error(err)
            return wordbooks
        })
        const userWordbooks = await Wordbook.find({ user: email }, 'name description', function(err, wordbooks) {
            if (err) console.error(err)
            return wordbooks
        })
        let doc = await User.findUser(email)
        ctx.render('wordbooks.html', {
            title: '单词本 | Vocabularist',
            defaultWordbooks,
            userWordbooks,
            username: doc.name,
            page2: 'active'
        })
    } else {
        ctx.redirect('/')
    }
}

const post = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const body = ctx.request.body

        var newWordbook = new Wordbook({
            name: body.name,
            description: body.description,
            user: email
        })
        await new Promise((resolve, reject) => {
            newWordbook.save(err => {
                if (err) reject(err)
                resolve()
            })
        })
        const defaultWordbooks = await Wordbook.find({ user: null }, 'name description', function(err, wordbooks) {
            if (err) console.error(err)
            return wordbooks
        })
        const userWordbooks = await Wordbook.find({ user: email }, 'name description', function(err, wordbooks) {
            if (err) console.error(err)
            return wordbooks
        })
        let doc = await User.findUser(email)
        ctx.redirect('/wordbooks/')
    } else {
        ctx.redirect('/')
    }
}

const deleteWordbook = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const body = ctx.request.body
        if (body.wordbook) {
            await Wordbook.deleteOne({ name: body.wordbook, user: email }, err => {
                if (err) console.error(err)
            })
        }
        ctx.redirect('/wordbooks')
    } else {
        ctx.redirect('/')
    }
}

const newWordbook = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const words = await Word.find({ $or: [{ user: null }, { user: email }] }, 'word', function(err, words) {
            if (err) console.error(err)
            return words
        })
        let doc = await User.findUser(email)
        ctx.render('newwordbook.html', {
            title: '新建单词本 | Vocabularist',
            words,
            username: doc.name
        })
    } else {
        ctx.redirect('/')
    }
}

module.exports = {
    get,
    post,
    deleteWordbook,
    newWordbook
}
