const mongoose = require('mongoose')
const Schema = mongoose.Schema

const RevisionSchema = new Schema({
    user: {
        type: String,
        ref: 'User',
        required: true
    },
    wordbook: {
        type: String,
        ref: 'Wordbook',
        required: true
    },
    progress: {
        type: Number,
        default: 0
    },
    words: [
        {
            type: String,
            ref: 'Word',
            required: false
        }
    ]
})

const Revision = mongoose.model('Revision', RevisionSchema)

module.exports = Revision
