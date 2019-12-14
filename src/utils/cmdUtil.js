
// const CmdUtils = {
  // 帧头 第一字节
  let FRAME_HEAD =  0xCF;

// 模式设置 第二字节
    let SET_MODE =  0x01;          // 模式设置
    let SPEED_DATA =  0x11;        // 速度数据(响应处理中)
    let POSITION_DATA =  0x12;     // 位置数据(响应处理中)
    let HEART_FRAME =  0x80;       // 心跳

// 异常信息 第三字节
    let DEVICE_EXC =  0x01;

// 模式种类(只有在SET_MODE条件下有效) 第六字节
    let MODE_SPEED =  0x01;        // 速度模式 PT-DEMO(响应成功)
    let MODE_POSITION =  0x02;     // 位置模式 LIVE(响应成功)
    let MODE_PAUSE =  0x03;        // 暂停模式 暂停、冻结(响应成功)
    let MODE_ZERO =  0x04;         // 零点模式 复位(响应成功)
    let MODE_RESET =  0x05;        // 大复位模式 故障(响应成功)

    let MODE_STOP =  0x0A;         // 响应急停
    let STOP_RUNNING =  0x1B;      // 急停复位中
    let STOP_OVER =  0x0B;         // 急停恢复正常

    let BLANK =  0;                // 置空位

    let POLYNOMIAL =  0x1021;      // crc多项式

// 心let 跳响应
    let HEART_RESPONSE =  [0xCF, 0x01, 0x00, 0x00, 0x00, 0x00, 0xD1, 0x62];
    let HEART_RESPONSE_STR =  HEART_RESPONSE.join(' ');

    let modeCache =  -1;                // 模式缓存
    let arrayCache =  [0xCF, 0X01, 0X00, 0X80, 0X00, 0X04, 0xAA, 0xBC];

    let STOPPING =  0xAA;   // 急停中 给用户提示 在此期间内无法发送数据
    let RESETTING =  0xBB;  // 需要整体复位
    let INVALID =  0xCC;    // 格式校验无效
    let UNKNOWN =  0xDD;    // 协议之外的未知操作
    let ILLEGAL =  0xEE;    // 非法操作(比如在速度模式下传坐标) 可以无视

    function sendHeart0 () {
        return createCrc16([FRAME_HEAD, HEART_FRAME, BLANK, BLANK, BLANK, BLANK]);
    };
    function reset0() {
        return createCrc16([FRAME_HEAD, SET_MODE, BLANK, BLANK, BLANK, MODE_RESET]);
    };

    function invoke0(mode, type, leftPower, rightPower, xOffset, yOffset, responseArray) {
        let data;
        // 判断是否需要复位
        if (equalsCode(responseArray[2], DEVICE_EXC)) {
            // 复位不允许从这里调用 需要通过reset方法执行
            throw RESETTING;
        }
        // 判断是否是急停中
        if (equalsIn(responseArray[5], STOP_RUNNING, MODE_STOP)) {
            // 需要告知目前为急停状态 当急停响应解除 通过响应回调通知
            throw STOPPING;
        }

        // 现在为正常处理 先判断是否为模式执行成功 当速度模式、位置模式执行成功后 要通知蓝牙再次发送当前请求
        // 暂停模式成功、复位成功、故障复位成功、急停解成通知 不需要做处理
        
        switch (getMode(mode)) {
            case MODE_SPEED:
                if (isSpeedMode(responseArray) || isSetSpeed(responseArray)) {
                    // alert('invoke22222222222')
                    data = [FRAME_HEAD, SPEED_DATA];
                    data.push(...toHexArray(speedConvert(leftPower)));
                    data.push(...toHexArray(speedConvert(rightPower)));
                    data = createCrc16(data);
                    data.push(false);
                    return data;
                } else if (isSetMode(responseArray) && !equalsCode(responseArray[5], MODE_SPEED)) {
                    // alert('33333333')
                    // 需要切换模式 并重新调取
                    data = createCrc16([FRAME_HEAD, SET_MODE, BLANK, BLANK, BLANK, MODE_SPEED]);
                    data.push(true);
                    return data;
                } else {
                    // alert('3444444444444')
                    throw ILLEGAL;
                }
            case MODE_POSITION:
                if (isPositionMode(responseArray) || isSetPosition(responseArray)) {
                    data = [FRAME_HEAD, POSITION_DATA];
                    data.push(...toHexArray(xOffset));
                    data.push(...toHexArray(yOffset));
                    data = createCrc16(data);
                    data.push(false);
                    return data;
                } else if (isSetMode(responseArray) && !equalsCode(responseArray[5], MODE_POSITION)) {
                    // 需要切换模式 并重新调取
                    data = createCrc16([FRAME_HEAD, SET_MODE, BLANK, BLANK, BLANK, MODE_POSITION]);
                    data.push(true);
                    return data;
                } else {
                    throw ILLEGAL;
                }
            case MODE_ZERO:
                data = createCrc16([FRAME_HEAD, SET_MODE, BLANK, BLANK, BLANK, MODE_ZERO]);
                data.push(false);
                return data;
            default:
                throw UNKNOWN;
        }
    };

    function responseHandle(originResponse, callback) {
        try {
            callback.success(parseResponseArray(originResponse));
        } catch (e) {
            callback.error(e);
        } finally {
            callback.complete(arrayCache);
        }
    };

    function parseResponseArray(responseArray) {
        responseArray = analyzeDataArray(responseArray); // 可能抛出INVALID异常
        if (isHeart(responseArray)) {
            // 为心跳 直接结束流程 缓存依旧是上次的缓存
            return HEART_FRAME;
        }
        try {
            switch (responseArray[1]) {
                case SET_MODE:
                    if (equalsCode(responseArray[2], DEVICE_EXC)) {
                        // 当硬件有错时是01，此时上位机发送大复位动作 由外部捕获
                        throw RESETTING;
                    }
                    if (equalsCode(responseArray[5], MODE_STOP)) {
                        // 当设备急停时 触发急停异常 通知用户界面禁止操作
                        throw STOPPING;
                    }
                    if (equalsCode(responseArray[5], STOP_OVER)) {
                        // 急停解除
                        return STOP_OVER;
                    }
                    break;
                case MODE_SPEED:
                    // TODO do nothing
                    break;
                case MODE_POSITION:
                    // TODO do nothing
                    break;
                default:
            }
            return BLANK;
        } finally {
            arrayCache = responseArray;
        }
    }

    function getMode(modeStr) {
        switch (modeStr.toUpperCase()) {
            case 'PT':
            case 'DEMO':
                return MODE_SPEED;
            case 'LIVE':
                return MODE_POSITION;
            default:
                return MODE_ZERO;
        }
    }

    function analyzeDataArray(originResponse) {
        const l = originResponse.length;
        
        if (l < 8) {
            throw INVALID;
        } else if (l === 8 && equalsCode(originResponse[0], FRAME_HEAD)) {
            verify(originResponse);
            return originResponse;
        } else if (l > 8) {
            // 排除心跳
            if (originResponse.join(' ').includes(HEART_RESPONSE_STR)) {
                originResponse = originResponse.replaceAll(HEART_RESPONSE_STR, '')
                    .trim().split(/\s+/);
                if (originResponse.length < 8) {
                    // 此时全部都是心跳
                    return HEART_RESPONSE;
                }
            }
            let number = arrayLastIndexOf(originResponse, FRAME_HEAD);
            if (number >= 0) {
                originResponse = originResponse.slice(number, number + 8);
                verify(originResponse);
                return originResponse;
            }
        }
        throw INVALID;
    }

    function isHeart(array) {
        return HEART_RESPONSE_STR === array.join(' ');
    }

    function verify(array) {
        verifyCrc16(array);
    }

    function verifyFrameHeard(array) {
        if (!equalsCode(array[0], HEART_FRAME)) {
            throw INVALID;
        }
    }

    function verifyCrc16(array) {
        if (array.length < 8) {
            throw INVALID;
        }
        if (!equalsCode(array.slice(6).reduce((pv, cv) => pv << 8 | cv), crc16(array.slice(0, 6)))) {
            throw INVALID;
        }
    }

    function createCrc16(array) {
        if (array.length > 6) {
            array = array.slice(0, 6);
        }
        array.push(...toHexArray(crc16(array)));
        return array;
    }

    function speedConvert(speed) {
        return range(speed, 0, 100) << 3;
    }

    function isSpeedMode(responseArray) {
        return equalsCode(responseArray[1], SPEED_DATA);
    }

    function isPositionMode(responseArray) {
        return equalsCode(responseArray[1], POSITION_DATA);
    }

    function isSetSpeed(responseArray) {
        return equalsCode(responseArray[1], SET_MODE) && equalsCode(responseArray[5], MODE_SPEED);
    }

    function isSetPosition(responseArray) {
        return equalsCode(responseArray[1], SET_MODE) && equalsCode(responseArray[5], MODE_POSITION);
    }

    function isSetMode(responseArray) {
        return equalsCode(responseArray[1], SET_MODE);
    }
    function equalsCode(code, target) {
        return !(code ^ target);
    }

    function equalsIn(code, ...targets) {
        return targets.filter(v => equalsCode(code, v)).length > 0;
    }

    function randomScope(min, max, decimal) {
        if (!decimal || decimal <= 0) decimal = 0;
        return (Math.random() * (max - min + 1) + min).toFixed(decimal);
    }

    function toHexArray(number) {
        let uint = number >>> 0;
        return [(uint >> 8) & 0xFF, uint & 0xFF];
    }

    function arrayLastIndexOf(array, target) {
        let index = -1;
        for (let i = 0; i < array.length; i++) {
            if (equalsCode(array[i], target)) {
                index = i;
            }
        }
        return index;
    }

    function hasLength(obj) {
        return obj.length > 0;
    }

    function range(value, min, max) {
        value = Math.max(min, value);
        value = Math.min(max, value);
        return value;
    }

    function crc16(array) {
        let crc = 0;
        for (let n = 6; n > 0; n--) {
            crc ^= (array[6 - n] << 8);
            for (let j = 0; j < 8; j++) {
                crc = crc & 0x8000 ? (crc << 1) ^ POLYNOMIAL : crc << 1;
            }
            crc &= 0xFFFF;
        }
        return crc;
    }
// }

const pluginFub = {
    stopping: 0xAA,   // 急停中 紧张发送数据
    resetting: 0xBB, // 需要整体复位
    invalid: 0xCC,     // 格式校验无效
    unknown: 0xDD,     // 协议之外的未知操作
    illegal: 0xEE,     // 非法操作(比如在速度模式下传坐标) 可以无视
    
    STOP_OVER: 0x0B,
    LOOP_FLAG: false,

    /**
     * 发送心跳指令
     */
    sendHeart: function () {
        return sendHeart0();
    },

    /**
     * 发送设备故障复位指令
     */
    reset: function () {
        return reset0();
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
    invoke: function (mode, type, responseArray, leftPower, rightPower, xOffset, yOffset) {
        return invoke0(mode, type, leftPower, rightPower, xOffset, yOffset, responseArray);
    
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
        return responseHandle(originResponse, callback);
    },

    equals: function(code, target) {
        return equalsCode(code, target);
    },
    createCrc: function(array) {
        return createCrc16(array)
    }
};
export default pluginFub;


