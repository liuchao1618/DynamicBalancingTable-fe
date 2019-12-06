import Vue from 'vue'
import vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(vuex)

// 定义所需的 state
const state = {
  loginflag:false,
  login:false,
  loginName:'',
}
// 所需要定义的mutations
const mutations = {
  SETLOGINFLAG:(state,data)=>{
    state.loginflag = data.loginflag
    state.login = data.login
    state.loginName = data.loginName
    window.localStorage.setItem('login',data.login)
    window.localStorage.setItem('loginflag',data.loginflag)
  }
}

export default new vuex.Store({
  actions,
  getters,
  state,
  mutations
})
