<template>
    <div class="box">
        <!-- 蓝牙加载状态 -->
        <div v-if='status === "fail"' class='loading'>
            <img class='loadingImg' src="./image/title.png" alt="">
            <div v-if='statusContent === 0' class='load-loading'>
                <div class='img'>
                    <img src="./image/bluetooth.png" alt="">蓝牙未开启
                </div>
                <div class='text'>移动设备蓝牙未开启，请先将蓝牙设置为开启</div>
            </div>
            <div v-if='statusContent === 1' class='load-loading'>
                <div class='img'>
                    <van-loading size="50px" color="#2CD781" class='van-landing' />正在建立通信
                </div>
            </div>
            <div v-if='statusContent === 2' class=load-loading>
                <div class='img'>
                    <img src="./image/none.png" alt="">未发现可用设备
                </div>
                <div class='load-button'>重新搜索</div>
            </div>
            <div v-if='statusContent === 3' class='load-loading'>
                <div class='img'>
                    <img src="./image/right.png" alt="">设备已链接
                </div>
            </div>
        </div>
        <!-- 页面内容 -->
        <div v-if='status === "success"' class="home">
            <div class="title">
                <img src="./image/title.png" />
            </div>
            <!-- tab条 -->
            <div class="tabList" v-if='login'>
                <div class="tabLeft">
                    <div class="tab" :class="{'tabActive': tab === 0}" @click="tabBtn(0)">训练</div>
                    <div class="tab" :class="{'tabActive': tab === 1}" @click="tabBtn(1)">记录</div>
                    <div class="tab" :class="{'tabActive': tab === 2}" @click="tabBtn(2)">收藏</div>
                    <div class="tab" :class="{'tabActive': tab === 3}" @click="tabBtn(3)">我的运动员</div>
                </div>
                <div class="tabRight">
                    <div class="name">教练：{{loginName}}</div>
                    <div class="setup">
                        <img @click="setup = !setup" src="./image/setup.png" />
                        <div class="setupList" v-if='setup'>
                            <div class='setupItem' @click='editPWD'>修改密码</div>
                            <div class='setupItem' @click='exitLogin'>退出登录</div>
                            <div class='setupItem'>自动登录 <van-switch class='switch' size='24px' v-model="loginSwitch"
                                    active-color="#07c160" inactive-color="#4E4F50"></van-switch>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 训练 -->
            <div v-show='tab === 0' class="menu">
                <div class="menuLeft">
                    <div class="menuItem" v-for='(item,index) in menuList' @click='leftgoDetail(item.text,index)'
                        :key='index'>
                        <img :src="item.img" />
                        <div class="menuText">{{ item.text }}</div>
                    </div>
                </div>
                <div class="menuRight" v-if='login'>
                    <div class='rightItem' v-for='(item,index) in list' :key='index' v-html='item.text'
                        :style='{"background-color": item.color}' @click='godetail(index,item.text)'><img
                            :src="item.img" /></div>
                </div>
                <div class="menuRight" v-else>
                    <div class='rightItem' v-for='(item,index) in touristList' :key='index' v-html='item.text'
                        :style='{"background-color": item.color}' @click='godetails(index,item.text)'></div>
                </div>
            </div>
            <!-- 记录 -->
            <div v-show='tab === 1' class='list'>
                <div class='item' v-for='(item,i) in recordList'>
                    <div v-show='item.model=="PT"'>
                        <div class='itemTitle'>{{item.createTime}} PT模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>设置运动时间</div>
                                <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                            </div>
                            <div class='con'>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                                <div>
                                    <div class='name'>本次使用参数</div>
                                    <div class='detail'>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.leftPower}}</div>
                                            <div class='detailDown'>POWER LEFT</div>
                                        </div>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.avgPower}}</div>
                                            <div class='detailDown'>BOOST</div>
                                        </div>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.rightPower}}</div>
                                            <div class='detailDown'>POWER RIGHT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div v-show='item.model=="DEMO"'>

                        <div class='itemTitle'>{{item.createTime}} DEMO模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>设置运动时间</div>
                                <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                            </div>
                            <div class='con'>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                                <div class='name'>本次使用运动等级</div>
                                <div class='time'>{{item.level}}</div>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
                            </div>
                        </div>
                    </div>
                    <div v-show='item.model=="LIVE"'>
                        <div class='itemTitle'>{{item.createTime}} LIVE模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                            </div>
                            <div class='con'>
                                <div class='name'>操控点轨迹记录</div>
                                <canvas :id="i" ref='myCanvas' width="402.5" height="86.9"
                                    style="border:1px solid rgba(117,121,137,1);"></canvas>
                                <!-- <div class='time'><img class='img' src="./image/line.png" alt=""></div> -->
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img v-if='item.favored' @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <img v-else @click='AddCollect(item)' src="./image/star.png" alt="">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 收藏 -->
            <div v-show='tab === 2' class='list'>
                <div class='item' v-for='(item,i) in collectList'>
                    <div v-if='item.model=="PT"'>
                        <div class='itemTitle'>{{item.createTime}} PT模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>设置运动时间</div>
                                <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                            </div>
                            <div class='con'>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                                <div>
                                    <div class='name'>本次使用参数</div>
                                    <div class='detail'>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.leftPower}}</div>
                                            <div class='detailDown'>POWER LEFT</div>
                                        </div>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.avgPower}}</div>
                                            <div class='detailDown'>BOOST</div>
                                        </div>
                                        <div class='detailItem'>
                                            <div class='detailUp'>{{item.rightPower}}</div>
                                            <div class='detailDown'>POWER RIGHT</div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <div @click="clickToTrain(item)" class='conTrain'>使用本次设置进行训练<img
                                        src="./image/right-arrow.png" alt=""></div>
                            </div>
                        </div>
                    </div>
                    <div v-else-if='item.model=="DEMO"'>

                        <div class='itemTitle'>{{item.createTime}} DEMO模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>设置运动时间</div>
                                <div class='time'>{{parseInt(item.fullPlayTime/60)}}分钟</div>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                            </div>
                            <div class='con'>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                                <div class='name'>本次使用运动等级</div>
                                <div class='time'>{{item.level}}</div>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <div @click="clickToTrain(item)" class='conTrain'>使用本次设置进行训练<img
                                        src="./image/right-arrow.png" alt=""></div>
                            </div>
                        </div>
                    </div>
                    <div v-else>
                        <div class='itemTitle'>{{item.createTime}} LIVE模式 </div>
                        <div class='itemCon'>
                            <div class='con'>
                                <div class='name'>实际运动时间</div>
                                <div class='time'>{{parseInt(item.realPlayTime/60)}}分钟</div>
                                <div class='name'>本次使用设备</div>
                                <div class='time' v-for='(val,ind) in item.deviceAliasList'>
                                    <span>{{val}}</span>
                                </div>
                            </div>
                            <div class='con'>
                                <div class='name'>操控点轨迹记录</div>
                                <canvas :id="'a'+i"  ref='myCanvas' width="402.5" height="86.9"
                                    style="border:1px solid rgba(117,121,137,1);"></canvas>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;"
                                        v-for='(v,i) in item.memberList'>{{v}}、</div>
                                </div>

                            </div>
                            <div class='conCollect'>
                                <img @click='DelCollect(item)' src="./image/starS.png" alt="">
                                <div @click="clickToTrain(item)" class='conTrain'>使用本次设置进行训练<img
                                        src="./image/right-arrow.png" alt=""></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <!-- 我的运动员 -->
            <div v-show='tab === 3' class='myAthletes'>
                <div class="addSport">
                    <span class="img" @click='addSport'><img src="../../assets/image/add.png" alt=""></span>
                    <span>添加运动员</span>
                </div>
                <van-row class='myHead'>
                    <van-col span='2' class="headItem">姓名</van-col>
                    <van-col span='2' class='headItem'>性别</van-col>
                    <van-col span='3' class='headItem'>出生日期</van-col>
                    <van-col span='3' class='headItem'>身高(cm)</van-col>
                    <van-col span='3' class='headItem'>体重(kg)</van-col>
                    <van-col span='5' class='headItem'>联系方式</van-col>
                    <van-col span='6' class='headItem'>操作</van-col>
                </van-row>
                <van-row class='myTd myHead' v-for='(item,i) in merberList' :key='i'>
                    <van-col span='2' class='headItem'>{{item.username}}</van-col>
                    <van-col span='2' class='headItem'>{{item.sex}}</van-col>
                    <van-col span='3' class='headItem'>{{item.birth}}</van-col>
                    <van-col span='3' class='headItem'>{{item.height}}</van-col>
                    <van-col span='3' class='headItem'>{{item.weight}}</van-col>
                    <van-col span='5' class='headItem'>{{item.mobile}}</van-col>
                    <van-col span='6' class='headItem'>
                        <span class='myTdColor' @click='edit(item)'>编辑</span>
                        <span class='myTdColor' @click='del(item)'>删除</span>
                        <span class='myTdColor' @click='detail(item)'>查看运动记录</span>
                    </van-col>
                </van-row>
            </div>
        </div>
        <!-- login组件 -->
        <login v-if='loginflag'></login>

    </div>
</template>

<script>
    import login from './components/login'
    import { Dialog } from 'vant'
    import { mapState } from 'vuex'
    import { memberExercise, memberMessage, addCollect, delCollect, delMember, trainDetail, exitLogin } from '@/api/index'
    export default {
        name: 'home',
        components: {
            login
        },
        data() {
            return {
                Str: '',
                tab: 0,
                setup: false,
                loginSwitch: false,
                status: 'fail',
                status: 'success',
                statusContent: 1,
                recordList: [],//记录 
                merberList: [],//我的运动员
                collectList: [],//收藏
                menuList: [
                    {
                        img: require('./image/banner1.png'),
                        text: 'FUNTIONAL 1 L1'
                    },
                    {
                        img: require('./image/banner2.png'),
                        text: 'FUNTIONAL 2 L1'
                    },
                    {
                        img: require('./image/banner3.png'),
                        text: 'FUNTIONAL 3 L1'
                    }
                ],
                list: [
                    {
                        color: '#55D295',
                        text: 'FUNTIONAL 1<br/>L2'
                    },
                    {
                        color: '#72C840',
                        text: 'FUNTIONAL 1<br/>L3'
                    },
                    {
                        color: '#7853EA',
                        text: 'FUNTIONAL 1<br/>L4'
                    },
                    {
                        color: '#D3C143',
                        text: 'FUNTIONAL 1<br/>L5'
                    },
                    {
                        color: '#EB9D3A',
                        text: 'FUNTIONAL 2<br/>L2'
                    },
                    {
                        color: '#38947E',
                        text: 'FUNTIONAL 2<br/>L3'
                    },
                    {
                        color: '#489696',
                        text: 'FUNTIONAL 2<br/>L4'
                    },
                    {
                        color: '#3387D6',
                        text: 'FUNTIONAL 2<br/>L5'
                    },
                    {
                        color: '#58CFDC',
                        text: 'FUNTIONAL 3<br/>L2'
                    },
                    {
                        color: '#4CD697',
                        text: 'FUNTIONAL 3<br/>L3'
                    },
                    {
                        color: '#D7C641',
                        text: 'LIVE'
                    },
                    {
                        color: '#5DB035',
                        text: 'DEMO TEST'
                    }
                ],
                touristList: [
                    {
                        color: '#55D295',
                        text: 'FUNTIONAL 1<br/>L2'
                    },
                    {
                        color: '#72C840',
                        text: 'FUNTIONAL 1<br/>L3'
                    },
                    {
                        color: '#7853EA',
                        text: 'FUNTIONAL 1<br/>L4'
                    },
                    {
                        color: '#D3C143',
                        text: 'FUNTIONAL 1<br/>L5'
                    },
                    {
                        color: '#EB9D3A',
                        text: 'FUNTIONAL 2<br/>L2'
                    },
                    {
                        color: '#38947E',
                        text: 'FUNTIONAL 2<br/>L3'
                    },
                    {
                        color: '#489696',
                        text: 'FUNTIONAL 2<br/>L4'
                    },
                    {
                        color: '#3387D6',
                        text: 'FUNTIONAL 2<br/>L5'
                    },
                    {
                        color: '#58CFDC',
                        text: 'FUNTIONAL 3<br/>L2'
                    },
                    {
                        color: '#4CD697',
                        text: 'FUNTIONAL 3<br/>L3'
                    },
                    {
                        color: '#D7C641',
                        text: 'FUNTIONAL 3<br/>L4'
                    },
                    {
                        color: '#5DB035',
                        text: 'PT'
                    }
                ]
            }
        },
        mounted() {
            this.getExercise(); //所有记录
            this.getmemberMsg(); //我的运动员
            this.startBluetoothDiscovery()
            this.tab = this.$route.query.index * 1 || 0;
            if (this.login) {
                window.localStorage.setItem('modle', 'PT')
            } else {
                window.localStorage.setItem('modle', 'DEMO')
            }
            console.log(this.recordList)
        },
        updated() {
            this.recordList.forEach((item, index) => {
                var c = document.getElementById(index);
                var ctx = c.getContext("2d");
                var arr = item.expands
                arr.forEach((v, i) => {
                    ctx.lineTo(v[0], v[1]);
                })
                ctx.stroke();
                ctx.strokeStyle = '#D1D5E6'
            })
            this.collectList.forEach((item, index) => {
                console.log(item)
                var c = document.getElementById("'a'+index");
                var ctx = c.getContext("2d");
                var arr = item.expands
                arr.forEach((v, i) => {
                    ctx.lineTo(v[0], v[1]);
                })
                ctx.stroke();
                ctx.strokeStyle = '#D1D5E6'
            })
        },
        computed: mapState([
            // 映射 this.loginflag 为 store.state.loginflag
            'loginflag',
            'login',
            'loginName'
        ]),
        methods: {
            exitLogin() {
                Dialog.confirm({
                    message: '您确定要退出登录吗？'
                }).then(() => {
                    // on confirm
                    exitLogin().then((res) => {
                        this.$store.dispatch('setLoginflag', { login: false })
                    })
                    // localStorage.clear()
                }).catch(() => {
                    // on cancel
                });
            },
            detail(item) {
                this.$router.push({ name: 'sportExerciseLog' })
            },
            edit(item) {
                this.$router.push({ name: 'addAthletes', query: { name: item.username, sex: item.sex, birth: item.birth, height: item.height, weight: item.weight, mobile: item.mobile } })
                window.localStorage.setItem('userCode', item.userCode)
            },
            del(item) {
                let data = {
                    deleteCodes: [item.userCode]
                }
                delMember(data).then((res) => {
                    if (res.data.code == 200) {
                        this.$toast({
                            message: '删除成功',
                            position: 'bottom'
                        });
                        this.getmemberMsg()
                    }
                })
            },
            addSport() {
                this.$router.push({ name: 'addAthletes' })
            },
            AddCollect(item) {
                item.favored = true
                let data = {
                    userCode: window.localStorage.getItem('userCode'),
                    id: item.id * 1
                }
                addCollect(data).then((res) => {
                    if (res.data.code == 200) {
                        this.getExercise()
                    }
                })
            },
            DelCollect(item) {
                item.favored = false
                let data = {
                    userCode: window.localStorage.getItem('userCode'),
                    id: item.id * 1
                }
                delCollect(data).then((res) => {
                    if (res.data.code == 200) {
                        this.getExercise()
                    }
                })
            },
            getExercise() {
                let data = {
                    userCode: window.localStorage.getItem('userCode')
                }
                memberExercise(data).then((res) => {
                    this.recordList = res.data.data;
                    this.collectList = [];
                    console.log(document.getElementById('0'), 0)
                    res.data.data.forEach((item, index) => {
                        item.expands = []
                        if (JSON.parse(item.expand) != null) {
                            var expand = JSON.parse(item.expand)
                            expand.forEach((v, ind) => {
                                var newArr = []
                                v.c.forEach((val,i)=>{
                                    newArr.push(parseInt(val/4))
                                })
                                    item.expands.push(newArr)
                            })
                        }
                        if (item.favored) {
                            this.collectList.push(item)
                        }
                    })
                })
            },
            getmemberMsg() {
                let data = {
                    level: 2,
                    userCode: window.localStorage.getItem('userCode')
                }
                memberMessage(data).then((res) => {
                    res.data.data.forEach((item, i) => {
                        if (item.sex == 0) {
                            item.sex = '女'
                        } else {
                            item.sex = '男'
                        }
                    })
                    this.merberList = res.data.data

                })
            },

            tabBtn(index) {
                this.tab = index
            },
            leftgoDetail(item, index) {
                let modle = window.localStorage.getItem('modle')
                if (modle == 'DEMO') {
                    window.localStorage.setItem('level', item)
                }
                this.$router.push({ name: 'SelectTime' });
            },
            godetail(index, text) {
                if (index == 10 && text == 'LIVE') {
                    this.$router.push({ name: 'live' });
                }
                else if (index == 11 && text == 'DEMO TEST') {
                    window.localStorage.setItem('modle', 'DEMO')
                    this.list.forEach((item, i) => {
                        if (i == 10) {
                            item.text = 'FUNTIONAL 3 <br/>L4'
                        } else if (i == 11) {
                            item.text = 'PT'
                        }
                    })
                }
                else if (index == 11 && text == 'PT') {
                    window.localStorage.setItem('modle', 'PT')
                    this.list.forEach((item, i) => {
                        if (i == 10) {
                            item.text = 'LIVE'
                        } else if (i == 11) {
                            item.text = 'DEMO TEST'
                        }
                    })
                }
                else {
                    this.$router.push({ name: 'SelectTime' });
                }
                window.localStorage.setItem('level', text)
            },
            godetails(index, text) {
                if (index == 11 && text == 'PT') {

                    this.$store.dispatch('setLoginflag', { loginflag: true })
                    // this.$store.dispatch('setLoginflag', { login: false })
                }
                else {
                    this.$router.push({ name: 'SelectTime' });
                }
                window.localStorage.setItem('level', text)
            },
            // 点击使用本次设置进行训练
            clickToTrain(item) {
                Dialog.confirm({
                    message: '确定使用本次设置进行训练？'
                }).then(() => {
                    window.localStorage.setItem('setTrainTime', item.fullPlayTime)
                    this.$router.push({ name: 'train', query: { model: item.model, fullPlayTime: item.fullPlayTime, realPlayTime: item.realPlayTime, leftPower: item.leftPower, rightPower: item.rightPower, avgPower: item.avgPower, level: item.level } })
                }).catch(() => {
                });
            },
            editPWD() {
                this.$router.push({ name: 'editPass' })
            },
            // 开始搜索附近的蓝牙设备
            startBluetoothDiscovery() {
                document.addEventListener('plusready', function () {
                    plus.bluetooth.openBluetoothAdapter({
                        success: function (e) {
                            alert('开始搜索附近的蓝牙设备: ' + JSON.stringify(e))
                            console.log('open success: ' + JSON.stringify(e))
                            plus.bluetooth.startBluetoothDevicesDiscovery({
                                success: function (e) {
                                    alert('开始搜索附近的蓝牙设备成功: ' + JSON.stringify(e))
                                    console.log('start discovery success: ' + JSON.stringify(e))
                                },
                                fail: function (e) {
                                    alert('开始搜索附近的蓝牙设备失败: ' + JSON.stringify(e))
                                    console.log('start discovery failed: ' + JSON.stringify(e))
                                }
                            });
                        },
                        fail: function (e) {
                            alert('开始搜索附近的蓝牙设备失败啦啦啦啦: ' + JSON.stringify(e))
                            console.log('open failed: ' + JSON.stringify(e))
                        }
                    });
                }, false);
            },
            // 获取已搜索到的蓝牙设备
            getBluetoothDevices() {
                plus.bluetooth.getBluetoothDevices({
                    success: function (e) {
                        var devices = e.devices
                        console.log('get devices success: ' + e.length)
                        for (var i in devices) {
                            console.log(i + ': ' + JSON.stringify(devices[i]))
                        }
                    },
                    fail: function (e) {
                        console.log('get devices failed: ' + JSON.stringify(e))
                    }
                })
            },

        }
    }
</script>



<style scoped lang="less">
    .addSport {
        display: flex;
        align-items: center;
        color: #D1D5E6;
        margin-bottom: 18px;

        .img {
            width: 35px;

            img {
                width: 100%;
            }
        }

        span {
            margin-right: 10px;
            font-size: 25px;
        }
    }

    .box {
        width: 100vw;
        min-height: 100vh;
        padding: 40px 40px 0;
        box-sizing: border-box;
        background: url("./image/bg.png") no-repeat left top;
        background-size: cover;

        .loading {
            padding-top: 197px;

            .loadingImg {
                width: 380px;
                height: 100px;
                margin-bottom: 243px;
            }

            .load-loading {
                text-align: center;

                .img {
                    height: 50px;
                    color: #EAEEF8;
                    font-size: 30px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 178px;

                    .van-landing {
                        width: 50px;
                        height: 50px;
                        margin-right: 45px;
                    }

                    img {
                        width: 50px;
                        height: 50px;
                        margin-right: 45px;
                    }
                }

                .text {
                    color: #9CA0B1;
                    font-size: 24px;
                }

                .load-button {
                    margin: 0 auto;
                    border: 1px solid #9CA0B1;
                    color: #9CA0B1;
                    width: 143px;
                    height: 50px;
                    font-size: 22px;
                    text-align: center;
                    line-height: 50px;
                }
            }
        }

        .home {
            .title {
                width: 100%;
                text-align: center;

                img {
                    width: 280px;
                    height: 64px;
                }
            }

            .tabList {
                width: 100%;
                display: flex;
                justify-content: space-between;

                .tabLeft {
                    display: flex;

                    .tab {
                        padding: 0 50px;
                        font-size: 34px;
                        color: #868A9A;
                        text-align: center;
                        line-height: 50px;
                        height: 70px;
                    }

                    .tabActive {
                        color: #fff;
                        background: url("./image/tab.png") no-repeat left bottom;
                        background-size: contain;
                    }
                }

                .tabRight {
                    display: flex;

                    .name {
                        margin-right: 22px;
                        color: #B7BCCA;
                        font-weight: 500;
                        font-size: 28px;
                        line-height: 45px;
                    }

                    .setup {
                        position: relative;

                        img {
                            width: 45px;
                            height: 45px;
                        }

                        .setupList {
                            position: absolute;
                            bottom: -282px;
                            left: -200px;
                            width: 245px;
                            height: 245px;
                            z-index: 3;
                            background-color: #373839;
                            border: 1px solid #464348;
                            border-radius: 10px;

                            .setupItem {
                                color: #D1D5E6;
                                font-size: 26px;
                                height: 85px;
                                display: flex;
                                justify-content: center;
                                align-items: center;
                                border-bottom: 1px solid #404350;
                                line-height: 85px;
                                text-align: center;

                                .switch {
                                    margin-left: 16px;
                                }
                            }
                        }
                    }
                }
            }

            .menu {
                display: flex;
                padding-top: 40px;

                .menuLeft {
                    .menuItem {
                        width: 450px;
                        height: 250px;
                        margin-bottom: 30px;
                        position: relative;

                        img {
                            position: absolute;
                            width: 100%;
                            height: 100%;
                            left: 0;
                            top: 0;
                            z-index: 1;
                        }

                        .menuText {
                            position: absolute;
                            left: 30px;
                            bottom: 24px;
                            color: #FFFFFF;
                            font-size: 26px;
                            font-weight: 500;
                            z-index: 2;
                        }
                    }
                }

                .menuRight {
                    display: flex;
                    flex-wrap: wrap;
                    width: 100%;
                    flex: 1;
                    margin-left: 40px;

                    .rightItem {
                        width: 22%;
                        height: 250px;
                        text-align: center;
                        font-size: 26px;
                        font-weight: 500;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        box-sizing: border-box;
                        color: #fff;
                        line-height: 37px;
                        margin: 0 27px 30px 0;
                    }
                }
            }

            .list {
                padding: 30px 0;
                width: 100%;

                .item {
                    margin-bottom: 10px;

                    .itemTitle {
                        color: #B8BBC6;
                        font-size: 18px;
                        margin-bottom: 10px;
                        text-align: left;
                    }

                    .itemCon {
                        display: flex;
                        justify-content: space-between;
                        width: 100%;
                        height: 255px;
                        box-sizing: border-box;
                        padding: 40px;
                        border: 1px solid #626576;
                        border-radius: 5px;

                        .con {
                            .name {
                                color: #979AA9;
                                font-size: 17px;
                                text-align: left;
                                margin-bottom: 10px;
                            }

                            .time {
                                color: #D1D5E6;
                                font-size: 26px;
                                text-align: left;
                                margin-bottom: 32px;
                            }

                            .detail {
                                display: flex;
                                box-sizing: border-box;
                                width: 264px;
                                /* height: 66px; */
                                padding: 10px 0;
                                border: 1px solid #757989;
                                border-radius: 2px;
                                justify-content: space-around;
                                align-items: center;

                                .detailItem {
                                    .detailUp {
                                        color: #D1D5E6;
                                        font-size: 24px;
                                        margin-bottom: 5px;
                                    }

                                    .detailDown {
                                        color: #B7BAC8;
                                        font-size: 10px;
                                    }
                                }
                            }

                            .img {
                                width: 264px;
                                border: 1px solid #626576;
                                border-radius: 5px;
                            }
                        }

                        .conCollect {
                            display: flex;
                            flex-direction: column;
                            justify-content: space-between;
                            align-items: flex-end;

                            img {
                                width: 35px;
                                height: 35px;
                            }

                            .conTrain {
                                display: flex;
                                align-items: center;
                                color: #B1B4C0;
                                font-size: 21px;

                                // margin-bottom: 40px;
                                img {
                                    width: 24px;
                                    height: 24px;
                                }
                            }
                        }
                    }
                }
            }

            .myAthletes {
                padding: 30px 0;
                width: 100%;

                .myHead {
                    // background-color: #FEFCFF;
                    border: 1px solid #404350;
                    color: #ABAFBD;
                    font-size: 24px;
                    line-height: 50px;

                    .headItem {
                        height: 75px;
                        line-height: 75px;
                        text-align: center;
                    }
                }

                .myTd {
                    line-height: 40px;
                    border: 1px solid #404350;
                    border-top: 0;

                    .myTdColor {
                        color: #D1D5E6;
                    }
                }
            }
        }
    }
</style>

<style lang="less">
    .van-hairline--top-bottom::after,
    .van-hairline-unset--top-bottom::after {
        border-width: 0;
    }

    .van-cell {
        height: 64px;
        line-height: 42px;
        font-size: 22px;
    }

    .van-button {
        height: 68px;
        font-size: 24px;
    }

    .van-field__control {
        color: #8D8D94;
        font-size: 22px;
    }
</style>

<style lang="less">
    .van-dialog {
        width: 649px;
        height: 376px;
        background: rgba(55, 56, 57, 1);
        border-radius: 12px;
        border: 1px solid rgba(70, 67, 72, 1);
    }

    .van-hairline--top::after {
        border: 0
    }

    .van-dialog__message {
        padding: 118px 159px 110px;
        text-align: center;
        color: #BABAC6;
        font-size: 25px;
    }

    .van-button {
        width: 56px;
        height: 68px;
        background: none;
        color: #D1D0D1;
    }

    .van-button__text {
        display: block;
        width: 206px;
        height: 68px;
        line-height: 68px;
        text-align: center;
        background: rgba(34, 134, 169, 1);
        margin: 0 auto;
        font-size: 24px;
        border-radius: 5px;
    }

    .van-dialog__cancel {
        .van-button__text {
            height: 66px;
            background: none !important;
            border: 1px solid rgba(134, 147, 159, 1);
            box-shadow: 0px 1px 3px 0px rgba(110, 110, 115, 1);
        }
    }

    [class*=van-hairline]::after {
        border: 0
    }
</style>