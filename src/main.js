// 导入所需模块
import Vue from 'vue'
import App from './App'
import router from './router'

// ajax
import axios from 'axios'
import VueAxios from 'vue-axios'

// 状态管理
import vuex from 'vuex'

// ui 框架
import Vant from 'vant'
import 'vant/lib/index.css'

import './assets/css/common.css'

// 懒加载
import { Lazyload } from 'vant'

// 瀑布流
import { List } from 'vant'

import 'lib-flexible'

import store from './store/store'
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(vuex)

Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(List)

/* VUE实例 */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
