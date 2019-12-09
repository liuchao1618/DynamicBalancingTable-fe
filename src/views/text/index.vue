<template>
  <div>
    <ul>
      <li class="li" v-for='(item,i) in list' :key='i' @click='changeText(item)'>{{item}}</li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      list:['0101','0102','0103','0104','0105','1101','1100','1200','1201']
    }
  },
  methods: {
    changeText(item){
      this.$store.dispatch('setLoginflag', { text:item })
    }
  },
  
}
</script>
<style scope>
  ul{
    display: flex;
    flex-wrap: wrap;
  }
.li{
  width: 30%;
  height: 250px;
  background: #ccc;
  margin: 10px;
  font-size: 25px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>