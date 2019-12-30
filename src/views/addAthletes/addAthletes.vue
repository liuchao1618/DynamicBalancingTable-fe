<template>
    <div class='addAthletes'>
        <div class='backHeader'>
            <div class='left' @click="back">
                <img src="../../assets/image/components/back.png" alt="">
                运动员信息
            </div>
        </div>
        <div class='item'>
            <div class='itemLeft'>*姓名</div>
            <van-field class="itemRight" v-model='form.username' placeholder="请输入您的姓名" />
        </div>
        <div class='item'>
            <div class='itemLeft'>*联系方式</div>
            <van-field class="itemRight" type="tel" v-model='form.tel' placeholder="请输入您的手机号">
            </van-field>
        </div>
        <div class='item' @click="show = true">
            <div class='itemLeft'>性别</div>
            <div class='itemRight'>{{ form.sex ? form.sex : '请选择性别' }}</div>
        </div>
        <div class='item'>
            <div class='itemLeft'>出生日期</div>
            <div class='itemRight' @click="dateShow = true">{{ form.birth ? form.birth : '请选择您的出生日期' }}</div>
        </div>
        <div class='item'>
            <div class='itemLeft'>身高（cm）</div>
            <van-field class="itemRight" v-model='form.height' placeholder="请输入您的身高" />
        </div>
        <div class='item'>
            <div class='itemLeft'>体重（kg）</div>
            <van-field class="itemRight" v-model='form.weight' placeholder="请输入您的体重" />
        </div>
        <div class='itemNo'>标*项为必填项，填写的手机号将作为运动员的账号使用</div>
        <div class='buttonBox'>
            <p class='button' @click='cancleBtn'>取消</p>
            <p class='button active' @click='saveBtn'>保存</p>
        </div>
        <van-popup v-model="show">
            <div class='sex'>
                <div class='sexItem' @click="sexBtn('男')">
                    <div>男</div>
                    <img v-if='form.sex == "男"' src="./image/right.png" alt="">
                </div>
                <div class='sexItem' @click="sexBtn('女')">
                    <div>女</div>
                    <img v-if='form.sex == "女"' src="./image/right.png" alt="">
                </div>
            </div>
        </van-popup>
        <van-popup v-model="dateShow" position="bottom">
            <van-datetime-picker type="date" :value='currentDate' :min-date='minDate' :max-date='maxDate' @cancel="handleCancel" @confirm="handleEndDateConfirm" />
        </van-popup>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { editMember, addMember } from '@/api/index'
    export default {
        name: 'addAthletes',
        data() {
            return {
                currentDate:new Date(2000,0,1),
                minDate:new Date(1970,0,1),
                maxDate:new Date(),
                form: {
                    username: '',
                    tel: '',
                    sex: '',
                    birth: '',
                    height: '',
                    weight: ''
                },
                dateShow: false,
                show: false,
                userCode: 0,
                edit: false
            }
        },
        mounted() {
            if (window.localStorage.getItem('editCode')) {
                this.form = this.$route.query || {}
                this.edit = true
            }
        },
        methods: {
            back() { 
                this.$router.push({ name: 'Home', query: { index: 3 } })
            },
            saveBtn() {
                let reg = /^1[3456789]\d{9}$/;
                let numReg = /^[0-9]*$/;
                if(this.form.username.length > 5){
                    this.$toast({
                        message: '姓名长度不得大于5',
                        position: 'bottom'
                    });
                }else if(!this.form.username&&!this.form.tel){
                    this.$toast({
                        message: '请输入您的姓名和联系方式',
                        position: 'bottom'
                    });
                }else if(!this.form.username){
                    this.$toast({
                        message: '请输入您的姓名',
                        position: 'bottom'
                    });
                }else if(!this.form.tel){
                    this.$toast({
                        message: '请输入您的联系方式',
                        position: 'bottom'
                    });
                }else if(!reg.test(this.form.tel)){
                    this.$toast({
                        message: '请输入正确的联系方式',
                        position: 'bottom'
                    });
                }
                else if(!numReg.test(this.form.height)){
                    this.$toast({
                        message: '请输入数字',
                        position: 'bottom'
                    });
                }else if(!numReg.test(this.form.weight)){
                    this.$toast({
                        message: '请输入数字',
                        position: 'bottom'
                    });
                }
                else{
                    let data = {
                    parentUserCode: window.localStorage.getItem('userCode'),
                    targetUserCode: window.localStorage.getItem('editCode'),
                    username: this.form.username,
                    mobile: this.form.tel,
                    sex: this.form.sex == '女' ? 0 : 1,
                    birth: this.form.birth,
                    height: this.form.height,
                    weight: this.form.weight,
                }
                let data1 = {
                    parentUserCode: window.localStorage.getItem('userCode'),
                    username: this.form.username,
                    mobile: this.form.tel,
                    sex: this.form.sex == '女' ? 0 : 1,
                    birth: this.form.birth,
                    height: this.form.height,
                    weight: this.form.weight,
                }
                if (this.edit) {
                    editMember(data).then((res) => {
                        if (res.data.code == 200) {
                            this.form.name = '';
                            this.form.tel = '';
                            this.form.sex = '';
                            this.form.birth = '';
                            this.form.height = '';
                            this.form.weight = '';
                            window.localStorage.removeItem('editCode')
                            this.$toast({
                                message: '编辑成功',
                                position: 'bottom'
                            });
                            this.$router.push({ name: 'Home', query: { index: 3 } })
                        }
                    })
                } else {
                    addMember(data1).then((res) => {
                        if (res.data.code == 200) {
                            this.form.name = '';
                            this.form.tel = '';
                            this.form.sex = '';
                            this.form.birth = '';
                            this.form.height = '';
                            this.form.weight = '';
                            this.$toast({
                                message: '添加成功',
                                position: 'bottom'
                            });
                            this.$router.push({ name: 'Home', query: { index: 3 } })
                        }
                    })

                }
                }
                
                console.log(this.form)
            },
            cancleBtn() {
                this.$router.push({ name: 'Home', query: { index: 3 } })
             },
            handleCancel() {
                this.dateShow = false;
            },
            //时间
            handleEndDateConfirm(event) {
                const d = new Date(event)
                const resDate = d.getFullYear() + '-' + p((d.getMonth() + 1)) + '-' + p(d.getDate())
                function p(s) {
                    return s < 10 ? '0' + s : s
                }
                this.form.birth = resDate
                this.dateShow = false;
            },
            sexBtn(val) {
                this.form.sex = val
                setTimeout(() => {
                    this.show = false
                }, 500)
            }
        }
    }
</script>

<style lang="less" scoped>
    /deep/ .van-picker__cancel, /deep/.van-picker__confirm , /deep/ .van-picker__columns li{
        font-size: 22px!important
    }
    /deep/.van-picker-column__wrapper{
        display: flex;
        flex-direction: column;
    }
    .backHeader {
        color: #EAEAF0;
        font-size: 30px;
        display: flex;
        justify-content: space-between;
        margin-bottom: 40px;

        .left {
            img {
                width: 28px;
                height: 28px;
                vertical-align: middle;
                margin-right: 20px;
            }
        }

        .right {
            padding: 5px;
        }
    }

    .addAthletes {
        width: 100vw;
        min-height: 100vh;
        padding: 40px;
        box-sizing: border-box;
        background: url("../home/image/bg.png") no-repeat left top;
        background-size: cover;

        .item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            height: 93px;
            padding: 0 10px;
            font-size: 24px;
            border-bottom: 1px solid #4E4F54;

            .itemLeft {
                color: #D1D1D6;
            }

            .itemRight {
                color: #868693;
                float: right;
                width: 250px;
                font-size: 24px;
                text-align: right;
                padding-right: 20px;
                background: transparent;

                /deep/.van-field__control {
                    text-align: right;
                    color: #868693
                }
            }
        }

        .itemNo {
            font-size: 19px;
            color: #99999E;
            line-height: 46px;
            text-align: left;
        }

        .buttonBox {
            margin-top: 100px;
            display: flex;
            justify-content: center;

            .button {
                width: 550px;
                height: 68px;
                font-size: 24px;
                border-radius: 5px;
                color: rgba(209, 208, 209, 1);
                border: 1px solid rgba(104, 105, 106, 1);
                line-height: 68px;
            }

            .active {
                border: 0;
                background: rgba(34, 134, 169, 1);
                margin-left: 30px;
            }
        }

        .sex {
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

            .sexItem {
                display: flex;
                justify-content: space-between;
                align-items: center;
                height: 42px;

                div {
                    font-size: 28px;
                    color: #BDBDC5;
                }

                img {
                    width: 42px;
                    height: 42px;
                }
            }
        }

        .van-popup {
            border-radius: 12px;
        }
    }
</style>