<template>
  <div>
    <div class="pub-width">
      <div class="question-list" v-loading="loading">
        <el-card v-for="(item, index) in questionList" :key="index">
          <label><span>{{index + 1}}</span>{{item.title}}</label>
          <p v-html="item.content"></p>
        </el-card>
      </div>
      <el-pagination
        @current-change="handleCurrentChange"
        background layout="total, prev, pager, next"
        :page-size="page.pageItemNum"
        :total="page.totalItemNum">
      </el-pagination>
    </div>
  </div>
</template>
<script>
  import api from '@/api/api'
  export default {
    data () {
      return {
        loading: true,
        questionList: [],
        page: {},
      }
    },
    methods: {
      handleCurrentChange(val) {
        this.getAjax({page: val})
      },
      getArticleList (json = {}) {
        json.typeId = this.articleTypeId
        api.getArticleList(json)
          .then(res => {
            this.loading = false
            this.questionList = res.data.list || []
            this.page = res.data.pageModel || {}
          })
      },
      getTypeList () {
        api.getType()
          .then(res => {
            if (res.code === '100') {
              res.data.forEach(item => {
                if (item.typeName === '常见问题') {
                  this.articleTypeId = item.articleTypeId
                  this.getArticleList()
                }
              })
            }
          })
      }
    },
    created(){
      this.getTypeList()
    }
  }
</script>

<style scoped>
  .question-list {
    margin-top: 20px;
    min-height: 400px;
    padding-bottom: 140px;
  }
  .question-list li {
    margin: 20px 0;
    border-bottom: 1px solid #E9E9E9;
  }
  .question-list label{
    font-size: 14px;
    color: #000000;
    line-height: 20px;
  }
  .question-list span{
    font-weight: 700;
    margin-right: 20px;
  }
  .question-list p{
    font-size: 14px;
    color: #666666;
    line-height: 24px;
    margin: 17px 0;
    text-indent: 2em;
  }
  .el-card{
    margin-top: 20px;
  }
  .el-pagination {
    text-align: center;
    margin: 20px 0;
  }
</style>
