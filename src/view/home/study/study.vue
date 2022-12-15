<template>
  <div class="bg">
    <div class="content pub-width">
      <keep-alive>
        <div class="nav-aside">
          <router-link v-for="(item, index) in asidesList" :to="item.path" :key="index" tag="li" active-class="aside-active">
            <i :class="item.icon"></i>
            <span>{{item.name}}</span>
          </router-link>
          <li class="img">
            <h3>有问题欢迎关注公众号</h3>
            <img src="@/assets/imgs/code2.png" alt="" />
          </li>
        </div>
      </keep-alive>
      <div class="nav-content">
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      asidesList: [
        {
          name: '首页',
          path: 'my-index',
          icon: 'el-icon-menu'
        },
        {
          name: '我的考试',
          path: 'my-course',
          icon: 'el-icon-tickets'
        },
        {
          name: '基本设置',
          path: 'setting',
          icon: 'el-icon-setting'
        }
      ],
    }
  },
  created () {

  }
}
</script>

<style scoped>
  a.el-button {
    margin: 20px 0;
  }
  .content {
    width: 1200px;
    padding-top: 20px;
    overflow: hidden;
  }
  .nav-aside {
    width: 200px;
    float: left;
    font-size: 18px;
    border: 1px solid #eee;
  }
  .nav-aside li {
    color: #16192F;
    display: block;
    width: 200px;
    height: 80px;
    line-height: 80px;
    background-color: #fff;
  }
  .nav-aside .img {
    height: auto;
    line-height: normal;
    font-size: 12px;
    text-align: center;
  }
  .nav-aside .img {
    margin-top: 20px;
  }
  .nav-aside .img h3 {
    margin: 10px 0;
  }
  .nav-aside li + li {
    border-top: 2px solid #FFFFFF;
  }
  .nav-aside li i {
    vertical-align: middle;
    padding: 15px;
    margin: 15px;
    background: rgba(230,236,251,0.4);
    border-radius: 30px;
  }
  .nav-aside li span {
    left:92px;
    vertical-align: middle;
  }
  .nav-aside li:hover {
    cursor: pointer;
  }
  .aside-active {
    color: #fff !important;
    background-color: #1D6AD2 !important;
  }
  .nav-content {
    float: left;
    width: 978px;
    margin-left: 20px;
  }
</style>
