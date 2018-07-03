const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	password: {
		type: String,
		required: true
	},
	token: String,
	create_time: Date,
	lastLogin_time: Date
})

UserSchema.query.byEmail = function(input) {
	this.find({ email: input }, 'name email create_time lastLogin_time', function(err, user) {
		console.log(user)
		return user
	})
}

const User = mongoose.model('User', UserSchema)

module.exports = User
