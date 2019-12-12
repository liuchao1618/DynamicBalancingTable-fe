import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/**
 * 重写路由的push方法
 */

const routerPush = Router.prototype.push
Router.prototype.push = function push(location) {
  return routerPush.call(this, location).catch(error=> error)
}

import Home from '@/views/home/home.vue'
import HttpError from '@/views/httpError/httpError.vue'
import AddAthletes from '@/views/addAthletes/addAthletes.vue'
import SelectTime from '@/views/selectTime'//训练_选择时间
import downTime from '@/views/downTime'//倒计时
import power from '@/views/power'//训练（PT模式）开始运动
import demo from '@/views/demo'//训练（demo模式）开始运动
import finish from '@/views/finish'//训练finish
import Train from '@/views/train'//训练设置
import editPass from '@/views/editPass'//训练finish
import live from '@/views/live'//live模式
import sportExerciseLog from '@/views/sportExerciseLog'//查看运动记录
import text from '@/views/text'//


export default new Router({
  routes: [
    // {
    //   path: '/home',
    //   name: 'Home',
    //   component: Home
    // },
    {
      path: '/',
      name: 'Home',
      component: Home
    },
    {
      path: '/sportExerciseLog',
      name: 'sportExerciseLog',
      component: sportExerciseLog
    },
    {
      path: '/text',
      name: 'text',
      component: text
    },
    {
      path: '/httpError',
      name: 'httpError',
      component: HttpError
    },
    {
      path: '/SelectTime',
      name: 'SelectTime',
      component: SelectTime
    },
    {
      path: '/editPass',
      name: 'editPass',
      component: editPass
    },{
      path: '/live',
      name: 'live',
      component: live
    }, {
      path: '/finish',
      name: 'finish',
      component: finish
    }, {
      path: '/demo',
      name: 'demo',
      component: demo
    }, {
      path: '/power',
      name: 'power',
      component: power
    }, {
      path: '/downTime',
      name: 'downTime',
      component: downTime
    },
    {
      path: '/addAthletes',
      name: 'addAthletes',
      component: AddAthletes
    },
    {
      path: '/train',
      name: 'train',
      component: Train
    },
    // {
    //   path: '*',
    //   redirect: '/'
    // }
  ]
})
