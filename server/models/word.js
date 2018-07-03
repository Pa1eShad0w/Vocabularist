const mongoose = require('mongoose')
const Schema = mongoose.Schema

const WordSchema = new Schema({
	word: {
		type: String,
		required: true
	},
	meaning: {
		type: String,
		required: true
	},
	user: {
		type: String,
		ref: 'User'
	}
})

WordSchema.query.byUser = function(user) {
	this.find({ user }, 'word meaning', function(err, words) {
		console.log(words)
		return words
	})
}

const Word = mongoose.model('Word', WordSchema)

module.exports = Word
