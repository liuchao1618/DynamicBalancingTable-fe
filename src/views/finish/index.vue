<template>
  <div class="chooseWrap" @click='closeSelect'>
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="wanC">
      <img src="../../assets/image/finish.png" alt="">
      <span>完成</span>
    </div>
    <div class="box">
      <div class="left">
        <h3 v-if='model == "PT"'>{{dataTime}} 手动模式</h3>
        <h3 v-if='model == "DEMO"'>{{dataTime}} demo模式</h3>
        <h3 v-if='model == "LIVE"'>{{dataTime}} 轨迹模式</h3>
        <div class="livebox" v-if='locus'>
          <div class="liveL">
            <div class="exerciseTime">
              <span>实际运动时长</span>
              <h2>{{realPlayTime}}</h2>
            </div>
            <div class="log">
              <span>操控点轨迹记录</span>
              <canvas id='mycanvas' ref='myCanvas' width="198" height="88"
                style="border:1px solid rgba(117,121,137,1);"></canvas>
            </div>
          </div>
          <div class='conCollect'>
            <img v-if='favored' @click.stop='Collect()' src="../../assets/image/starS.png" alt="">
            <img v-else @click.stop='Collect()' src="../../assets/image/star.png" alt="">
          </div>
        </div>
        <div class="exercise" v-else>
          <div class="exerciseTime">
            <span>设置运动时长</span>
            <h2> {{fullPlayTime}}</h2>
            <span>实际运动时长</span>
            <h2>{{realPlayTime}}</h2>
          </div>
          <div class="usedevice">
            <span>本次使用设备</span>
            <div style="display:flex;marginBottom:35px;">
              <h2 style="marginLeft:10px" v-for='(item,i) in devices'>{{item.deviceAlias}}</h2>
            </div>
            <div v-if='level'>
              <span>本次使用运动等级</span>
              <div style="fontSize:20px">{{level}}</div>
            </div>
            <div v-else>
              <span>本次使用参数</span>
              <div class="usedevicebox">
                <dl>
                  <dt>{{leftValue}}</dt>
                  <dd>左</dd>
                </dl>
                <dl>
                  <dt>{{parseInt(( leftValue*1 + rightValue*1) / 2)}}</dt>
                  <dd>BOOST</dd>
                </dl>
                <dl>
                  <dt>{{rightValue}}</dt>
                  <dd>右</dd>
                </dl>
              </div>
            </div>
          </div>
          <div class='conCollect'>
            <img v-if='favored' @click.stop='Collect()' src="../../assets/image/starS.png" alt="">
            <img v-else @click.stop='Collect()' src="../../assets/image/star.png" alt="">
          </div>
        </div>
      </div>
      <div class="right">
        <h3>参与本次训练的运动员</h3>
        <div class="exercises">
          <div class="check">
            <span>已选：</span>
            <div class="chekbox">
              <div class="checkName" @click.stop='del(item)' v-for='(item,ind) in checkName'>
                <span>{{item.username}}</span>
                <span>×</span>
              </div>
            </div>
          </div>
          <div class="drill">
            <div class="coach">
              <span>教练：</span>
              <div class="select" @click.stop='tabShow'>
                <span>{{coachName}}</span>
                <span class="img"><img src="../../assets/image/xiala.png" alt=""></span>
              </div>
              <ul class="list" v-if='show'>
                <li v-for='(item,i) in trainerName' @click.stop='changeName(item.username)'>{{item.username}}</li>
              </ul>
            </div>
            <div class="search">
              <van-search placeholder="请输入运动员姓名" @input='changeIpt' v-model="iptName" />
              <ul class="lists" v-if='shows'>
                <li v-for='(item,i) in sportName' @click.stop='checkNames(item)'>{{item.username}}</li>
              </ul>
            </div>
          </div>
          <div class="exerciseName">
            <div class="info" v-for='(item,index) in nameList'>
              <van-checkbox :disabled='nameDisabled' :class='nameDisabled?"forbidBox":""' v-model="item.checked"
                shape="square" @click.stop='selectAll(item)'>
                {{item.username}}</van-checkbox>
            </div>
          </div>

          <div class="sub" :class="[checkName.length>0 ? 'active' : '']" @click.stop='submit'>提交
          </div>
        </div>
      </div>
    </div>
    <div class="bottom" @click='goHome'>
      回到训练页
    </div>
  </div>
</template>
<script>
  import { checkMember, delCollect, addCollect, addSport, runnersName } from '@/api/index'
  export default {
    data() {
      return {
        dataTime: '',
        show: false,
        value1: '',
        coachName: '',
        nameDisabled: false,
        trainerName: [],
        checkName: [],
        sportName: [],
        iptName: '',
        shows: false,
        favored: false,
        leftValue: 55,
        level: '',
        rightValue: 80,
        currentId: 0,
        bottomValue: 30,
        fullPlayTime: '',
        realPlayTime: '',
        referFlag: true,
        model: '',
        clickName: [],
        devices: [],
        dataList: [
          {
            num: 30,
            word: 'POWER LEFT'
          }, {
            num: 25,
            word: 'BOOST'
          }, {
            num: 30,
            word: 'POWER RIGHT'
          }],
        nameList: [],
        locus: []
      }
    },
    mounted() {
      this.coachName = window.localStorage.getItem('username')
      function getDate() {

        var myDate = new Date();

        //获取当前年
        var year = myDate.getFullYear();

        //获取当前月
        var month = myDate.getMonth() + 1;

        //获取当前日
        var date = myDate.getDate();
        var h = myDate.getHours(); //获取当前小时数(0-23)
        var m = myDate.getMinutes(); //获取当前分钟数(0-59)
        var s = myDate.getSeconds();

        //获取当前时间

        return year + '-' + (month) + "-" + (date) + " " + (h) + ':' + (m) + ":" + (s);

      };
      this.dataTime = getDate()
      this.leftValue = this.$route.query.left
      this.rightValue = this.$route.query.right
      this.fullPlayTime = this.formatSeconds(this.$route.query.fullPlayTime)
      this.realPlayTime = this.formatSeconds(this.$route.query.realPlayTime)
      this.currentId = this.$route.query.id
      this.level = this.$route.query.level
      this.model = this.$route.query.model
      this.locus = JSON.parse(window.localStorage.getItem('locus'))
      this.devices = JSON.parse(window.localStorage.getItem('devices'))
      this.getcheckMember()
      var c = document.getElementById('mycanvas');
      var ctx = c.getContext("2d");
      ctx.strokeStyle = '#D1D5E6'
        this.locus&&this.locus.forEach((v, i) => {
        var newArr = []
        v.c.forEach((val, i) => {
          newArr.push(parseInt(val / 4))
        })
        ctx.lineTo(newArr[0], newArr[1]);
      })
      ctx.stroke();
    },
    methods: {
      closeSelect(){
        this.show = false
        this.shows = false
      },
      goHome() {
        this.$router.push({ name: 'Home', query: { index: 0} })
        window.localStorage.setItem('checkModel',this.model);
        window.localStorage.removeItem('locus')
      },
      checkNames(item) {
        item.checked = true
        this.checkName.push(item)
        this.shows = false
        this.clickName.push(item.username)
        this.nameList.forEach((v, i) => {
          if (this.clickName.indexOf(v.username) !== -1) {
            v.checked = true
          }
        })
      },
      changeIpt() {
        runnersName().then((res) => {
          this.sportName = []
          res.data.data.forEach((item, i) => {
            item.checked = false
            if (this.iptName !== '') {
              if (item.username.indexOf(this.iptName) !== -1) {
                this.sportName.push(item)
              }

            } else {
              this.shows = false
            }
          })
          if (this.sportName.length > 0) {
            this.shows = true
          }
          // this.sportName = res.data.data
        })
      },
      getcheckMember() {
        checkMember().then((res) => {
          this.trainerName = res.data.data
          res.data.data.forEach((item, i) => {
            if (item.username == this.coachName) {
              item.members.forEach((v, i) => {
                if(v.userCode == window.localStorage.getItem('childCode')){
                  v.checked = true
                  this.checkName.push(v)
                }else{
                  v.checked = false
                }
              })
              this.nameList = JSON.parse(JSON.stringify(item.members))
            }
            
          })
        })
      },
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
      changeName(val) {
        if (val) {
          this.coachName = val
          this.show = false
          checkMember().then((res) => {
            // this.trainerName = res.data.data
            res.data.data.forEach((item, i) => {
              if (val == item.username) {
                item.members.forEach((v, i) => {
                  v.checked = false
                })
                this.nameList = item.members
              }
            })
          })
        }
      },
      tabShow() {
        if (this.show == false) {
          this.show = true
        } else {
          this.show = false
        }
      },
      submit() {
        this.nameDisabled = true
        this.referFlag = false
        let data = {
          id: this.currentId * 1,
          members: this.checkName
        }
        addSport(data).then((res) => {
          if (res.data.code == 200) {
            this.checkName = []
            this.nameList.forEach((item, i) => {
              item.checked = false
            })
            this.$toast({
              message: '提交成功',
              position: 'bottom'
            });
          }
        })
      },
      submits() {
        let data = {
          id: this.currentId * 1,
          members: this.checkName
        }
        addSport(data).then((res) => {
          if (res.data.code == 200) {
            this.checkName = []
            this.nameList.forEach((item, i) => {
              item.checked = false
            })
          }
        })
      },
      Collect() {
        if (this.favored) {
          this.favored = false
          let data = {
            userCode: window.localStorage.getItem('userCode'),
            id: this.currentId * 1
          }
          delCollect(data).then((res) => {
            if (res.data.code == 200) {
            }
          })
        } else {
          this.favored = true
          let data = {
            userCode: window.localStorage.getItem('userCode'),
            id: this.currentId * 1
          }
          addCollect(data).then((res) => {
            if (res.data.code == 200) {
            }
          })
        }
      },
      del(val) {
        this.checkName.map((item, ind) => {
          if (item.username == val.username) {
            this.checkName.splice(ind, 1)
            item.checked = false
          }
        })
        // this.nameList.map((item, i) => {
        //   if (val.name == item.name) {
        //   }
        // })
      },
      selectAll(val) {
        if (!val.checked && this.checkName.length < 4) {
          this.checkName.unshift(val)
        } else {
          this.checkName.map((item, ind) => {
            if (item.username == val.username) {
              this.checkName.splice(ind, 1)
            }
          })
        }
      }
    },
    watch: {
      nameList: { //监听的对象
        deep: true, //深度监听设置为 true
        handler: function (newV, oldV) {
          if (newV !== oldV) {
            newV.forEach((v, i) => {
              if (this.clickName.indexOf(v.username) !== -1) {
                v.checked = true
              }
            })
          } else {
          }
        }
      }
    },

  }
</script>
<style scoped lang="less">
  .forbidBox {
    pointer-events: none
  }

  .list {
    position: absolute;
    top: 45px;
    left: 67px;
    width: 145px;
    height: 180px;
    background: rgba(41, 43, 49, 1);
    box-shadow: 0px -1px 0px 0px rgba(88, 86, 93, 1);
    border-radius: 5px;
    border: 1px solid rgba(88, 86, 93, 1);
    border-top: 0;
    z-index: 999;
    color: #8D8D94;
    line-height: 45px;
    padding: 5px 10px;
    box-sizing: border-box;
    overflow: auto;

    li {
      width: 100%;
    }
  }
  /deep/ .van-search__content{
    height: 45px;
    
  }
  /deep/ .van-cell--borderless{
    height: 45px;
  }
  .lists {
    position: absolute;
    top: 45px;
    left: 0px;
    width: 205px;
    height: 100px;
    background: rgba(41, 43, 49, 1);
    box-shadow: 0px -1px 0px 0px rgba(88, 86, 93, 1);
    border-radius: 5px;
    border: 1px solid rgba(88, 86, 93, 1);
    border-top: 0;
    z-index: 1000;
    color: #8D8D94;
    line-height: 45px;
    padding: 5px 10px;
    box-sizing: border-box;
    overflow: auto;
    li{
      width: 100%;
    }
  }

  .select {
    margin-right: 15px;
    padding: 5px 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;
    width: 145px;
    height: 45px;
    color: #D1D5E6;
    border-radius: 4px;
    border: 1px solid rgba(98, 101, 118, 1);

    .img {
      width: 14px;

      img {
        width: 100%;
      }
    }
  }

  .conCollect {
    width: 60px;
  }

  .conCollect img {
    width: 100%;
  }

  /deep/.van-checkbox__label {
    color: #D1D5E6
  }

  /deep/.van-field__left-icon {
    margin-left: 10px;
    color: transparent;
    display: none
  }

  /deep/.van-icon .van-icon-search,
  .van-cell {
    font-size: 22px;
    color: #626576 !important;
  }

  /deep/.van-search,
  .van-search__content {
    padding: 0;
    background: transparent !important;
  }

  /deep/.van-field__control {
    height: 35px;
    padding: 0 10px;
    color: #D1D5E6 !important;
  }
  /deep/ .van-checkbox__icon--disabled .van-icon{
    background-color:#373A43 !important;
  }
  .box {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;

    h3 {
      color: rgba(184, 187, 198, 1);
      font-size: 24px;
      margin-bottom: 15px;
    }

    .left,
    .right {
      flex: 1;
      text-align: left;
      margin-bottom: 60px;
    }

    .left {
      margin-right: 20px;
    }

    .exercise,
    .exercises,
    .livebox {
      height: 300px;
      background: rgba(254, 252, 255, 0.03);
      border-radius: 5px;
      border: 1px solid rgba(98, 101, 118, 1);
      color: rgba(209, 213, 230, 1);
    }

    .livebox {
      display: flex;
      justify-content: space-between;
      padding: 20px;
      box-sizing: border-box;

      span {
        font-size: 20px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(151, 154, 169, 1);
        line-height: 24px;
      }

      h2 {
        margin-top: 5px;
        font-size: 26px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(209, 213, 230, 1);
      }

      #mycanvas {
        margin-top: 5px;
      }

      .log {
        margin-top: 10px;
        display: flex;
        flex-direction: column;
      }
    }

    .exercises {
      padding: 20px;
      box-sizing: border-box;

      .check {
        font-size: 22px;

        display: flex;
        height: 38px;
        align-items: center;
        color: rgba(171, 175, 189, 1);

        .chekbox {
          font-size: 18px;

          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .checkName {
          font-size: 22px;
          margin-right: 20px;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          height: 38px;
          background: rgba(1, 9, 21, 0.2);
          border-radius: 4px;
          border: 1px solid rgba(146, 150, 174, 1);
          span:first-child{
            margin-right:15px;
          }
        }
      }

      .drill {
        display: flex;
        height: 45px;
        justify-content: space-between;
        align-items: center;
        font-size: 22px;
        margin: 15px 0 20px 0;
        .coach {
          position: relative;
          display: flex;
          align-items: center;

          span {
            /* font-size: 18px; */
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(171, 175, 189, 1);
            line-height: 25px;
          }
        }

        .search {
          position: relative;
          width: 204px;
          height: 45px;
          border-radius: 4px;
          border: 1px solid rgba(98, 101, 118, 1);
          /* overflow: hidden; */

          input {
            border: 0;
            /* line-height: 38px; */
            padding: 0 10px;
            box-sizing: border-box;
            background: transparent;
            color: rgba(85, 88, 103, 1);
          }
        }
      }

      .exerciseName {
        margin: 10px 0 20px 0;
        display: flex;
        height: 82px;
        overflow-y: scroll;
        flex-wrap: wrap;
        background: rgba(33, 36, 41, 0.05);
        border-radius: 4px;
        border: 1px solid rgba(98, 101, 118, 1);

        .info {
          font-size: 22px;
          width: 23%;
          display: flex;
          height: 38px;
          padding-left: 10px;
          box-sizing: border-box;
          /* justify-content: center; */
          /* align-items: center; */
        }
      }

      .sub {
        width: 195px;
        height: 45px;
        background: rgba(50, 61, 81, 1);
        border-radius: 5px;
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(95, 88, 96, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
      }

      .active {
        font-size: 22px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        background: rgba(34, 96, 169, 1);
        color: rgba(209, 208, 209, 1);
        display: flex;
        justify-content: center;
        align-items: center;
      }
    }

    .exercise {
      display: flex;
      justify-content: space-between;
      padding: 25px;
      box-sizing: border-box;

      .exerciseTime,
      .usedevice {
        flex: 1;
        display: flex;
        flex-direction: column;

        span {
          font-size: 21px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(151, 154, 169, 1);
          line-height: 24px;
        }

        span:nth-child(3) {
          margin-top: 50px;
        }

        h2 {
          font-size: 26px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: rgba(209, 213, 230, 1);
          line-height: 37px;
        }

        .usedevicebox {
          display: flex;
          padding: 0 20px;
          box-sizing: border-box;
          justify-content: space-between;
          width: 264px;
          height: 66px;
          border-radius: 2px;
          border: 1px solid rgba(117, 121, 137, 1);
          align-items: center;
          margin-top: 10px;
          dl {
            display: flex;
            flex-direction: column;
            height: 100%;
            justify-content: center;
            align-items: center;
          }

          dt {
            font-size: 18px;
          }

          dd {
            margin-top: 5px;
            text-align: center;
            font-size: 18px;
          }
        }
      }
    }
  }

  .bottom {
    width: 480px;
    height: 50px;
    border-radius: 5px;
    font-size: 24px;
    line-height: 50px;
    
    background: rgba(34, 96, 169, 1);
        color: rgba(209, 208, 209, 1);
    margin: 0 auto;
    moz-user-select: -moz-none; 
    -moz-user-select: none; 
    -o-user-select:none; 
    -khtml-user-select:none; 
    -webkit-user-select:none; 
    -ms-user-select:none; 
    user-select:none;
  }

  .wanC {
    display: flex;
    flex-direction: column;
    width: 203px;
    color: rgba(171, 175, 189, 1);
    font-size: 32px;
    margin: 80px auto 120px;

    img {
      width: 203px;
      height: 203px;
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