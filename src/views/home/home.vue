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
                <div @click="discoveryNewDevice()" class='load-button'>重新搜索</div>
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
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
                                <canvas :id="'a'+i" ref='myCanvas' width="402.5" height="86.9"
                                    style="border:1px solid rgba(117,121,137,1);"></canvas>
                            </div>
                            <div class='con' style='width:200px'>
                                <div class='name'>参与本次训练运动员</div>
                                <div style="display: flex;flex-wrap: wrap;">
                                    <div style="color:rgba(209,213,230,1);fontSize:20px;">{{item.memberList}}</div>
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
    function BluetoothTool() {
        let BluetoothAdapter = plus.android.importClass("android.bluetooth.BluetoothAdapter"); //蓝牙适配器
        let Intent = plus.android.importClass("android.content.Intent");
        let IntentFilter = plus.android.importClass("android.content.IntentFilter");
        let BluetoothDevice = plus.android.importClass("android.bluetooth.BluetoothDevice"); // 蓝牙设备
        let UUID = plus.android.importClass("java.util.UUID");
        let Toast = plus.android.importClass("android.widget.Toast");
        //连接串口设备的 UUID
        let MY_UUID = UUID.fromString("00001101-0000-1000-8000-00805F9B34FB");

        let invoke = plus.android.invoke;
        let btAdapter = BluetoothAdapter.getDefaultAdapter(); //默认适配器
        let activity = plus.android.runtimeMainActivity();

        let btSocket = null;
        let btInStream = null;
        let btOutStream = null;
        let setIntervalId = 0;

        let btFindReceiver = null; //蓝牙搜索广播接收器
        let btStatusReceiver = null; //蓝牙状态监听广播

        let state = {
            bluetoothEnable: false, //蓝牙是否开启
            bluetoothState: "", //当前蓝牙状态
            discoveryDeviceState: false, //是否正在搜索蓝牙设备
            readThreadState: false, //数据读取线程状态
        };
        let statusContent = 0 // 页面初始化显示蓝牙未开启

        let options = {
            /*
            *打开蓝牙回调
            *
            */
            turnOnBluetoothCallback: function (stateContent) { },
            /*
            *连接设备成功
            */
            connDeviceCallback: function (stateContent) { },
            /**
             * 监听蓝牙状态回调
             * @param {String} state
             */
            listenBTStatusCallback: function (stateContent) { },
            /**
             * 搜索到新的蓝牙设备回调
             * @param {Device} newDevice
             */
            discoveryDeviceCallback: function (newDevice) { },
            /**
             * 蓝牙搜索完成回调
             */
            discoveryFinishedCallback: function (stateContent) { },
            /**
             * 接收到数据回调
             * @param {Array} dataByteArr
             */
            readDataCallback: function (dataByteArr) { },
            /**
             * 蓝牙连接中断回调
             * @param {Exception} e
             */
            connExceptionCallback: function (stateContent) { }
        }

        let bluetoothToolInstance = {
            state: state, //蓝牙状态
            init: init, //初始化回调函数
            statusContent: statusContent, // 页面显示状态
            isSupportBluetooth: isSupportBluetooth,
            getBluetoothStatus: getBluetoothStatus,
            turnOnBluetooth: turnOnBluetooth,
            turnOffBluetooth: turnOffBluetooth,
            getPairedDevices: getPairedDevices,
            discoveryNewDevice: discoveryNewDevice,
            listenBluetoothStatus: listenBluetoothStatus,
            connDevice: connDevice,
            disConnDevice: disConnDevice,
            cancelDiscovery: cancelDiscovery,
            readData: readData,
            sendData: sendData
        }
        if (window.bluetoothToolInstance) {
            return window.bluetoothToolInstance;
        } else {
            window.bluetoothToolInstance = bluetoothToolInstance;
            return bluetoothToolInstance;
        }

        function init(setOptions) {
            Object.assign(options, setOptions);
            state.bluetoothEnable = getBluetoothStatus();
            listenBluetoothStatus();
        }

        function shortToast(msg) {
            Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show();
        }

        /**
         * 是否支持蓝牙
         * @return {boolean}
         */
        function isSupportBluetooth() {
            if (btAdapter != null) {
                return true;
            }
            return false;
        }
        /**
         * 获取蓝牙的状态
         * @return {boolean} 是否已开启
         */
        function getBluetoothStatus() {
            if (btAdapter != null) {
                return btAdapter.isEnabled();
            }
            return false;
        }

        /**
         * 打开蓝牙
         * @param activity
         * @param requestCode
         */
        function turnOnBluetooth() {
            if (btAdapter == null) {
                shortToast("没有蓝牙");
                return;
            }
            if (!btAdapter.isEnabled()) {
                if (activity == null) {
                    shortToast("未获取到activity", activity);
                    return;
                } else {
                    let intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                    let requestCode = 1;
                    activity.startActivityForResult(intent, requestCode);
                    shortToast("未获取到activity", activity);
                    state.statusContent = 1;
                    options.turnOnBluetoothCallback && options.turnOnBluetoothCallback(state.statusContent)
                    return;
                }
            } else {
                shortToast("蓝牙已经打开");
                state.statusContent = 1;
                options.turnOnBluetoothCallback && options.turnOnBluetoothCallback(state.statusContent)
            }
        }

        /**
         * 关闭蓝牙
         */
        function turnOffBluetooth() {
            if (btAdapter != null && btAdapter.isEnabled()) {
                btAdapter.disable();
            }
            if (btFindReceiver != null) {
                try {
                    activity.unregisterReceiver(btFindReceiver);
                } catch (e) {

                }
                btFindReceiver = null;
            }
            state.bluetoothEnable = false;
            cancelDiscovery();
            closeBtSocket();

            if (btAdapter != null && btAdapter.isEnabled()) {
                btAdapter.disable();
                state.statusContent = 0;
                shortToast("蓝牙关闭成功");
            } else {
                state.statusContent = 0;
                shortToast("蓝牙已经关闭");
            }
        }

        /**
         * 获取已经配对的设备
         * @return {Array} connetedDevices
         */
        function getPairedDevices() {
            alert('获取已经配对的设备')
            let pairedDevices = [];

            //蓝牙连接android原生对象，是一个set集合
            let pairedDevicesAndroid = null;
            if (btAdapter != null && btAdapter.isEnabled()) {
                pairedDevicesAndroid = btAdapter.getBondedDevices();
            } else {
                shortToast("蓝牙未开启");
            }

            if (!pairedDevicesAndroid) {
                return pairedDevices;
            }

            //遍历连接设备的set集合，转换为js数组
            let it = invoke(pairedDevicesAndroid, "iterator");
            while (invoke(it, "hasNext")) {
                let device = invoke(it, "next");
                pairedDevices.push({
                    "name": invoke(device, "getName"),
                    "address": invoke(device, "getAddress")
                });
            }
            return pairedDevices;
        }

        /**
         * 发现设备
         */
        function discoveryNewDevice(discoveryAddress) {
            state.statusContent = 1
            options.discoveryFinishedCallback && options.discoveryFinishedCallback(state.statusContent);
            alert(JSON.stringify(discoveryAddress))
            if (discoveryAddress.length == 0) {
                shortToast('未提供可配对设备地址')
                cancelDiscovery(); // 取消发现
                state.statusContent = 2
                options.discoveryFinishedCallback && options.discoveryFinishedCallback(state.statusContent);
                return
            }
            if (btFindReceiver != null) {
                try {
                    activity.unregisterReceiver(btFindReceiver);
                } catch (e) {
                    console.error(e);
                }
                btFindReceiver = null;
                cancelDiscovery(); // 取消发现
            }
            let Build = plus.android.importClass("android.os.Build");

            //6.0以后的如果需要利用本机查找周围的wifi和蓝牙设备, 申请权限
            if (Build.VERSION.SDK_INT >= 6.0) {

            }

            btFindReceiver = plus.android.implements("io.dcloud.android.content.BroadcastReceiver", {
                "onReceive": function (context, intent) {
                    plus.android.importClass(context);
                    plus.android.importClass(intent);
                    let action = intent.getAction();

                    if (BluetoothDevice.ACTION_FOUND == action) { // 找到设备
                        let device = intent.getParcelableExtra(BluetoothDevice.EXTRA_DEVICE);

                        let address = String(plus.android.invoke(device, "getAddress"))
                        if (discoveryAddress.indexOf(address) > -1) {
                            connDevice(address)
                            cancelDiscovery();
                        }
                    }
                    if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED == action) { // 搜索完成
                        if (!state.readThreadState) {
                            shortToast('未发现可用设备')
                            state.statusContent = 2;
                        }
                        cancelDiscovery();
                        options.discoveryFinishedCallback && options.discoveryFinishedCallback(state.statusContent);
                    }
                }
            });
            let filter = new IntentFilter();
            filter.addAction(BluetoothDevice.ACTION_FOUND);
            filter.addAction(BluetoothAdapter.ACTION_DISCOVERY_FINISHED);
            activity.registerReceiver(btFindReceiver, filter);
            btAdapter.startDiscovery(); //开启搜索
            state.discoveryDeviceState = true;
        }

        /**
         * 蓝牙状态监听
         * @param {Activity} activity
         */
        function listenBluetoothStatus() {
            if (btStatusReceiver != null) {
                try {
                    activity.unregisterReceiver(btStatusReceiver);
                } catch (e) {
                    console.error(e);
                }
                btStatusReceiver = null;
            }

            btStatusReceiver = plus.android.implements("io.dcloud.android.content.BroadcastReceiver", {
                "onReceive": function (context, intent) {
                    plus.android.importClass(context);
                    plus.android.importClass(intent);

                    let action = intent.getAction();
                    switch (action) {
                        case BluetoothAdapter.ACTION_STATE_CHANGED:
                            let blueState = intent.getIntExtra(BluetoothAdapter.EXTRA_STATE, 0);
                            let stateStr = "";
                            let content = '';
                            switch (blueState) {
                                case BluetoothAdapter.STATE_TURNING_ON:
                                    stateStr = "STATE_TURNING_ON";
                                    content = 1;
                                    break;
                                case BluetoothAdapter.STATE_ON:
                                    state.bluetoothEnable = true;
                                    content = 1;
                                    stateStr = "STATE_ON";
                                    shortToast('蓝牙已开启')
                                    break;
                                case BluetoothAdapter.STATE_TURNING_OFF:
                                    stateStr = "STATE_TURNING_OFF";
                                    state.bluetoothEnable = false;
                                    break;
                                case BluetoothAdapter.STATE_OFF:
                                    stateStr = "STATE_OFF";
                                    shortToast('设备已断开连接')
                                    content = 0;
                                    state.bluetoothEnable = false;
                                    break;
                            }
                            state.bluetoothState = stateStr;
                            state.statusContent = content;
                            options.listenBTStatusCallback && options.listenBTStatusCallback(state.statusContent);
                            break;
                    }
                }
            });
            let filter = new IntentFilter();
            filter.addAction(BluetoothAdapter.ACTION_STATE_CHANGED);
            activity.registerReceiver(btStatusReceiver, filter);
        }

        /**
         * 根据蓝牙地址，连接设备
         * @param {Stirng} address
         * @return {Boolean}
         */
        function connDevice(address) {
            alert('开始连接了')
            // alert(address)
            let InputStream = plus.android.importClass("java.io.InputStream");
            let OutputStream = plus.android.importClass("java.io.OutputStream");
            let BluetoothSocket = plus.android.importClass("android.bluetooth.BluetoothSocket");
            cancelDiscovery(); // 取消搜索
            if (btSocket != null) {
                closeBtSocket(); // 断开连接设备
            }
            state.readThreadState = false;

            try {
                // alert('address能用吗')
                let device = invoke(btAdapter, "getRemoteDevice", address);
                btSocket = invoke(device, "createRfcommSocketToServiceRecord", MY_UUID);
            } catch (e) {
                shortToast("连接失败，获取Socket失败！");
                return false;
            }
            try {
                invoke(btSocket, "connect");
                readData(); //读数据
                shortToast("连接成功");
            } catch (e) {
                console.error(e);
                shortToast("连接失败");
                try {
                    btSocket.close();
                    btSocket = null;
                } catch (e1) {
                    console.error(e1);
                }
                state.statusContent = 2;
                options.connDeviceCallback && options.connDeviceCallback(state.statusContent)
                return false;
            }
            state.statusContent = 3;
            options.connDeviceCallback && options.connDeviceCallback(state.statusContent)
            return true;
        }

        /**
         * 断开连接设备
         * @param {Object} address
         * @return {Boolean}
         */
        function disConnDevice() {
            if (btSocket != null) {
                closeBtSocket();
            }
            state.readThreadState = false;
            shortToast("断开连接成功");
        }

        /**
         * 断开连接设备
         * @param {Object} address
         * @return {Boolean}
         */
        function closeBtSocket() {
            state.readThreadState = false;
            if (!btSocket) {
                return;
            }
            try {
                btSocket.close();
            } catch (e) {
                console.error(e);
                btSocket = null;
            }
        }

        /**
         * 取消发现
         */
        function cancelDiscovery() {
            if (btAdapter.isDiscovering()) {
                btAdapter.cancelDiscovery();
            }
            if (btFindReceiver != null) {
                activity.unregisterReceiver(btFindReceiver);
                btFindReceiver = null;
            }
            // alert('取消搜索了')
            state.discoveryDeviceState = false;
        }

        /**
         * 读取数据
         * @param {Object} activity
         * @param {Function} callback
         * @return {Boolean}
         */
        function readData() {
            if (!btSocket) {
                shortToast("请先连接蓝牙设备！");
                return false;
            }
            try {
                btInStream = invoke(btSocket, "getInputStream");
                btOutStream = invoke(btSocket, "getOutputStream");
            } catch (e) {
                console.error(e);
                shortToast("创建输入输出流失败！");
                closeBtSocket();
                return false;
            }
            let setTimeCount = 0;
            read();
            state.readThreadState = true;
            return true;

            /**
             * 模拟java多线程读取数据
             */
            function read() {
                clearInterval(setIntervalId);
                setIntervalId = setInterval(function () {
                    setTimeCount++;
                    if (state.readThreadState) {
                        let t = new Date().getTime();
                        //心跳检测
                        if (setTimeCount % 10 == 0) {
                            try {
                                // btOutStream.write([0b00]);
                            } catch (e) {
                                state.readThreadState = false;
                                shortToast('设备已断开连接')
                                state.statusContent = 2
                                options.connExceptionCallback && options.connExceptionCallback(state.statusContent);
                            }
                        }
                        let dataArr = [];
                        while (invoke(btInStream, "available") !== 0) {
                            let data = invoke(btInStream, "read");
                            dataArr.push(data);
                            let ct = new Date().getTime();
                            if (ct - t > 100) {
                                break;
                            }
                        }
                        if (dataArr.length > 0) {
                            // alert('接收数据')
                            // alert(dataArr)
                            options.readDataCallback && options.readDataCallback(dataArr);
                        }
                    }
                }, 40);
            }
        }

        /**
         * 发送数据
         * @param {String} dataStr
         * @return {Boolean}
         */
        function sendData(dataStr) {
            alert(dataStr)
            if (!btOutStream) {
                shortToast("创建输出流失败！");
                return;
            }
            // let bytes = invoke(dataStr, 'getBytes', 'gbk');
            alert('发送数据')
            try {
               for (let i = 0; i < dataStr.length; i++) {
                btOutStream.write(dataStr[i])
            }
            } catch (e) {
                alert('发送失败')
                return false;
            } finally {

            }
            alert('发送成功')
            return true;
        }
    };
    let bluetoothTool = null;

    import login from './components/login'
    import { Dialog } from 'vant'
    import { mapState } from 'vuex'
    import { memberExercise, memberMessage, addCollect, delCollect, delMember, trainDetail, exitLogin } from '@/api/index'
    import { deviceInfo } from '../../api/api'
    import {t80, dataNum} from '../../utils/sendData.js'

    let vm = {
        name: 'home',
        components: {
            login
        },
        data() {
            return {
                leftValue:0,
                rightValue:0,
                tab: 0,
                // loginFlag: false,
                setup: false,
                //   loginSwitch: false,
                status: 'fail',
                // status: 'success',
                statusContent: 0,
                deviceList: [], // 蓝牙地址(adress)
                dataList: [], // 接收到的数据
                contrastData: [], // 做对比的数据
                // sendDataNum: 0b10100000,
                sendDataNum: [0b10100110, 0b10101000, 0b01100000, 0b10100110, 0b10101000,  0b00001010, 0b11100010, 0b11111111],
                recordList: [],//记录 
                merberList: [],//我的运动员
                collectList: [],//收藏
                menuList: [
                    {
                        img: require('./image/banner1.png'),
                        text: 'FUNTIONAL 1 L1'
                    }, {
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
            // console.log(this.collectList,'this.collectList')
            this.collectList.forEach((item, index) => {
                var c = document.getElementById('a'+index);
                var ctx = c.getContext("2d");
                var arr = item.expands
                arr.forEach((v, i) => {
                    ctx.lineTo(v[0], v[1]);
                })
                ctx.stroke();
                ctx.strokeStyle = '#D1D5E6'
            })
        },
        created() {
            this.getDeviceInfo()
            let that = this
            document.addEventListener("plusready", () => {
                bluetoothTool = BluetoothTool();
                bluetoothTool.init({
                    turnOnBluetoothCallback: function (stateContent) { // 打开蓝牙回调
                        alert('打开蓝牙回调')
                        that.statusContent = Number(stateContent)
                    },
                    connDeviceCallback: function (stateContent) { // 连接设备回调
                        alert('连接设备回调')
                        that.statusContent = Number(stateContent)
                        that.status = "success"
                        // that.sendDataTime()
                        // bluetoothTool.sendData(that.sendDataNum)
                        // that.watchReceiveData()
                    },
                    readDataCallback: function (dataArr) { // 读取数据回调
                        alert('读取数据回调')
                        alert(dataArr)
                        that.dataList = dataArr
                    },
                    discoveryFinishedCallback: function (stateContent) { // 搜索发现回调
                        alert('搜索发现回调')
                        that.statusContent = Number(stateContent)
                    },
                    connExceptionCallback: function (stateContent) { // 设备中断连接回调
                        alert('设备中断连接回调')
                        that.statusContent = Number(stateContent)
                        that.status = "fail"
                        that.$router.push({name: 'Home', query: {urlContent: Number(stateContent)}})
                    },
                    listenBTStatusCallback: function (stateContent) { // 监听蓝牙状态回调
                        alert('监听蓝牙状态回调')
                        that.statusContent = Number(stateContent)
                        // alert('listenBTStatusCallback')
                        if (bluetoothTool.state.bluetoothEnable) {
                            alert('that.statusContent  true')
                            that.discoveryNewDevice() // 发现设备
                        } else {
                            that.statusContent = Number(stateContent)
                            that.status = "fail"
                            that.$router.push({name: 'Home', query: {urlContent: Number(stateContent)}})
                            this.$forceUpdate()
                        }
                    }
                })
            }, false)
        },
        mounted() {
            // 在其他页面监听蓝牙与设备的连接状态
            let urlContent = this.$route.query.urlContent
            if (urlContent) {
                this.statusContent = urlContent
            }
            // this.loginflag = localStorage.getItem('loginflag')
            // this.login = localStorage.getItem('login')
            // console.log('  this.loginflag',  this.loginflag,'this.login',this.login)
            this.getExercise(); //所有记录
            this.getmemberMsg(); //我的运动员
            this.tab = this.$route.query.index * 1 || 0;
            if (this.login) {
                window.localStorage.setItem('modle', 'PT')
            } else {
                window.localStorage.setItem('modle', 'DEMO')
            }
            let that = this
            document.addEventListener("plusready", () => {
                bluetoothTool.turnOnBluetooth()
                if (bluetoothTool.state.bluetoothEnable) {
                    that.discoveryNewDevice() // 发现设备
                }
            }, false)
        },
        computed: mapState([
            // 映射 this.loginflag 为 store.state.loginflag
            'loginflag',
            'login',
            'loginName'
        ]),
        watch: {
            tab(now,old){
                if(now == 1){
                    this.getExercise();
                }else if(now == 2){
                    this.getExercise();
                }else if(now == 3){
                    this.getmemberMsg();
                }
            },
            $route (to, from) {
                if (to != from) {
                alert('路由切换了') 
                    this.$router.go(0)
                }
            },
            // 监听status
            // status (newVal,oldVal) {
            //     alert('watch,status')
            //     alert(newVal)
            //     this.status = newVal
            // },
            // statusContent (newVal,oldVal) {
            //     this.statusContent = newVal
            // },
        },
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
                this.$router.push({ name: 'addAthletes', query: { username: item.username, sex: item.sex, birth: item.birth, height: item.height, weight: item.weight, tel: item.mobile } })
                window.localStorage.setItem('editCode', item.userCode)
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
                    res.data.data.forEach((item, index) => {
                        item.memberList = item.memberList.join('、')
                        item.expands = []
                        if (JSON.parse(item.expand) != null) {
                            var expand = JSON.parse(item.expand)
                            expand.forEach((v, ind) => {
                                var newArr = []
                                v.c.forEach((val, i) => {
                                    newArr.push(parseInt(val / 4))
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
                }else if(modle == 'PT'){
                }
                    if(index == 0){
                    this.leftValue = 10
                    this.rightValue = 15
                }else if(index == 1){
                    this.leftValue = 40
                    this.rightValue = 45
                }else if(index == 2){
                    this.leftValue = 80
                    this.rightValue = 85
                }
                window.localStorage.setItem('leftValue',this.leftValue)
                window.localStorage.setItem('rightValue',this.rightValue)
                this.$router.push({ name: 'SelectTime' });
            },
            godetail(index, text) {
                if(index == 0){
                    this.leftValue = 15
                    this.rightValue = 20
                }else if(index == 1){
                    this.leftValue = 25
                    this.rightValue = 30
                }else if(index == 2){
                    this.leftValue = 30
                    this.rightValue = 35
                }else if(index == 3){
                    this.leftValue = 35
                    this.rightValue = 40
                }else if(index == 4){
                    this.leftValue = 50
                    this.rightValue = 55
                }else if(index == 5){
                    this.leftValue = 55
                    this.rightValue = 60
                }else if(index == 6){
                    this.leftValue = 60
                    this.rightValue = 65
                }else if(index == 7){
                    this.leftValue = 70
                    this.rightValue = 75
                }else if(index == 8){
                    this.leftValue = 85
                    this.rightValue = 90
                }else if(index == 9){
                    this.leftValue = 90
                    this.rightValue = 95
                }
                window.localStorage.setItem('leftValue',this.leftValue)
                window.localStorage.setItem('rightValue',this.rightValue)
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
                if(index == 0){
                    this.leftValue = 15
                    this.rightValue = 20
                }else if(index == 1){
                    this.leftValue = 25
                    this.rightValue = 30
                }else if(index == 2){
                    this.leftValue = 30
                    this.rightValue = 35
                }else if(index == 3){
                    this.leftValue = 35
                    this.rightValue = 40
                }else if(index == 4){
                    this.leftValue = 50
                    this.rightValue = 55
                }else if(index == 5){
                    this.leftValue = 55
                    this.rightValue = 60
                }else if(index == 6){
                    this.leftValue = 60
                    this.rightValue = 65
                }else if(index == 7){
                    this.leftValue = 70
                    this.rightValue = 75
                }else if(index == 8){
                    this.leftValue = 85
                    this.rightValue = 90
                }else if(index == 9){
                    this.leftValue = 90
                    this.rightValue = 95
                }
                window.localStorage.setItem('leftValue',this.leftValue)
                window.localStorage.setItem('rightValue',this.rightValue)
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
            // 获取到的蓝牙地址
            getDeviceInfo() {
                deviceInfo().then((res) => {
                    if (res.data.code == 200) {
                        let list = res.data.data
                        for (let i = 0; i < list.length; i++) {
                            this.deviceList.push(list[i].unionCode)
                            console.log(this.deviceList, '11111')
                        }
                    }
                })
                .catch((err) => {
                    console.log(err)
                })
            },
            // 发现设备
            discoveryNewDevice() {
                this.statusContent = 1
                bluetoothTool.discoveryNewDevice(this.deviceList)
            },
            // 每隔1秒发送数据
            sendDataTime () {
                let that = this
                // let timer = setInterval(() => {
                //     if (!bluetoothTool.state.readThreadState) {
                //         clearInterval(timer)
                //         return false
                //     }
                //     bluetoothTool.sendData(that.sendDataNum)
                // }, 1000)
            },
            // 实时判断是否在实时接收数据
            watchReceiveData() {
                let that = this
                let timer = setInterval(() => {
                    alert(bluetoothTool.state.readThreadState)
                    if (!bluetoothTool.state.readThreadState) {
                        clearInterval(timer)
                        return false
                    }
                    if (that.dataList.length == 0) {
                        alert('未接收到数据')
                    } else {
                        alert('接收数据正常')
                        that.dataList = []
                    }
                    return false
                }, 6000)
            }
        }
    }
    export default vm

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