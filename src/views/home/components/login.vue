<template>
    <div class='login' @click.stop=''>
        <div class='content'>
            <div class='title'>登录</div>
            <div class='input'>
                <van-cell-group class='mgb35'>
                    <van-field ref="field" @focus="telFocus" @blur="telBlur" type="tel" v-model="tel" placeholder="请输入手机号">
                    </van-field>
                    <div class="tel_Wrapper" v-if="telFlag">
                        <div class="tel_box"  v-for="(item, index) of oldTel" :key="item.id">
                            <p @click="oldTelClick(item.tel)">{{item.tel}}</p>
                            <p @click="deleteTel(index)">×</p>
                        </div>
                    </div>
                </van-cell-group>
                <van-cell-group class='mgb60'>
                    <van-field type="password" v-model="pwd" placeholder="请输入密码" />
                </van-cell-group>
                <van-button type="primary" :disabled='flag' class='button mgb20' size="large">登录</van-button>
                <van-button class='cancel' type="default">取消</van-button>
            </div>
        </div>
    </div>
</template>
<script>
export default {
    name: 'login',
    data(){
        return {
            tel: '',
            pwd: '',
            flag: true,
            telFlag: false,
            oldTel: [{
                tel: 18401744592,
                id: 0
            },
            {
                tel: 16498503992,
                id: 1
            },
            {
                tel: 15945400002,
                id: 2
            },
            {
                tel: 13845400430,
                id: 3
            },
            {
                tel: 13845467001,
                id: 4
            },
            {
                tel: 13645467885,
                id: 5
            }]
        }
    },
    // mounted () {
    //     this.$refs.field.blur(() => {
    //         this.telFlag = true
    //         console.log('5555555555')
    //     })
    // },
    methods:{
        checkTel(newVal){
            let tips = '';
            let reg = /^1[3456789]\d{9}$/;
            if(newVal == undefined){
              tips = '请输入正确手机号';
            } else if (newVal.length > 11) {
              this.tel = newVal.substring(0, 11);
              return true
            } else if (!reg.test(newVal)) {
              tips = '请输入正确手机号';
            } else if(reg.test(newVal)){
            //   this.error = tips;
              return true
            }
            // this.error = tips;
            return false
        },
        //校验密码
        checkPassWord(val) {//必须为字母加数字且长度不小于8位
            let str = val;
            if (str.length < 6 || str.length > 20) {
              // this.error = '请输入6-20位英文和数字或下划线的组合';
              return false;
            }
            let reg1 = new RegExp(/^[0-9A-Za-z]+$/);
            let reg2 = new RegExp(/^[0-9]+$/);
            let reg3 = new RegExp(/^[A-Za-z]+$/);
            if (!reg1.test(str)) {
              return false;
            } else if (reg2.test(str)) {
              return true;
            } else if (reg3.test(str)) {
              return true;
            }
            let reg = new RegExp(/[a-zA-Z0-9_]{6,20}/);
            if (reg.test(str)) {
              return true;
            } else {
              // this.error = '请输入6-20位英文和数字或下划线的组合';
              return false;
            }
        },
        // 点击输入手机号码获取焦点
        telFocus () {
            if (this.oldTel.length > 0) {
                this.telFlag = true
            }
        }, 
        // 失去焦点
        telBlur () {
            let that = this
            setTimeout(function(){
                that.telFlag = false
                console.log('1111111111')
            }, 10)
            // console.log('1111111111')
        },
        // 点击历史手机号码
        oldTelClick (val) {
            if (val) {
                this.tel = val
                this.telFlag = false
            } else {
                this.telFlag = false
            }
        },
        // 删除历史手机号
        deleteTel (index) {
            this.oldTel.splice(index,1)
        }
    }
}
</script>

<style lang="less" scoped>
.login{
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 5;
    position: fixed;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, .1);
    .content{
        width: 737px;
        border: 1px solid #464348;
        height: 520px;
        background-color: #373839;
        border-radius: 12px;
        .title{
            border-radius: 12px 12px 0 0;
            height: 76px;
            line-height: 76px;
            text-align: center;
            color: #C8CACD;
            font-size: 28px;
            background: linear-gradient(180deg,#444244 0%,#282A2D 100%);
            box-shadow:0px 2px 4px 0px #282A2D;
        }
        .input{
            padding: 64px 93px 0 93px;
            /deep/ .van-cell-group{
                background-color: #454444;
                border-radius: 5px;
            }
            /deep/ .van-cell{
                background-color: #454444;
                border-radius: 5px;
            }
            .mgb35{
                margin-bottom: 35px;
                position: relative;
            }
            .mgb60{
                margin-bottom: 60px;
            }
            .mgb20{
                margin-bottom: 20px;
            }
            /deep/ .van-button--primary{
                background-color: #324951;
                border: 1px solid #324951;
            }
            /deep/ .van-button--default{
                color: #D1D0D1;
                background-color: #373839;
                border: 1px solid #373839;
            }
        }
        .tel_Wrapper{
            position: absolute;
            width:550px;
            height:134px;
            background:rgba(69,68,68,1);
            box-shadow:0px -1px 0px 0px rgba(88,86,93,1);
            border-radius:5px;
            z-index: 100;
            font-size:22px;
            line-height: 40px;
            color:rgba(141,141,148,1);
            overflow: auto;
        }
        .tel_box{
            display: flex;
            padding: 0 30px;
            justify-content: space-between;
        }
    }
}
</style>


