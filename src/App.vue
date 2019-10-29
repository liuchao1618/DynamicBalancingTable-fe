<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
  mounted(){
    plus.screen.lockOrientation('landscape-primary')
  }
}
</script>

<style>
#app {
  /*font-family: 'Avenir', Helvetica, Arial, sans-serif;*/
  font-family: "Microsoft YaHei",微软雅黑,"MicrosoftJhengHei",华文细黑,STHeiti,MingLiu;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
