const jwt = require('jsonwebtoken')

function create(mail) {
	const token = jwt.sign({ email: mail }, 'Pa1eShad0w', { expiresIn: '3600s' })
	return token
}

async function check(ctx, next) {
	const authorization = ctx.get('Authorization')
	if (authorization === '') {
		ctx.throw(401, 'no token detected')
	}
	const token = authorization.split(' ')[1]
	let tokenContent
	try {
		tokenContent = await jwt.verify(token, 'Pa1eShad0w')
	} catch (err) {
		ctx.throw(401, 'invalid token')
	}
	await next()
}

module.exports = {
	create,
	check
}
