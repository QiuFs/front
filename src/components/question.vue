<template>
  <div>
    <div class="title" v-html="value.questionDescription || value.question.questionDescription"></div>
    <div>
      <div v-model="value.isTrue" :is='value.question ? value.question.categoryName === "多选题" ? "el-checkbox-group" : "el-radio-group" : value.categoryName === "多选题" ? "el-checkbox-group" : "el-radio-group"'>
        <div class="question-answer" v-for="(item, index) in value.answerList" :key="item.answerId">
          <div :label="item.answerId" :is='value.question ? value.question.categoryName === "多选题" ? "el-checkbox" : "el-radio" : value.categoryName === "多选题" ? "el-checkbox" : "el-radio"'>
            <span>{{letter[index]}}.</span>
            <span v-html="item.questionAnswer"></span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import getImageHeight from '@/api/getImageHeight.js'
export default {
  name: 'tree',
  props: {
    value: Object,
    letter: String
  },
  data () {
    return {
    }
  },
  watch: {
    value (val) {
      this.getImageHeight(val)
    }
  },
  methods: {
    ...getImageHeight
  },
  created () {
    this.getImageHeight(this.value)
  }
}
</script>
  
<style>
  .title img, .question-answer span img {
    vertical-align: middle;
    height: 15%;
  }
</style>

<style scoped>
  .question-info {
    margin-left: 112px;
  }
  .title, .question-answer label span {
    font-size: 21px;
  }
  .question-info .el-radio-group {
    display: block;
  }
  .question-info .title {
    line-height: 40px;
  }
  .question-answer {
    margin-top: 20px;
  }
  .question-answer label span {
    display: inline-block;
    vertical-align: middle;
  }
  .question-answer label span + span {
    width: 700px;
    word-wrap: break-word;
  }
</style>
