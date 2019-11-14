import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '@/views/home/home.vue'
import HttpError from '@/views/httpError/httpError.vue'
import AddAthletes from '@/views/addAthletes/addAthletes.vue'
import AthletesDetail from '@/views/athletesDetail/athletesDetail.vue'
import SelectTime from '@/views/selectTime'//训练_选择时间
// import Live from '@/views/live'//LIVE模式
import downTime from '@/views/downTime'//倒计时
import power from '@/views/power'//训练（PT模式）开始运动
import demo from '@/views/demo'//训练（demo模式）开始运动
import finish from '@/views/finish'//训练finish
import Train from '@/views/train'//训练设置
import editPass from '@/views/editPass'//训练finish


export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home
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
    // {
    //   path: '/live',
    //   name: 'Live',
    //   component: Live
    // },
    {
      path: '/editPass',
      name: 'editPass',
      component: editPass
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
      path: '/athletesDetail',
      name: 'athletesDetail',
      component: AthletesDetail
    },
    {
      path: '/train',
      name: 'train',
      component: Train
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
