<template>
    <div class='addAthletes'>
        <back-header title='运动员信息'></back-header>
        <div class='item' @click="toDetail(1)">
            <div class='itemLeft'>*姓名</div>
            <div class='itemRight'>{{ athletes.name ? athletes.name : '请填写您的姓名 >' }}</div>
        </div>
        <div class='item' @click="toDetail(2)">
            <div class='itemLeft'>*联系方式</div>
            <div class='itemRight'>{{ athletes.tel ? athletes.tel : '请填写您的手机号 >' }}</div>
        </div>
        <div class='item' @click="show = true">
            <div class='itemLeft'>性别</div>
            <div class='itemRight'>{{ athletes.sex ? athletes.sex : '请选择性别 >' }}</div>
        </div>
        <div class='item'>
            <div class='itemLeft'>出生日期</div>
            <div class='itemRight'>{{ athletes.birth ? athletes.birth : '请选择您的出生日期 >' }}</div>
        </div>
        <div class='item' @click="toDetail(5)">
            <div class='itemLeft'>身高（cm）</div>
            <div class='itemRight'>{{ athletes.height ? athletes.height : '请填写您的身高 >' }}</div>
        </div>
        <div class='item' @click="toDetail(6)">
            <div class='itemLeft'>体重（kg）</div>
            <div class='itemRight'>{{ athletes.weight ? athletes.weight : '请填写您的体重 >' }}</div>
        </div>
        <div class='itemNo'>标*项为必填项，填写的手机号将作为运动员的账号使用</div>
        <div class='buttonBox'>
            <van-button type="primary" class='button mgr'>取消</van-button>
            <van-button type="primary" class='button'>保存</van-button>
        </div>
        <van-popup v-model="show">
            <div class='sex'>
                <div class='sexItem' @click="sexBtn(1)">
                    <div>男</div>
                    <img v-if='sex === 1' src="./image/right.png" alt="">
                </div>
                <div class='sexItem' @click="sexBtn(2)">
                    <div>女</div>
                    <img v-if='sex === 2' src="./image/right.png" alt="">
                </div>
            </div>
        </van-popup>
    </div>
</template>

<script>
import backHeader from '@/components/backHeader'
import { mapState } from 'vuex'
export default {
    name: 'addAthletes',
    components: {
        backHeader
    },
    computed:{
        ...mapState([ 
            'athletes'
        ])
    },
    data(){
        return {
            show: false,
            sex: 1,
        }
    },
    methods: {
        toDetail(index){
            this.$router.push({name: 'athletesDetail', params: {index: index}})
        },
        sexBtn(index){
            this.sex = index
            this.$store.dispatch('setAthletes', {index: 3, sex: index === 1 ? '男' : '女'})
            let that = this
            setTimeout(()=>{
                that.show = false
            }, 500)
        },
        sexBtnSwitch(){

        }
    }
}
</script>

<style lang="less" scoped>
.addAthletes{
    width: 100vw;
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
    background: url("../home/image/bg.png") no-repeat left top;
    background-size: cover;
    .item{
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 93px;
        padding: 0 10px;
        font-size: 24px;
        border-bottom: 1px solid #4E4F54;
        .itemLeft{
            color: #D1D1D6;
        }
        .itemRight{
            color: #868693;
        }
    }
    .itemNo{
        font-size:19px;
        color: #99999E;
        line-height: 46px;
        text-align: left;
    }
    .buttonBox{
        margin-top: 100px;
        display: flex;
        justify-content: center;
        .button{
            width: 550px;
            height: 68px;
            font-size: 24px;
            border-radius: 5px;
        }
        .mgr{
            margin-right: 30px;
            &.van-button--primary{
                background-color: transparent;
                border-color: #68696A;
            }
        }
        .van-button--primary{
            background-color: #2286A9;
            border-color: #2286A9;
        }
    }
    .sex{
        width: 576px;
        height: 222px;
        border-radius: 12px;
        background-color: #373839;
        border: 1px solid #464348;
        box-sizing: border-box;
        padding: 50px 90px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .sexItem{
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 42px;
            div{
                font-size: 28px;
                color: #BDBDC5;
            }
            img{
                width: 42px;
                height: 42px;
            }
        }
    }
    .van-popup{
        border-radius: 12px;
    }
}
</style>

