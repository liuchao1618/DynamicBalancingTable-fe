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
          <div class="check">
            <span>已选：</span>
            <div class="chekbox">
              <div class="checkName" v-for='(item,ind) in checkName'>
                <span>{{item.name}}</span>
                <span @click='del(item)'>×</span>
              </div>
            </div>
          </div>
          <div class="drill">
            <div class="coach">
              <span>教练：</span>
              <!-- <select>
                  <option :value ="item.value" v-for='(item,ind) in option1'>{{item.text}}</option>
                </select> -->
            </div>
            <div class="search">
              <van-search placeholder="请输入运动员姓名" v-model="iptName" />
            </div>
          </div>
          <div class="exerciseName">
            <div class="info" v-for='(item,index) in nameList'>
              <van-checkbox :disabled='item.disabled' v-model="item.checked" shape="square" @click='selectAll(item)'>{{item.name}}</van-checkbox>
            </div>
          </div>
          <div class="sub" :class="[checkName.length>0 ? 'active' : '']">提交
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
        value1:'',
        option1:[
        { text: '王乐乐', value: 0 },
        { text: '赵哈哈', value: 1 },
        { text: '孙嘻嘻', value: 2 }
        ],
        checkName: [],
        iptName:'',
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
        nameList: [
          {
          name: '周怡君',
          checked: false
        }, {
          name: '林辛豪',
          checked: false
        }, {
          name: '蔡修梅',
          checked: false
        }, {
          name: '王心怡',
          checked: false
        }, {
          name: '何冠良',
          checked: false
        }, {
          name: '李筱婷',
          checked: false
        }, {
          name: '林宜月3',
          checked: false
        }, {
          name: '林辛豪3',
          checked: false
        }, {
          name: '蔡修梅3',
          checked: false
        }, {
          name: '王心怡3',
          checked: false
        }, {
          name: '何冠良3',
          checked: false
        }, {
          name: '李筱婷3',
          checked: false
        }, {
          name: '林宜月3',
          checked: false
        }]
      }
    },
    mounted() {

    },
    methods: {
      del(val){
        this.checkName.map((item,ind)=>{
            if (item.name == val.name) {
              this.checkName.splice(ind,1)
            }
          })
          this.nameList.map((item,i)=>{
            if(val.name==item.name){
              item.checked = false
            }
          })
      },
      selectAll(val) {
        // if(this.checkName.length >= 5&&val.checked){
        //   this.nameList.map((item,i)=>{
        //     if(!item.checked){
        //       item.disabled = true
        //     }
        //   })
        // }else{
        if (!val.checked&&this.checkName.length < 5) {
          this.checkName.unshift(val)
        } else {
          this.checkName.map((item,ind)=>{
            if (item.name == val.name) {
              this.checkName.splice(ind,1)
            }
          })
        }

      }
    }
  }
</script>
<style scoped lang="less">
  /deep/.van-checkbox__label {
    color: #D1D5E6
  }
  /deep/.van-field__left-icon{
    margin-left: 10px;

  } 
  /deep/.van-icon .van-icon-search,.van-cell{
    color:#626576!important;
  }
  /deep/.van-search,.van-search__content{
    padding: 0;
    background: transparent!important;
  }
  /deep/.van-field__control{
    color: #D1D5E6!important;
  }
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
      padding: 20px;
      box-sizing: border-box;

      .check {
        display: flex;
        height: 38px;
        align-items: center;
        color: rgba(171, 175, 189, 1);

        .chekbox {
          display: flex;
          flex-wrap: wrap;
          margin-bottom: 10px;
        }

        .checkName {
          margin-right: 20px;
          padding: 0 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          box-sizing: border-box;
          width: 100px;
          height: 38px;
          background: rgba(1, 9, 21, 0.2);
          border-radius: 4px;
          border: 1px solid rgba(146, 150, 174, 1);
        }
      }

      .drill {
        display: flex;
        justify-content: space-between;
        align-items: center;

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
          height: 35px;
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
        height: 82px;
        overflow-y: scroll;
        flex-wrap: wrap;
        background: rgba(33, 36, 41, 0.05);
        border-radius: 4px;
        border: 1px solid rgba(98, 101, 118, 1);

        .info {
          width: 20%;
          display: flex;
          height: 38px;
          padding-left:10px;
          box-sizing:border-box;
          /* justify-content: center; */
          /* align-items: center; */
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