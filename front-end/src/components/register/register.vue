<template>
  <div class="register-wrapper">
    <div class="register-container">
      <div class="up">
        用户注册
      </div>
      <div class="middle">
        <div class="register-item register-item-avatar">
          <div class="avatar-wrapper">
            <img :src="avatar" alt="上传头像" class="preview-avatar">
            <label class="upload-label" for="upload-avatar">上传头像<input type="file" class="upload-avatar" id="upload-avatar" @change="uploadImage"></label>
          </div>
        </div>
        <div class="register-item">
          <span class="text">称呼</span><input v-model="username" type="text" placeholder="请输入称呼" class="username">
        </div>
        <div class="register-item">
          <span class="text">账号</span><input v-model="userid"  type="text" placeholder="请输入账号" class="userid">
        </div>
        <div class="register-item">
          <span class="text">密码</span><input type="password" v-model="userpwd" placeholder="请输入密码" class="password">
        </div>
        <div class="register-item">
          <span class="text">确认密码</span><input type="password" v-model="userpwdconfirm" placeholder="请输入确认密码" class="password">
        </div>
        <div class="register-item">
          <span class="text">验证码</span><input type="text" v-model="code" placeholder="请输入验证码" class="verifycode">
          <img :src="imgSrc" alt="" @click="_getVerifyCode">
        </div>
      </div>
      <div class="bottom">
        <div class="register-btn" @click="register">注册</div>
        <router-link class="register" to="/login">已有账号，去登录</router-link>
      </div>
      <div class="cropper-img-box" v-if="cropper_box_mark == true">
        <vue-cropper
        ref="cropper"
        :img="cropperData.img"
        :autoCrop="cropperData.autoCrop"
        :autoCropWidth="cropperData.autoCropWidth"
        :autoCropHeight="cropperData.autoCropHeight"
        :fixedBox="cropperData.fixedBox"
        >
        </vue-cropper>
        <div class="cropper-img-tool">
          <button class="cropper-img-tool-btn" @click="rotateRight">顺时针90°</button>
          <button class="cropper-img-tool-btn" @click="finish">确认</button>
          <button class="cropper-img-tool-btn" @click="cropper_box_mark = false">取消</button>
          <button class="cropper-img-tool-btn" @click="rotateLeft">逆时针90°</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6">
  import VueCropper from 'vue-cropper'
  import {codeMixins} from '@/mixins/mixins'
  import {usersRegister} from '@/api/api'
  export default{
    mixins:[codeMixins],
    components:{VueCropper},
    data(){
      return {
        username:'',
        userpwdconfirm:'',
        avatar:'',
        cropper_box_mark:false,
        cropperData:{
          img: '',
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          fixedBox: true
        }
      }
    },
    methods:{
      rotateRight(){
        this.$refs.cropper.rotateRight()
      },
      rotateLeft(){
        this.$refs.cropper.rotateLeft()
      },
      finish(){
        this.$refs.cropper.getCropData(data=>{
          this.avatar = data
          this.cropper_box_mark = false
        })
      },
      uploadImage(e){
        let obj = e.target
        let file = obj.files[0]
        let temArr = file.name.split('.')
        let fileSuffix = temArr[temArr.length-1]
        if(fileSuffix !== 'jpg' && fileSuffix !== 'png' && fileSuffix !== 'jpeg'){
          alert('上传图片失败，目前只支持jpg,png,jpeg的图片!')
          return
        }
        let reader = new FileReader()
        let _self = this
        reader.onload = function (ev) {
          _self.cropperData.img = ev.target.result
          _self.cropper_box_mark = true
        }
        reader.readAsDataURL(file)
      },
      register(){
        let userInfo = {
          username:this.username,
          userid:this.userid,
          userpwd:this.userpwd,
          userpwdconfirm:this.userpwdconfirm,
          code:this.code,
          codeToken:this.codeToken,
          avatar:this.avatar
        }
        usersRegister(userInfo).then(res=>{
          const {code,data} = res.data
          if (code===200) {
            this.$router.push('/list')
            this.$store.commit('saveUserInfo',data)
          }
        }).catch(e=>console.log(e.message))
      }
    }
  }
</script>

<style scoped lang="stylus" rel="stylesheet/stylus">
  .register-wrapper
    width 100%
    height 100%
    .register-container
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
        .upload-image
          display none
      .middle
        margin-top 30px
        .register-item
          display flex
          height 40px
          line-height 40px
          margin-top 4px
          &.register-item-avatar
            height auto
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
            &.upload-avatar
              display none
          .avatar-wrapper
            flex 1
            text-align center
            .preview-avatar
              display block
              width 120px
              height 120px
              margin 0 auto
              border-radius 50%
              border 1px solid #ccc
              margin-bottom 16px
            .upload-label
              width 100px
              border 1px solid #ccc
              padding 10px 30px
              color #999
              cursor pointer
      .bottom
        margin-top 20px
        text-align center
        .register-btn
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
      .cropper-img-box
        position fixed
        z-index 2
        top 0px
        bottom 0px
        left 0px
        right 0px
        .cropper-img-tool 
          position: absolute
          z-index: 2
          bottom: 20px
          left: 0
          text-align: center
          width: 100%
          .cropper-img-tool-btn 
            width: 140px
            height: 50px
            font-size: 18px
            cursor: pointer
            margin-left 20px
      
</style>
