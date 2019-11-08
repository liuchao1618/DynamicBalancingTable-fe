<template>
  <div class="chooseWrap">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="box">
      <div @click='changefreeze' :class="[freeze=='FREEZE' ? 'freeze' : 'unfreeze']">{{freeze}}</div>
      <div class="cenCent">
        <span>TIMER</span>
        <span>01:41</span>
      </div>
      <div class="orange" @click='changealign'>{{align}}</div>
    </div>
    <div class="bottom">
      <div @click='changepause' :class="[pause=='PAUSE' ? 'pauses' : 'resumes']">{{pause}}</div>

      <div>STOP</div>
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
        pause: 'PAUSE',
        freeze: 'FREEZE',
        align: 'ALIGN'
      }
    },
    mounted() {
    },
    methods: {
      changeleft(event) {
        this.bottomValue = parseInt((100 - event + 100 - this.rightValue) / 2)
      },
      changeright(event) {
        this.bottomValue = parseInt((100 - event + 100 - this.rightValue) / 2)
      },
      changebottom(event) {
        console.log(event)
      },
      changepause() {
        if (this.pause == 'RESUME') {
          this.pause = 'PAUSE'
        } else {
          this.pause = 'RESUME'
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
      }
    }
  }
</script>
<style scoped lang="less">
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