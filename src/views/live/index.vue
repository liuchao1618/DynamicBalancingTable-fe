<template>
  <div class="live">
    <div class="imgbox">
      <img src="../../assets/image/title.png" alt="">
    </div>
    <div class="live_trajectory">
      <!-- <div class="yellow" @mousedown=changeMap($event)></div> -->
      <div class="yellow" id="moveDiv" v-if='flag' @mousedown="down" @touchstart="down" @mousemove="move" @touchmove="move"
        @mouseup="end" @touchend="end"></div>
        <div class="yellow" v-else></div>
      <img src="../../assets/image/base@2x.png" alt="">
    </div>
    <div class="live_operation">
      <div class="operation_bcak" @click='back'>BACK</div>
      <div class="operation_time">{{currentTime}}</div>
      <div class="operation_blue operation_but" @click='start'>START</div>
      <div class="operation_red operation_but" @click='stop'>STOP</div>
    </div>
  </div>
</template>
<script>
  import {saveRecord} from '@/api/index'
  export default {
    data() {
      return {
        positionX: 0,
        positionY: 0,
        flags: false,
        currentTime:'00:00',
        setTime:0,
        position: { x: 0, y: 0 },
        timer:null,
        flag:false,
        dataArr:[],
        startStr:'',
        currentStr:'',
        x:0
      }
    },
    methods: {
      stop(){
        clearInterval(this.timer)
          // locus:[{
          //   a :555,88
          //   :111 555 87
          //   :111 557 86
          // }]
        let data = {
          model: 'LIVE',
          devices: [{ deviceId: 1, deviceAlias: '设备1' }],
          realPlayTime: this.setTime,
          userCode: window.localStorage.getItem('userCode'),
          locus:this.dataArr
        }
        saveRecord(data).then(res=>{
          console.log(res)
        })
      },
      start(){
        this.startStr = new Date()*1
        this.flag = true
        /**
       * 将秒转换为 分:秒
       * s int 秒数
      */
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
      this.timer = setInterval(() => {
        if(this.setTime>=1200){
          this.setTime = 1200
        }else{
          this.setTime++;
        }
          this.currentTime = s_to_hs(this.setTime)
      }, 1000);
      },
      back() {
        this.$router.go(-1)
      },
      down() {
        this.flags = true;
        var touch;
        if (event.touches) {
          touch = event.touches[0];
        } else {
          touch = event;
        }
        this.position.x = touch.clientX;
        this.position.y = touch.clientY;
        this.dx = moveDiv.offsetLeft;
        this.dy = moveDiv.offsetTop;
      },
      move() {
        if (this.flags) {
          var touch;
          if (event.touches) {
            touch = event.touches[0];
          } else {
            touch = event;
          }
          this.nx = touch.clientX - this.position.x;
          this.ny = touch.clientY - this.position.y;
          this.xPum = this.dx + this.nx + 20;
          this.yPum = this.dy + this.ny + 20;
          if (this.xPum < 15) this.xPum = 15
          if (this.xPum > 996) this.xPum = 996
          if (this.yPum < 20) this.yPum = 20
          if (this.yPum > 265) this.yPum = 265
          moveDiv.style.left = this.xPum + "px";
          moveDiv.style.top = this.yPum + "px";
          
          if((new Date()*1-this.setTime*1000-this.startStr)%200==5){
            console.log(new Date()*1-this.setTime*1000-this.startStr)
            this.dataArr.push(
            {t:this.x+=200,c:[this.xPum,this.yPum]}
          )
          }
          
          // console.log(this.dataArr,this.xPum,this.yPum)
          //阻止页面的滑动默认事件
          document.addEventListener("touchmove", function () { // 1.2 如果碰到滑动问题，请注意是否获取到 touchmove
            // event.preventDefault();//jq 阻止冒泡事件
            // event.stopPropagation(); // 如果没有引入jq 就用 stopPropagation()
          }, false);
        }
      },
      //鼠标释放时候的函数
      end() {
        this.dataArr.push({t:this.x+=200,c:[506,142]})
        console.log(this.dataArr)
        this.flags = false;
        moveDiv.style.left = '506px'
        moveDiv.style.top = '142px'
      },
    },
    computed: {},
    name: 'Live',
  }
</script>
<style scoped lang="less">
  .yellow {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    background: rgba(230, 238, 34, 1);
    position: absolute;
    left: 50%;
    top: 50%;
    margin-top: -25px;
    z-index: 999;
    touch-action: none;
    margin-left: -25px;
  }

  .live {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;

    .imgbox {
      padding-top: 50px;
    }

    .imgbox img {
      width: 280px;
      height: 64px;
      // margin-bottom: 234px;
    }

    .live_operation {
      display: flex;
      padding-left: 133px;
      align-items: flex-end;

      .operation_bcak {
        width: 174px;
        height: 75px;
        border: 4px solid rgba(234, 234, 240, 1);
        font-size: 42px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(234, 234, 240, 1);
        line-height: 75px;
        margin-right: 70px;
      }

      .operation_time {
        width: 268px;
        height: 133px;
        opacity: 0.84;
        border: 6px solid rgba(131, 135, 147, 1);
        font-size: 76px;
        font-family: PingFang-SC-Medium, PingFang-SC;
        font-weight: 500;
        color: rgba(209, 209, 221, 1);
        line-height: 133px;
        letter-spacing: 1px;
        margin-right: 70px;
      }

      .operation_but {
        width: 224px;
        height: 211px;
        font-size: 38px;
        font-family: PingFangSC-Medium, PingFang SC;
        font-weight: 500;
        color: rgba(255, 255, 255, 1);
        line-height: 211px;
        margin-right: 70px;
      }

      .operation_blue {
        background: rgba(0, 216, 29, 1);
      }

      .operation_red {
        background: rgba(212, 27, 40, 1);
      }
    }

    .live_trajectory {
      position: relative;
      margin: 100px 130px 190px;

      img {
        width: 100%;
        height: 396px;
      }
    }
  }
</style>