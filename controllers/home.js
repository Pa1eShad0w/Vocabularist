async function get(ctx) {
	console.log('GET request successfully')
	await console.log(ctx.request)
	ctx.body = 'hello, world!'
}

async function post(ctx) {
	console.log('POST request successfully')
	await console.log(ctx.request)
}

module.exports = {
	get,
	post
}
