const mongoose = require('mongoose');
const db = mongoose.connect("mongodb://localhost:27017/blog", {useNewUrlParser:true}, function(err){
  if(err){
    console.log(err)
  }else{
    console.log("Connection success!")
  }
})
const Schema = mongoose.Schema

// 用户
let userSchema = new Schema({
  username: String,
  userid: String,
  userpwd: String,
  avatar: {
    type: String,
    default: ""
  },
  token: {
    type: String,
    default: ""
  }
})

// 留言
let commentSchema = new Schema({
  userid: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  username:String,
  content: String,
  createtime: {
    type: String,
    default: Date.now
  }
})

// 验证码
let checkcodeSchema = new Schema({
  token: String,
  code: String
})

const User = mongoose.model('User', userSchema)
const Comment = mongoose.model('Comment', commentSchema)
const Checkcode = mongoose.model('Checkcode', checkcodeSchema)

module.exports = {
  User,Comment,Checkcode
}