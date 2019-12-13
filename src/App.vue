<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  let bluetoothTool = null;
  let timerHeard = null; // 发送心跳定时器
  import { mapState } from 'vuex'

export default {
  name: 'App',
  data(){
    return {
      flag: false
    }
  },
  created(){
    let that = this;
    document.addEventListener('plusready',function () { 
        plus.screen.lockOrientation('landscape-primary')
    },false)
    document.addEventListener("plusready", () => {
      bluetoothTool = BluetoothTool();
      bluetoothTool.init({
        turnOnBluetoothCallback: function (Content) { // 打开蓝牙回调
          alert('打开蓝牙回调')
          that.$store.dispatch('setLoginflag', { storeStatusContent: Number(Content) })
        },
        listenBTStatusCallback: function (Content) { // 监听蓝牙回调
         // 如果蓝牙是开启状态就搜索已配对设备
          if (bluetoothTool.state.bluetoothEnable) {
            that.$store.dispatch('setLoginflag', { storeStatusContent: 1 })
            that.defaultDevice()
          } else {
            if (that.$route.name != 'Home') {
              that.$router.push({name: 'Home', query: {urlContent: Number(Content)}})
            }
            that.$store.dispatch('setLoginflag', { storeStatus: 'fail' })
          }
          // 如果蓝牙开启并且处于未连接状态 再去搜索设备
          if (bluetoothTool.state.bluetoothEnable && !bluetoothTool.state.readThreadState) {
            that.searchDevice()
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
        },
        discoveryFinishedCallback: function (Content) { // 搜索设备回调
          alert('搜索设备回调')
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
        },
        connDeviceCallback: function (Content) { // 连接设备回调
          alert('连接设备回调')
          if(bluetoothTool.state.readThreadState) {
            that.sendHeard()
            that.$store.dispatch('setLoginflag', { storeStatus: 'success' })
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
        },
        connExceptionCallback: function (Content) {
          alert('设备中断回调')
          alert(bluetoothTool.state.readThreadState)
          if (that.$route.name != 'Home') {
            that.$router.push({name: 'Home', query: {urlContent: Number(Content)}})
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
          that.$store.dispatch('setLoginflag', { storeStatus: 'fail' })
        },
        sendDataback: function (Content) { // 发送数据 失败
          alert('发送数据 失败')
          if (that.$route.name != 'Home') {
            that.$router.push({name: 'Home', query: {urlContent: Number(Content)}})
          }
          if (!bluetoothTool.state.readThreadState) {
            clearInterval(timerHeard)
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
          that.$store.dispatch('setLoginflag', { storeStatus: 'fail' })
        }
      })
    }, false)
  },
  mounted() {
    let that = this
    document.addEventListener("plusready", () => {
      bluetoothTool.turnOnBluetooth()
      if (bluetoothTool.state.bluetoothEnable) { // 如果蓝牙是开启状态就搜索设备
        that.defaultDevice()
      }
      if (bluetoothTool.state.bluetoothEnable && !bluetoothTool.state.readThreadState) {
        that.searchDevice()
      }
    }, false)
  },
  computed: mapState([
    'text',
    'storeStatus'
  ]),
  methods: {
    searchDevice () { // 搜索设备
      let address = ['00:15:A6:00:1E:36', '00:15:A6:00:44:2A', '00:19:09:01:1D:B0']
      bluetoothTool.discoveryNewDevice(address)
    },
    defaultDevice () { // 搜索已经配对的设备
      let address = ['00:15:A6:00:1E:36', '00:15:A6:00:44:2A', '00:19:09:01:1D:B0']
      bluetoothTool.getPairedDevices(address)
    },
    sendHeard () { //  发送心跳
        // let data = pluginFub.t80()
        let that = this
        timerHeard = setInterval (() => {
          let data = [120,1,1,1,0,0,0,1]
          bluetoothTool.sendData(data)
        },3000)
    },
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
