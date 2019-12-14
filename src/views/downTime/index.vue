<template>
  <div class="chooseWrap">
    <div class="word">{{word}}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        word: 3,
        timer: null,
        left:window.localStorage.getItem('left'),
        right:window.localStorage.getItem('right')
      }
    },
    mounted() {
      this.word = 3
      this.timer = setInterval(() => {
        if(this.word > 1){
          --this.word
        }else{
          clearInterval(this.timer)
          let model = window.localStorage.getItem('modle')
          if(model == 'PT'){
            this.$router.push({ name: 'power'});
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['PT','',this.left,this.right,0,0] })
          }else{
            this.$router.push({ name: 'demo'});
          this.$store.dispatch('setLoginflag', { BluetoothDataArr: ['DEMO','',this.left,this.right,0,0] })
          }
        }
          
        }, 1000);
    },
    methods: {
    }
  }
</script>
<style scoped lang="less">
  .chooseWrap {
    width: 100vw;
    min-height: 100vh;
    background: url('../../assets/image/bg.png') no-repeat;
    background-size: 100% 100%;
  }

  .word {
    height: 100vh;
    font-size: 250px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    color: rgba(206, 95, 30, 1);
    display: flex;
    justify-content: center;
    align-items: center;
  }
</style>