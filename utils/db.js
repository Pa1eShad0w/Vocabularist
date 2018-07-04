const Word = require('../models/word')
const Wordbook = require('../models/wordbook')

const hasWordbank = async () => {
    return await Word.count({ user: null }, function(err, count) {
        if (err) console.error(err)
        return count > 0
    })
}

const hasWordbook = async () => {
    return await Wordbook.count({ user: null }, function(err, count) {
        if (err) console.error(err)
        return count > 0
    })
}

const init_wordbank = async (num = null) => {
    const hasWb = await hasWordbank()
    if (!hasWb) {
        const fs = require('fs')
        const rawWords = JSON.parse(fs.readFileSync('./assets/dictionary.json'))

        console.debug('[Words] Wordbank file read successfully')
        var cnt = 0
        for (var word in rawWords) {
            if (num && cnt++ > num) break
            let newWord = new Word({
                word,
                meaning: rawWords[word]
            })
            await new Promise((resolve, reject) => {
                newWord.save((err, word) => {
                    if (err) reject(err)
                    resolve(word)
                })
            })
        }
        console.debug('[Words] All words imported successfully')
    }
}

const clear_wordbank = async () => {
    await Word.remove({}, err => {
        if (err) console.error(err)
        else console.log('[Words] Wordbank cleared')
    })
}

const init_wordbook = async () => {
    const initials = ['T', 'A', 'O', 'I', 'S']
    const hasWbank = await hasWordbank()
    const hasWbook = await hasWordbook()
    if (!hasWbook && !!hasWbank) {
        for (var i = 0; i < initials.length; i++) {
            let name = initials[i]
            await Word.find({ word: { $regex: '^' + name + '.*', $options: 'i' } }, 'word', function(err, words) {
                if (err) console.error(err)
                var temp = []
                for (var i = 0; i < words.length; i++) {
                    temp.push(words[i].word)
                }
                Wordbook.create({ name: '' + name, description: 'Words starting with ' + name, words: temp }, function(
                    err,
                    doc
                ) {
                    if (err) console.error(err)
                    console.log(doc)
                })
            })
        }
    }
}

module.exports = {
    init_wordbank,
    clear_wordbank,
    init_wordbook
}
