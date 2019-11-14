<template>
  <div class="live">
    <div class="imgbox">
      <img src="../../assets/image/title.png" alt="">
    </div>
    <div class="live_trajectory">
      <img src="../../assets/image/base@2x.png" alt="">
    </div>
    <div class="live_operation">
      <div class="operation_bcak">BACK</div>
      <div class="operation_time">15:42</div>
      <div class="operation_blue operation_but">START</div>
      <div class="operation_red operation_but">STOP</div>
    </div>
  </div>
</template>
<script>
  export default {
    name: 'Live',
    data() {
      return {

      }
    }
  }
</script>
<style scoped lang="less">
.live{
  width: 100vw;
  min-height: 100vh;
  background: url('../../assets/image/bg.png') no-repeat;
  background-size: 100% 100%;
  .imgbox {
    padding-top: 50px;
  }
  .imgbox img {
    width: 280px;
    height: 64px;
    // margin-bottom: 234px;
  }
  .live_operation{
    display: flex;
    padding-left: 133px;
    align-items:flex-end;
    .operation_bcak{
      width:174px;
      height:75px;
      border:4px solid rgba(234,234,240,1);
      font-size:42px;
      font-family:PingFang-SC-Medium,PingFang-SC;
      font-weight:500;
      color:rgba(234,234,240,1);
      line-height:75px;
      margin-right: 70px;
    }
    .operation_time{
      width:268px;
      height:133px;
      opacity:0.84;
      border:6px solid rgba(131,135,147,1);
      font-size:76px;
      font-family:PingFang-SC-Medium,PingFang-SC;
      font-weight:500;
      color:rgba(209,209,221,1);
      line-height:133px;
      letter-spacing:1px;
      margin-right: 70px;
    }
    .operation_but{
      width:224px;
      height:211px;
      font-size:38px;
      font-family:PingFangSC-Medium,PingFang SC;
      font-weight:500;
      color:rgba(255,255,255,1);
      line-height:211px;
      margin-right: 70px;
    }
    .operation_blue{
      background:rgba(0,216,29,1);
    }
    .operation_red{
      background:rgba(212,27,40,1);
    }
  }
  .live_trajectory{
    padding: 0 130px;
    margin: 100px 0 190px 0;
    img{
      width: 100%;
      height: 396px;
    }
  }
}
</style>