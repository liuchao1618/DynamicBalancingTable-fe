<template>
    <div class="httpError">
        <img class='titleImg' src="./image/title.png"/>
        <img class='errorImg' src="./image/error.png"/>
        <div class='text'>无网络连接</div>
        <div class='buttonBox'>
            <van-button class='cancel' type="default">取消</van-button>
            <van-button type="default">进入访客模式</van-button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'httpError'
}
</script>

<style lang="less" scoped>
.httpError{
    width: 100vw;
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
    background: url("./image/bg.png") no-repeat left top;
    background-size: cover;
    .titleImg{
        margin: 0 auto;
        width: 280px;
        height: 64px;
        margin-bottom: 272px;
    }
    .errorImg{
        margin: 0 auto;
        width: 140px;
        height: 140px;
        display: block;
        margin-bottom: 42px;
    }
    .text{
        font-size: 30px;
        color: #EAEEF8;
        text-align: center;
        margin-bottom: 217px;
    }
    .buttonBox{
        .cancel{
            margin-right: 20px;
        }
        /deep/ .van-button--default{
            color: #9CA0B1;
            background-color: transparent;
            border: 1px solid #9CA0B1;
        }
    }
}
</style>
