<template>
    <div class='backHeader'>
        <div class='left' @click="back">
            <!-- <img src="../assets/image/components/back.png" alt=""> -->
             {{ title }}
        </div>
        <div v-if='save' @click="saveBtn" class='right'>保存</div>
    </div>
</template>

<script>
export default {
    name: 'backHeader',
    props:['title', 'save'],
    methods: {
        back(){
            history.back(-1)
        },
        saveBtn(){
            this.$emit('saveData')
        }
    }
}
</script>

<style lang="less" scoped>
.backHeader{
    color: #EAEAF0;
    font-size: 30px;
    display: flex;
    justify-content: space-between;
    margin-bottom: 40px;
    .left{
        img{
            width: 28px;
            height: 28px;
            vertical-align: middle;
            margin-right: 20px;
        }
    }
    .right{
        padding: 5px;
    }
}
</style>
