<template>
  <div class="box">
      <!-- 蓝牙加载状态 -->
      <div v-if='status === "fail"' class='loading'>
          <img class='loadingImg' src="./image/title.png" alt="">
          <div v-if='statusContent === 0' class='load-loading'>
               <div class='img'>
                   <img src="./image/bluetooth.png" alt="">蓝牙未开启
                </div>
                <div class='text'>移动设备蓝牙未开启，请先将蓝牙设置为开启</div>
          </div>
          <div v-if='statusContent === 1' class='load-loading'>
              <div class='img'>
                  <van-loading size="50px" color="#2CD781" class='van-landing'/>正在建立通信
              </div>
          </div>
          <div v-if='statusContent === 2' class=load-loading>
              <div class='img'>
                  <img src="./image/none.png" alt="">未发现可用设备
              </div>
              <div class='load-button'>重新搜索</div>
          </div>
          <div v-if='statusContent === 3' class='load-loading'>
               <div class='img'>
                   <img src="./image/right.png" alt="">设备已链接
                </div>
          </div>
      </div>
      <!-- 页面内容 -->
      <div v-if='status === "success"' class="home">
          <div class="title">
              <img src="./image/title.png"/>
          </div>
          <!-- tab条 -->
          <div class="tabList">
              <div class="tabLeft">
                  <div class="tab" :class="{'tabActive': tab === 0}" @click="tabBtn(0)">训练</div>
                  <div class="tab" :class="{'tabActive': tab === 1}" @click="tabBtn(1)">记录</div>
                  <div class="tab" :class="{'tabActive': tab === 2}" @click="tabBtn(2)">收藏</div>
                  <div class="tab" :class="{'tabActive': tab === 3}" @click="tabBtn(3)">我的运动员</div>
              </div>
              <div class="tabRight">
                  <div class="name">教练：张天天</div>
                  <div class="setup">
                      <img @click="setup = !setup" src="./image/setup.png"/>
                      <div class="setupList" v-if='setup'>
                          <div class='setupItem'>修改密码</div>
                          <div class='setupItem'>退出登录</div>
                          <div class='setupItem'>自动登录 <van-switch class='switch' size='24px' v-model="loginSwitch" active-color="#07c160" inactive-color="#4E4F50"></van-switch></div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- 训练 -->
          <div v-if='tab === 0' class="menu">
              <div class="menuLeft">
                 <div class="menuItem" v-for='(item,index) in menuList' :key='index'>
                    <img :src="item.img"/>
                    <div class="menuText">{{ item.text }}</div>
                 </div>
              </div>
              <div class="menuRight">
                  <div class='rightItem' v-for='(item,index) in list' :key='index' v-html='item.text' :style='{"background-color": item.color}'></div>
              </div>
          </div>
          <!-- 记录 -->
          <div v-if='tab === 1' class='list'>
              <div class='item'>
                  <div class='itemTitle'>2019-10-09 00:43:19 PT模式 DEMO模式 LIVE模式</div>
                  <div class='itemCon'>
                      <div class='con'>
                          <div class='name'>设置运动时间</div>
                          <div class='time'>14分钟</div>
                          <div class='name'>实际运动时间</div>
                          <div class='time'>9分钟</div>
                      </div>
                      <div class='con'>
                          <div class='name'>本次使用设备</div>
                          <div class='time'>设备1</div>
                          <div class='name'>本次使用运动等级</div>
                          <div class='time'>FUNTIONAL1 L1</div>
                      </div>
                      <div class='con'>
                          <div class='name'>参与本次训练运动员</div>
                          <!-- PT模式 DEMO模式 -->
                          <div class='time'>张晓晓、张明明</div>
                          <!-- PT模式 -->
                          <div class='name'>本次使用参数</div>
                          <div class='detail'>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                          </div>
                          <!-- LIVE模式 -->
                          <!-- <img class='img' src="./image/line.png" alt=""> -->
                      </div>
                      <div class='conCollect'>
                          <!-- <img src="./image/star.png" alt=""> -->
                          <img src="./image/starS.png" alt="">
                      </div>
                  </div>
              </div>
          </div>
          <!-- 收藏 -->
          <div v-if='tab === 2' class='list'>
              <div class='item'>
                  <div class='itemTitle'>2019-10-09 00:43:19 PT模式 DEMO模式 LIVE模式</div>
                  <div class='itemCon'>
                      <div class='con'>
                          <div class='name'>设置运动时间</div>
                          <div class='time'>14分钟</div>
                          <div class='name'>实际运动时间</div>
                          <div class='time'>9分钟</div>
                      </div>
                      <div class='con'>
                          <div class='name'>本次使用设备</div>
                          <div class='time'>设备1</div>
                          <div class='name'>本次使用运动等级</div>
                          <div class='time'>FUNTIONAL1 L1</div>
                      </div>
                      <div class='con'>
                          <div class='name'>参与本次训练运动员</div>
                          <!-- PT模式 DEMO模式 -->
                          <div class='time'>张晓晓、张明明</div>
                          <!-- PT模式 -->
                          <div class='name'>本次使用参数</div>
                          <div class='detail'>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                              <div class='detailItem'>
                                  <div class='detailUp'>30</div>
                                  <div class='detailDown'>POWER LEFT</div>
                              </div>
                          </div>
                          <!-- LIVE模式 -->
                          <!-- <img class='img' src="./image/line.png" alt=""> -->
                      </div>
                      <div class='conCollect'>
                          <!-- <img src="./image/star.png" alt=""> -->
                          <img src="./image/starS.png" alt="">
                          <div class='conTrain'>使用本次设置进行训练<img src="./image/right-arrow.png" alt=""></div>
                      </div>
                  </div>
              </div>
          </div>
          <!-- 我的运动员 -->
          <div v-if='tab === 3' class='myAthletes'>
                <van-row class='myHead'>
                    <van-col span='2' class="headItem">姓名</van-col>
                    <van-col span='2' class='headItem'>性别</van-col>
                    <van-col span='3' class='headItem'>出生日期</van-col>
                    <van-col span='3' class='headItem'>身高(cm)</van-col>
                    <van-col span='3' class='headItem'>体重(kg)</van-col>
                    <van-col span='5' class='headItem'>联系方式</van-col>
                    <van-col span='6' class='headItem'>操作</van-col>
                </van-row>
                <van-row class='myTd myHead'>
                    <van-col span='2' class='headItem'>张晓晓</van-col>
                    <van-col span='2' class='headItem'>男</van-col>
                    <van-col span='3' class='headItem'>1998-09-21</van-col>
                    <van-col span='3' class='headItem'>190</van-col>
                    <van-col span='3' class='headItem'>78</van-col>
                    <van-col span='5' class='headItem'>13688932223</van-col>
                    <van-col span='6' class='headItem'><span class='myTdColor'>编辑</span> <span class='myTdColor'>查看运动记录</span></van-col>
                </van-row>
          </div>
      </div>
      <!-- login组件 -->
      <login v-if='loginFlag'></login>
  </div>
</template>

<script>
import login from './components/login'
export default {
  name: 'home',
  components: {
      login
  },
  data () {
    return {
        tab: 3,
        loginFlag: false,
        setup: false,
        loginSwitch: false,
        // status: 'fail',
        status: 'success',
        statusContent: 0,
        menuList: [
            {
            img: require('./image/banner1.png'),
            text: 'FUNTIONAL 1 L1'
            },
            {
            img: require('./image/banner2.png'),
            text: 'FUNTIONAL 2 L1'
            },
            {
            img: require('./image/banner3.png'),
            text: 'FUNTIONAL 3 L1'
            }
        ],
        list: [
            {
                color: '#55D295',
                text: 'FUNTIONAL 1 <br/>L2'
            },
            {
                color: '#72C840',
                text: 'FUNTIONAL 1 <br/>L3'
            },
            {
                color: '#7853EA',
                text: 'FUNTIONAL 1 <br/>L4'
            },
            {
                color: '#D3C143',
                text: 'FUNTIONAL 1 <br/>L5'
            },
            {
                color: '#EB9D3A',
                text: 'FUNTIONAL 2 <br/>L2'
            },
            {
                color: '#38947E',
                text: 'FUNTIONAL 2 <br/>L3'
            },
            {
                color: '#489696',
                text: 'FUNTIONAL 2 <br/>L4'
            },
            {
                color: '#3387D6',
                text: 'FUNTIONAL 2 <br/>L5'
            },
            {
                color: '#58CFDC',
                text: 'FUNTIONAL 3 <br/>L2'
            },
            {
                color: '#4CD697',
                text: 'FUNTIONAL 3 <br/>L3'
            },
            {
                color: '#D7C641',
                text: 'FUNTIONAL 3 <br/>L4'
            },
            {
                color: '#5DB035',
                text: 'PT'
            }
        ]
    }
  },
  methods: {
        tabBtn (index) {
            this.tab = index
        },
  }
}
</script>

<style scoped lang="less">
.box{
    width: 100vw;
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
    background: url("./image/bg.png") no-repeat left top;
    background-size: cover;
    .loading{
        padding-top: 197px;
        .loadingImg{
            width: 380px;
            height: 100px;
            margin-bottom: 243px;
        }
        .load-loading{
            text-align: center;
            .img{
                height: 50px;
                color: #EAEEF8;
                font-size: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                margin-bottom: 178px;
                .van-landing{
                    width: 50px;
                    height: 50px;
                    margin-right: 45px;
                }
                img{
                    width: 50px;
                    height: 50px;
                    margin-right: 45px;
                }
            }
            .text{
                color: #9CA0B1;
                font-size: 24px;
            }
            .load-button{
                margin: 0 auto;
                border: 1px solid #9CA0B1;
                color: #9CA0B1;
                width: 143px;
                height: 50px;
                font-size: 22px;
                text-align: center;
                line-height: 50px;
            }
        }
    }
    .home{
        .title{
            width: 100%;
            text-align: center;
            img{
                width: 280px;
                height: 64px;
            }
        }
        .tabList{
            width: 100%;
            display: flex;
            justify-content: space-between;
            .tabLeft{
                display: flex;
                .tab{
                    padding: 0 50px;
                    font-size:34px;
                    color: #868A9A;
                    text-align: center;
                    line-height: 50px;
                    height: 70px;
                }
                .tabActive{
                    color: #fff;
                    background: url("./image/tab.png") no-repeat left bottom;
                    background-size: contain;
                }
            }
            .tabRight{
                display: flex;
                .name{
                    margin-right: 22px;
                    color: #B7BCCA;
                    font-weight: 500;
                    font-size: 28px;
                    line-height: 45px;
                }
                .setup{
                    position: relative;
                    img{
                        width: 45px;
                        height: 45px;
                    }
                    .setupList{
                        position: absolute;
                        bottom: -282px;
                        left: -200px;
                        width: 245px;
                        height: 255px;
                        z-index: 3;
                        background-color: #373839;
                        border: 1px solid #464348;
                        border-radius: 10px;
                        .setupItem{
                            color: #D1D5E6;
                            font-size: 26px;
                            height: 85px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            border-bottom: 1px solid #404350;
                            line-height: 85px;
                            text-align: center;
                            .switch{
                                margin-left: 16px;
                            }
                        }
                    }
                }
            }
        }
        .menu{
            display: flex;
            margin-right: 53px;
            padding-top: 40px;
            .menuLeft{
                .menuItem{
                    width: 560px;
                    height: 262px;
                    margin-bottom: 50px;
                    position: relative;
                    img{
                        position: absolute;
                        width: 100%;
                        height: 100%;
                        left: 0;
                        top: 0;
                        z-index: 1;
                    }
                    .menuText{
                        position: absolute;
                        left: 30px;
                        bottom: 24px;
                        color: #FFFFFF;
                        font-size: 26px;
                        font-weight: 500;
                        z-index: 2;
                    }
                }
            }
            .menuRight{
                display: flex;
                flex-wrap: wrap;
                width: 1171px;
                margin-left: 40px;
                .rightItem{
                    width: 262px;
                    height: 262px;
                    text-align: center;
                    font-size:26px;
                    font-weight:500;
                    padding-top: 98px;
                    box-sizing: border-box;
                    color: #fff;
                    line-height: 37px;
                    margin: 0 41px 50px 0;
                }
            }
        }
        .list{
            margin-top: 30px;
            width: 100%;
            .item{
                .itemTitle{
                    color: #B8BBC6;
                    font-size: 18px;
                    margin-bottom: 10px;
                    text-align: left;
                }
                .itemCon{
                    display: flex;
                    justify-content: space-between;
                    width: 100%;
                    height: 235px;
                    box-sizing: border-box;
                    padding: 40px;
                    border: 1px solid #626576;
                    border-radius: 5px;
                    .con{
                        .name{
                            color: #979AA9;
                            font-size: 17px;
                            text-align: left;
                            margin-bottom: 10px;
                        }
                        .time{
                            color: #D1D5E6;
                            font-size: 26px;
                            text-align: left;
                            margin-bottom: 32px;
                        }
                        .detail{
                            display: flex;
                            box-sizing: border-box;
                            width: 264px;
                            height: 66px;
                            border: 1px solid #757989;
                            border-radius: 2px;
                            justify-content: space-around;
                            align-items: center;
                            .detailItem{
                                .detailUp{
                                    color: #D1D5E6;
                                    font-size: 24px;
                                    margin-bottom: 5px;
                                }
                                .detailDown{
                                    color: #B7BAC8;
                                    font-size: 10px;
                                }
                            }
                        }
                        .img{
                            width: 264px;
                            height: 150px;
                            border: 1px solid #626576;
                            border-radius: 5px;
                        }
                    }
                    .conCollect{
                        display: flex;
                        flex-direction: column;
                        justify-content: space-between;
                        align-items: flex-end;
                        img{
                            width: 35px;
                            height: 35px;
                        }
                        .conTrain{
                            display: flex;
                            align-items: center;
                            color: #B1B4C0;
                            font-size: 21px;
                            // margin-bottom: 40px;
                            img{
                                width: 24px;
                                height: 24px;
                            }
                        }
                    }
                }
            }
        }
        .myAthletes{
            margin-top: 30px;
            width: 100%;
            .myHead{
                // background-color: #FEFCFF;
                border: 1px solid #404350;
                color: #ABAFBD;
                font-size: 24px;
                line-height: 50px;
                .headItem{
                    height: 75px;
                    line-height: 75px;
                    text-align: center;
                }
            }
            .myTd{
                line-height: 40px;
                border: 1px solid #404350;
                border-top: 0;
                .myTdColor{
                    color: #D1D5E6;
                }
            }
        }
    }
}
</style>
