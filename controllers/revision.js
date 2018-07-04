const Word = require('../models/word')
const Wordbook = require('../models/wordbook')
const Revision = require('../models/revision')
const User = require('./user')

const get = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        var revisions = await Revision.find({ user: email }, function(err, revisions) {
            if (err) console.error(err)
            return revisions
        })
        for (var i = 0; i < revisions.length; i++) {
            revisions[i].words = await Word.find({ word: { $in: revisions[i].words } }, (err, doc) => {
                if (err) console.error(err)
                return doc
            })
        }
        let doc = await User.findUser(email)
        ctx.render('revision.html', {
            title: '错词本 | Vocabularist',
            revisions,
            username: doc.name,
            page4: 'active'
        })
    } else {
        ctx.redirect('/')
    }
}

const post = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const body = ctx.request.body
        if (body.learned) {
            var alreadyRevision = await Revision.findOne({ user: email, wordbook: body.wordbook }, (err, revision) => {
                if (err) console.error(err)
                return revision
            })
            if (alreadyRevision) {
                alreadyRevision.progress++
                await alreadyRevision.save((err, res) => {
                    if (err) console.error(err)
                    return res
                })
            } else {
                const newRevision = new Revision({ user: email, wordbook: body.wordbook, progress: 1 })
                await newRevision.save((err, res) => {
                    if (err) console.error(err)
                    return res
                })
            }
        } else {
            alreadyRevision = await Revision.findOne({ user: email, wordbook: body.wordbook }, (err, revision) => {
                if (err) console.error(err)
                return revision
            })
            if (alreadyRevision) {
                const revisionWord = await Word.findOne({ word: body.word }, (err, doc) => {
                    if (err) console.error(err)
                    return doc
                })
                alreadyRevision.words.push(revisionWord.word)
                await alreadyRevision.save((err, doc) => {
                    if (err) console.error(err)
                    return doc
                })
            } else {
                var newRevision = new Revision({ user: email, wordbook: body.wordbook })
                const revisionWord = await Word.findOne({ word: body.word }, (err, doc) => {
                    if (err) console.error(err)
                    return doc
                })
                newRevision.words.push(revisionWord.word)
                await newRevision.save((err, res) => {
                    if (err) console.error(err)
                    return res
                })
            }
        }
        const revisions = await Revision.find({ user: email }, function(err, revisions) {
            if (err) console.error(err)
            return revisions
        })
        let doc = await User.findUser(email)
        ctx.redirect('back')
    } else {
        ctx.redirect('/')
    }
}

const learn = async ctx => {
    const email = ctx.cookies.get('email')
    if (email) {
        const wordbook = ctx.params.wordbook
        const words = await Word.find({ word: { $regex: '^' + wordbook + '.*', $options: 'i' } }, (err, doc) => {
            if (err) console.error(err)
            return doc
        })
        const revision = await Revision.findOne({ user: email, wordbook }, (err, doc) => {
            if (err) console.error(err)
            return doc
        })
        var word
        if (revision) {
            word = words[revision.progress + revision.words.length]
        } else {
            const newRevision = new Revision({ user: email, wordbook })
            await newRevision.save((err, doc) => {
                if (err) console.error(err)
                return doc
            })
            word = words[0]
        }
        let doc = await User.findUser(email)
        ctx.render('learn.html', {
            title: wordbook + ' | Vocabularist',
            wordbook: wordbook,
            word: word.word,
            meaning: word.meaning,
            username: doc.name
        })
    } else ctx.redirect('/')
}

module.exports = {
    get,
    post,
    learn
}
