<template>
    <div class='addAthletes'>
            <div class='backHeader'>
                    <div class='left' @click="back">
                        <img src="../../assets/image/components/back.png" alt="">
                        修改密码
                    </div>
                </div>
        <div class='item'>
            <div class='itemLeft'>旧密码</div>
            <van-field class="itemRight" v-model='form.oldpass' placeholder="请填写旧密码" />
        </div>
        <div class='item'>
            <div class='itemLeft'>新密码</div>
            <van-field class="itemRight" v-model='form.newpass' placeholder="请输入6—12位数字字母组合新密码" />
        </div>
        <div class='item'>
            <div class='itemLeft'>确认新密码</div>
            <van-field class="itemRight" v-model='form.checkpass' placeholder="请确认6—12位数字字母组合新密码" />
        </div>
        <div class='buttonBox'>
            <p class='button' @click='cancle'>取消</p>
            <p class='button active' @click='save'>保存</p>
        </div>
    </div>
</template>

<script>
    import { mapState } from 'vuex'
    import { editPass } from '@/api/index'
    export default {
        name: 'addAthletes',
        data() {
            return {
                form:{
                    oldpass:'',
                    newpass:'',
                    checkpass:''
                },
            }
        },
        methods: {
            cancle(){
                this.$router.push({ name: 'Home', query: { index: 0 } })

            },
            back(){
                this.$router.push({ name: 'Home', query: { index: 0 } })
            },
            save() {
                if (this.form.oldpass == '123456') {

                }
                if (this.form.newpass != this.form.checkpass) {
                    this.$toast({
                        message: '两次输入密码不一致！',
                        position: 'bottom'
                    });
                } else {
                    let data = {
                        oldPassword: this.form.oldpass,
                        newPassword: this.form.newpass
                    }
                    editPass(data).then(res => {
                        if (res.data.code == 200) {
                            this.$toast({
                                message: '修改成功',
                                position: 'bottom'
                            });
                            this.$router.push({ name: 'Home', query: { index: 0 } })
                        }else{
                            this.$toast({
                                message: res.data.msg,
                                position: 'bottom'
                            });
                        }
                    })
                }
            }
        }
    }
</script>

<style lang="less" scoped>
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
                width: 480px;
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
    }
</style>