<template>
  <div class="main">
    <div class="my-course-tabs">
      <div class='required-title'>
        <p>江苏省魔方运动协会</p>
        <p style='color: #ff0000'>达到考试条件，获取相应证书</p>
      </div>
      <div class="course-container" v-loading="loading">
        <div class="top">
          <div class='course-type'>全部</div>
        </div>
        <div v-for="item in searchCourseList" :key="item.labelId">
          <ul class="course-list">
            <li v-for="sitem in item.courseList" :key="sitem.courseId">
              <img :src="sitem.course.courseCover" alt="">
              <div class='course-info'>
                <h3>{{sitem.course.courseName}}</h3>
                <div>状态：{{sitem.coursePercent === 1 ? '完成' : '未完成'}}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;综合测最高成绩：{{sitem.testScore || 0}}</div>
                <div>
                  <span>学习进度：</span>
                </div>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from '@/api/api'
import $cookie from '@/api/cookie'
export default {
  data () {
    return {
      loading: true,
      searchCourseList: [],
      courseList: [],
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  methods: {
    getCourse () {
      api.getCourseList(this.$store.state.user.userName)
        .then(res => {
          console.log(res.data)
          this.loading = false
          if (res.code === '100') {
            // this.searchCourseList = this.courseList = res.data
            var arr = [];
            arr[0] = res.data[0];
            this.searchCourseList = this.courseList = arr;
            // console.log(arr)
          } else {
            this.$message(res.msg)
          }
        })
    },
    toChapter (courseId) {
      if (this.userInfo.phone) {
        this.$router.push(`/chapter/${courseId}`)
      } else {
        this.$confirm('请先绑定手机号码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$router.push('/setting')
        }).catch(() => {
          this.$router.push('/setting')
        })
      }
    },
    toTest (data) {
      // this.$message('考试已经关闭')
      if (data.coursePercent === 1) {
        this.$router.push({path: `/test/${data.course.courseId}`})
      } else {
        this.$message('课程未完成')
      }
    },
  },
  created () {
    this.getCourse()
  }
}
</script>
<style>
.course-info .el-progress {
  width: 170px;
  display: inline-block;
  vertical-align: top;
}
.course-info .el-progress-bar__innerText, .course-info .el-progress-bar {
  display: block;
}
</style>

<style scoped>
  .main{
    font-size: 14px;
  }
  .my-course-title span{
    font-weight: bolder;
    color: #000000;
    margin-right: 40px;
  }
  .required-title {
    height: 56px;
    padding: 22px 0 22px 50px;
    background: #fff;
    border: 1px solid #eee;
    margin-bottom: 20px;
  }
  .required-title p:first-child {
    margin-bottom: 30px;
  }
  .required-prompt{
    font-weight: bolder;
    font-size: 16px;
    color: #000;
    margin-bottom: 10px;
  }
  .course-container{
    min-height: 340px;
    background: #fff;
    padding: 16px;
    border: 1px solid #eee;
  }
  .course-container .top {
    height: 54px;
    border-bottom: 1px solid #eee;
  }
  .course-container .top>div, .course-container .top .el-input__inner {
    height: 35px !important;
    line-height: 35px;
  }
  .course-container .top .course-type {
    width: 100px;
    color: #fff;
    border-radius: 2px;
    background: #1d6ad2;
    text-align: center;
    float: left;
  }
  .course-list {
    overflow: hidden;
  }
  .course-list li {
    width: 461px;
    height: 144px;
    border: 1px solid #eee;
    float: left;
    margin-top: 20px;
  }
  .course-list li:nth-child(2n) {
    margin-left: 18px;
  }
  .course-list li img {
    width: 172px;
    height: 100%;
    float: left;
    margin-right: 20px;
  }
  .course-list li .course-info {
    width: 268px;
    float: left;
    margin-top: 14px;
    position: relative;
  }
  .course-list li .course-info h3 {
    color: #333;
    font-size: 20px;
    margin-bottom: 27px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  .course-list li .course-info>div {
    margin-bottom: 10px;
  }
  .course-list li .btn {
    position: absolute;
    top: 20px;
    right: 27px;
  }
  .course-list li .btn i {
    width: 35px;
    height: 35px;
    line-height: 35px;
    text-align: center;
    color: #fff;
    font-size: 22px;
    border-radius: 50%;
    background: #ffa012;
    cursor: pointer;
  }
  .course-list li .btn i:first-child {
    background: #409eff;
    margin-right: 12px;
  }
  .year-title {
    font-size: 18px;
    margin-top: 20px;
  }
</style>
