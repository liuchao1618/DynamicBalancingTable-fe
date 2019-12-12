<template>
  <div>
    <ul>
      <li class="li" v-for='(item,i) in list' :key='i' @click='changeText(item)'>{{item}}</li>
    </ul>
  </div>
</template>
<script>
// import {realconsole} from '../../utils/blueTooch.js'
// let bluetoothTool = null;
export default {
  data() {
    return {
      list:['0101','0102','0103','0104','0105','1101','1100','1200','1201']
    }
  },
  // created () {
  //   let that = this
  //   document.addEventListener("plusready", () => {
  //     bluetoothTool = realconsole();
  //     bluetoothTool.init({
  //       turnOnBluetoothCallback: function () { // 打开蓝牙回调
  //           alert('打开蓝牙回调')
  //       },
  //     })
  //   })
  // },
  // mounted () {
  //   let that = this
  //   document.addEventListener("plusready", () => {
  //     bluetoothTool.turnOnBluetooth()
  //   }, false)
  // },
  methods: {
    changeText(item){
      this.$store.dispatch('setLoginflag', { text:item })
    }
  },
  
}
</script>
<style scope>
  ul{
    display: flex;
    flex-wrap: wrap;
  }
.li{
  width: 30%;
  height: 250px;
  background: #ccc;
  margin: 10px;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>