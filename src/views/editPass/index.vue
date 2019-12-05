<template>
    <div class='addAthletes'>
        <back-header title='修改密码'></back-header>
        <div class='item' @click="toDetail(7)">
            <div class='itemLeft'>*旧密码</div>
            <div class='itemRight'>{{ athletes.oldpass ? athletes.oldpass : '请填写旧密码 >' }}</div>
        </div>
        <div class='item' @click="toDetail(8)">
            <div class='itemLeft'>*新密码</div>
            <div class='itemRight'>{{ athletes.newpass ? athletes.newpass : '请输入6—12位数字字母组合新密码 >' }}</div>
        </div>
        <div class='item' @click="toDetail(9)">
            <div class='itemLeft'>确认新密码</div>
            <div class='itemRight'>{{ athletes.checkpass ? athletes.checkpass : '请确认6—12位数字字母组合新密码 >' }}</div>
        </div>
        <div class='buttonBox'>
            <p class='button'>取消</p>
            <p class='button active' @click='save'>保存</p>
        </div>
    </div>
</template>

<script>
    import backHeader from '@/components/backHeader'
    import { mapState } from 'vuex'
    import { editPass } from '@/api/index'
    export default {
        name: 'addAthletes',
        components: {
            backHeader
        },
        computed: {
            ...mapState([
                'athletes'
            ])
        },
        data() {
            return {
                dateShow: false,
                currentDate: new Date(),
                show: false,
                sex: 1,
            }
        },
        methods: {
            save() {
                if (this.athletes.oldpass == '123456') {

                }
                if (this.athletes.newpass != this.athletes.checkpass) {
                    this.$toast({
                        message: '两次输入密码不一致！',
                        position: 'bottom'
                    });
                } else {
                    let data = {
                        oldPassword: this.athletes.oldpass,
                        newPassword: this.athletes.newpass
                    }
                    editPass(data).then(res => {
                        if (res.data.code == 200) {
                            this.$toast({
                                message: '两次输入密码不一致！',
                                position: 'bottom'
                            });
                        }
                    })
                }
                console.log(this.athletes, 'athletes')
            },
            toDetail(index) {
                this.$router.push({ name: 'athletesDetail', query: { index: index } })
            }
        }
    }
</script>

<style lang="less" scoped>
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