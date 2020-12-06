const router = require('koa-router')()
const {Comment} = require('../db/index.js')
const xss = require('xss')

router.prefix('/message')

// 获取留言列表
router.post('/list',async (ctx,next)=>{
  let {size = 10, page = 1} = ctx.request.body
  try {
    let options = {
      skit:Number((page-1)*size),
      limit:Number(size),
      sort:{createtime:'-1'}
    }
    // 查询参数中的ctx._id为判断token有效的时候添加到ctx上
    let res = await Comment.find({userid:ctx._id},null,options);
    let total = await Comment.countDocuments();
    ctx.body = {
      code: 200,
      msg: '获取留言成功',
      data: {
        list: res,
        pagination: {
          total,
          page : Number(page),
          size : Number(size)
        }
      }
    }
  } catch(e) {
    ctx.body = {
     code: 500,
     msg: "获取留言失败，服务器异常，请稍后再试！"
   }
    console.log(e)
  }
  
})

// 添加留言
router.post('/add',async (ctx,next)=>{
  let {username} = ctx
  let {content} = ctx.request.body
  // 防xss攻击
  content = xss(content)
  try {
    let comment = new Comment({
      username,
      content,
      userid:ctx._id
    })
    // save 返回被保存的实例本身
    let res = await comment.save()
    if (res._id != null) {
      ctx.body = {
        code: 200,
        msg: '留言成功！',
        data: res
      }
    } else {
      ctx.body = {
        code: 500,
        msg: '留言失败，服务器异常，请稍后再试!'
      }
    }
  } catch(e) {
    ctx.body = {
      code: 503,
      msg: '留言失败，服务器异常，请稍后再试!'
    }
    console.log(e)
  }

})

// 删除留言
router.post('/delete',async (ctx,next)=>{
  let {_id} = ctx.request.body
  try {
    // findOneAndDelete返回被删除记录本身
    let res = await Comment.findOneAndDelete({_id,userid: ctx._id});
    if(res == null){
      ctx.body = {
        code: 500,
        msg: '删除留言失败，服务器异常!'
      }
    }else {
      ctx.body = {
        code: 200,
        msg: '删除留言成功!'
      }
    }
  } catch(e){
    console.log(e);
    ctx.body = {
      code: 500,
      msg: '删除留言失败，服务器异常!'
    }
  }
})



module.exports = router
