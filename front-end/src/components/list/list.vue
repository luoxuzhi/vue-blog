<template>
  <div class="list">
    <div class="list-header">
      <message-header></message-header>
      <div class="message-wrapper">
        <div class="list-edit">
          <h3 class="title">留下点什么吧...</h3>
          <div class="avatar-content">
            <div class="left">
              <img class="edit-avatar" :src="userInfo.avatar"  alt="">
              <p class="edit-username">{{userInfo.username}}</p>
            </div>
            <div class="right">
              <textarea class="message-content" v-model="content"></textarea>
            </div>
          </div>
          <div class="submit-btn">
            <span class="text" @click="commitMessage">发表</span>
          </div>
        </div>
        <div class="list-message">
          <h3 class="title">留言列表:</h3>
          <ul class="list-ul">
            <li class="list-item" v-for="item in messagelist">
              <div class="item-up">
                <img class="item-img" :src="userInfo.avatar" alt="">
                <div class="item-message-info">
                  <p class="username">{{item.username}}</p>
                  <p class="time">{{item.createtime | formatDate}}</p>
                </div>
              </div>
              <div class="item-down">
                {{item.content}}
              </div>
              <div class="item-del">
                <span class="del-text" @click="delMessage(item)">删除</span>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import MessageHeader from '../header/header.vue'
  import {userInfoMixins} from '@/mixins/mixins'
  import {getMessageList,addMessage,delMessage} from '@/api/api'
  import {mapState} from 'vuex'
  import {formatDate} from '@/common/js/date'
  export default{
    mixins:[userInfoMixins],
    data(){
      return {
        messagelist:[],
        content:''
      }
    },
    components:{MessageHeader},
    computed:{
      ...mapState(['userInfo'])
    },
    created(){
      this.getList()
    },
    methods:{
      getList(){
        getMessageList().then(res=>{
          const {code,data:{list}} = res.data
          if (code===200) {
            this.messagelist = list
          }
        })
      },
      commitMessage(){
        if (!this.content) {
          alert('留言内容不能为空')
          return
        }
        addMessage({content:this.content}).then(res=>{
          const {code} = res.data
          if (code===200) {
            this.content = ''
            this.getList()
          }
        })
      },
      delMessage(item){
        delMessage({_id:item._id}).then(res=>{
          const {msg,code} = res.data
          alert(msg)
          if (code===200) {
            this.getList()
          }
        })
      }
    },
    filters:{
      formatDate(time){
        let date = new Date(Number(time))
        return formatDate(date,'yyyy-MM-dd hh:mm:ss')
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .message-wrapper
    width 800px
    margin 40px auto 0
    .list-edit
      width 100%
      padding 10px
      box-sizing border-box
      border 1px solid #ccc
      .title
        margin 16px 0
        font-size 22px
        font-weight bold
      .avatar-content
        display flex
        width 100%
        padding 16px 0
        border-top 1px solid #ccc
        .left
          flex 0 0 140px
          width 140px
          text-align center
          .edit-avatar
            display block
            margin 0 auto
            width 100px
            height 100px
            border-radius 50%
          .edit-username
            margin-top 20px
            color #333
            font-weight bold
        .right
          flex 1
          .message-content
            width 98%
            height 150px
            border 1px solid #ccc
            outline none
            resize none
      .submit-btn
        position relative
        height 40px
        line-height 40px
        padding-right 20px
        .text
          position absolute
          right 10px
          cursor pointer
          color #fff
          padding 0 20px
          background-color #178EF1
    .list-message
      margin-top 20px
      .title
        font-size 22px
        font-weight bold
      .list-ul
        .list-item
          position relative
          margin 10px 0
          padding 10px
          box-shadow 0 0 10px #ccc
          transition all .6s
          &:hover
            box-shadow 0 5px 20px #ccc
          .item-up
            display flex
            .item-img
              flex 0 0 80px
              height 80px
              border-radius 50%
            .item-message-info
              flex 1
              line-height 41px
              margin-left 20px
              .username
                font-weight bold
          .item-down
            margin-top 10px
          .item-del
            display flex
            position absolute
            top 0px
            right 0px
            width 80px
            height 100%
            align-items center
            justify-content center
            color #fff
            background-color #CE8282
            transition all .6s
            .del-text
              cursor pointer
            &:hover
              width 100%
              
          
</style>
