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
  identity:'',
  storeStatusContent: 0, // home页面蓝牙状态切换展示
  storeStatus: 'fail', // 未连接成功的状态
  readData: [], // 接收到的数据
  transmitType: 'normal', // 传给操作界面，用来判断该显示的状态和提示 normal：正常,stopping:急停
  BluetoothDataArr:['','',0,0,0,0],
  refreSearch:false, //蓝牙未连接 重新搜索
}
// 所需要定义的mutations
const mutations = {
  SETLOGINFLAG: (state, data) => {
    state.refreSearch = data.refreSearch ||state.refreSearch
    console.log(state,data)
    state.storeStatusContent = data.storeStatusContent || state.storeStatusContent
    state.storeStatus = data.storeStatus || state.storeStatus
    state.transmitType = data.transmitType || state.transmitType

    if(data.text =='coach'){
      state.identity = data.identity
    }

    if(data.index == 1){
    state.loginflag = data.loginflag
    state.login = data.login
    state.loginName = data.loginName
    }if(data.index == 2){
    state.loginflag = data.loginflag
 }
    if(data.BluetoothDataArr){
      state.BluetoothDataArr = data.BluetoothDataArr
    }
    if (data.index == 3) {
      state.login = data.login
    }
    if (data.loginName) {
      state.loginName = data.loginName
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
