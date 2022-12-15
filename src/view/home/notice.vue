<template>
  <div>
    <div class="pub-width" v-loading="loading">
      <el-card v-for="(item, index) in noticeList" :key="index">
        <router-link class="notice" :to='{path: "/notice-detail", query: {id: item.articleId}}'>
          <img :src="item.articlePic">
          <div class="notice-article">
            <span>{{item.title}}</span>
            <p v-html='item.content'></p>
          </div>
        </router-link>
      </el-card>
    </div>
    <el-pagination
      @current-change="handleCurrentChange"
      background layout="total, prev, pager, next"
      :page-size="page.pageItemNum"
      :total="page.totalItemNum">
    </el-pagination>
  </div>
</template>

<script>
  import api from '@/api/api'
  export default {
    data () {
      return {
        articleTypeId: '',
        noticeList: [],
        page: {},
        loading: true
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.getArticleList({page: val})
      },
      getArticleList (json = {}) {
        json.typeId = this.articleTypeId
        this.loading = true
        api.getArticleList(json)
          .then(res => {
            this.loading = false
            this.noticeList = res.data.list || []
            this.page = res.data.pageModel || {}
          })
      },
      getTypeList () {
        api.getType()
          .then(res => {
            if (res.code === '100') {
              res.data.forEach(item => {
                if (item.typeName === '通知公告') {
                  this.articleTypeId = item.articleTypeId
                  this.getArticleList()
                }
              })
            }
          })
      }
    },
    created () {
      this.getTypeList()
    }
  }
</script>

<style scoped>
  .pub-width {
    min-height: 400px;
    margin-top: 80px;
    padding-bottom: 140px;
  }
  .notice {
    display: block;
    overflow: hidden;
  }
  .notice img {
    width: 245px;
    float: left;
  }
  .el-card {
    margin-top: 10px;
  }
  .notice-article {
    width: calc(100% - 260px);
    padding-right: 10px;
    margin-left: 260px;
  }
  .notice-article p {
    height: 120px;
    line-height: 24px;
    text-indent: 24px;
    font-size: 14px;
    color: #333333;
    overflow: hidden;
    margin-top: 10px;
  }
  .notice-article span {
    font-size: 20px;
    color: #009FF5;
    font-weight: 400;
    margin-bottom: 15px;
  }
  .el-pagination {
    text-align: center;
    margin: 20px 0;
  }
</style>
