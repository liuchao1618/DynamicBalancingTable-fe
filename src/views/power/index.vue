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
          <van-slider class="leftLine" v-model="leftValue" bar-height='32px;' @change='changeleft' vertical />
          <img src="../../assets/image/left.png" alt="">
        </div>
        <div class="cenCent">
          <div></div>
          <div class="cencenTop">
            <span>TIMER</span>
            <span>01:41</span>
          </div>
          <div></div>
          <div class="cencenBot">
            <span>BOOST</span>
            <span>{{parseInt((100-leftValue+100-rightValue)/2)}}</span>
          </div>
        </div>
        <div class="cenRight">
          <van-slider class="rightValue" v-model="rightValue" bar-height='38px;' @change='changeright' vertical />
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
      <van-slider class="bottomLine" :value="(100-leftValue+100-rightValue)/2" @change='changebottom' bar-height='23px' />
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
  export default {
    data() {
      return {
        leftValue: 55,
        rightValue: 80,
        bottomValue: 30,
        pause:'PAUSE',
        freeze:'FREEZE',
        align:'ALIGN'
      }
    },
    mounted() {
    },
    methods: {
      stop(){
        this.$router.push({name:'finish'})
      },
      changeleft(event){
        this.bottomValue = parseInt((100-event+100-this.rightValue)/2)
      },
      changeright(event){
        this.bottomValue = parseInt((100-event+100-this.rightValue)/2)
      },
      changebottom(event){
        console.log(event)
      },
      changepause(){
        if(this.pause == 'RESUME'){
          this.pause = 'PAUSE'
        }else{
           this.pause = 'RESUME'
        }
      },
      changefreeze(){
        if(this.freeze == 'FREEZE'){
          this.freeze = 'UNFREEZE'
        }else{
           this.freeze = 'FREEZE'
        }
      },
      changealign(){
        this.freeze = 'UNFREEZE'
      }
    }
  }
</script>
<style scoped lang="less">
  .mark{
    position: absolute;
    left:0;
    background: rgba(0,0,0,.5);
    top: 0;
  }
 .bottom .pauses{
    background: rgba(210, 222, 29, 1);
  }
  .bottom .orange{
    background:rgba(225,149,25,1);
  }
  .bottom .resumes{
   background: rgba(0,216,29,1);
   animation:blink 1s infinite;
	-webkit-animation:blink 1s infinite; /*Safari and Chrome*/
  }
  .bottom .freeze{
    position: relative;
    background:rgba(212,196,25,1);
  }
  .none{
    pointer-events: none;
  }
  .bottom .unfreeze{
   background: rgba(75,68,167,1);
   animation:blink 1s infinite;
	-webkit-animation:blink 1s infinite; /*Safari and Chrome*/
  }
  @keyframes blink{
	0%{
		opacity: 0;
	}
	50%{
		opacity: 80;
	}
	100%{
		opacity: 0;
	}
}
@-webkit-keyframes blink{
	0%{
		opacity: 0;
	}
	50%{
		opacity: 80;
	}
	100%{
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
    div:nth-child(3){
      background:rgba(225,149,25,1);
    }
    div:nth-child(4){
      background:rgba(212,27,40,1);
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

      /deep/.van-slider__button-wrapper {
        width: 40px;
        height: 40px;

        div {
          width: 100%;
          height: 100%;
        }
      }
    }

    /deep/.van-slider--vertical .van-slider__button-wrapper {
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

  /deep/.van-slider--vertical .van-slider__button-wrapper {
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

  /deep/.center .van-slider__bar {
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