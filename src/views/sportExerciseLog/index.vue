<template>
  <div class="chooseWrap">
    <header>
      <span @click='goback' class="img"><img src="../../assets/image/back.png" alt=""></span>
      <span>查看运动记录</span>
    </header>
    <div class='item' v-for='(item,i) in recordList'>
      <div v-if='item.model=="PT"'>
        <div class='itemTitle'>{{item.createTime}} PT模式 </div>
        <div class='itemCon'>
          <div class='con'>
            <div class='name'>设置运动时间</div>
            <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
            <div class='name'>实际运动时间</div>
            <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
          </div>
          <div class='con'>
            <div class='name'>本次使用设备</div>
            <div class='time' v-for='(val,ind) in item.deviceAliasList'>
              <span>{{val}}</span>
            </div>
            <div>
              <div class='name'>本次使用参数</div>
              <div class='detail'>
                <div class='detailItem'>
                  <div class='detailUp'>{{item.leftPower}}</div>
                  <div class='detailDown'>POWER LEFT</div>
                </div>
                <div class='detailItem'>
                  <div class='detailUp'>{{item.avgPower}}</div>
                  <div class='detailDown'>BOOST</div>
                </div>
                <div class='detailItem'>
                  <div class='detailUp'>{{item.rightPower}}</div>
                  <div class='detailDown'>POWER RIGHT</div>
                </div>
              </div>
            </div>
          </div>
          <div class='con'>
            <div class='name'>参与本次训练运动员</div>
            <!-- PT模式 DEMO模式 -->
            <div class='time'>张晓晓、张明明</div>
            <!-- PT模式 -->
            <!-- LIVE模式 -->
            <!-- <img class='img' src="./image/line.png" alt=""> -->
          </div>
          <div class='conCollect'>
            <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
            <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
          </div>
        </div>
      </div>
      <div v-else-if='item.model=="DEMO"'>

        <div class='itemTitle'>{{item.createTime}} DEMO模式 </div>
        <div class='itemCon'>
          <div class='con'>
            <div class='name'>设置运动时间</div>
            <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
            <div class='name'>实际运动时间</div>
            <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
          </div>
          <div class='con'>
            <div class='name'>本次使用设备</div>
            <div class='time' v-for='(val,ind) in item.deviceAliasList'>
              <span>{{val}}</span>
            </div>
            <div class='name'>本次使用运动等级</div>
            <div class='time'>FUNTIONAL1 L1</div>
          </div>
          <div class='con'>
            <div class='name'>参与本次训练运动员</div>
            <!-- PT模式 DEMO模式 -->
            <div class='time'>张晓晓、张明明</div>
            <!-- PT模式 -->
            <!-- LIVE模式 -->
            <!-- <img class='img' src="./image/line.png" alt=""> -->
          </div>
          <div class='conCollect'>
            <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
            <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
          </div>
        </div>
      </div>
      <div v-else>
        <div class='itemTitle'>{{item.createTime}} LIVE模式 </div>
        <div class='itemCon'>
          <div class='con'>
            <div class='name'>实际运动时间</div>
            <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
            <div class='name'>本次使用设备</div>
            <div class='time' v-for='(val,ind) in item.deviceAliasList'>
              <span>{{val}}</span>
            </div>
          </div>
          <div class='con'>
            <div class='name'>操控点轨迹记录</div>
            <div class='time'><img class='img' src="./image/line.png" alt=""></div>
          </div>
          <div class='con'>
            <div class='name'>参与本次训练运动员</div>
            <!-- PT模式 DEMO模式 -->
            <div class='time'>张晓晓、张明明</div>
            <!-- PT模式 -->
            <!-- LIVE模式 -->
            <!-- <img class='img' src="./image/line.png" alt=""> -->
          </div>
          <div class='conCollect'>
            <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
            <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import { memberExercise, addCollect, delCollect } from '@/api/index'
  export default {
    data() {
      return {
        recordList: []
      }
    },
    mounted() {
      this.getExercise()
    },
    methods: {
      getExercise(){
        let data = {
        userCode: window.localStorage.getItem('userCode')
      }
      memberExercise(data).then((res) => {
        this.recordList = res.data.data;
      })
      },
      goback() {
        this.$router.go(-1)
      },
      AddCollect(item) {
        let data = {
          userCode: window.localStorage.getItem('userCode'),
          id: item.id * 1
        }
        addCollect(data).then((res) => {
          if (res.data.code == 200) {
            this.getExercise()
          }
        })
      },
      DelCollect(item) {
        let data = {
          userCode: window.localStorage.getItem('userCode'),
          id: item.id * 1
        }
        delCollect(data).then((res) => {
          if (res.data.code == 200) {
            this.getExercise()
          }
        })
      },
    },
  }
</script>
<style scoped lang="less">
  header {
    width: 100%;
    height: 50px;
    display: flex;
    align-items: center;
    margin-bottom: 58px;

    .img {
      width: 28px;
      margin-right: 18px;

      img {
        width: 100%;
      }
    }

    span {
      font-size: 30px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(234, 234, 240, 1);
    }
  }

  .chooseWrap {
    padding: 50px;
    box-sizing: border-box;
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .item {
    margin-bottom: 10px;

    .itemTitle {
      color: #B8BBC6;
      font-size: 18px;
      margin-bottom: 10px;
      text-align: left;
    }

    .itemCon {
      display: flex;
      justify-content: space-between;
      width: 100%;
      height: 235px;
      box-sizing: border-box;
      padding: 40px;
      border: 1px solid #626576;
      border-radius: 5px;

      .con {
        .name {
          color: #979AA9;
          font-size: 17px;
          text-align: left;
          margin-bottom: 10px;
        }

        .time {
          color: #D1D5E6;
          font-size: 26px;
          text-align: left;
          margin-bottom: 32px;
        }

        .detail {
          display: flex;
          box-sizing: border-box;
          width: 264px;
          height: 66px;
          border: 1px solid #757989;
          border-radius: 2px;
          justify-content: space-around;
          align-items: center;

          .detailItem {
            .detailUp {
              color: #D1D5E6;
              font-size: 24px;
              margin-bottom: 5px;
            }

            .detailDown {
              color: #B7BAC8;
              font-size: 10px;
            }
          }
        }

        .img {
          width: 264px;
          border: 1px solid #626576;
          border-radius: 5px;
        }
      }

      .conCollect {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        align-items: flex-end;

        img {
          width: 35px;
          height: 35px;
        }

        .conTrain {
          display: flex;
          align-items: center;
          color: #B1B4C0;
          font-size: 21px;

          // margin-bottom: 40px;
          img {
            width: 24px;
            height: 24px;
          }
        }
      }
    }
  }
</style>