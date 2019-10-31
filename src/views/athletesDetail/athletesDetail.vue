<template>
    <div class='athletesDetail'>
        <back-header :title='title' @saveData='saveData' :save='true'></back-header>
        <input v-if='index === 1' type="text" ref='input' class='input' v-model='name'>
        <input v-if='index === 2' type="tel" ref='input' class='input' v-model='tel'>
        <input v-if='index === 5' type="tel" maxlength="3" ref='input' class='input' v-model='height'>
        <input v-if='index === 6' type="tel" maxlength="3" ref='input' class='input' v-model='weight'>
    </div>
</template>

<script>
import backHeader from '@/components/backHeader'
export default {
    name: 'athletesDetail',
    components: {
        backHeader
    },
    data(){
        return {
            index: 0,
            title: '',
            name: '',
            tel: '',
            height: '',
            weight: '',
        }
    },
    created(){
        this.index = this.$route.params.index
        if(this.index === 1){
            this.title = '姓名'
        }else if(this.index === 2){
            this.title = '联系方式'
        }else if(this.index === 5){
            this.title = '身高'
        }else if(this.index === 6){
            this.title = '体重'
        }
    },
    mounted(){
        if(this.index){
            this.$refs.input.focus()
        }
    },
    methods:{
        saveData(){
            if(this.index === 1 && !this.name){
                this.$toast('请填写姓名')
                return
            }
            if(this.index === 2 && !this.checkTel(this.tel)){
                this.$toast('请填写正确联系方式')
                return
            }
            if(this.index === 5 && !this.height){
                this.$toast('请填写身高')
                return
            }
            if(this.index === 6 && !this.weight){
                this.$toast('请填写体重')
                return
            }
            let data = {index: this.index}
            if(this.index === 1 ){
                data.name = this.name
            }else if(this.index === 2){
                data.tel = this.tel
            }else if(this.index === 3){
                data.height = this.height
            }else if(this.index === 4){
                data.weight = this.weight 
            }
            this.$store.dispatch('setAthletes', data)
            this.$router.push({name: 'addAthletes'})
        },
        checkTel(newVal){
            let reg = /^1[3456789]\d{9}$/;
            if(newVal == undefined){
                return false 
            } else if (newVal.length > 11) {
              this.tel = newVal.substring(0, 11);
              return true
            } else if (!reg.test(newVal)) {
                return false 
            } else if(reg.test(newVal)){
              return true
            }
            return false
        },
    }
}
</script>

<style lang="less" scoped>
.athletesDetail{
    width: 100vw;
    min-height: 100vh;
    padding: 40px;
    box-sizing: border-box;
    background: url("../home/image/bg.png") no-repeat left top;
    background-size: cover;
    .input{
        width: 100%;
        height: 93px;
        text-indent: 10px;
        font-size: 22px;
        background-color: transparent;
        border: 0;
        border-bottom: 1px solid #4E4F54;
    }
}
</style>
