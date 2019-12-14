<template>
  <div id="app">
      <router-view/>
  </div>
</template>

<script>
  let bluetoothTool = null;
  let timerHeard = null; // 发送心跳定时器
  let flagFalse = null; // 
  import { mapState } from 'vuex'
  import pluginFub from './utils/cmdUtil.js'

export default {
  name: 'App',
  data(){
    let that = this;
    return {
      flag: false,
      originResponse : {
        success: function (res) {
          that.sendDataTime()
          if(pluginFub.equals(res, pluginFub.STOP_OVER)) {
            that.$store.dispatch('setLoginflag', { transmitType:  'normal'})
            // 传值给操作界面
          }
        },
        error: function (e) {
          // alert('error')
          switch (e) {
            case pluginFub.resetting: 
              that.sendReset() // 发送复位
              break;
            case pluginFub.stopping:
              that.$store.dispatch('setLoginflag', { transmitType:  'stopping'})
              break;
            case pluginFub.invalid:
              console.log(e, 'invalid')
              break;
            default:
              console.log(e, 'default')
          }
        },
        complete: function (arrayCache) {
          localStorage.setItem('arrayCache', arrayCache)
          // alert('complete')
        }
      }
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
          // alert('打开蓝牙回调')
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
          // alert('搜索设备回调')
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
        },
        connDeviceCallback: function (Content) { // 连接设备回调
          // alert('连接设备回调')
          // alert(bluetoothTool.state.readThreadState)
          if(bluetoothTool.state.readThreadState) {
            // that.sendHeard()
            that.$store.dispatch('setLoginflag', { storeStatus: 'success' })
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
        },
        connExceptionCallback: function (Content) {
          // alert('设备中断回调')
          // alert(bluetoothTool.state.readThreadState)
          if (that.$route.name != 'Home') {
            that.$router.push({name: 'Home', query: {urlContent: Number(Content)}})
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
          that.$store.dispatch('setLoginflag', { storeStatus: 'fail' })
        },
        sendDataback: function (Content) { // 发送数据 失败
          // alert('发送数据 失败')
          if (that.$route.name != 'Home') {
            that.$router.push({name: 'Home', query: {urlContent: Number(Content)}})
          }
          if (!bluetoothTool.state.readThreadState) {
            clearInterval(timerHeard)
          }
          that.$store.dispatch('setLoginflag', { storeStatusContent:Content })
          that.$store.dispatch('setLoginflag', { storeStatus: 'fail' })
        },
        readDataCallback: function (dataStr) { // 接收数据
        // alert('接收数据')
        // alert(dataStr)
          dataStr = dataStr.slice(0, parseInt(dataStr.length / 8) * 8 )
          pluginFub.responseHandler(dataStr, that.originResponse)
        }
      })
    }, false)
  },
  mounted() {
    localStorage.setItem('arrayCache', [0xCF, 0x01, 0x00, 0x80, 0x00, 0x04, 0xAA, 0xBC])
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
    'storeStatus',
    'BluetoothData',
    'readData'
  ]),
  watch: {
    BluetoothData () {
      this.sendDataTime()
    }
  },
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
        let that = this
        timerHeard = setInterval (() => {
          bluetoothTool.sendData(pluginFub.sendHeart())
        },2000)
    },
    // 发送复位
    sendReset () {
      if (!bluetoothTool.state.readThreadState) {
          return false
      }
      bluetoothTool.sendData(pluginFub.reset())
    },
    // 发送数据
    sendDataTime () {
      // if (!bluetoothTool.state.readThreadState) {
      //     return false
      // }
      let responseArray = localStorage.getItem('arrayCache').split(',')
      let data = '';
      try {
        data = pluginFub.invoke(this.BluetoothData.mode,this.BluetoothData.type,responseArray,this.BluetoothData.leftPower,this.BluetoothData.rightPower,this.BluetoothData.xOffset,this.BluetoothData.yOffset)
        alert(data)
        let loopFlag = data.pop()
        bluetoothTool.sendData(data)
        if(loopFlag) {
          this.hhhh(loopFlag)
        } else {
          clearTimeout(flagFalse)
        }
      }
      catch(e) {
        // alert(e)
        switch(e) {
          case pluginFub.unknown:
            console.log('pluginFub.unknown')
        }
      }
    },
    hhhh (loopFlag) {
      let that = this
      flagFalse = setTimeout(() => {
        if (!loopFlag) {
          clearTimeout(fff)
          return false
        }
        that.sendDataTime()
      }, 300)
    }
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
