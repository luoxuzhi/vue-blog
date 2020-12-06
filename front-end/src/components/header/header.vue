<template>
  <div class="header-container">
    <div class="header">
      <img class="header-avatar" :src="userInfo.avatar">
      <span class="username">{{userInfo.username}}</span>
      <span class="login-out" @click="logout">退出登录</span>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import {userInfoMixins} from '@/mixins/mixins'
  export default{
    mixins:[userInfoMixins],
    methods:{
      logout(){
        this.$store.commit('remove')
        this.$router.push('/login')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .header-container
    height 60px
    line-height 60px
    background-color #AFA7A7
    .header
      float right
      display flex
      align-items center
      margin-right 60px
      color #333
      .header-avatar 
        width 40px
        height 40px
        border-radius 50%
        margin-right 20px
      .username
        margin-right 20px
      .login-out
        cursor pointer
</style>
