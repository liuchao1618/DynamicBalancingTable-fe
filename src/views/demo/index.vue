<template>
  <div class="chooseWrap">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="box">
      <div v-if="pause=='RESUME'" class="none freeze">FREEZE</div>
      <div v-else @click='changefreeze' :class="[freeze=='FREEZE' ? 'freeze' : 'unfreeze']">{{freeze}}</div>
      <div class="cenCent">
        <span>TIMER</span>
        <span>{{currentTime}}</span>
      </div>
      <div v-if="pause=='RESUME'" class="none orange">ALIGN</div>
      <div v-else @click='changealign' class="orange">{{align}}</div>
    </div>
    <div class="bottom">
      <div @click='changepause' :class="[pause=='PAUSE' ? 'pauses' : 'resumes']">{{pause}}</div>
      <div @click='stop'>STOP</div>
    </div>
  </div>
</template>
<script>
  import { saveRecord } from '@/api/index'
  export default {
    data() {
      return {
        currentTime: '00:00',
        pause: 'PAUSE',
        left:this.$store.state.BluetoothData.leftPower,
        right: this.$store.state.BluetoothData.rightPower,
        freeze: 'FREEZE',
        align: 'ALIGN',
        setTime: 0,

      }
    },
    mounted() {
      /**
       * 将秒转换为 分:秒
       * s int 秒数
      */
      function s_to_hs(s) {
        //计算分钟
        //算法：将秒数除以60，然后下舍入，既得到分钟数
        var h;
        h = Math.floor(s / 60);
        //计算秒
        //算法：取得秒%60的余数，既得到秒数
        s = s % 60;
        //将变量转换为字符串
        h += '';
        s += '';
        //如果只有一位数，前面增加一个0
        h = (h.length == 1) ? '0' + h : h;
        s = (s.length == 1) ? '0' + s : s;
        return h + ':' + s;
      }
      this.setTime = window.localStorage.getItem('setTime');
      this.timer = setInterval(() => {
        if (this.setTime > 0) {
          this.setTime--;
          this.currentTime = s_to_hs(this.setTime)
        } else {
          clearInterval(this.timer)
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null','',0,0,0,0] })

          let level = window.localStorage.getItem('level').split('<br/>').join('-')
          let data = {
            userCode: window.localStorage.getItem('userCode'),
            model: 'DEMO',
            devices: [{ deviceId: 1, deviceAlias: '设备1' }],
            fullPlayTime: window.localStorage.getItem('setTime') * 1,
            realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
            level: level
          }
          saveRecord(data).then((res) => {
            if (res.data.code == 200) {
              window.localStorage.setItem('devices', JSON.stringify([{ "deviceId": "1", "deviceAlias": "设备1" }]));
              this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'PT' } });
            }
          })
        }
      }, 1000);
    },
    methods: {
      stop() {
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null','',0,0,0,0] })

        let level = window.localStorage.getItem('level').split('<br/>').join('-')
        let data = {
          userCode: window.localStorage.getItem('userCode'),
          model: 'DEMO',
          devices: [{ deviceId: 1, deviceAlias: '设备1' }],
          fullPlayTime: window.localStorage.getItem('setTime') * 1,
          realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
          level: level
        }
        saveRecord(data).then((res) => {
          if (res.data.code == 200) {
            window.localStorage.setItem('devices', JSON.stringify([{ "deviceId": "1", "deviceAlias": "设备1" }]));
            this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'PT' } });
          } else if (res.data.code == 401) {
            this.$router.push({ name: 'Home' })
          }
        })
      },
      changepause() {
        if (this.pause == 'RESUME') {
          function s_to_hs(s) {
            //计算分钟
            //算法：将秒数除以60，然后下舍入，既得到分钟数
            var h;
            h = Math.floor(s / 60);
            //计算秒
            //算法：取得秒%60的余数，既得到秒数
            s = s % 60;
            //将变量转换为字符串
            h += '';
            s += '';
            //如果只有一位数，前面增加一个0
            h = (h.length == 1) ? '0' + h : h;
            s = (s.length == 1) ? '0' + s : s;
            return h + ':' + s;
          }
          this.setTime = window.localStorage.getItem('setTime');
          this.timer = setInterval(() => {
            if (this.setTime > 0) {
              this.setTime--;
              this.currentTime = s_to_hs(this.setTime)
            } else {
              clearInterval(this.timer)
              window.localStorage.setItem('devices', JSON.stringify([{ "deviceId": "1", "deviceAlias": "设备1" }]));
              this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'PT' } });
            }
          }, 1000);
          this.pause = 'PAUSE'
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO','',this.left,this.right,0,0] })
        } else {
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO','',0,0,0,0] })
          this.pause = 'RESUME'
          clearInterval(this.timer)
        }
      },
      changefreeze() {
        if (this.freeze == 'FREEZE') {
          this.freeze = 'UNFREEZE'
          // this.$store.dispatch('setLoginflag', { left:0,right:0})
        } else {
          this.freeze = 'FREEZE'
          // this.$store.dispatch('setLoginflag', { left: this.left,right:this.right})

        }
      },
      changealign() {
        this.freeze = 'UNFREEZE'
      }
    }
  }
</script>
<style scoped lang="less">
  .none {
    pointer-events: none;
  }
  .cenCent {
    display: flex;
    margin-top: -60px;
    flex-direction: column;
    /* justify-content: space-between; */
    font-size: 30px;

    span:last-child {
      width: 300px;
      height: 181px;
      margin-top: 30px;
      font-size: 90px;
      border: 6px solid rgba(234, 234, 240, 1);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .orange {
    width: 194px;
    height: 181px;
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #fff;
    justify-content: center;
    background: rgba(225, 149, 25, 1);
  }

  .pauses {
    background: rgba(210, 222, 29, 1);
  }

  .resumes {
    background: rgba(0, 216, 29, 1);
    animation: blink 1s infinite;
    -webkit-animation: blink 1s infinite;
    /*Safari and Chrome*/
  }

  .freeze {
    width: 194px;
    height: 181px;
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #fff;
    justify-content: center;
    position: relative;
    background: rgba(212, 196, 25, 1);
  }

  .unfreeze {
    width: 194px;
    height: 181px;
    display: flex;
    align-items: center;
    font-size: 30px;
    color: #fff;
    justify-content: center;
    background: rgba(75, 68, 167, 1);
    animation: blink 1s infinite;
    -webkit-animation: blink 1s infinite;
    /*Safari and Chrome*/
  }

  @keyframes blink {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 80;
    }

    100% {
      opacity: 0;
    }
  }

  @-webkit-keyframes blink {
    0% {
      opacity: 0;
    }

    50% {
      opacity: 80;
    }

    100% {
      opacity: 0;
    }
  }

  .bottom {
    display: flex;
    width: 30%;
    justify-content: space-between;
    margin: 0 auto;

    div {
      width: 194px;
      height: 181px;
      display: flex;
      align-items: center;
      font-size: 30px;
      color: #fff;
      justify-content: center;
      /* background: rgba(210, 222, 29, 1); */
    }

    div:nth-child(2) {
      background: rgba(212, 27, 40, 1);
    }
  }



  .box {
    display: flex;
    justify-content: space-between;
    width: 60%;
    margin: 200px auto;
    color: #fff;

    .center {
      display: flex;
      justify-content: space-between;
      flex: 1;
      margin: 0 92px;

      .cenLeft,
      .cenRight {
        width: 130px;
        position: relative;

        img {
          width: 100%;
        }
      }

    }

    .left,
    .right {
      width: 167px;
      height: 200px;
      display: flex;
      flex-direction: column;
      font-size: 35px;
      justify-content: space-between;
      /* margin:  auto 0; */
      margin-top: 116px;

      span {
        margin-top: 20px;
      }

      span:last-child {
        margin-top: 30px;
        width: 167px;
        font-size: 50px;
        height: 94px;
        line-height: 94px;
        border: 3px solid rgba(234, 234, 240, 1);
      }
    }
  }

  .chooseWrap {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .title {
    width: 100%;
    text-align: center;
    padding-top: 50px;

    img {
      width: 280px;
      height: 64px;
    }
  }
</style>