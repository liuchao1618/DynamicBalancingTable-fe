import Vue from 'vue'
import vuex from 'vuex'
import * as actions from './actions'
import * as getters from './getters'
Vue.use(vuex)

// 定义所需的 state
const state = {
  athletes: {
    name: '',
    tel: '',
    sex: '',
    birth: '',
    height: '',
    weight: ''
  }
}
// 所需要定义的mutations
const mutations = {
  SETATHLETES: (state, data) => {
    if(data.index === 1){
      state.athletes.name = data.name
    }
    if(data.index === 2){
      state.athletes.tel = data.tel
    }
    if(data.index === 3){
      state.athletes.sex = data.sex
    }
    if(data.index === 4){
      state.athletes.birth = data.birth
    }
    if(data.index === 5){
      state.athletes.height = data.height
    }
    if(data.index === 6){
      state.athletes.weight = data.weight
    }
    if(data.index === 0){
      state.athletes = {
        name: '',
        tel: '',
        sex: '',
        birth: '',
        height: '',
        weight: ''
      }
    }
    if(data.index === -1){
      state.athletes = data.data
    }
  }
}

export default new vuex.Store({
  actions,
  getters,
  state,
  mutations
})
