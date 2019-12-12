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
        timer: null
      }
    },
    mounted() {
      this.word = 3
      this.timer = setInterval(() => {
        if(this.word > 1){
          --this.word
        }else{
          clearInterval(this.timer)
          console.log(this.$store.state)
          let model = this.$store.state.modle
          if(model == 'PT'){
            this.$router.push({ name: 'power'});
          }else{
            this.$router.push({ name: 'demo'});
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