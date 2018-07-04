const User = require('../models/user')
const moment = require('moment')
const sha1 = require('sha1')

const checkUser = async ctx => {
    const email = ctx.request.query.email
    const foundUser = await new Promise((resolve, reject) => {
        User.findOne({ email }, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
        })
    })
    if (foundUser) ctx.body = { valid: false }
    else ctx.body = { valid: true }
}

const findUser = async email => {
    return await new Promise((resolve, reject) => {
        User.findOne({ email }, (err, doc) => {
            if (err) reject(err)
            else resolve(doc)
        })
    })
}

const logout = async ctx => {
    if (ctx.cookies.get('email')) {
        ctx.cookies.set('email', '', {
            path: '/',
            maxAge: 0
        })
        ctx.redirect('back')
    // ctx.render('base.html', { title: 'Vocabularist' })
    }
}

const login = async ctx => {
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
        // let token = Token.create(email)
        // console.log(token)
        // doc.token = token
        // await new Promise((resolve, reject) => {
        //     doc.save(err => {
        //         if (err) {
        //             reject(err)
        //         }
        //         resolve()
        //     })
        // })
        ctx.status = 200
        ctx.cookies.set('email', email, {
            path: '/', // 写cookie所在的路径
            maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
        })
        // ctx.render('base.html', { title: 'Vocabularist', user: doc.name })
        ctx.redirect('back')
    } else {
        console.log('Wrong password')
        ctx.status = 200
        ctx.body = {
            success: false
        }
    }
}

const register = async ctx => {
    const body = ctx.request.body
    var newUser = new User({
        name: body.name,
        email: body.email,
        password: sha1(body.password),
        create_time: moment(Date.now()).format('YYYY-MM-DD HH:mm:ss'),
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
        ctx.cookies.set('email', newUser.email, {
            path: '/', // 写cookie所在的路径
            maxAge: 2 * 60 * 60 * 1000, // cookie有效时长
            httpOnly: false, // 是否只用于http请求中获取
            overwrite: false // 是否允许重写
        })
        ctx.redirect('back')
    // ctx.render('base.html', { title: 'Vocabularist', user: newUser.name })
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
    checkUser,
    login,
    logout,
    register,
    deleteUser,
    findUser
}
