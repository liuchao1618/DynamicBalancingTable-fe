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
      alert('打开设备')
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
      alert('关闭设备')
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
      alert('要找到地址链接啦')
      alert(JSON.stringify(discoveryAddress))
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
                      cancelDiscovery();
                      connDevice(address)
                  }
              }
              if (BluetoothAdapter.ACTION_DISCOVERY_FINISHED == action) { // 搜索完成
                  cancelDiscovery();
                  if (!state.readThreadState) {
                      state.statusContent = 2;
                  }
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
                              content = 0;
                              break;
                          case BluetoothAdapter.STATE_ON:
                              state.bluetoothEnable = true;
                              content = 1;
                              stateStr = "STATE_ON";
                              alert('蓝牙已经打开，怎么打开的？')
                              break;
                          case BluetoothAdapter.STATE_TURNING_OFF:
                              stateStr = "STATE_TURNING_OFF";
                              state.bluetoothEnable = false;
                              break;
                          case BluetoothAdapter.STATE_OFF:
                              stateStr = "STATE_OFF";
                              alert('蓝牙已关闭，请手动打开')
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
      alert('取消搜索了')
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
                  if (setTimeCount % 20 == 0) {
                      try {
                          btOutStream.write([0b00]);
                      } catch (e) {
                          state.readThreadState = false;
                          state.setTimeCount = 2
                          options.connExceptionCallback && options.connExceptionCallback(state.setTimeCount);
                      }
                  }
                  let dataArr = [];
                  while (invoke(btInStream, "available") !== 0) {
                      let data = invoke(btInStream, "read");
                      dataArr.push(data);
                      let ct = new Date().getTime();
                      if (ct - t > 20) {
                          break;
                      }
                  }
                  if (dataArr.length > 0) {
                      alert('接收数据')
                      alert(dataArr)
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
      let bytes = invoke(dataStr, 'getBytes', 'gbk');
      try {
          btOutStream.write(bytes);
      } catch (e) {
          alert('发送失败')
          return false;
      }
      alert('发送成功')
      return true;
  }
};

export default BluetoothTool