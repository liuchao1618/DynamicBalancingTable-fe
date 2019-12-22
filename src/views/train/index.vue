<template>
  <div class="train">
    <div class="patternWapper">
      <p>{{model}}</p>
      <div class="pattern">
        <div class="pattern_left">
          <p>设置运动时间</p>
          <div class="pattern_content">{{parseInt(fullPlayTime/60)}}分钟</div>
        </div>
        <div v-if="model == 'PT' || model == 'DEMO'" class="pattern_center">
          <p>使用设备</p>
          <div class="pattern_content">设备1</div>
        </div>
        <!-- 使用参数  -->
        <div v-if="model == 'PT'" class="pattern_right">
          <p>使用参数</p>
          <div class="right_box">
            <div class="box_list">
              <div class="box_num">{{leftPower}}</div>
              <div class="box_name">POWER LEFT</div>
            </div>
            <div class="box_list">
              <div class="box_num">{{avgPower}}</div>
              <div class="box_name">BOOST </div>
            </div>
            <div class="box_list">
              <div class="box_num">{{rightPower}}</div>
              <div class="box_name">POWER RIGHT</div>
            </div>
          </div>
        </div>
        <!-- 使用运动等级  -->
        <div v-if="model == 'DEMO'" class="pattern_right">
          <p>使用运动等级</p>
          <div class="pattern_content">{{level}}</div>
        </div>
        <!-- 操控点轨迹记录 -->
        <div v-if="model == 'LIVE'" class="pattern_right">
          <p>操控点轨迹记录</p>
          <canvas id='mycanvas' ref='myCanvas' width="198" height="88"
            style="border:1px solid rgba(117,121,137,1);"></canvas>
        </div>
      </div>
    </div>
    <div class="timerWapper">
      <div class="time_title">TIMER</div>
      <div class="time_num">{{currentTime}}</div>
    </div>
    <div class="buttonWapper">
      <div class="but_blue but" @click='start'>START</div>
      <div class="but_red but" @click='stop'>STOP</div>
      <div></div>
    </div>
  </div>
</template>

<script>
  const minLeftPower = 10;
  const minRightPower = 15;
  const minRuntime = 6.0;
  const maxRuntime = 10.0;
  const minStoptime = 1.0;
  const maxStoptime = 3.0;
  import { saveRecord } from '@/api/index'
  export default {
    name: 'Train',
    data() {
      return {
        value: 2,
        setTime: 0,
        currentTime: '00:00',
        model: '',
        devices: '',
        fullPlayTime: '',
        realPlayTime: '',
        leftPower: '',
        rightPower: '',
        avgPower: '',
        level: '',
        userCode: '',
        timer: null,
        expand: [],
        expands: [],
        interval1:null,
        timeNode:0,
        intervalCount: 0, // 结束要置零  偶数运动 奇数停止
        interva: null,
        closeFlag: false,
        markFlag:false
      }
    },
    mounted() {
      this.expand = JSON.parse(localStorage.getItem('expand'))
      this.expands = JSON.parse(localStorage.getItem('expands'))
      function s_to_hs(s) {
        //计算分钟
        //算法：将秒数除以60，然后下舍入，既得到分钟数
        var h;
        h = Math.floor(s / 60);
        //计算秒
        //算法：取得秒%60的余数，既得到秒数
        s = s % 60;
        //将变量转换为字符串
        h += '';
        s += '';
        //如果只有一位数，前面增加一个0
        h = (h.length == 1) ? '0' + h : h;
        s = (s.length == 1) ? '0' + s : s;
        return h + ':' + s;
      }
      this.fullPlayTime = this.$route.query.fullPlayTime;
      this.model = this.$route.query.model;
      this.level = this.$route.query.level;
      this.leftPower = this.$route.query.leftPower;
      this.rightPower = this.$route.query.rightPower;
      this.avgPower = this.$route.query.avgPower;
      if (this.model == 'LIVE') {
        this.setTime = 1
        this.currentTimeNum = 0
      } else {
        this.currentTimeNum = this.fullPlayTime - this.$route.query.realPlayTime
        this.currentTime = s_to_hs(this.fullPlayTime - this.$route.query.realPlayTime);

      }
    },
    methods: {
      randomScope(min, max, decimal) {
        if (!decimal || decimal <= 0) decimal = 0;
        return (Math.random() * (max - min + 1) + min).toFixed(decimal);
      },
      toInt(db) {
        return parseInt(parseFloat(db) * 1000);
      },

      /**
       * 10-15 ~ 90-95 差值位0-80
       * @param this.left
       */
       randomFuture() {
        try {
          if (this.intervalCount % 2 === 0) {
            let random0 = Math.floor(this.randomScope(0, this.leftPower, 0) / 5) * 5;
            random0 = Math.min(random0, this.leftPower - minLeftPower);
            return [random0 + minLeftPower, random0 + minRightPower, this.toInt(this.randomScope(minRuntime, maxRuntime, 1))]
          } else {
            return [0, 0, this.toInt(this.randomScope(minStoptime, maxStoptime, 1))]
          }
        } finally {
          this.intervalCount++;
        }
      },

       a() {
        clearTimeout(this.interva);
        if (this.closeFlag) {
          return;
        }
        let future = this.randomFuture(this.leftPower,this.rightPower);
        console.log(future);
        this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO', this.intervalCount, future[0],future[1], 0, 0] })
        
        this.interva = setTimeout(()=> {
          this.a();
        }, future[2])
      },
      start() {
       
        clearInterval(this.timer)
        if (this.model == 'LIVE') {
          this.timer = setInterval(() => {
            this.currentTimeNum++;
            this.currentTime = s_to_hs(this.currentTimeNum)
          }, 1000);
          this.f(this.expand)
        } else {
          if(this.model == 'PT'){
            this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['PT','', this.leftPower,this.rightPower, 0,0] })

          }else{
           this.a()
          }
          this.timer = setInterval(() => {
            if (this.currentTimeNum > 0) {
              this.currentTimeNum--;
              this.currentTime = s_to_hs(this.currentTimeNum)
            } else {
              clearInterval(this.timer)
              window.localStorage.setItem('devices', JSON.stringify([{ "deviceId": "1", "deviceAlias": "设备1" }]));
              this.$router.push({ name: 'finish', query: { left: this.leftPower, right: this.rightPower, avg: this.avgPower, fullPlayTime: this.fullPlayTime, realPlayTime: window.localStorage.getItem('setTrainTime') - this.currentTimeNum, id: res.data.data.id, level: this.level, model: this.model } })
            }
          }, 1000);
        }
        function s_to_hs(s) {
          //计算分钟
          //算法：将秒数除以60，然后下舍入，既得到分钟数
          var h;
          h = Math.floor(s / 60);
          //计算秒
          //算法：取得秒%60的余数，既得到秒数
          s = s % 60;
          //将变量转换为字符串
          h += '';
          s += '';
          //如果只有一位数，前面增加一个0
          h = (h.length == 1) ? '0' + h : h;
          s = (s.length == 1) ? '0' + s : s;
          return h + ':' + s;
        }

      },
      f(array) {
          clearTimeout(this.interval1);
          if (this.timeNode >= array.length) {
            this.timeNode = 0;
            return;
          }
          let temp = this.timeNode;
          this.interval1 = setTimeout(() => {
            // 发送数据
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['LIVE','', 0,0,array[this.timeNode++].c[0], array[this.timeNode++].c[1]] })

            console.log(array[this.timeNode++]);
            this.f(array);
          }, temp <= 0 ? array[temp].t : array[temp].t - array[temp - 1].t);
        },
      stop() {
        clearInterval(this.timer)

        let data = {
          model: this.$route.query.model,
          devices: [{ deviceId: 1, deviceAlias: '设备1' }],
          fullPlayTime: this.fullPlayTime * 1,
          realPlayTime: window.localStorage.getItem('setTrainTime') - this.currentTimeNum,
          leftPower: this.leftPower,
          rightPower: this.rightPower,
          avgPower: parseInt((this.leftPower + this.rightPower) / 2),
          userCode: window.localStorage.getItem('userCode'),
          level: this.level,
          locus: this.expands
        }
        saveRecord(data).then((res) => {
          if (res.data.code == 200) {
            window.localStorage.setItem('devices', JSON.stringify([{ "deviceId": "1", "deviceAlias": "设备1" }]));
            this.$router.push({ name: 'finish', query: { left: this.leftPower, right: this.rightPower, avg: this.avgPower, fullPlayTime: this.fullPlayTime, realPlayTime: window.localStorage.getItem('setTrainTime') - this.currentTimeNum, id: res.data.data.id, level: this.level, model: this.model } })
          }
        })
      },
    },
    updated() {
      var c = document.getElementById('mycanvas');
      var ctx = c.getContext("2d");
      ctx.strokeStyle = '#D1D5E6'
      var arr = this.expands
      arr.forEach((v, i) => {
        ctx.lineTo(v[0], v[1]);
      })
      ctx.stroke();

    },
  }
</script>

<style scoped lang="less">
  .train {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;
    overflow: hidden;

    .patternWapper {
      width: 94%;
      margin: 0 auto;
      margin-top: 100px;

      p {
        color: #B8BBC6;
        text-align: left;
        line-height: 36px;
        font-size: 24px;
      }

      .pattern {
        height: 204px;
        margin: 0 auto;
        display: flex;
        justify-content: space-between;
        padding: 80px 160px 0;
        text-align: center;
        background: rgba(254, 252, 255, 0.03);
        border-radius: 5px;
        border: 1px solid rgba(98, 101, 118, 1);

        .pattern_content {
          font-size: 36px;
          line-height: 92px;
          color: #E4E7F6;
        }

        .right_box {
          width: 318px;
          height: 77px;
          margin-top: 20px;
          padding: 8px 6px;
          display: flex;
          justify-content: space-between;
          border-radius: 2px;
          border: 1px solid rgba(117, 121, 137, 1);

          .box_num {
            color: #E4E7F6;
            font-size: 32px;
            line-height: 45px;
          }

          .box_name {
            color: #B7BAC8;
            font-size: 14px;
            line-height: 20px;
          }
        }
      }
    }

    .timerWapper {
      width: 30%;
      display: flex;
      margin: 0 auto;
      margin-top: 60px;

      .time_title {
        color: #C4C8D0;
        line-height: 133px;
        font-size: 30px;
        margin-right: 45px;
      }

      .time_num {
        width: 268px;
        height: 133px;
        opacity: 0.84;
        border: 4px solid rgba(131, 135, 147, 1);
        color: #D1D1DD;
        font-size: 76px;
        line-height: 133px;
      }
    }

    .buttonWapper {
      width: 40%;
      margin: 0 auto;
      margin-top: 100px;
      display: flex;
      justify-content: space-around;

      .but {
        width: 224px;
        height: 211px;
        color: #FFF;
        font-size: 38px;
        line-height: 211px;
      }

      .but_blue {
        background: rgba(0, 216, 29, 1);
      }

      .but_red {
        background: rgba(212, 27, 40, 1);
      }
    }
  }
</style>