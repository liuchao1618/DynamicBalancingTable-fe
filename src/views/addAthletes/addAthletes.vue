<template>
    <div class='addAthletes'>
        <back-header title='运动员信息'></back-header>
        <div class='item' @click="toDetail(1, athletes.name)">
            <div class='itemLeft'>*姓名</div>
            <div class='itemRight'>{{ athletes.name ? athletes.name : '请填写您的姓名 >' }}</div>
        </div>
        <div class='item' @click="toDetail(2, athletes.tel)">
            <div class='itemLeft'>*联系方式</div>
            <div class='itemRight'>{{ athletes.tel ? athletes.tel : '请填写您的手机号 >' }}</div>
        </div>
        <div class='item' @click="show = true">
            <div class='itemLeft'>性别</div>
            <div class='itemRight'>{{ athletes.sex ? athletes.sex : '请选择性别 >' }}</div>
        </div>
        <div class='item'>
            <div class='itemLeft'>出生日期</div>
            <div class='itemRight' @click="dateShow = true">{{ athletes.birth ? athletes.birth : '请选择您的出生日期 >' }}</div>
        </div>
        <div class='item' @click="toDetail(5, athletes.height)">
            <div class='itemLeft'>身高（cm）</div>
            <van-field  type="tel" 
                        placeholder="请输入身高">
                    </van-field>
            <!-- <div class='itemRight'>{{ athletes.height ? athletes.height : '请填写您的身高 >' }}</div> -->
        </div>
        <div class='item' @click="toDetail(6, athletes.weight)">
            <div class='itemLeft'>体重（kg）</div>
            <input type="text" placeholder="请填写您的体重">
            <!-- <div class='itemRight'>{{ athletes.weight ? athletes.weight : '请填写您的体重 >' }}</div> -->
        </div>
        <div class='itemNo'>标*项为必填项，填写的手机号将作为运动员的账号使用</div>
        <div class='buttonBox'>
                <p class='button' @click='cancleBtn'>取消</p>
                <p class='button active' @click='saveBtn'>保存</p>
            <!-- <van-button type="primary" class='button mgr' @click='cancleBtn'>取消</van-button>
            <van-button type="primary" class='button' @click='saveBtn'>保存</van-button> -->
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
        <van-popup v-model="dateShow" position="bottom">
                <van-datetime-picker
                type="date"
                v-model="currentDate"
                @cancel="handleCancel"
                @confirm="handleEndDateConfirm" 
              />
        </van-popup>
    </div>
</template>

<script>
    import backHeader from '@/components/backHeader'
    import { mapState } from 'vuex'
    import {editMember,addMember} from '@/api/index'
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
                userCode:0
            }
        },
        mounted() {
            console.log(this.athletes,'11111111111111111111111')
            // ({name:'addAthletes',query:{userCode: item.userCode,name:item.username,sex: item.sex=='女'?0:1,birth:item.birth,height:item.height,weight:item.weight,mobile:item.mobile}})
            this.athletes.name = this.$route.query.name||this.athletes.name 
            this.athletes.tel = this.$route.query.mobile|| this.athletes.tel
            this.athletes.sex = this.$route.query.sex||this.athletes.sex
            this.athletes.birth = this.$route.query.birth||this.athletes.birth 
            this.athletes.height = this.$route.query.height|| this.athletes.height
            this.athletes.weight = this.$route.query.weight||this.athletes.weight
        },
        methods: {
            saveBtn(){
                let data = {
                    parentUserCode:window.localStorage.getItem('userCode'),
                    username:this.athletes.name,
                    mobile:  this.athletes.tel,
                    sex:     this.athletes.sex=='女'?0:1,
                    birth:   this.athletes.birth,
                    height:  this.athletes.height,
                    weight:  this.athletes.weight,
                };

                let data1 = {
                    parentUserCode:window.localStorage.getItem('userCode'),
                    targetUserCode: window.localStorage.getItem('userCode'),
                    username:this.athletes.name,
                    mobile:  this.athletes.tel,
                    sex:     this.athletes.sex=='女'?0:1,
                    birth:   this.athletes.birth,
                    height:  this.athletes.height,
                    weight:  this.athletes.weight,
                }
                console.log(this.$route.query.name)
                if(this.$route.query.name){
                    editMember(data1).then((res)=>{
                    if(res.data.code == 200){
                        this.athletes.name = '';
                        this.athletes.tel = '';
                        this.athletes.sex = '';
                        this.athletes.birth = '';
                        this.athletes.height = '';
                        this.athletes.weight = '';
                        this.$toast({
                            message:'修改成功',
                            position:'bottom'
                        });
                        this.$router.push({name:'Home',query:{index:3}})
                    }
                })
                }else{
                addMember(data).then((res)=>{
                    if(res.data.code == 200){
                        this.athletes.name = '';
                        this.athletes.tel = '';
                        this.athletes.sex = '';
                        this.athletes.birth = '';
                        this.athletes.height = '';
                        this.athletes.weight = '';
                        this.$toast({
                            message:'添加成功',
                            position:'bottom'
                        });
                        this.$router.push({name:'Home',query:{index:3}})
                    }
                })

                }
            },
            cancleBtn(){},
            handleCancel() {
                this.dateShow = false;
            },
            //时间
            handleEndDateConfirm() {
                this.dateShow = false;
                this.$store.dispatch('setAthletes', { index: 4, birth: this.currentDate})
            },
            toDetail(index,val) {
                // this.$router.push({ name: 'athletesDetail', query: { index: index ,value:val} })
            },
            sexBtn(index) {
                this.sex = index
                this.$store.dispatch('setAthletes', { index: 3, sex: index === 1 ? '男' : '女' })
                let that = this
                setTimeout(() => {
                    that.show = false
                }, 500)
            },
            sexBtnSwitch() {

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
                border-radius: 5px;color:rgba(209,208,209,1);
                border:1px solid rgba(104,105,106,1);
                line-height:68px;
            }

            .active{
                border:0;
                background:rgba(34,134,169,1);
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