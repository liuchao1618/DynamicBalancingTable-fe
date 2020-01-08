<template>
  <div class="live">
    <div class="imgbox">
      <img src="../../assets/image/title.png" alt="">
    </div>
    <div class="live_trajectory">
      <!-- <div class="yellow" @mousedown=changeMap($event)></div> -->
      <div class="yellow" id="moveDiv" v-if='flag' @mousedown="down" @touchstart="down" @mousemove="move"
        @touchmove="move" @mouseup="end" @touchend="end"></div>
      <div class="yellow" v-else></div>
      <img src="../../assets/image/base@2x.png" alt="">
    </div>
    <div class="live_operation">
      <div class="operation_time">{{currentTime}}</div>
      <div class="operation_blue operation_but" :style="{ opacity : startFlag  }" @click='start'>开始</div>
      <div class="operation_red operation_but" @click='stop'>停止</div>
    </div>
    <div class="bottomDiv">请先点击开始再拖动操控点，第一次拖动会稍许延时。</div>
  </div>
</template>
<script>
  import { mapState } from 'vuex'
  import { saveRecord } from '@/api/index'
  export default {
    mounted() {
      // console.log(this.xPum,this.yPum)
    },
    data() {
      return {
        startFlag: '1',
        flags: false,
        currentTime: '00:00',
        setTime: 0,
        position: { x: 0, y: 0 },
        timer: null,
        flag: false,
        dataArr: [],
        startStr: '',
        currentStr: '',
        x: 0,
        timers: null,
        xPum: 400,
        yPum: 175,
        bluetoothX: 0,
        bluetoothY: 0
      }
    },
    methods: {
      stop() {
        this.$store.dispatch('setLoginflag', { resetType:  'reset'})
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['null', '', 0, 0, 0, 0] })
        clearInterval(this.timers)
        clearInterval(this.timer)
        // locus:[{
        //   a :555,88
        //   :111 555 87
        //   :111 557 86
        // }]
        let data = {
          model: 'LIVE',
          devices: [{ deviceId: 1, deviceAlias: '设备1' }],
          realPlayTime: this.setTime,
          userCode: window.localStorage.getItem('userCode'),
          locus: this.dataArr
        }
        saveRecord(data).then(res => {
          window.localStorage.setItem('locus', JSON.stringify(this.dataArr))
          this.$router.push({
            name: 'finish',
            query: {
              model: 'LIVE',
              id: res.data.data.id,
              devices: [{ deviceId: 1, deviceAlias: '设备1' }],
              realPlayTime: this.setTime,
              userCode: window.localStorage.getItem('userCode')
            }
          });
        })
      },
      start() {
        this.startFlag = '0.6'
        clearInterval(this.timer)
        this.startStr = new Date() * 1
        this.flag = true
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
        this.timer = setInterval(() => {
          if (this.setTime >= 1200) {
            this.setTime = 1200
          } else {
            this.setTime++;
          }
          this.currentTime = s_to_hs(this.setTime)
        }, 1000);
      },
      back() {
        this.$router.go(-1)
      },
      down() {
        this.flags = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move() {
        if (this.flags) {
          var touch;
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.nx = touch.clientX - this.position.x;
          this.ny = touch.clientY - this.position.y;
          this.xPum = this.dx + this.nx + 20;
          this.yPum = this.dy + this.ny + 20;
          if (this.xPum < 15) this.xPum = 15
          if (this.xPum > 785) this.xPum = 785
          if (this.yPum < 20) this.yPum = 20
          if (this.yPum > 330) this.yPum = 330
          moveDiv.style.left = this.xPum + "px";
          moveDiv.style.top = this.yPum + "px";
          //阻止页面的滑动默认事件
          document.addEventListener("touchmove", function () { // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
            // event.preventDefault();//jq 阻止冒泡事件
            // event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
          }, false);
          // console.log(this.xPum, this.yPum)
        }
      },
      //鼠标释放时候的函数
      end() {

        this.dataArr.push({ t: new Date() * 1 + this.setTime * 1000 - this.startStr, c: [400, 175] })
        this.flags = false;
        moveDiv.style.left = '400px'
        moveDiv.style.top = '175px'
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['LIVE', '', 0, 0, 0, 0] })
      },
    },
    
    computed: mapState({
      transmitType: state => state.transmitType,
    }),
    watch: {
      transmitType() {
        if (this.transmitType == 'stopping') {
          clearInterval(this.timers)
          clearInterval(this.timer)
          this.$toast({
            message: '设备已急停',
            position: 'bottom'
          });
          this.$router.push({ name: 'Home', query:{index: 0} })
        }
      },
      flags(now, old) {
        function coordinateTransform(site) {
          const xRatio = 1.22;
          const yRatio = 7;
          const targetLeftTop = [-465, 1155];
          const sourceLeftTop = [15, 20];
          return [parseInt(targetLeftTop[0] + (site[0] - sourceLeftTop[0]) * xRatio),
          parseInt(targetLeftTop[1] - (site[1] - sourceLeftTop[1]) * yRatio)];
        }
        if (now) {
          this.timers = setInterval(() => {
            this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['LIVE', '', 0, 0, coordinateTransform([this.xPum, this.yPum])[0], coordinateTransform([this.xPum, this.yPum])[1]] })
            this.dataArr.push(
              { t: new Date() * 1 + this.setTime * 1000 - this.startStr, c: [parseInt(this.xPum), parseInt(this.yPum)] }
            )
          }, 1000);
        } else {
          clearInterval(this.timers)
        }
      },

    },
    name: 'Live',
  }
</script>
<style scoped lang="less">
  .bottomDiv{
    font-size: 24px;
    color: #9499A8;
    margin: 0 auto;
    margin-top:30px;
  }
  .yellow {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(230, 238, 34, 1);
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -25px;
    z-index: 999;
    touch-action: none;
    margin-left: -25px;
  }

  .live {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;

    .imgbox {
      padding-top: 50px;
    }

    .imgbox img {
      width: 280px;
      height: 64px;
      // margin-bottom: 234px;
    }

    .live_operation {
      display: flex;
      padding-left: 270px;
      align-items: flex-end;
      margin: 0 auto;
      .operation_bcak {
        width: 174px;
        height: 75px;
        border: 4px solid rgba(234, 234, 240, 1);
        font-size: 42px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(234, 234, 240, 1);
        line-height: 75px;
        margin-right: 70px;
      }

      .operation_time {
        width: 268px;
        height: 133px;
        opacity: 0.84;
        border: 6px solid rgba(131, 135, 147, 1);
        font-size: 76px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(209, 209, 221, 1);
        line-height: 133px;
        letter-spacing: 1px;
        margin-right: 70px;
      }

      .operation_but {
        width: 224px;
        height: 211px;
        font-size: 38px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 211px;
        margin-right: 70px;
      }

      .operation_blue {
        background: rgba(0, 216, 29, 1);
      }

      .operation_red {
        background: rgba(212, 27, 40, 1);
      }
    }

    .live_trajectory {
      width: 1105px;
      height: 490px;
      position: relative;
      margin: 80px auto 50px;

      img {
        width: 100%;
        height: 100%;
        /* width: 1105px;
        height: 490px; */
      }
    }
  }
</style>