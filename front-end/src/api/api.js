import axios from 'axios'
import store from '../store/'
import router from '../router/'

// 全局设置
axios.defaults.timeout = 10000 // 时间超时设置10s
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 创建一个axios的实列
const instance = axios.create()
instance.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'


// request拦截器
instance.interceptors.request.use(
  config => {
    if (store.state.userInfo.token) {
      config.headers.Authorization = store.state.userInfo.token
    }
    return config
  },
  err => {
    return Promise.reject(err)
  }
)

// respone拦截器
instance.interceptors.response.use(
  response => {
    return response
  },
  // 除了200以外的请求到这里来，，这里的200不是我们设置的那个code200,,我这里是，没有登录才会不返回200
  error => {
    let { response } = error
    if(response != null){
      // 这里为什么处理401错误,详见，server/until/token checkRequestToken这个函数
      if(response.status === 401) {
        let msg = response.data || '请重新登录!'
        alert(msg)
        store.commit('remove')  // token过期,清除
        router.replace({ // 跳转到登录页面
            path: '/login',
            // 添加一个重定向后缀，等登录以后再到这里来
            query: { redirect: router.currentRoute.fullPath }
        })
        return Promise.reject(error.response)
      }
    }else {
      console.log(error)
    }
  }
)

export const getVerifyCode = function () {
  return instance.post('/users/verifycode')
}

export const usersRegister = function (data) {
  return instance.post('/users/register',data)
}

export const usersLogin = function (data) {
  return instance.post('/users/login',data)
}

export const getMessageList = function (data) {
  return instance.post('/message/list',data)
}
export const addMessage = function (data) {
  return instance.post('/message/add',data)
}

export const delMessage = function (data) {
  return instance.post('/message/delete',data)
}






