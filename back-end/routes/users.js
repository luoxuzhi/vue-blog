const router = require('koa-router')()
const {User} = require('../db/index.js')
const {createToken,checkCodeToken} = require('../util/token.js')
const {PWD_ENCODE_STR} = require('../util/config.js')
const sha1 = require('sha1')
const xss = require('xss')

router.prefix('/users')

router.get('/', async (ctx, next) => {
  let users  = await User.find({})
  // ctx.body = 'this is a users response!'
  ctx.body = {
    code:200,
    message:'request success',
    data:users
  }
})

// 用户注册
router.post('/register', async (ctx, next) => {
  let {username,userid,userpwd,userpwdconfirm,code,codeToken,avatar} = ctx.request.body
  try {
    // 验证码判断
    // let mark = await Checkcode.find({token:codeToken,code:code.toUpperCase()})
    let mark = await checkCodeToken({token:codeToken,code})
    if (!mark) {
      ctx.body = {
        code: 401,
        msg: '注册失败，验证码错误!'
      }
      return
    }

    // 判断userid是否重复
    let isExitUser = await User.find({userid})
    if (isExitUser.length !== 0) {
      ctx.body = {
        code: 409,
        msg: '注册失败，登录账号重复了，换一个吧!'
      }
      return
    }
    // 通过sha1三重加密密码
    userpwd = sha1(sha1(sha1(userpwd + PWD_ENCODE_STR)))
    username = xss(username)
    // 基于userid创建token，后台请求拦截可以基于这个token解析出userid
    let token = createToken(userid)
    let user = new User({userid,userpwd,username,token,avatar})
    isExitUser = await user.save()
    if (isExitUser._id !== null) {
      ctx.body = {
        code:200,
        message:'注册成功',
        data:{
          _id:isExitUser._id,
          username,
          token,
          avatar
        }
      }
    }else {
      ctx.body = {
        code: 500,
        msg: "注册失败，服务器异常!"
      }
    }

  } catch(e) {
    console.log(e)
    ctx.body = {
      code: 500,
      msg: '注册失败，服务器内部错误!'
    }
  }
  
})

// 用户登录
router.post('/login', async (ctx, next) => {
  let {userid,userpwd,code,codeToken} = ctx.request.body
  try {
    // 验证码判断
    let mark = await checkCodeToken({token:codeToken,code})
    if (!mark) {
      ctx.body = {
        code: 401,
        msg: '登录失败，验证码错误!'
      }
      return
    }

    // 判断用户是否存在
    userpwd = sha1(sha1(sha1(userpwd + PWD_ENCODE_STR)))
    let doc = await User.find({userid,userpwd})
    if (doc.length !== 0) {
      // 每次登录生成新的用户token并保存到数据库
      let token = createToken(userid)
      doc[0].token = token
      doc[0].save()
      let temp = doc[0]
      ctx.body = {
        code: 200,
        msg: '登录成功',
        data:{
          _id:temp._id,
          username:temp.username,
          avatar:temp.avatar,
          token:token
        }
      }
      return
    }else{
      ctx.body = {
        code: 401,
        msg: '登录失败，用户名或者密码错误!'
      }
    }
  } catch(e) {
    console.log(e)
    ctx.body = {
      code: 500,
      msg: '登录失败，服务器内部错误!'
    }
  }
  
})



module.exports = router
