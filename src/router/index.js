import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '@/views/home/home'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path:'*',
      redirect:'/'
    }
  ]
})
