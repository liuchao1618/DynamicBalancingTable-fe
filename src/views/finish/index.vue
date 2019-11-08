<template>
  <div class="chooseWrap">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="wanC">
      <img src="../../assets/image/finish.png" alt="">
      <span>完成</span>
    </div>
    <div class="box">
      <div class="left">
        <h3>2019-10-09 00:43:19 PT模式</h3>
        <div class="exercise">
          <div class="exerciseTime">
            <span>设置运动时间</span>
            <h2>14分钟</h2>
            <span>实际运动时间</span>
            <h2>8分钟</h2>
          </div>
          <div class="usedevice">
            <span>本次使用设备</span>
            <h2>设备1</h2>
            <span>本次使用参数</span>
            <div class="usedevicebox">
              <dl v-for='(item,index) in dataList'>
                <dt>{{item.num}}</dt>
                <dd>{{item.word}}</dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
      <div class="right">
        <h3>参与本次训练的运动员</h3>
        <div class="exercises">
          <div class="drill">
            <div class="coach">
              <span>教练：</span>
              <!-- <select name="" id="">
                <option value="">张天天</option>
              </select> -->
            </div>
            <div class="search">
              <span></span>
              <input type="text" placeholder="请输入运动员姓名">
            </div>
          </div>
          <div class="exerciseName">
            <div class="info" v-for='(item,index) in nameList'>
              <input type="checkbox" @click='selectAll($event)'>
              <span>{{item}}</span>
            </div>
          </div>
          <div class="sub" :class="[flag ? 'active' : '']">提交
          </div>
        </div>
      </div>
    </div>
    <div class="bottom">
      回到训练页
    </div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        flag:false,//提交按钮是否置灰
        dataList: [{
          num: 30,
          word: 'POWER LEFT'
        }, {
          num: 25,
          word: 'BOOST'
        }, {
          num: 30,
          word: 'POWER RIGHT'
        }],
        nameList: ['周怡君', '林辛豪', '蔡修梅', '王心怡', '何冠良', '李筱婷', '林宜月', '宋浩', '林燕', '郭佳慧', '周怡君', '林辛豪', '蔡修梅', '王心怡']
      }
    },
    mounted() {
      
    },
    methods: {
      selectAll(e){
        if(e.target.checked){ 
          this.flag = true
        }else{
          this.flag =false
        }
      }
    }
  }
</script>
<style scoped lang="less">
  .box {
    display: flex;
    justify-content: space-between;
    width: 90%;
    margin: 0 auto;

    h3 {
      color: rgba(184, 187, 198, 1);
      font-size: 18px;
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
    .exercises {
      height: 250px;
      background: rgba(254, 252, 255, 0.03);
      border-radius: 5px;
      border: 1px solid rgba(98, 101, 118, 1);
      color: rgba(209, 213, 230, 1);
    }

    .exercises {
      padding: 25px;
      box-sizing: border-box;

      .drill {
        display: flex;
        justify-content: space-between;

        .coach {
          span {
            font-size: 18px;
            font-family: PingFangSC-Regular, PingFang SC;
            font-weight: 400;
            color: rgba(171, 175, 189, 1);
            line-height: 25px;
          }
        }

        .search {
          width: 204px;
          height: 38px;
          border-radius: 4px;
          border: 1px solid rgba(98, 101, 118, 1);

          input {
            border: 0;
            line-height: 38px;
            padding: 0 10px;
            box-sizing: border-box;
            background: transparent;
            color: rgba(85, 88, 103, 1);
          }
        }
      }

      .exerciseName {
        margin: 10px 0;
        display: flex;
        overflow-y: auto;
        height: 109px;
        flex-wrap: wrap;
        background: rgba(33, 36, 41, 0.05);
        border-radius: 4px;
        border: 1px solid rgba(98, 101, 118, 1);

        .info {
          width: 20%;
          height: 50px;
          display: flex;
          justify-content: center;
          align-items: center;

          input[type=checkbox] {
            width: 21px;
            height: 21px;
            border-radius: 3px;
            border: 1px solid rgba(117, 121, 137, 1);
          }
        }
      }

      .sub {
        width: 195px;
        height: 35px;
        background: rgba(50, 61, 81, 1);
        border-radius: 5px;
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        color: rgba(95, 88, 96, 1);
        display: flex;
        justify-content: center;
        align-items: center;
        margin: 0 auto;
      }

      .active {
        background: rgba(34, 96, 169, 1);
        font-size: 18px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(209, 208, 209, 1);
        line-height: 25px;
      }
    }

    .exercise {
      display: flex;
      justify-content: space-between;
      padding: 25px;
      box-sizing: border-box;

      .exerciseTime,
      .usedevice {
        display: flex;
        flex-direction: column;

        span {
          font-size: 17px;
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
          justify-content: space-between;
          width: 264px;
          height: 66px;
          border-radius: 2px;
          border: 1px solid rgba(117, 121, 137, 1);
          align-items: center;

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
            text-align: center;
            font-size: 8px;
            -webkit-text-size-adjust: none;
          }
        }
      }
    }
  }

  .bottom {
    width: 480px;
    height: 48px;
    border-radius: 5px;
    font-size: 22px;
    line-height: 48px;
    color: rgba(152, 151, 164, 1);
    margin: 0 auto;
    border: 1px solid rgba(99, 107, 114, 1);
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