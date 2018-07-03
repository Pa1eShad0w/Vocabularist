const User = require('../models/user')
const moment = require('moment')
const objectIdToTimestamp = require('objectid-to-timestamp')
const sha1 = require('sha1')
const Token = require('../middlewares/token')

const findUser = ctx => {
	const email = ctx.request.body.email
	return new Promise((resolve, reject) => {
		User.findOne({ email }, (err, doc) => {
			if (err) reject(err)
			else resolve(doc)
		})
	})
}

const signIn = async ctx => {
	//拿到账号和密码
	let email = ctx.request.body.email
	let password = sha1(ctx.request.body.password)
	let doc = await findUser(email)
	if (!doc) {
		console.log('Invalid email')
		ctx.status = 200
		ctx.body = {
			info: false
		}
	} else if (doc.password === password) {
		console.log('Password checked')
		//生成一个新的token,并存到数据库
		let token = Token.create(email)
		console.log(token)
		doc.token = token
		await new Promise((resolve, reject) => {
			doc.save(err => {
				if (err) {
					reject(err)
				}
				resolve()
			})
		})
		ctx.status = 200
		ctx.body = {
			success: true,
			email,
			token, //登录成功要创建一个新的token,应该存入数据库
			create_time: doc.create_time
		}
	} else {
		console.log('Wrong password')
		ctx.status = 200
		ctx.body = {
			success: false
		}
	}
}

const signUp = async ctx => {
	const body = ctx.request.body
	let newUser = new User({
		name: body.name,
		email: body.email,
		password: sha1(body.password),
		token: Token.create(this.name),
		create_time: moment(objectIdToTimestamp(newUser._id)).format('YYYY-MM-DD HH:mm:ss'),
		lastLogin_time: this.create_time
	})
	let doc = await findUser(newUser.email)
	if (doc) {
		console.log('Duplicated email')
		ctx.status = 200
		ctx.body = {
			success: false
		}
	} else {
		await new Promise((resolve, reject) => {
			newUser.save(err => {
				if (err) reject(err)
				resolve()
			})
		})
		console.log('Sign up successfully')
		ctx.status = 200
		ctx.body = {
			success: true
		}
	}
}

const delUser = function(id) {
	return new Promise((resolve, reject) => {
		User.findOneAndRemove({ _id: id }, err => {
			if (err) {
				reject(err)
			}
			console.log('Delete user successfully')
			resolve()
		})
	})
}

const deleteUser = async ctx => {
	//拿到要删除的用户id
	let email = ctx.request.body.email
	await delUser(email)
	ctx.status = 200
	ctx.body = {
		success: 'Delete user successfully'
	}
}

module.exports = {
	findUser,
	signIn,
	signUp,
	deleteUser
}
