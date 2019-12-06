<template>
  <div class="chooseWrap">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="box">
      <div class="left">
        <span>POWER</span>
        <span>LEFT</span>
        <span>{{100-leftValue}}</span>
      </div>
      <div class="center">
        <div class="cenLeft">
          <van-slider :step="5" class="leftLine" v-model="leftValue" bar-height='32px;' vertical
          @change='changeleft' />
          <img src="../../assets/image/left.png" alt="">
        </div>
        <div class="cenCent">
          <div></div>
          <div class="cencenTop">
            <span>TIMER</span>
            <span>{{currentTime}}</span>
          </div>
          <div></div>
          <div class="cencenBot">
            <span>BOOST</span>
            <span>{{bottomValue}}</span>
          </div>
        </div>
        <div class="cenRight">
          <van-slider :step="5" class="rightValue" v-model="rightValue" bar-height='38px;' vertical
          @change='changeright' />
          <img src="../../assets/image/right.png" alt="">
        </div>
      </div>
      <div class="right">
        <span>POWER</span>
        <span>RIGHT</span>
        <span>{{100-rightValue}}</span>
      </div>
    </div>
    <div class="centBottom">
      <van-slider :step="5" class="bottomLine" v-model="bottomValue" bar-height='23px' @change="changeBottom" />
      <img src="../../assets/image/bottom.png" alt="">
    </div>
    <div class="bottom">
      <div @click='changepause' :class="[pause=='PAUSE' ? 'pauses' : 'resumes']">{{pause}}</div>
      <div v-if="pause=='RESUME'" class="none freeze">FREEZE</div>
      <div v-else @click='changefreeze' :class="[freeze=='FREEZE' ? 'freeze' : 'unfreeze']">{{freeze}}</div>
      <div v-if="pause=='RESUME'" class="none orange">ALIGN</div>
      <div v-else @click='changealign'>{{align}}</div>
      <div @click='stop'>STOP</div>
    </div>
  </div>
</template>
<script>
  import { saveRecord } from '@/api/index'

  export default {
    data() {
      return {
        value: '',
        leftValue: 0,
        rightValue: 0,
        bottomValue: 0,
        currentTime: '00:00',
        pause: 'PAUSE',
        freeze: 'FREEZE',
        align: 'ALIGN',
        timer: null,
        setTime: 0,
        watchFlag: false
      }
    },
    mounted() {
      this.leftValue = 100 - localStorage.getItem('leftValue')
      this.rightValue = 100 - localStorage.getItem('rightValue')
      this.bottomValue = parseInt((localStorage.getItem('leftValue')*1 + localStorage.getItem('rightValue')*1)/2)
      console.log( localStorage.getItem('leftValue'), localStorage.getItem('rightValue'),'left') 
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
          let data = {
            model: 'PT',
            devices: [{ deviceId: 1, deviceAlias: '设备1' }],
            fullPlayTime: window.localStorage.getItem('setTime') * 1,
            realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
            leftPower: 100 - this.leftValue,
            rightPower: 100 - this.rightValue,
            avgPower: this.calculateAvg(this.leftPower, this.rightPower),
            userCode: window.localStorage.getItem('userCode')
          }
          saveRecord(data).then((res) => {
            if (res.data.code == 200) {
              window.localStorage.setItem('devices', JSON.stringify([{
                "deviceId": "1",
                "deviceAlias": "设备1"
              }]));
              this.$router.push({
                name: 'finish',
                query: {
                  left: 100 - this.leftValue,
                  right: 100 - this.rightValue,
                  avg: this.calculateAvg(this.left, this.right),
                  fullPlayTime: window.localStorage.getItem('setTime') * 1,
                  realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
                  id: res.data.data.id,
                  model: 'PT'
                }
              });
            }
          })
        }
      }, 1000);
    },
    methods: {
      l(...obj) {
        console.log(obj);
      },

      stop() {
        clearInterval(this.timer)

        let data = {
          model: 'PT',
          devices: [{ deviceId: 1, deviceAlias: '设备1' }],
          fullPlayTime: window.localStorage.getItem('setTime') * 1,
          realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
          leftPower: 100 - this.leftValue,
          rightPower: 100 - this.rightValue,
          avgPower: parseInt((100 - this.leftValue + 100 - this.rightValue) / 2),
          userCode: window.localStorage.getItem('userCode')
        }
        saveRecord(data).then((res) => {
          if (res.data.code == 200) {
            window.localStorage.setItem('devices', JSON.stringify([{
              "deviceId": "1",
              "deviceAlias": "设备1"
            }]));
            this.$router.push({
              name: 'finish',
              query: {
                left: 100 - this.leftValue,
                right: 100 - this.rightValue,
                avg: parseInt((100 - this.leftValue + 100 - this.rightValue) / 2),
                fullPlayTime: window.localStorage.getItem('setTime') * 1,
                realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
                id: res.data.data.id,
                model: 'PT'
              }
            });
          }
        })
      },

      changeleft(event) {
        this.watchFlag = false
        this.bottomValue = parseInt((100 - event + 100 - this.rightValue) / 2)
        window.localStorage.setItem('leftValue',100-this.leftValue)
        window.localStorage.setItem('bottomValue',this.bottomValue)
      },
      changeright(event) {
        this.watchFlag = false
        this.bottomValue = parseInt((100 - event + 100 - this.leftValue) / 2)
        window.localStorage.setItem('rightValue',100-this.rightValue)
        window.localStorage.setItem('bottomValue',this.bottomValue)
      },

      changeBottom() {
        this.watchFlag = true;
      },

      changepause() {
        if (this.pause == 'RESUME') {
          this.pause = 'PAUSE'

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

          // this.setTime = window.localStorage.getItem('setTime');
          this.timer = setInterval(() => {
            if (this.setTime > 0) {
              this.setTime--;
              this.currentTime = s_to_hs(this.setTime)
            } else {
              clearInterval(this.timer)
              window.localStorage.setItem('devices', JSON.stringify([{
                "deviceId": "1",
                "deviceAlias": "设备1"
              }]));
              this.$router.push({
                name: 'finish',
                query: {
                  left: 100 - this.leftValue,
                  right: 100 - this.rightValue,
                  avg: parseInt((100 - this.leftValue + 100 - this.rightValue) / 2),
                  fullPlayTime: window.localStorage.getItem('setTime') * 1,
                  realPlayTime: window.localStorage.getItem('setTime') * 1 - this.setTime,
                  id: res.data.data.id,
                  model: 'PT'
                }
              });
            }
          }, 1000);
        } else {
          this.pause = 'RESUME'
          clearInterval(this.timer)
        }
      },

      changefreeze() {
        if (this.freeze == 'FREEZE') {
          this.freeze = 'UNFREEZE'
        } else {
          this.freeze = 'FREEZE'
        }
      },

      changealign() {
        this.freeze = 'UNFREEZE'
      },

      calculateBottomValue(now, old) {

        let tempLeftValue = 100 - this.leftValue;
        let tempRightValue = 100 - this.rightValue;
        let overflowValue = 0;
        let overflowFlag = false;

        //差值
        const diff = now - old;
        // 计算补差值
        let averageDiff = (tempLeftValue + tempRightValue - (old << 1));
        let arr = this.getRandomNum(Math.abs(diff) << 1, 2);

        if (diff > 0) {
          if ((tempLeftValue += arr[0]) >= 100) {
            overflowValue = tempLeftValue - 100;
            tempLeftValue = 100;
            overflowFlag = true;
          }
          if ((tempRightValue = tempRightValue + arr[1] + overflowValue - averageDiff) >= 100) {
            overflowValue = tempRightValue - 100;
            tempRightValue = 100;
          }
          if (overflowValue !== 0 && !overflowFlag) {
            tempLeftValue = Math.min(tempLeftValue + overflowValue, 100);
          }
        } else if (diff < 0) {
          if ((tempLeftValue -= arr[0]) <= 0) {
            overflowValue = Math.abs(0 - tempLeftValue);
            tempLeftValue = 0;
            overflowFlag = true;
          }
          if ((tempRightValue = tempRightValue - arr[1] - overflowValue - averageDiff) <= 0) {
            overflowValue = Math.abs(0 - tempRightValue);
            tempRightValue = 0;
          }
          if (overflowValue !== 0 && !overflowFlag) {
            tempLeftValue = Math.max(tempLeftValue - overflowValue, 0);
          }
        }
        this.leftValue = 100 - tempLeftValue;
        this.rightValue = 100 - tempRightValue;
      },

      getRandomNum(num, times) {
        let res = [];
        if (times === 1) {
          res.push(num);
          return res;
        }
        let max = num / times * 2;
        let current = 1 + (~~(Math.random() * max - 1));
        res.push(current);
        return res.concat(this.getRandomNum(num - current, --times));
      }
    },

    watch: {
      bottomValue(now, old) {
        setTimeout(() => {
        if (this.watchFlag) {
          this.calculateBottomValue(now, old);
          window.localStorage.setItem('leftValue',100-this.leftValue)
          window.localStorage.setItem('rightValue',100-this.rightValue)
        window.localStorage.setItem('bottomValue',this.bottomValue)
        }
        }, 500);
      }
    }
  }
</script>
<style scoped lang="less">
  .mark {
    position: absolute;
    left: 0;
    background: rgba(0, 0, 0, .5);
    top: 0;
  }

  .bottom .pauses {
    background: rgba(210, 222, 29, 1);
  }

  .bottom .orange {
    background: rgba(225, 149, 25, 1);
  }

  .bottom .resumes {
    background: rgba(0, 216, 29, 1);
    animation: blink 1s infinite;
    -webkit-animation: blink 1s infinite;
    /*Safari and Chrome*/
  }

  .bottom .freeze {
    position: relative;
    background: rgba(212, 196, 25, 1);
  }

  .none {
    pointer-events: none;
  }

  .bottom .unfreeze {
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
    width: 75%;
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

    div:nth-child(3) {
      background: rgba(225, 149, 25, 1);
    }

    div:nth-child(4) {
      background: rgba(212, 27, 40, 1);
    }
  }

  .centBottom {
    position: relative;
    width: 700px;
    margin: 30px auto 0;

    img {
      width: 100%;
    }

    .bottomLine {
      position: absolute;
      left: 0;
      margin-left: 27px;
      top: 14px;
      width: 90%;
      padding-right: 15px;
      background: linear-gradient(180deg, rgba(196, 209, 210, 1) 0%, rgba(255, 255, 255, 1) 100%);

      /deep/ .van-slider__button-wrapper {
        width: 40px;
        height: 40px;

        div {
          width: 100%;
          height: 100%;
        }
      }
    }

    /deep/ .van-slider--vertical .van-slider__button-wrapper {
      left: -24px;
      width: 40px;
      height: 40px;

      .van-slider__button {
        width: 100%;
        height: 100%;
      }
    }
  }

  .box {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;
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

      .cenCent {
        display: flex;
        flex-direction: column;
        justify-content: space-between;

        .cencenTop {
          display: flex;
          align-items: center;
          font-size: 32px;
          font-family: PingFangSC-Medium, PingFang SC;

          span:last-child {
            margin-left: 30px;
            display: flex;
            font-size: 60px;
            width: 200px;
            height: 100px;
            justify-content: center;
            align-items: center;
            border: 6px solid rgba(234, 234, 240, 1);
          }
        }

        .cencenBot {
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 32px;
          font-family: PingFangSC-Medium, PingFang SC;

          span:last-child {
            margin-left: 24px;
            display: flex;
            font-size: 50px;
            width: 120px;
            height: 80px;
            justify-content: center;
            align-items: center;
            border: 3px solid rgba(234, 234, 240, 1);
          }
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

    .leftLine {
      position: absolute;
      left: 11px;
      top: 21px;
      width: 32px;
      height: 500px;
      background: linear-gradient(90deg, rgba(13, 184, 46, 1) 0%, rgba(45, 199, 75, 1) 33%, rgba(125, 212, 142, 1) 63%, rgba(177, 225, 186, 1) 83%, rgba(231, 237, 232, 1) 100%);
    }

    .rightValue {
      position: absolute;
      left: 88px;
      top: 21px;
      width: 32px;
      height: 500px;
      background: linear-gradient(90deg, rgba(13, 184, 46, 1) 0%, rgba(45, 199, 75, 1) 33%, rgba(125, 212, 142, 1) 63%, rgba(177, 225, 186, 1) 83%, rgba(231, 237, 232, 1) 100%);
    }
  }

  /deep/ .van-slider--vertical .van-slider__button-wrapper {
    left: -24px;
    width: 40px;
    height: 40px;

    .van-slider__button {
      width: 100%;
      height: 100%;
    }
  }

  /* .slider_line{
    height: 600px;
    position: absolute;
  left: 10px;
    top: 13px;
    -webkit-transform:rotate(180deg);
  } */
  .chooseWrap {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;
  }

  /deep/ .centBottom .van-slider__bar {
    background: linear-gradient(180deg, rgba(13, 184, 46, 1) 0%, rgba(45, 199, 75, 1) 33%, rgba(125, 212, 142, 1) 63%, rgba(177, 225, 186, 1) 83%, rgba(231, 237, 232, 1) 100%);
  }

  /deep/ .center .van-slider__bar {
    background: linear-gradient(90deg, rgba(196, 209, 210, 1) 0%, rgba(255, 255, 255, 1) 100%);
  }

  /* /deep/.van-slider__button {
    height: 40px;
    width: 40px;
    left: -20px;
    background: linear-gradient(#F8F8F8, #D7D0D0)
  } */

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