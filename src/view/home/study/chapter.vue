<template>
  <div class="bg">
    <div class="pub-width" v-loading="loading">
      <ul class="breadcrumb">
        <li>
          <router-link to='/my-course'>我的考试</router-link>
          <i class="el-icon-arrow-right"></i>
        </li>
        <li class="active">
          <span>{{courseInfo.courseName}}</span>
        </li>
      </ul>
      <ul class="course-info">
        <li>
          <img :src="courseInfo.courseCover" alt="">
        </li>
        <li>
          <div>完成所有考试</div>
          <div class="linear"></div>
          <div>等级考试要求</div>
        </li>
        <li>
          <div>{{completeType ? '完成' : '未完成'}}</div>
          <div class="linear"></div>
          <div>考试状态</div>
        </li>
        <li>
          <div>{{courseInfo.courseHours}}</div>
          <div class="linear"></div>
          <div>等级</div>
        </li>
        <li>
          <div class="star" @click="$router.push({path: '/listen', query: {courseId: $route.params.id, index: 0}})">
            <i class="el-icon-caret-right"></i>
            <div>开始考试</div>
          </div>
        </li>
      </ul>
      <div class="chapter">
        <div class="chapter-header">
          <div>章节名称</div>
          <div>完成状态</div>
          <div>学习进度</div>
          <div>操作</div>
        </div>
        <div class="chapter-main">
          <tree v-for="(item, index) in chapterList" :key="index" :model="item" :index="index"></tree>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  import tree from '@/components/tree.vue'
  export default {
  	components: {
      tree
  	},
    data () {
      return {
        courseName: '',
        chapterList :[],
        loading: true,
        completeType: false
      }
    },
    computed: {
      courseInfo () {
        return this.$store.state.courseInfo
      }
    },
    created () {
      api.getChapterList(this.$route.params.id, this.$store.state.user.userName)
        .then(res => {
          console.log(res.data)
          this.loading = false
          if (res.code === '100') {
            var completeType = true
            res.data.map(item => {
              if (item.childChapter.length === 0) {
                // if (item.testActive && item.videoPosition && item.videoPosition.videoPosition.split('.')[0] / item.videoPosition.videoTime.split('.')[0] === 1) {
                //   } else {
                //     completeType = false
                //   }
              } else {
                item.childChapter.map(sitem => {
                  if (sitem.testActive && sitem.videoPosition && sitem.videoPosition.videoPosition / sitem.videoPosition.videoTime === 1) {
                  } else {
                    completeType = false
                  }
                })
              }
            })
            this.completeType = completeType
            this.chapterList = res.data
          } else {
            this.$message(res.msg || '该课程下不存在章节')
          }
        })
      this.$store.dispatch('getCourse', this.$route.params.id)
    }
  }
</script>

<style scoped>
  .pub-width>div, .pub-width>ul {
    margin-top: 20px;
    background: #fff;
  }
  .course-info {
    height: 160px;
    overflow: hidden;
  }
  .course-info li {
    width: 238px;
    height: 100%;
    text-align: center;
    color: #000;
    font-size: 14px;
    float: left;
    border-right: 2px solid #f8f8f8;
  }
  .course-info li + li {
    height: calc(100% - 38px);
    padding-top: 38px;
  }
  .course-info li img {
    width: 100%;
    height: 100%;
  }
  .course-info li div:first-child {
    font-size: 20px;
  }
  .course-info li .linear {
    width: 44px;
    height: 2px;
    margin: 20px auto;
    background: #a0a0a0;
  }
  .course-info li:last-child {
    height: calc(100% - 30px);
    padding-top: 30px;
    background: #1d6ad2;
  }
  .course-info li .star {
    width: 102px;
    height: 102px;
    color: #1d6ad2;
    border-radius: 50%;
    background: #fff;
    margin: 0 auto;
    overflow: hidden;
    cursor: pointer;
  }
  .course-info li .star i {
    display: block;
    font-size: 36px;
    margin-top: 22px;
  }
  .course-info li .star div {
    font-size: 16px;
  }
  .chapter-header {
    height: 72px;
    line-height: 72px;
    border-bottom: 1px solid #f8f8f8;
    overflow: hidden;
  }
  .chapter-header>div {
    float: left;
    color: #333;
    font-size: 20px;
  }
  .chapter-header>div:first-child {
    width: 535px;
    padding-left: 65px;
  }
  .chapter-header>div:nth-child(2), .chapter-header>div:last-child {
    width: 125px;
    text-align: center;
  }
  .chapter-header>div:nth-child(3) {
    width: 325px;
    padding-left: 25px;
  }
  .chapter-main {
    margin-bottom: 20px;
  }
</style>
