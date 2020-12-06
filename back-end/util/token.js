
const {Checkcode,User} = require('../db/index.js')
const jwt = require('jsonwebtoken')
const {TOKEN_ENCODE_STR, URL_YES_PASS} = require('./config')

module.exports = {
  createToken(str){
    return jwt.sign({str},TOKEN_ENCODE_STR,{expiresIn:'1h'})
  },
  // 验证验证码与token是否正确
  async checkCodeToken({code,token}){
    try {
      code = code.toUpperCase()
      await jwt.verify(token,TOKEN_ENCODE_STR)
      // 验证成功后返回该条删除的记录，并删除数据库对应记录
      let res = await Checkcode.findOneAndDelete({code,token})
      if (res==null) {
        return false
      }
    } catch(e) {
      return false
    }
    return true
  },
  // 除登录注册动作外，其它请求都要验证用户token，封装成中间件在app.js中调用，验证通过才继续往下走
  async checkRequestToken(ctx,next){
    let url = ctx.url
    if (!URL_YES_PASS.includes(url)) {
      let token = ctx.get('Authorization')
      if (!token) {
        ctx.response.status = 401
        ctx.response.body = "你还没有登录，快去登录吧!"
        return
      }
      try {
        // 验证token是否过期
        let {str = ''} = await jwt.verify(token,TOKEN_ENCODE_STR)
        // 验证token是否有匹配的用户
        let users = await User.find({userid:str,token})
        if (!users.length) {
          ctx.response.status = 401
          ctx.response.body = "登录过期，请重新登录!"
          return
        }
        // 保存用户_id,以便后面添加/删除留言使用
        ctx._id = users[0]._id
        ctx.username = users[0].username
      } catch(e) {
        console.log(e)
        ctx.response.status = 401
        ctx.response.body = "登录过期，请重新登录!"
        return
      }
    }
    await next()
  }
  
}