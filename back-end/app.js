const Koa = require('koa')
const app = new Koa()
const views = require('koa-views')
const json = require('koa-json')
const onerror = require('koa-onerror')
const bodyparser = require('koa-bodyparser')
const logger = require('koa-logger')

const {checkRequestToken} = require('./util/token.js')
const users = require('./routes/users')
const verifycode = require('./routes/verifycode')
const message = require('./routes/message')

// error handler
onerror(app)

// middlewares
app.use(bodyparser({
  enableTypes:['json', 'form', 'text']
}))
app.use(json())
app.use(logger())
app.use(require('koa-static')(__dirname + '/public'))

// logger
app.use(async (ctx, next) => {
  const start = new Date()
  await next()
  const ms = new Date() - start
  console.log(`${ctx.method} ${ctx.url} - ${ms}ms`)
})

// 除登录、注册外的请求都要判断token是否有效
app.use(checkRequestToken)

// routes
app.use(users.routes(), users.allowedMethods())
app.use(verifycode.routes(), verifycode.allowedMethods())
app.use(message.routes(), message.allowedMethods())

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

module.exports = app
