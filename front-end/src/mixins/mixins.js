import {getVerifyCode} from '@/api/api'
import {mapState} from 'vuex'

export const codeMixins = {
  data(){
    return {
      imgSrc:'',
      userid:'',
      userpwd:'',
      code:'',
      codeToken:''
    }
  },
  created(){
    this._getVerifyCode()
  },
  methods:{
    _getVerifyCode(){
      getVerifyCode().then(res=>{
        const {data:{token,img}} = res.data
        this.imgSrc = img
        this.codeToken = token
      })
    }
  }
}

export const userInfoMixins = {
  computed:{
    ...mapState(['userInfo'])
  }
}