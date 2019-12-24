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
      <span class="back" @click='back'>返回</span>
      <span class="start" @click='start'>开始</span>
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        currentValue: 300,
        timeStr:'05:00'
      }
    },
    methods: {
      back(){
        this.$router.back(-1)
      },
      onChange(event) {
        //将秒数转换为时分秒格式
        function formatSeconds(s) {
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
        this.timeStr = formatSeconds(event)
        this.currentValue = event;
      },
      start() {
        this.$router.push({ name: 'downTime'});
        this.timeStr = this.timeStr.split(':')[0] * 60 + this.timeStr.split(':')[1] * 1;
        window.localStorage.setItem('setTime',this.timeStr)
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
      margin-left: 420px;
    }
  }
</style>