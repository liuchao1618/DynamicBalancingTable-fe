function realconsole(){  
    alert()
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
        turnOnBluetoothCallback: function () { },
    }

    let bluetoothToolInstance = {
        state: state, //蓝牙状态
        init: init, //初始化回调函数
        statusContent: statusContent, // 页面显示状态
        isSupportBluetooth: isSupportBluetooth,
        getBluetoothStatus: getBluetoothStatus,
        turnOnBluetooth: turnOnBluetooth,
    
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
                options.turnOnBluetoothCallback && options.turnOnBluetoothCallback()
                return;
            }
        } else {
            shortToast("蓝牙已经打开");
            options.turnOnBluetoothCallback && options.turnOnBluetoothCallback()
        }
    }
}
