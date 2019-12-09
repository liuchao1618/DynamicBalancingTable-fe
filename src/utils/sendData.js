export default {
    // 帧头 第一字节
    FRAME_HEAD : 0xCF,

    // 模式设置 第二字节
    SET_MODE : 0x01,        // 模式设置
    SPEED_DATA : 0x11,      // 速度数据(响应处理中)
    POSITION_DATA : 0x12,   // 位置数据(响应处理中)
    HEART_FRAME : 0x80,     // 心跳


    // 模式种类(只有在SET_MODE条件下有效) 第六字节
    MODE_SPEED : 0x01,       // 速度模式 PT-DEMO(响应成功)
    MODE_POSITION : 0x02,    // 位置模式 LIVE(响应成功)
    MODE_PAUSE : 0x03,       // 暂停模式 暂停、冻结(响应成功)
    MODE_ZERO : 0x04,        // 零点模式 复位(响应成功)
    MODE_RESET : 0x05,       // 大复位模式 故障(响应成功)

    MODE_STOP : 0x0A,        // 响应急停
    STOP_RUNNING : 0x1B,    // 急停复位中
    STOP_OK : 0x0B,

    ZERO : 0,                // 置空位

    dataNum: function (type) {
        if (type === 't0101') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_SPEED, 0, 0]
        } else if (type === 't0101') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_POSITION, 0, 0]
        } else if (type === 't0102') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_POSITION, 0, 0]
        } else if (type === 't0103') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_PAUSE, 0, 0]
        } else if (type === 't0104') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_ZERO, 0, 0]
        } else if (type === 't0105') {
            return [this.FRAME_HEAD, this.SET_MODE, 0, 0, 0, this.MODE_RESET, 0, 0]
        } else if (type === 't1101') {
            return [this.FRAME_HEAD, this.SPEED_DATA, 0x01, 0, 0, 0, 0, 0]
        } else if (type === 't1100') {
            return [this.FRAME_HEAD, this.SPEED_DATA, 0, 0x0C, 0x10, 0, 0, 0]
        } else if (type === 't1200') {
            return [this.FRAME_HEAD, this.POSITION_DATA, 0, 0, 0, 0, 0, 0]
        } else if (type === 't1201') {
            return [this.FRAME_HEAD, this.SPEED_DATA, 0x01, 0xCC, 0, 0, 0, 0]
        }
    },
        // 心跳
    t80() {
        return [this.FRAME_HEAD, this.HEART_FRAME, 0, 0, 0, 0, 0, 0]
    }
}
