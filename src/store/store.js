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
  text: '',
  identity:'',
  BluetoothData:{
    mode: 'null',
    type: '',
    leftPower: 0,
    rightPower: 0,
    xOffset:0,
    yOffset:0
  }
}
// 所需要定义的mutations
const mutations = {
  SETLOGINFLAG: (state, data) => {
    console.log(state,data)
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
    if (data.mode) {
      state.BluetoothData.mode = data.mode
    }
    if (data.type) {
      state.BluetoothData.type = data.type      
    }
    if (data.left) {
      state.BluetoothData.leftPower = data.left

    }
    if (data.right) {
      state.BluetoothData.rightPower = data.right

    } 
    if (data.yOffset) {
      state.BluetoothData.yOffset = data.yOffset

    } 
    if (data.xOffset) {
      state.BluetoothData.xOffset = data.xOffset

    } 
    if (data.identity) {
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
