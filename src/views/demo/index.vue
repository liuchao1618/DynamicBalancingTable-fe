<template>
  <div class="chooseWrap">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="box">
      <div v-if="pause=='继续'" class="none freeze">冻结</div>
      <div v-else @click='changefreeze' :class="[freeze=='冻结' ? 'freeze' : 'unfreeze']">{{freeze}}</div>
      <div class="cenCent">
        <span>倒计时</span>
        <span>{{currentTime}}</span>
      </div>
      <div v-if="pause=='继续'" class="none orange">复位</div>
      <div v-else @click='changealign' class="orange">{{align}}</div>
    </div>
    <div class="bottom">
      <div @click='changepause' :class="[pause=='暂停' ? 'pauses' : 'resumes']">{{pause}}</div>
      <div @click='stop'>结束</div>
    </div>
    <van-overlay :show="markFlag">
      <div class="wrapperMark">
        <img src="../../assets/image/timg.gif" alt="">
        <p>复位中，请稍等几秒后再进行操作...</p>
      </div>
    </van-overlay>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { saveRecord } from '@/api/index'
  const minLeftPower = 10;
  const minRightPower = 15;
  const minRuntime = 6.0;
  const maxRuntime = 9.0;
  const minStoptime = 1.0;
  const maxStoptime = 2.0;
  export default {
    data() {
      return {
        currentTime: '00:00',
        pause: '暂停',
        left: '',
        right: '',
        freeze: '冻结',
        align: '复位',
        setTime: 0,
        intervalCount: 0, // 结束要置零  偶数运动 奇数停止
        interva: null,
        closeFlag: false,
        markFlag: false,
        timer: null

      }
    },
    created() {
      this.left = window.localStorage.getItem('left')
      this.right = window.localStorage.getItem('right')
    },
    mounted() {
      if (window.localStorage.getItem('leftbox') == 1) {
        var level = window.localStorage.getItem('level')
      } else {
        window.localStorage.getItem('level').replace(/<br\/>/g, " ");
      }
      this.setTime = window.localStorage.getItem('setTime');
      /**
       * 将秒转换为 分:秒
       * s int 秒数
      */
      clearInterval(this.timer)
      this.timer = setInterval(() => {
        if (this.setTime > 0) {
          this.setTime--;
          this.currentTime = this.s_to_hs(this.setTime)
        } else {
          clearInterval(this.timer)
          this.timer = null
          this.$store.dispatch('setLoginflag', { resetType: 'reset' })
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })
          clearTimeout(this.interva)
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
              this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'DEMO' } });
              this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })
            } else if (res.data.code == 401) {
              this.$router.push({ name: 'Home', query: { index: 0 } })
              this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })

            }

          })
        }
      }, 1000);
      this.a();

    },
    computed: mapState({
      transmitType: state => state.transmitType,
      resetType: state => state.resetType,
    }),
    watch: {
      transmitType() {
        if (this.transmitType == 'stopping') {
          clearTimeout(this.interva)
          this.$toast({
            message: '设备已急停',
            position: 'bottom'
          });
          this.$router.push({ name: 'Home', query: { index: 0 } })
        }
      },
      resetType() {
        if (this.$store.state.resetType == 'normal') {
          this.markFlag = false;
        } else {
          this.markFlag = true;
        }
      }
    },
    methods: {
      s_to_hs(s) {
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
      },
      randomScope(min, max, decimal) {
        if (!decimal || decimal <= 0) decimal = 0;
        return (Math.random() * (max - min + 1) + min).toFixed(decimal);
      },
      toInt(db) {
        return parseInt(parseFloat(db) * 1000);
      },

      /**
       * 10-15 ~ 90-95 差值位0-80
       * 此函数用来计算新一次的随机值  当需要修改随机比例时 从这里改
       *
       * 当目前的随机迭代计数器为偶数时 即为运动(有值产生) 为奇数时 为暂停(数值为0)
       * @param this.left
       */
      randomFuture() {
        try {
          if (this.intervalCount % 2 === 0) {
            let random0 = Math.floor(this.randomScope(0, this.left, 0) / 5) * 5;
            random0 = Math.min(random0, this.left - minLeftPower);
            return [random0 + minLeftPower, random0 + minRightPower, this.toInt(this.randomScope(minRuntime, maxRuntime, 1))]
          } else {
            return [0, 0, this.toInt(this.randomScope(minStoptime, maxStoptime, 1))]
          }
        } finally {
          this.intervalCount++;
        }
      },
      /**
             * 此函数用来迭代生产下次的随机值
             * 先判断是否未停止 然后根据当前迭代计数器生成新值 后通过生成的随机时间作为下次调用本方法的计时器时间
             *
             * 当暂停和冻结时
             */
      a() {
        clearTimeout(this.interva);
        if (this.closeFlag) {
          return;
        }
        let future = this.randomFuture(this.left, this.right);
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO', this.intervalCount, future[0], future[1], 0, 0] })

        this.interva = setTimeout(() => {
          this.a();
        }, future[2])
      },
      stop() {
        clearInterval(this.timer)
        clearTimeout(this.interva)
        if (window.localStorage.getItem('leftbox') == 1) {
          var level = window.localStorage.getItem('level')
        } else {
          var level = window.localStorage.getItem('level').replace(/<br\/>/g, " ");
        }
        window.localStorage.removeItem('leftbox')
        this.$store.dispatch('setLoginflag', { resetType: 'reset' })
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
            this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'DEMO' } });
            this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })
          } else if (res.data.code == 401) {
            this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })
            this.$router.push({ name: 'Home', query: { index: 0 } })
          }

        })
      },
      changepause() {
        if (this.pause == '继续') {
          this.timer = setInterval(() => {
            if (this.setTime > 0) {
              this.setTime--;
              this.currentTime = this.s_to_hs(this.setTime)
            } else {
              clearInterval(this.timer)
              clearTimeout(this.interva)
              if (window.localStorage.getItem('leftbox') == 1) {
                var level = window.localStorage.getItem('level')
              } else {
                var level = window.localStorage.getItem('level').replace(/<br\/>/g, " ");
              }
              window.localStorage.removeItem('leftbox')
              this.$store.dispatch('setLoginflag', { resetType: 'reset' })
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
                  this.$router.push({ name: 'finish', query: { fullPlayTime: window.localStorage.getItem('setTime') * 1, realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime, level: level, id: res.data.data.id, model: 'DEMO' } });
                  this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })
                } else if (res.data.code == 401) {
                  this.$router.push({ name: 'Home', query: { index: 0 } })
                  this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', 'STOP', 0, 0, 0, 0] })

                }

              })
            }
          }, 1000);
          this.pause = '暂停'
          this.a();
        } else {
          this.intervalCount = 0
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO', 'PAUSE', 0, 0, 0, 0] })
          clearTimeout(this.interva)
          this.pause = '继续'
          clearInterval(this.timer)
        }
      },
      changefreeze() {
        if (this.freeze == '冻结') {
          this.intervalCount = 0
          this.freeze = '解冻'
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO', 'PAUSE', 0, 0, 0, 0] })
          clearTimeout(this.interva)
        } else {
          this.freeze = '冻结'
          this.a();
        }
      },
      changealign() {
        this.$store.dispatch('setLoginflag', { resetType: 'reset' })
        if (this.$store.state.resetType == 'normal') {
          this.markFlag = false;
        } else {
          this.markFlag = true;
        }
        clearTimeout(this.interva)
        this.intervalCount = 0
        this.freeze = '解冻'
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO', 'STOP', 0, 0, 0, 0] })

      }
    }
  }
</script>
<style scoped lang="less">
  .wrapperMark {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    height: 100%;

    img {
      width: 60px;
      height: 60px;
    }

    p {
      margin-top: 10px;
      font-size: 20px;
      color: #abafbd;
    }
  }

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