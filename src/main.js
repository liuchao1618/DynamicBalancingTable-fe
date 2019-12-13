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

// html5+
import VueHtml5Plus from 'vue-html5plus'

import 'lib-flexible'
import { Toast } from 'vant';


import store from './store/store'
Vue.config.productionTip = false

Vue.use(VueAxios, axios)
Vue.use(vuex)
Vue.use(Toast);
Vue.use(Vant)
Vue.use(Lazyload)
Vue.use(List)
Vue.use(VueHtml5Plus)

// window.AndroidMethod = function (msg) {
//   if (window.android !== null && typeof(window.android) !== "undefined") {
//     window.android.callAndroid(msg);
//   }
// }
/* VUE实例 */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
