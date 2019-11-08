<template>
  <div class="chooseWrap">
    <div class="imgbox">
      <img src="../../assets/image/title.png" alt="">
    </div>
    <div class="scale">
      <span>TIME</span>
      <div class="scaleimg">
          <!-- <van-slider class="leftLine" v-model="leftValue" bar-height='38px;' vertical /> -->
        <van-slider class="slider_line"  v-model="currentValue" :max="1200" @change="onChange($event)"
          bar-height='26px' inactive-color='linear-gradient(180deg,rgba(196,209,210,1) 0%,rgba(255,255,255,1) 100%)'
          active-color='linear-gradient(180deg,rgba(13,184,46,1) 0%,rgba(45,199,75,1) 33%,rgba(125,212,142,1) 63%,rgba(177,225,186,1) 83%,rgba(231,237,232,1) 100%)' />
        <img src="../../assets/image/base.png" alt="">
      </div>
      <span class="time">{{timeStr}}</span>
    </div>
    <div class="bottom">
      <span class="back">BACK</span>
      <span class="start" @click='start'>START</span>
      <span></span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentValue: 720,
        timeStr:'12:0'
      }
    },
    methods: {
      onChange(event) {
        //将秒数转换为时分秒格式
        function formatSeconds(value) {

          var theTime = parseInt(value);// 秒
          var middle = 0;// 分
          var hour = 0;// 小时

          if (theTime > 60) {
            middle = parseInt(theTime / 60);
            theTime = parseInt(theTime % 60);
            if (middle > 60) {
              hour = parseInt(middle / 60);
              middle = parseInt(middle % 60);
            }
          }
          var result = "" + parseInt(theTime);
          if (middle > 0) {
            result = "" + parseInt(middle) + ":" + result;
          }
          if (hour > 0) {
            result = "" + parseInt(hour) + ":" + result;
          }
          return result;
        }
        this.timeStr = formatSeconds(event)
        this.currentValue = event;
      },
      start() {
        this.$router.push({ name: 'downTime' });

      }
    }
  }
</script>
<style scoped lang="less">
  .slider_line {
    width: 95%;
    /* margin: 0 10px; */
    position: absolute;
    left: 0px;
    top: 13px;
    padding: 0 10px 0 0;
    margin-left: 28px;
    box-sizing: border-box;
  }

  /deep/.van-slider {
    /* width: 100%; */
  }

  /deep/.van-slider__button {
    height: 40px;
    width: 40px;
    background: linear-gradient(#F8F8F8, #D7D0D0)
  }

  .chooseWrap {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;

    .imgbox {
      padding-top: 158px;

    }

    .imgbox img {
      width: 380px;
      height: 100px;
      margin-bottom: 234px;
    }
  }



  .scale {
    display: flex;
    width: 80%;
    margin: 0 auto;
    justify-content: space-between;
    /* align-items: center; */
    color: #EAEAF0;
    font-size: 20px;

    span {
      width: 70px;
    }

    .scaleimg {
      position: relative;
      width: 80%;

      img {
        width: 100%;
      }
    }



    span {
      margin-top: 15px;
    }

    .time {
      line-height: 115px;
      width: 205px;
      height: 115px;
      border: 4px solid rgba(234, 234, 240, 1);
      font-size: 60px;
      margin: -20px 0 0 60px;
    }
  }

  .bottom {
    display: flex;
    width: 90%;
    margin: 50px auto 0;
    height: auto;
    justify-content: space-between;
    align-items: flex-end;

    .back {
      width: 174px;
      height: 75px;
      font-size: 42px;
      font-family: PingFang-SC-Medium, PingFang-SC;
      font-weight: 500;
      color: rgba(234, 234, 240, 1);
      line-height: 75px;
      border: 4px solid rgba(234, 234, 240, 1);

    }

    .start {
      width: 268px;
      height: 252px;
      background: rgba(223, 202, 36, 1);
      font-size: 60px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
      line-height: 252px;
    }
  }
</style>