<template>
  <div class='addAthletes'>
      <back-header title='修改密码'></back-header>
      <div class='item' @click="toDetail(7)">
          <div class='itemLeft'>*旧密码</div>
          <div class='itemRight'>{{ athletes.oldpass ? athletes.oldpass : '请填写旧密码 >' }}</div>
      </div>
      <div class='item' @click="toDetail(8)">
          <div class='itemLeft'>*新密码</div>
          <div class='itemRight'>{{ athletes.newpass ? athletes.newpass : '请输入6—12位数字字母组合新密码 >' }}</div>
      </div>
      <div class='item'  @click="toDetail(9)">
          <div class='itemLeft'>确认新密码</div>
          <div class='itemRight'>{{ athletes.checkpass ? athletes.checkpass : '请确认6—12位数字字母组合新密码 >' }}</div>
      </div>
      <div class='buttonBox'>
          <van-button type="primary" class='button mgr'>取消</van-button>
          <van-button type="primary" class='button'>保存</van-button>
      </div>
  </div>
</template>

<script>
  import backHeader from '@/components/backHeader'
  import { mapState } from 'vuex'
  export default {
      name: 'addAthletes',
      components: {
          backHeader
      },
      computed: {
          ...mapState([
              'athletes'
          ])
      },
      data() {
          return {
              dateShow: false,
              currentDate: new Date(),
              show: false,
              sex: 1,
          }
      },
      methods: {
          toDetail(index) {
              this.$router.push({ name: 'athletesDetail', params: { index: index } })
          }
      }
  }
</script>

<style lang="less" scoped>
  .addAthletes {
      width: 100vw;
      min-height: 100vh;
      padding: 40px;
      box-sizing: border-box;
      background: url("../home/image/bg.png") no-repeat left top;
      background-size: cover;

      .item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          height: 93px;
          padding: 0 10px;
          font-size: 24px;
          border-bottom: 1px solid #4E4F54;

          .itemLeft {
              color: #D1D1D6;
          }

          .itemRight {
              color: #868693;
          }
      }

      .itemNo {
          font-size: 19px;
          color: #99999E;
          line-height: 46px;
          text-align: left;
      }

      .buttonBox {
          margin-top: 100px;
          display: flex;
          justify-content: center;

          .button {
              width: 550px;
              height: 68px;
              font-size: 24px;
              border-radius: 5px;
          }

          .mgr {
              margin-right: 30px;

              &.van-button--primary {
                  background-color: transparent;
                  border-color: #68696A;
              }
          }

          .van-button--primary {
              background-color: #2286A9;
              border-color: #2286A9;
          }
      }

      .sex {
          width: 576px;
          height: 222px;
          border-radius: 12px;
          background-color: #373839;
          border: 1px solid #464348;
          box-sizing: border-box;
          padding: 50px 90px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;

          .sexItem {
              display: flex;
              justify-content: space-between;
              align-items: center;
              height: 42px;

              div {
                  font-size: 28px;
                  color: #BDBDC5;
              }

              img {
                  width: 42px;
                  height: 42px;
              }
          }
      }

      .van-popup {
          border-radius: 12px;
      }
  }
</style>