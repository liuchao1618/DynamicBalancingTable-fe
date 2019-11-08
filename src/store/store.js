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
      Date.prototype.dateFormat = function (fmt) { //author: meizz 
        var o = {
            "M+": this.getMonth() + 1, //月份 
            "d+": this.getDate(), //日 
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    }
      state.athletes.birth = data.birth.dateFormat("yyyy-MM-dd")
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
