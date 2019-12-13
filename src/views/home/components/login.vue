<template>
    <div class='login' @click.stop=''>
        <div class='content'>
            <div class='title'>登录</div>
            <div class='input'>
                <van-cell-group class='mgb35'>
                    <van-field ref="field" @focus="telFocus" @blur="telBlur" type="tel" v-model="tel"
                        placeholder="请输入手机号">
                    </van-field>
                    <div class="tel_Wrapper" v-if="telFlag">
                        <div class="tel_box" v-for="(item, index) of oldTel" :key="index">
                            <p @click="oldTelClick(item)">{{item}}</p>
                            <p @click="deleteTel(index)">×</p>
                        </div>
                    </div>
                </van-cell-group>
                <van-cell-group class='mgb60'>
                    <van-field type="password" v-model="pwd" placeholder="请输入密码" />
                </van-cell-group>
                <p class="loginBth" @click='login'>登录</p>
                <p class="cancelBth" @click='cancel'>取消</p>
                <!-- <van-button type="warning" :disabled='flag' class='mgb20' size="large">登录
                </van-button>
                <van-button type="danger" class='cancel'>取消</van-button> -->
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import { login, memberExercise,exitLogin, phoneList, loginMsg, addPhoneList, delPhoneList } from '@/api/index'
    export default {
        name: 'login',
        data() {
            return {
                tel: '154545454152',
                pwd: '123456',
                flag: true,
                telFlag: false,
                oldTel: []
            }
        },
        mounted() {
            this.getphoneList()
            // this.$refs.field.blur(() => {
            //     this.telFlag = true
            //     console.log('5555555555')
            // })
        },
        // computed: mapState([
        //     // 映射 this.loginflag 为 store.state.loginflag
        //     'loginflag',
        //     'login',
        //     'loginName'
        // ]),
        methods: {
            getData(){
                let data = {
                    userCode: window.localStorage.getItem('userCode')
                }
                memberExercise(data).then((res) => {
                    this.recordList = res.data.data;
                    this.collectList = [];
                    res.data.data.forEach((item, i) => {
                        if (item.favored) {
                            this.collectList.push(item)
                        }
                    })
                })
            },
            getphoneList() {
                let data = {
                    padCode: 'asdf526asdf'
                }
                phoneList(data).then((res) => {
                    this.oldTel = res.data.data.mobileList
                })
            },
            cancel() {
                this.$store.dispatch('setLoginflag', { loginflag: false, login: false,index:1 })
            },
            login() {
                let data = {
                    username: this.tel,
                    password: this.pwd
                }
                login(data).then((res) => {
                    if (res.data.code == 200) {
                        let data1 = {
                            padCode: 'asdf526asdf',
                            mobile: this.tel
                        }
                        window.localStorage.setItem('modle', 'PT')
                        // this.getData()
                        addPhoneList(data1)
                        loginMsg().then((res) => {
                            if(res.data.data.parent == null){
                            this.$store.dispatch('setLoginflag', { identity: 'coach' })
                            window.localStorage.setItem('username', res.data.data.username)
                            }else{
                            window.localStorage.setItem('username', res.data.data.parent.username)
                            this.$store.dispatch('setLoginflag', { identity: 'athlete' })

                            }
                            window.localStorage.setItem('userCode', res.data.data.userCode)
                            this.$store.dispatch('setLoginflag', { loginName: res.data.data.username,loginflag: false, login: true,index:1 })
                        })
                    }else{
                        this.$toast({
                            message: res.data.msg,
                            position: 'bottom'
                        });
                    }
                })
            },
            checkTel(newVal) {
                let tips = '';
                let reg = /^1[3456789]\d{9}$/;
                if (newVal == undefined) {
                    tips = '请输入正确手机号';
                } else if (newVal.length > 11) {
                    this.tel = newVal.substring(0, 11);
                    return true
                } else if (!reg.test(newVal)) {
                    tips = '请输入正确手机号';
                } else if (reg.test(newVal)) {
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
            telFocus() {
                if (this.oldTel.length > 0) {

                    this.telFlag = true
                }
            },
            // 失去焦点
            telBlur() {
                let that = this
                setTimeout(function () {
                    that.telFlag = false
                    console.log('1111111111')
                }, 10)
                // console.log('1111111111')
            },
            // 点击历史手机号码
            oldTelClick(val) {
                if (val) {
                    this.tel = val
                    this.telFlag = false
                } else {
                    this.telFlag = false
                }
            },
            // 删除历史手机号
            deleteTel(index) {
                let data1 = {
                    padCode: 'asdf526asdf',
                    mobile: this.tel
                }
                delPhoneList(data1).then((res) => {
                    if(res.data.code == 200){
                        this.getphoneList()
                    }
                })
                // this.oldTel.splice(index, 1)
            }
        }
    }
</script>

<style scoped lang="less">
    .loginBth {
        width: 550px;
        height: 68px;
        background: rgba(34, 134, 169, 1);
        border-radius: 5px;
        border: 0;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(209, 208, 209, 1);
        line-height: 68px
    }

    .cancelBth {
        line-height: 68px;
        width: 550px;
        height: 68px;
        font-size: 24px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: rgba(209, 208, 209, 1);

    }

    .login {
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

        .content {
            width: 737px;
            border: 1px solid #464348;
            height: 520px;
            background-color: #373839;
            border-radius: 12px;

            .title {
                border-radius: 12px 12px 0 0;
                height: 76px;
                line-height: 76px;
                text-align: center;
                color: #C8CACD;
                font-size: 28px;
                background: linear-gradient(180deg, #444244 0%, #282A2D 100%);
                box-shadow: 0px 2px 4px 0px #282A2D;
            }

            .input {
                padding: 64px 93px 0 93px;

                /deep/ .van-cell-group {
                    background-color: #454444;
                    border-radius: 5px;
                }

                /deep/ .van-cell {
                    background-color: #454444;
                    border-radius: 5px;
                }

                .mgb35 {
                    margin-bottom: 35px;
                    position: relative;
                }

                .mgb60 {
                    margin-bottom: 60px;
                }

                .mgb20 {
                    margin-bottom: 20px;
                }
            }

            .tel_Wrapper {
                position: absolute;
                width: 550px;
                height: 134px;
                background: rgba(69, 68, 68, 1);
                box-shadow: 0px -1px 0px 0px rgba(88, 86, 93, 1);
                border-radius: 5px;
                z-index: 100;
                font-size: 22px;
                line-height: 40px;
                color: rgba(141, 141, 148, 1);
                overflow: auto;
            }

            .tel_box {
                display: flex;
                padding: 0 30px;
                justify-content: space-between;
            }
        }
    }
</style>