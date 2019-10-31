import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

import Home from '@/views/home/home.vue'
import HttpError from '@/views/httpError/httpError.vue'
import AddAthletes from '@/views/addAthletes/addAthletes.vue'
import AthletesDetail from '@/views/athletesDetail/athletesDetail.vue'

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
      path: '*',
      redirect: '/'
    }
  ]
})
