<template>
  <div class="chooseWrap">
    <header>
      <span @click='goback' class="img"><img src="../../assets/image/back.png" alt=""></span>
      <span>查看运动记录</span>
    </header>
    <div v-if='flag' class="kongBox">
      该运动员暂无运动记录
    </div>
    <div v-else class='item' v-for='(item,i) in recordList'>
      <div v-if='item.model=="PT"'>
        <div class='itemTitle'>{{item.createTime}} 手动模式 </div>
        <div class='itemCon'>
          <div class='con'>
            <div class='name'>设置运动时长</div>
            <div class='time'>{{item.fullPlayTime}}分钟</div>
            <div class='name'>实际运动时长</div>
            <div class='time'>{{item.realPlayTime}}分钟</div>
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
                  <div class='detailDown'>左</div>
                </div>
                <div class='detailItem'>
                  <div class='detailUp'>{{item.avgPower}}</div>
                  <div class='detailDown'>BOOST</div>
                </div>
                <div class='detailItem'>
                  <div class='detailUp'>{{item.rightPower}}</div>
                  <div class='detailDown'>右</div>
                </div>
              </div>
            </div>
          </div>
          <div class='con'>
            <div class='name'>参与本次训练运动员</div>
            <!-- PT模式 DEMO模式 -->
            <div style="display: flex;flex-wrap: wrap;">
              <div style="line-height:25px;color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
            </div>
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
            <div class='name'>设置运动时长</div>
            <div class='time'>{{item.fullPlayTime}}分钟</div>
            <div class='name'>实际运动时长</div>
            <div class='time'>{{item.realPlayTime}}分钟</div>
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
            <div style="display: flex;flex-wrap: wrap;">
              <div style="line-height:25px;color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
            </div>
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
        <div class='itemTitle'>{{item.createTime}} 轨迹模式 </div>
        <div class='itemCon'>
          <div class='con'>
            <div class='name'>实际运动时长</div>
            <div class='time'>{{item.realPlayTime}}分钟</div>
            <div class='name'>本次使用设备</div>
            <div class='time' v-for='(val,ind) in item.deviceAliasList'>
              <span>{{val}}</span>
            </div>
          </div>
          <div class='con'>
            <div class='name'>操控点轨迹记录</div>
            <canvas :id="i" ref='myCanvas' width="198" height="88"
              style="border:1px solid rgba(117,121,137,1);"></canvas>
          </div>
          <div class='con'>
            <div class='name'>参与本次训练运动员</div>
            <!-- PT模式 DEMO模式 -->
            <div style="display: flex;flex-wrap: wrap;">
              <div style="line-height:25px;color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
            </div>
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
        recordList: [],
        userCode: '',
        flag: false
      }
    },
    updated() {
      console.log(this.recordList)
      this.recordList.forEach((item, index) => {
        var c = document.getElementById(index);
        var ctx = c.getContext("2d");
        ctx.strokeStyle = '#D1D5E6'
        var arr = item.expands
        arr.forEach((v, i) => {
          ctx.lineTo(v[0], v[1]);
        })
        ctx.stroke();
      })
    },
    mounted() {
      this.userCode = this.$route.query.userCode
      this.getExercise()
    },
    methods: {
      formatSeconds(s) {
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
      getExercise() {
        let data = {
          userCode: this.userCode
        }
        memberExercise(data).then((res) => {
          this.recordList = res.data.data;
          res.data.data.forEach((item, index) => {
            item.fullPlayTime = this.formatSeconds(item.fullPlayTime)
            item.realPlayTime = this.formatSeconds(item.realPlayTime)
            item.memberList = item.memberList.join('、')
            item.expands = []
            if (JSON.parse(item.expand) != null) {
              var expand = JSON.parse(item.expand)
              expand.forEach((v, ind) => {
                var newArr = []
                v.c.forEach((val, i) => {
                  newArr.push(parseInt(val / 4))
                })
                item.expands.push(newArr)
              })
            }
          })
          if(this.recordList.length==0){
            this.flag = true
          }
        })
      },
      goback() {
        this.$router.push({ name: 'Home', query: { index: 3 } })
      },
      AddCollect(item) {
        let data = {
          userCode: this.userCode,
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
          userCode: this.userCode,
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
  .kongBox {
    color: #B8BBC6;
    font-size: 18px;
  }

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
          width: 50px;
          height: 50px;
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