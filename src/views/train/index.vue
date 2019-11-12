<template>
  <div class="train">
    <div class="patternWapper">
      <p>PT模式</p>
      <div class="pattern">
        <div class="pattern_left">
          <p>设置运动时间</p>
          <div class="pattern_content">20分钟</div>
        </div>
        <div v-if="value == 1 || value == 2" class="pattern_center">
          <p>使用设备</p>
          <div class="pattern_content">设备1</div>
        </div>
        <!-- 使用参数  -->
        <div v-if="value==1" class="pattern_right">
          <p>使用参数</p>
          <div class="right_box">
            <div class="box_list">
              <div class="box_num">30</div>
              <div class="box_name">POWER LEFT</div>
            </div>
            <div class="box_list">
              <div class="box_num">25</div>
              <div class="box_name">BOOST </div>
            </div>
            <div class="box_list">
              <div class="box_num">20</div>
              <div class="box_name">POWER RIGHT</div>
            </div>
          </div>
        </div>
        <!-- 使用运动等级  -->
        <div v-if="value==2" class="pattern_right">
          <p>使用运动等级</p>
          <div class="pattern_content">FUNTIONAL1 L1</div>
        </div>
        <!-- 操控点轨迹记录 -->
        <div v-if="value==3" class="pattern_right">
          <p>使用运动等级</p>
          <div class="pattern_content">FUNTIONAL1 L1</div>
        </div>
      </div>
    </div>
    <div class="timerWapper">
      <div class="time_title">TIMER</div>
      <div class="time_num">15:42</div>
    </div>
    <div class="buttonWapper">
      <div class="but_blue but">START</div>
      <div class="but_red but">STOP</div>
      <div></div>
    </div>
  </div>
</template>

<script>
import { Dialog } from 'vant'
  export default {
    name: 'Train',
    data () {
      return{
        value: 2
      }
    },
    mounted () {
      Dialog.confirm({
        message: '确定使用本次设置进行训练？'
      }).then(() => {
      }).catch(() => {
      });
    }
  }
</script>

<style scoped lang="less">
.train{
  width: 100vw;
  min-height: 100vh;
  background: url(/static/img/bg.02a4e64.png) no-repeat;
  background-size: 100% 100%;
  overflow: hidden;
  .patternWapper{
    width:94%;
    margin: 0 auto;
    margin-top: 148px;
    p{
      color: #B8BBC6;
      text-align: left;
      line-height: 36px;
      font-size: 24px;
    }
    .pattern{
      height:204px;
      margin: 0 auto;
      display: flex;
      justify-content: space-between;
      padding: 80px 160px 0;
      text-align: center;
      background:rgba(254,252,255,0.03);
      border-radius:5px;
      border:1px solid rgba(98,101,118,1);
      .pattern_content{
        font-size: 36px;
        line-height: 92px;
        color: #E4E7F6;
      }
      .right_box{
        width:318px;
        height:77px;
        margin-top: 20px;
        padding: 8px 6px;
        display: flex;
        justify-content: space-between;
        border-radius:2px;
        border:1px solid rgba(117,121,137,1);
        .box_num{
          color: #E4E7F6;
          font-size: 32px;
          line-height: 45px;
        }
        .box_name{
          color: #B7BAC8;
          font-size: 14px;
          line-height: 20px;
        }
      }
    }
  }
  .timerWapper{
    width: 30%;
    display: flex;
    margin: 0 auto;
    margin-top: 80px;
    .time_title{
      color: #C4C8D0;
      line-height: 133px;
      font-size: 30px;
      margin-right: 45px;
    }
    .time_num{
      width:268px;
      height:133px;
      opacity:0.84;
      border:4px solid rgba(131,135,147,1);
      color: #D1D1DD;
      font-size: 76px;
      line-height: 133px;
    }
  }
  .buttonWapper{
    width: 40%;
    margin: 0 auto;
    margin-top: 100px;
    display: flex;
    justify-content: space-around;
    .but{
      width:224px;
      height:211px;
      color: #FFF;
      font-size: 38px;
      line-height: 211px;
    }
    .but_blue{
      background:rgba(0,216,29,1);
    }
    .but_red{
      background:rgba(212,27,40,1);
    }
  }
}
</style>

<style lang="less">

  .van-dialog{
    width:649px;
    height:376px;
    background:rgba(55,56,57,1);
    border-radius:12px;
    border:1px solid rgba(70,67,72,1);
  }
  .van-hairline--top::after{border: 0}
  .van-dialog__message{
    padding: 118px 159px 110px;
    text-align: center;
    color:#BABAC6;
    font-size: 25px;
  }
  .van-button{
    width:56px;
    height:68px;
    background: none;
    color: #D1D0D1;
  }
  .van-button__text{
    display: block;
    width: 206px;
    height: 68px;
    line-height: 68px;
    text-align: center;
    background:rgba(34,134,169,1);
    margin: 0 auto;
    font-size: 24px;
    border-radius:5px;
  }
  .van-dialog__cancel{
    .van-button__text{
      height: 66px;
      background: none !important;
      border:1px solid rgba(134,147,159,1);
      box-shadow:0px 1px 3px 0px rgba(110,110,115,1);
    }
  }
  [class*=van-hairline]::after{border: 0}
</style>
