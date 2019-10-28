import Vue from 'vue'
import vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(vuex);

// 定义所需的 state
const state = {

}
// 所需要定义的mutations
const mutations = {

}

export default new vuex.Store({
  actions,
  getters,
  state,
  mutations
})
