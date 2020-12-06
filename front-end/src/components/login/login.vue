<template>
  <div class="login-wrapper">
    <div class="login-container">
      <div class="up">用户登录</div>
      <div class="middle">
        <div class="login-item">
          <span class="text">账号</span><input v-model="userid" type="text" placeholder="请输入账号" class="username">
        </div>
        <div class="login-item">
          <span class="text">密码</span><input v-model="userpwd" type="password" placeholder="请输入密码" class="password">
        </div>
        <div class="login-item">
          <span class="text">验证码</span><input v-model="code" type="text" placeholder="请输入验证码" class="verifycode">
          <img :src="imgSrc" alt="" class="code-img" @click="_getVerifyCode">
        </div>
      </div>
      <div class="bottom">
        <div class="login-btn" @click="login">登录</div>
        <router-link class="register" to="/register">没有账号，去注册</router-link>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {codeMixins} from '@/mixins/mixins'
  import {usersLogin} from '@/api/api'
  export default{
    mixins:[codeMixins],
    methods:{
      login(){
        let userInfo = {
          userid:this.userid,
          userpwd:this.userpwd,
          code:this.code,
          codeToken:this.codeToken
        }
        usersLogin(userInfo).then(res=>{
          const {code,data,msg} = res.data
          if (code===200) {
            this.$router.push('/list')
            this.$store.commit('saveUserInfo',data)
          }else {
            alert(msg)
          }
        }).catch(e=>console.log(e.message))
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .login-wrapper
    width 100%
    height 100%
    .login-container
      margin 0 auto
      margin-top 60px
      width 600px
      padding 30px
      background-color #fff
      box-shadow 0px 0px 30px #ccc
      .up
        text-align center      
        font-size 26px
        font-weight bold
      .middle
        margin-top 30px
        .login-item
          display flex
          height 40px
          line-height 40px
          margin-top 4px
          .text
            display inline-block
            width 100px
            margin-right 20px
            text-align right
            color #999
          input
            flex 1
            outline none
            border 0px solid #D2C0C0
            border-bottom 1px dotted #ccc
            &:focus
              border-bottom-color: red
      .bottom
        margin-top 20px
        text-align center
        .login-btn
          margin 0 auto 10px
          width 150px
          height 40px
          line-height 40px
          background-color #7E7777
          cursor pointer
        .register
          color #999
          cursor pointer
          &:hover
            color red
</style>
