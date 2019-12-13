const pluginFub = {
    stopping: CmdUtil.STOPPING,   // 急停中 紧张发送数据
    resetting: CmdUtil.RESETTING, // 需要整体复位
    invalid: CmdUtil.INVALID,     // 格式校验无效
    unknown: CmdUtil.UNKNOWN,     // 协议之外的未知操作
    illegal: CmdUtil.ILLEGAL,     // 非法操作(比如在速度模式下传坐标) 可以无视

    /**
     * 发送心跳指令
     */
    sendHeart: function () {
        return CmdUtil.sendHeart();
    },

    /**
     * 发送设备故障复位指令
     */
    reset: function () {
        return CmdUtil.reset();
    },

    /**
     * 发送其他指令
     *
     * @param mode*          模式 PT DEMO LIVE NULL
     * @param type*          操作类型 PAUSE(暂停) ALAIN(复位) ON(运行)
     * @param responseArray* 已经解析好的响应数据 会在接收后存入缓存中
     * @param leftPower      PT DEMO模式下的左电机值
     * @param rightPower     PT DEMO模式下的右电机值
     * @param xOffset        LIVE模式下的横坐标
     * @param yOffset        LIVE模式下的纵坐标
     * @param callback       当请求过后需要重新请求
     *
     * @throws RESETTING     设备故障 需要立刻整体复位 调取reset函数
     * @throws STOPPING      设备急停 界面提示用户
     * @throws INVALID       设备响应信号为无效 不做处理
     * @throws UNKNOWN       协议之外的未知操作 可以记录一下(比如弹框) 无须做处理
     */
    invoke: function (mode, type, responseArray, leftPower, rightPower, xOffset, yOffset, callback) {
        return CmdUtil.invoke(mode, type, leftPower, rightPower, xOffset, yOffset, responseArray, callback);
    },

    /**
     * 接收数据调用
     *
     * @param originResponse 接收的原始数组
     * @param callback       回调函数
     *
     * @throws RESETTING     设备故障 需要立刻整体复位 调取reset函数
     * @throws STOPPING      设备急停 界面提示用户
     * @throws INVALID       设备响应信号为无效 不做处理
     */
    responseHandler: function (originResponse, callback) {
        return CmdUtil.responseHandler(originResponse, callback);
    },

    test: function (abc) {
        return CmdUtil.test(abc);
    }

};
export default pluginFub;

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

class CmdUtil {

    static cu = new CmdUtil();

    constructor() {
        this.modeCache = -1;
        this.arrayCache = [];
    }

    // 帧头 第一字节
    FRAME_HEAD = 0xCF;

    // 模式设置 第二字节
    SET_MODE = 0x01;          // 模式设置
    SPEED_DATA = 0x11;        // 速度数据(响应处理中)
    POSITION_DATA = 0x12;     // 位置数据(响应处理中)
    HEART_FRAME = 0x80;       // 心跳

    // 异常信息 第三字节
    DEVICE_EXC = 0x01;

    // 模式种类(只有在SET_MODE条件下有效) 第六字节
    MODE_SPEED = 0x01;        // 速度模式 PT-DEMO(响应成功)
    MODE_POSITION = 0x02;     // 位置模式 LIVE(响应成功)
    MODE_PAUSE = 0x03;        // 暂停模式 暂停、冻结(响应成功)
    MODE_ZERO = 0x04;         // 零点模式 复位(响应成功)
    MODE_RESET = 0x05;        // 大复位模式 故障(响应成功)

    MODE_STOP = 0x0A;         // 响应急停
    STOP_RUNNING = 0x1B;      // 急停复位中
    STOP_OVER = 0x0B;         // 急停恢复正常

    BLANK = 0;                // 置空位

    POLYNOMIAL = 0x1021;      // crc多项式

    // 心跳响应
    HEART_RESPONSE = [0xCF, 0x01, 0x00, 0x00, 0x00, 0x00, 0xD1, 0x62];
    HEART_RESPONSE_STR = this.HEART_RESPONSE.join(' ');

    modeCache;                // 模式缓存
    arrayCache;               // 解析后的响应数组缓存


    // 错误类型
    static STOPPING = 0xAA;   // 急停中 给用户提示 在此期间内无法发送数据
    static RESETTING = 0xBB;  // 需要整体复位
    static INVALID = 0xCC;    // 格式校验无效
    static UNKNOWN = 0xDD;    // 协议之外的未知操作
    static ILLEGAL = 0xEE;    // 非法操作(比如在速度模式下传坐标) 可以无视

    /**
     * 测试
     * @param abc
     */
    static test(abc) {
        alert(abc);
        alert("aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa");
    }

    /**
     * 发送心跳
     */
    static sendHeart() {
        let a = this.cu;
        return a.createCrc16([a.FRAME_HEAD, a.HEART_FRAME, a.BLANK, a.BLANK, a.BLANK, a.BLANK]);
    }

    /**
     * 设备复位
     */
    static reset() {
        let a = this.cu;
        return a.createCrc16([a.FRAME_HEAD, a.SET_MODE, a.BLANK, a.BLANK, a.BLANK, a.MODE_RESET]);
    }

    /**
     * 当模式发生变化时触发
     */
    static invoke(mode, type, leftPower, rightPower, xOffset, yOffset, responseArray, callback) {
        let a = this.cu;

        let doCallback = false;
        // 首次发送(不存在响应时)时， 至可以切换模式
        if (!this.hasLength(responseArray)) {
            return a.createCrc16([a.FRAME_HEAD, a.SET_MODE, a.BLANK, a.BLANK, a.BLANK, a.getMode(mode)]);
        }
        // 判断是否需要复位
        if (this.equalsCode(responseArray[2], a.DEVICE_EXC)) {
            // 复位不允许从这里调用 需要通过reset方法执行
            throw this.RESETTING;
        }
        // 判断是否是急停中
        if (this.equalsIn(responseArray[5], a.STOP_RUNNING, a.MODE_STOP)) {
            // 需要告知目前为急停状态 当急停响应解除 通过响应回调通知
            throw this.STOPPING;
        }

        // 现在为正常处理 先判断是否为模式执行成功 当速度模式、位置模式执行成功后 要通知蓝牙再次发送当前请求
        // 暂停模式成功、复位成功、故障复位成功、急停解成通知 不需要做处理
        try {
            switch (a.getMode(mode)) {
                case a.MODE_SPEED:
                    if (a.isSpeedMode(responseArray) || a.isSetSpeed(responseArray)) {
                        let ar = [a.FRAME_HEAD, a.SPEED_DATA];
                        ar.push(this.toHexArray(a.speedConvert(leftPower)));
                        ar.push(this.toHexArray(a.speedConvert(responseArray)));
                        return a.createCrc16(ar);
                    } else if (a.isSetMode(responseArray) && !a.isSetSpeed(responseArray)) {
                        // 需要切换模式 并重新调取
                        doCallback = true;
                        return a.createCrc16([a.FRAME_HEAD, a.SET_MODE, a.BLANK, a.BLANK, a.BLANK, a.MODE_SPEED]);
                    } else {
                        throw this.ILLEGAL;
                    }
                case a.MODE_POSITION:
                    if (a.isPositionMode(responseArray) || a.isSetPosition(responseArray)) {
                        let ar = [a.FRAME_HEAD, a.POSITION_DATA];
                        ar.push(this.toHexArray(xOffset));
                        ar.push(this.toHexArray(yOffset));
                        return a.createCrc16(ar);
                    } else if (a.isSetMode(responseArray) && !a.isSetPosition(responseArray)) {
                        // 需要切换模式 并重新调取
                        doCallback = true;
                        return a.createCrc16([a.FRAME_HEAD, a.SET_MODE, a.BLANK, a.BLANK, a.BLANK, a.MODE_POSITION]);
                    } else {
                        throw this.ILLEGAL;
                    }
                case a.MODE_ZERO:
                    return a.createCrc16([a.FRAME_HEAD, a.SET_MODE, a.BLANK, a.BLANK, a.BLANK, a.MODE_ZERO]);
                default:
                    throw this.UNKNOWN;
            }
        } finally {
            if (doCallback) {
                callback.onAgain();
            }
        }

    }

    static responseHandler(originResponse, callback) {
        try {
            callback.success(this.cu.parseResponseArray(originResponse));
        } catch (e) {
            callback.error(e);
        } finally {
            callback.complete(this.cu.arrayCache);
        }
    }

    //////////////////////////////////////////////////////内部函数///////////////////////////////////////////////////////

    parseResponseArray(responseArray) {
        let a = CmdUtil.cu;
        responseArray = a.analyzeDataArray(responseArray); // 可能抛出INVALID异常
        if (CmdUtil.cu.isHeart(responseArray)) {
            // 为心跳 直接结束流程 缓存依旧是上次的缓存
            return a.HEART_FRAME;
        }
        try {
            switch (responseArray[1]) {
                case a.SET_MODE:
                    if (CmdUtil.equalsCode(responseArray[2], a.DEVICE_EXC)) {
                        // 当硬件有错时是01，此时上位机发送大复位动作 由外部捕获
                        throw CmdUtil.RESETTING;
                    }
                    if (CmdUtil.equalsCode(responseArray[5], a.MODE_STOP)) {
                        // 当设备急停时 触发急停异常 通知用户界面禁止操作
                        throw CmdUtil.STOPPING;
                    }
                    if (CmdUtil.equalsCode(responseArray[5], a.STOP_OVER)) {
                        // 急停解除
                        return a.STOP_OVER;
                    }
                    break;
                case a.MODE_SPEED:
                    // TODO do nothing
                    break;
                case a.MODE_POSITION:
                    // TODO do nothing
                    break;
                default:
            }
            return a.BLANK;
        } finally {
            a.arrayCache = responseArray;
        }
    }

    getMode(modeStr) {
        switch (modeStr.toUpperCase()) {
            case 'PT':
            case 'DEMO':
                return CmdUtil.cu.MODE_SPEED;
            case 'LIVE':
                return CmdUtil.cu.MODE_POSITION;
            default:
                return CmdUtil.cu.MODE_ZERO;
        }
    }

    analyzeDataArray(originResponse) {
        const l = originResponse.length;
        if (l < 8) {
            throw CmdUtil.INVALID;
        } else if (l === 8 && CmdUtil.equalsCode(originResponse[0], CmdUtil.cu.HEART_FRAME)) {
            this.verify(originResponse);
            return originResponse;
        } else if (l > 8) {
            // 排除心跳
            if (originResponse.join(' ').includes(CmdUtil.cu.HEART_RESPONSE_STR)) {
                originResponse = originResponse.replaceAll(CmdUtil.cu.HEART_RESPONSE_STR, '')
                    .trim().split(/\s+/);
                if (originResponse.length < 8) {
                    // 此时全部都是心跳
                    return CmdUtil.cu.HEART_RESPONSE;
                }
            }
            let number = CmdUtil.arrayLastIndexOf(originResponse, CmdUtil.cu.FRAME_HEAD);
            if (number >= 0) {
                originResponse = originResponse.slice(number, number + 8);
                this.verify(originResponse);
                return originResponse;
            }
        }
        alert("错误的响应数据：" + originResponse);
        throw CmdUtil.INVALID;
    }

    isHeart(array) {
        return CmdUtil.cu.HEART_RESPONSE_STR === array.join(' ');
    }

    verify(array) {
        CmdUtil.cu.verifyCrc16(array);
    }

    verifyFrameHeard(array) {
        if (!CmdUtil.equalsCode(array[0], CmdUtil.cu.HEART_FRAME)) {
            throw CmdUtil.INVALID;
        }
    }

    verifyCrc16(array) {
        if (array.length < 8) {
            throw CmdUtil.INVALID;
        }
        if (!CmdUtil.equalsCode(array.slice(6).reduce((pv, cv) => pv << 8 | cv), CmdUtil.crc16(array.slice(0, 6)))) {
            throw CmdUtil.INVALID;
        }
    }

    createCrc16(array) {
        if (array.length > 6) {
            array = array.slice(0, 6);
        }
        array.push(CmdUtil.toHexArray(CmdUtil.crc16(array)));
        return array;
    }

    speedConvert(speed) {
        return CmdUtil.range(speed, 0, 100) << 3;
    }

    isSpeedMode(responseArray) {
        return CmdUtil.equalsCode(responseArray[1], CmdUtil.cu.SPEED_DATA);
    }

    isPositionMode(responseArray) {
        return CmdUtil.equalsCode(responseArray[1], CmdUtil.cu.POSITION_DATA);
    }

    isSetSpeed(responseArray) {
        return CmdUtil.equalsCode(responseArray[1], CmdUtil.cu.SET_MODE) && CmdUtil.equalsCode(responseArray[5], CmdUtil.cu.MODE_SPEED);
    }

    isSetPosition(responseArray) {
        return CmdUtil.equalsCode(responseArray[1], CmdUtil.cu.SET_MODE) && CmdUtil.equalsCode(responseArray[5], CmdUtil.cu.MODE_POSITION);
    }

    isSetMode(responseArray) {
        return CmdUtil.equalsCode(responseArray[1], CmdUtil.cu.SET_MODE);
    }

    //////////////////////////////////////////////////////通用函数///////////////////////////////////////////////////////

    static equalsCode(code, target) {
        return !(code ^ target);
    }

    static equalsIn(code, ...targets) {
        return targets.filter(v => this.equalsCode(code, v)).length > 0;
    }

    static randomScope(min, max, decimal) {
        if (!decimal || decimal <= 0) decimal = 0;
        return (Math.random() * (max - min + 1) + min).toFixed(decimal);
    }

    static toHexArray(number) {
        let uint = number >>> 0;
        return [(uint >> 8) & 0xFF, uint & 0xFF];
    }

    static arrayLastIndexOf(array, target) {
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (this.equalsCode(array[i], target)) {
                index = i;
            }
        }
        return index;
    }

    static hasLength(obj) {
        return obj.length > 0;
    }

    static range(value, min, max) {
        value = Math.max(min, value);
        value = Math.min(max, value);
        return value;
    }

    static crc16(array) {
        let crc = 0;
        for (let n = 6; n > 0; n--) {
            crc ^= (array[6 - n] << 8);
            for (let j = 0; j < 8; j++) {
                crc = crc & 0x8000 ? (crc << 1) ^ this.cu.POLYNOMIAL : crc << 1;
            }
            crc &= 0xFFFF;
        }
        return crc;
    }

}
