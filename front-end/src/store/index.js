import Vuex from 'vuex'
import Vue from 'vue'

Vue.use(Vuex)

export default new Vuex.Store({
  state:{
    userInfo:{
      _id:window.sessionStorage.getItem('_id') || '',
      token:window.sessionStorage.getItem('token') || '',
      username:window.sessionStorage.getItem('username') || '',
      avatar:window.sessionStorage.getItem('avatar') || ''
    }
  },
  mutations:{
    saveUserInfo(state,{_id,token,username,avatar}){
      state.userInfo._id = _id
      state.userInfo.token = token
      state.userInfo.username = username
      state.userInfo.avatar = avatar
      window.sessionStorage.setItem('_id', _id)
      window.sessionStorage.setItem('token', token)
      window.sessionStorage.setItem('username', username)
      window.sessionStorage.setItem('avatar', avatar)
    },
    remove(state){
      state.userInfo._id = ''
      state.userInfo.token = ''
      state.userInfo.username = ''
      state.userInfo.avatar = ''
      window.sessionStorage.removeItem('_id')
      window.sessionStorage.removeItem('token')
      window.sessionStorage.removeItem('username')
      window.sessionStorage.removeItem('avatar')
    }
  }
})