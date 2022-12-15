<template>
  <div>
    <div class="user-info">
      <div class="info">
        <div v-if="userInfo">{{userInfo.cardId}} 您好！</div>
        <div>江苏省魔方运动协会</div>
        <div>{{gettime}}</div>
      </div>
      <span>生命是一场盛大的战役</span>
      <img src="@/assets/imgs/banner.png" alt="banner" class="banner" />
    </div>
    <router-view class="container"></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      gettime:'',//当前时间
    };
  },
  computed: {
    userInfo() {
      return this.$store.state.userInfo;
    },
  },
  methods: {
    getTime:function(){
      var _this = this;
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth()+1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf = new Date().getMinutes()<10 ? '0'+new Date().getMinutes() : new Date().getMinutes();
      let ss = new Date().getSeconds()<10 ? '0'+new Date().getSeconds() : new Date().getSeconds();
      _this.gettime = yy+'-'+mm+'-'+dd+' '+hh+':'+mf+':'+ss;
    },
    currentTime:function(){
      setInterval(this.getTime,100)
    },
  },
  created() {
    this.$store.dispatch("setUserInfo");
    this.currentTime();
  },
};
</script>

<style scoped lang="scss">
.user-info {
  height: 110px;
  background: linear-gradient(to left, #f9e7e7 30%, #4eb2dd);
  position: relative;
  padding: 50px 55px 0;
  color: #fff;
  .info {
    font-size: 16px;
    div {
      height: 40px;
      line-height: 40px;
    }
    // div:first-child {
    //   font-size: 16px;
    // }
  }
  span {
    color: #343434;
    font-size: 24px;
    position: absolute;
    right: 335px;
    top: 80px;
  }
  .banner {
    width: 215px;
    position: absolute;
    right: 140px;
    top: 25px;
  }
}
.container {
  padding-bottom: 140px;
}
</style>
