const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WordbookSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    user: {
        type: String,
        ref: 'User',
        required: false,
        default: null
    },
    words: [
        {
            type: String,
            ref: 'Word',
            required: false
        }
    ]
})

const Wordbook = mongoose.model('Wordbook', WordbookSchema)

module.exports = Wordbook
