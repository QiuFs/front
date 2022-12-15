<template>
  <div>
    <el-row>
      <div id='main'>
        <el-card v-for="(item, index) in lessonList" :key="index">
          <div class="lesson">
            <div class="lesson-content">
              <div class="lesson-teacher">
                <label>主讲教师:</label>
                <span>{{item.teacher}}</span>
              </div>
              <p class="lesson-course-name">{{item.tempCourseName}}</p>
              <p class="lesson-course-desc">{{item.videoName}}</p>
            </div>
            <div class="lesson-btn">
              <router-link :to='{path: "/free-listen", query: {url: item.videoUrl}}'>
                <el-button type="primary" round>免费试听</el-button>
              </router-link>
            </div>
          </div>
        </el-card>
      </div>
    </el-row>
    <el-row class='notice-bottom'>
      <el-pagination
        @current-change="handleCurrentChange"
        background layout="total, prev, pager, next"
        :page-size="page.pageItemNum"
        :total="page.totalItemNum">
      </el-pagination>
    </el-row>
  </div>
</template>

<script>
  import api from '../../api/api'
  export default {
    data () {
      return {
        lessonList: [],
        page: {},
      }
    },
    methods: {
      getFreeVideo (json = {}) {
        api.getFreeVideo(json)
          .then(res => {
            if (res.code === '100') {
              this.lessonList = res.data.list
            } else {
              this.lessonList = []
            }
            this.page = res.data.pageModel
          })
      },
      //分页
      handleCurrentChange (val) {
        this.getFreeVideo({page: val})
      }
    },
    created() {
      this.getFreeVideo()
    }
  }
</script>

<style scoped>
  #main {
    width: 1200px;
    margin: 0 auto;
  }
  .banner, .banner img{
    width: 100%;
  }
  .lesson {
    display: flex;
    justify-content: space-between;
  }
  .lesson img {
    width: 100%;
    height: 100%;
    max-width: 245px;
    max-height: 175px;
  }
  .lesson-teacher label{
    font-size: 16px;
    color: #999;
  }
  .lesson-teacher span{
    font-size: 19px;
    color: #009FF5;
  }
  .el-row .el-card{
    margin-top: 10px;
  }
  .lesson-content{
    margin-left: 10px;
  }
  .lesson-course-name{
    font-size: 20px;
    color: #009FF5;
    font-weight: 400;
    margin: 15px 0;
  }
  .lesson-course-desc{
    text-indent: 24px;
    font-size: 14px;
    color: #333333;
    line-height: 24px;
  }
  .lesson-btn{
    display: flex;
    align-items: center;
  }
</style>
