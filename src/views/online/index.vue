<template>
  <div class="wrapbox">
    <div class="title">
      <img src="../../assets/image/title.png" />
    </div>
    <div class="box">
      <img src="../../assets/image/online.png" alt="">
      <p>无网络连接</p>
    </div>
    <div class="btn">
      <span>刷新</span>
      <span>进入访客模式</span>
    </div>
  </div>
</template>
<script>
  export default {

  }
</script>
<style scoped lang="less">
  .wrapbox {
    width: 100vw;
    min-height: 100vh;
    padding: 30px 30px 0;
    box-sizing: border-box;
    background: url("../../assets/image/bg.png") no-repeat left top;
    background-size: cover;
  }

  .title {
    width: 100%;
    text-align: center;

    img {
      width: 280px;
      height: 64px;
    }
  }

  .box {
    margin-top: 200px;

    p {
      font-size: 30px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(234, 238, 248, 1);
      line-height: 42px;
      margin-top: 10px;
      letter-spacing: 3px;
    }
  }

  .btn{
    margin-top: 200px;
    span {
    margin-left:30px;
    height: 50px;
    line-height: 50px;
    font-size: 22px;
    padding: 7px 15px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(156, 160, 177, 1);
    border: 1px solid rgba(156, 160, 177, 1);
  }
  } 
</style>