import Vue from 'vue'
import vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(vuex)

// 定义所需的 state
const state = {
  loginflag: false,
  login: false,
  loginName: '',
  modle: 'null',
  type: '',
  left: 0,
  right: 0,
  text: '',
  identity:''
}
// 所需要定义的mutations
const mutations = {
  SETLOGINFLAG: (state, data) => {
    state.text = data.text
    if (data.index == 1) {
      state.loginflag = data.loginflag
      state.login = data.login
    } if (data.index == 2) {
      state.loginflag = data.loginflag
    }
    if (data.index == 3) {
      state.login = data.login
    }
    if (data.loginName) {
      state.loginName = data.loginName
    }
    if (data.modle) {
      state.modle = data.modle
    }
    if (data.type) {
      state.type = data.type
    }
    if (data.left) {
      state.left = data.left
    }
    if (data.right) {
      state.right = data.right
    } if (data.identity) {
      state.identity = data.identity
    }
    window.localStorage.setItem('login', data.login)
    window.localStorage.setItem('loginflag', data.loginflag)
  }
}

export default new vuex.Store({
  actions,
  getters,
  state,
  mutations
})
