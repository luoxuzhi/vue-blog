import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      redirect:'/login'
    },
    {
      path:'/login',
      component:() => import('@/components/login/login')
    },
    {
      path:'/register',
      component:() => import('@/components/register/register')
    },
    {
      path:'/list',
      component:() => import('@/components/list/list')
    }
  ]
})
