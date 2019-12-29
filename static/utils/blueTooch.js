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
    let windowMe = invoke(activity, "getWindow");

    let decorView = invoke(windowMe, "getDecorView");


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
    let judgementState = false // 连接已经配对过的设备是否成功

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
        connExceptionCallback: function (stateContent) { },
         /**
         * 蓝牙获取已经配对设备回调
         * @param {Exception} e
         */
        getPairedDevicesback: function (stateContent) { },
         /**
         * 蓝牙发送数据回调
         * @param {Exception} e
         */
        sendDataback: function (stateContent) { },
        // 获取默认蓝牙回调
        getPairedDevicescallback: function(stateContent) { }
    }

    let bluetoothToolInstance = {
        state: state, //蓝牙状态
        init: init, //初始化回调函数
        // statusContent: statusContent, // 页面显示状态
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
        sendData: sendData,
        windowMeFlag: windowMeFlag
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
        alert(Toast)
        Toast.makeText(activity, msg, Toast.LENGTH_SHORT).show();
    }
    function windowMeFlag () {
        invoke(decorView, "setSystemUiVisibility", 5894);
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
            // shortToast("没有蓝牙");
            return;
        }
        if (!btAdapter.isEnabled()) {
            if (activity == null) {
                // shortToast("未获取到activity", activity);
                return;
            } else {
                let intent = new Intent(BluetoothAdapter.ACTION_REQUEST_ENABLE);
                let requestCode = 1;
                activity.startActivityForResult(intent, requestCode);
                return;
            }
        } else {
            // shortToast("蓝牙已经打开");
            statusContent = 1;
            options.turnOnBluetoothCallback && options.turnOnBluetoothCallback(statusContent)
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
            statusContent = 0;
            // shortToast("蓝牙关闭成功");
        } else {
            statusContent = 0;
            // shortToast("蓝牙已经关闭");
        }
    }

    /**
     * 获取已经配对的设备
     * @return {Array} connetedDevices
     */
    function getPairedDevices(discoveryAddress) {
        // statusContent = 1
        // options.discoveryFinishedCallback && options.discoveryFinishedCallback(statusContent);
        // alert('获取默认设备')
        // console.log('获取默认设备')
        statusContent = 1
        options.getPairedDevicescallback && options.getPairedDevicescallback(statusContent)
        // alert('获取已经配对的设备')
        let pairedDevices = [];

        //蓝牙连接android原生对象，是一个set集合
        let pairedDevicesAndroid = null;
        if (btAdapter != null && btAdapter.isEnabled()) {
            pairedDevicesAndroid = btAdapter.getBondedDevices();
        } else {
            // shortToast("蓝牙未开启");
        }

        if (!pairedDevicesAndroid) {
            return pairedDevices;
        }

        //遍历连接设备的set集合，转换为js数组
        let it = invoke(pairedDevicesAndroid, "iterator");
        while (invoke(it, "hasNext")) {
            let device = invoke(it, "next");
            let address = String(plus.android.invoke(device, "getAddress"))
            if (discoveryAddress.indexOf(address) > -1 ) {
                connDevice(address)
                cancelDiscovery();
            }
        }
    }

    /**
     * 发现设备
     */
    function discoveryNewDevice(discoveryAddress) {
        // console.log(discoveryAddress+'kkkkkjjjjjjjj')
        // alert('发现设备')
        statusContent = 1
        options.discoveryFinishedCallback && options.discoveryFinishedCallback(statusContent);
        // console.log('length ===========00000')

        if (discoveryAddress.length == 0) {
            // console.log('length ===========1111')
            // shortToast('未提供可配对设备地址')
            cancelDiscovery(); // 取消发现
            statusContent = 2
            options.discoveryFinishedCallback && options.discoveryFinishedCallback(statusContent);
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
            // console.log('66666666666666')
        //6.0以后的如果需要利用本机查找周围的wifi和蓝牙设备, 申请权限
        if (Build.VERSION.SDK_INT >= 6.0) {
            plus.android.requestPermissions(['android.permission.ACCESS_FINE_LOCATION'], function(e){
                if(e.deniedAlways.length>0){	//权限被永久拒绝
                    // 弹出提示框解释为何需要定位权限，引导用户打开设置页面开启
                    // console.log('Always Denied!!! '+ e.deniedAlways.toString());
                }
                if(e.deniedPresent.length>0){	//权限被临时拒绝
                    // 弹出提示框解释为何需要定位权限，可再次调用plus.android.requestPermissions申请权限
                    // console.log('Present Denied!!! '+e.deniedPresent.toString());
                }
                if(e.granted.length>0){	//权限被允许
                    //调用依赖获取定位权限的代码
                    // console.log('Granted!!! '+e.granted.toString());
                }
            }, function(e){
                    // console.log('Request Permissions error:'+JSON.stringify(e));
            });
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
                        // shortToast('未发现可用设备')
                        statusContent = 2;
                    }
                    cancelDiscovery();
                    options.discoveryFinishedCallback && options.discoveryFinishedCallback(statusContent);
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
                        let content = '';
                        switch (blueState) {
                            case BluetoothAdapter.STATE_TURNING_ON:
                                content = 1;
                                break;
                            case BluetoothAdapter.STATE_ON:
                                state.bluetoothEnable = true;
                                content = 1;
                                // shortToast('蓝牙已开启')
                                break;
                            case BluetoothAdapter.STATE_TURNING_OFF:
                                state.bluetoothEnable = false;
                                break;
                            case BluetoothAdapter.STATE_OFF:
                                // shortToast('设备已断开连接')
                                content = 0;
                                state.bluetoothEnable = false;
                                break;
                        }
                        statusContent = content;
                        options.listenBTStatusCallback && options.listenBTStatusCallback(statusContent);
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
        // alert('连接设备')
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
            // shortToast("连接失败，获取Socket失败！");
            return false;
        }
        try {
            invoke(btSocket, "connect");
            readData(); //读数据
            // shortToast("连接成功");
        } catch (e) {
            console.error(e);
            // shortToast("连接失败");
            try {
                btSocket.close();
                btSocket = null;
            } catch (e1) {
                console.error(e1);
            }
            statusContent = 2;
            judgementState = false
            options.connDeviceCallback && options.connDeviceCallback(statusContent, judgementState)
            return false;
        }
        statusContent = 3;
        judgementState = true
        options.connDeviceCallback && options.connDeviceCallback(statusContent, judgementState)
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
        // shortToast("断开连接成功");
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
        // alert('取消发现')
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
            // shortToast("请先连接蓝牙设备！");
            return false;
        }
        try {
            btInStream = invoke(btSocket, "getInputStream");
            btOutStream = invoke(btSocket, "getOutputStream");
        } catch (e) {
            // console.error(e);
            // shortToast("创建输入输出流失败！");
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
                            // shortToast('设备已断开连接')
                            statusContent = 2
                            options.connExceptionCallback && options.connExceptionCallback(statusContent);
                        }
                    }
                    let dataArr = [];
                    while (invoke(btInStream, "available") !== 0) {
                        let data = invoke(btInStream, "read");
                        dataArr.push(data);
                        let ct = new Date().getTime();
                        // if (ct - t > 100) {
                        //     break;
                        // }
                    }
                    if (dataArr.length > 0) {
                        // alert('接收数据')

                        // shortToast(dataArr+"接收到的数据")
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
        console.log(dataStr)
        // console.log(typeof dataStr)
        console.log(dataStr.map(v => v.toString(16)))

        // shortToast(dataStr)
        // shortToast(typeof dataStr)
        // shortToast(dataStr.map(v => v.toString(16)))
        if (!btOutStream) {
            // shortToast("创建输出流失败！");
            return;
        }
        // let bytes = invoke(dataStr, 'getBytes', 'gbk');
        // alert('发送数据')
        try {
           for (let i = 0; i < dataStr.length; i++) {
                btOutStream.write(dataStr[i])
            }
        } catch (e) {
            statusContent = 2
            state.readThreadState = false;
            options.sendDataback && options.sendDataback(statusContent)
            // shortToast('发送失败')
            return false;
        }
        // alert('发送成功')
        return true;
    }
}