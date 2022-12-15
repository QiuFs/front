<template>
  <div>
    <div class="header">
      <img src="@/assets/imgs/logo.jpg" alt="logo" class="logo" />
      <img src="@/assets/imgs/logo-font.png" alt="logo" class="logo-font" />
      <div class="navbar">
        <router-link
          v-for="(item, index) in navmenu"
          :key="index"
          :to="item.url">
          {{item.title}}
        </router-link>
        <router-link v-if="user" to="/continue">个人中心</router-link>
        <a href="javascript:void(0)" v-if="user" @click="outLogin">退出</a>
      </div>
    </div>
    <el-main>
      <router-view></router-view>
    </el-main>
    <div class="footer">
      <img src="@/assets/imgs/footer-font.png" alt="" class="font" />
      <span>Copyright  </span>
      <div class="code">
        <div>
          <img src="@/assets/imgs/code.png" alt="公众号" />
        </div>
        <p>扫码关注公众号</p>
      </div>
      <div class="code">
      </div>
    </div>
  </div>
</template>
<script>
import $cookie from '@/api/cookie'
export default {
  data () {
    return {
      navmenu: [
        {
          title: '首页',
          url: '/'
        },
        {
          title: '通知公告',
          url: '/notice'
        },
        {
          title: '常见问题',
          url: '/problem'
        },
        {
          title: '联系我们',
          url: '/about'
        },
      ]
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    outLogin () {
      $cookie.removeCookie('userName')
      $cookie.removeCookie('token')
      this.$store.commit('setUser')
      this.$router.push('/')
    },
  },
  created () {
    this.$store.commit('setUser')
  }
}
</script>
<style lang="scss">
  * {
    padding: 0;
    margin: 0;
  }
  ol, ul {
    list-style: none;
  }
  a {
    color: inherit;
    text-decoration: none;
  }
  body {
    // min-width: 1520px;
    font-family: "Helvetica Neue",Helvetica,Arial,"Hiragino Sans GB","Hiragino Sans GB W3","Microsoft YaHei UI","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
    color: #444;
  }
  .pub-width {
    width: 1200px;
    margin: 0 auto;
  }
  /*头部*/
  .header {
    height: 130px;
    padding: 50px 55px 0;
    position: relative;
    z-index: 5;
    img {
      vertical-align: middle;
    }
    .logo {
      width: 100px;
      margin-right: 15px;
    }
    .logo-font {
      width: 620px;
      margin-top: 35px;
    }
    .navbar {
      float: right;
      margin-top: 65px;
      a {
        padding: 0 20px;
        border-left: 1px solid #7d7d7d;
      }
      a:first-child {
        border: none;
      }
    }
  }

  /*内容区*/
  .el-main {
    padding: 0 !important;
    width: 100%;
    min-height: 729px;
    overflow: hidden;
  }

  /*底部*/
  .footer {
    height: 65px;
    color: #fff;
    padding: 25px 75px 0;
    background: #4eb2dd;
    position: relative;
    .font {
      margin-right: 15px;
    }
    .code {
      position: absolute;
      top: -75px;
      right: 80px;
      div {
        height: 110px;
      }
      img {
        width: 110px;
      }
      p {
        text-align: center;
        margin-top: 15px;
      }
    }
    }

  /*面包屑*/
  .breadcrumb {
    height: 60px;
    line-height: 60px;
    padding-left: 16px;
    overflow: hidden;
    background-color: #fff;
  }
  .breadcrumb li {
    float: left;
  }
  .breadcrumb li.active {
    color: #1d6ad2;
  }

  .bg {
    min-height: 800px;
    background-color: #f8f8f8;
    overflow: hidden;
  }
</style>

