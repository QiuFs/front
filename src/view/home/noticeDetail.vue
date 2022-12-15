<template>
  <div>
    <div class="detail">
      <div class="title">
        {{details.title}}
      </div>
      <div class="detail-body" v-html='details.content'></div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  export default {
    data() {
      return {
        details: []
      }
    },
    created() {
      api.getArticleMsg(this.$route.query.id)
        .then(res => {
          this.details = res.data
        })
    }
  }
</script>

<style type="text/css">
  .detail-body img {
    display: block;
    max-width: 100%;
    margin: 0 auto;
  }
</style>

<style scoped lang="scss">
  .detail {
    width: 1100px;
    margin: 100px auto 150px;
    border: 1px solid #E9E9E9;
    padding: 0 50px;
    .title {
      font-size: 24px;
      text-align: center;
      margin: 50px 0;
    }
    .detail-body {
      color: #333;
      line-height: 35px;
    }
  }
</style>
