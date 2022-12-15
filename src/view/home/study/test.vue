<template>
  <div v-loading='loading'>
    <div class='test'>
      <div class="test-top">
        <el-card class="box-card">
          <label>剩余时间:</label>
          <span>{{Math.floor(paper.paperTime / 60) < 10 ? '0' + Math.floor(paper.paperTime / 60) : Math.floor(paper.paperTime / 60)}} : {{paper.paperTime % 60 < 10 ? '0' + paper.paperTime % 60 : paper.paperTime % 60}} 分钟</span>
        </el-card>
        <el-row class='btn'>
          <el-button type="primary" plain @click='submit'>结束考试</el-button>
        </el-row>
      </div>
      <div class="test-main">
        <div class="test-main-left">
          <div class="test-main-left-con" v-for="(item, index) in paper.paperQuestionList" :key="index">
            <h3>{{item.questionType}}</h3>
            <div class="test-num">
              <div
                v-for="(myItem, myIndex) in item.questionIdList"
                :class="display.index === item.str[myIndex]? 'active':''"
                :key="myIndex"
                @click='getQuestions($event.srcElement.innerText, myItem, item.questionType)'>
                {{ item.str[myIndex] }}
              </div>
            </div>
          </div>
        </div>
        <div class="test-main-right">
          <div class="test-main-right-content">
            <p>试题</p>
            <div class="right-content-header">{{ type }}</div>
            <div class="right-content-main">
              <question v-if="display.questionDescription" v-model="display" :letter="letter"></question>
            </div>
          </div>
          <div style='text-align: center; margin-bottom: 10px'>
            <el-button @click='prevQuestion' v-if='display.index !== 1'>上一题</el-button>
            <el-button @click='nextQuestion' v-if='display.index !== array.length'>下一题</el-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import api from '@/api/api'
  import question from '@/components/question'
  export default {
    components: { question },
    data () {
      return {
        letter: 'ABCDEFG',
        paper: [],
        array: [],
        type: '',
        cardId: '',
        questionsList: [],
        display: {},
        set: '',
        loading: true
      }
    },
    methods: {
      prevQuestion () {
        let type
        this.paper.paperQuestionList.forEach(item => {
          item.questionIdList.forEach(items => {
            if (items === this.array[this.display.index - 2]) {
              type = item.questionType
            }
          })
        })
        this.getQuestions(this.display.index - 2, this.array[this.display.index - 2], type)
      },
      nextQuestion () {
        let type
        this.paper.paperQuestionList.forEach(item => {
          item.questionIdList.forEach(items => {
            if (items === this.array[this.display.index]) {
              type = item.questionType
            }
          })
        })
        this.getQuestions(this.display.index + 1, this.array[this.display.index], type)
      },
      submit () {
        const loading = this.$loading({
          lock: true,
          text: '正在提交',
          spinner: 'el-icon-loading',
          background: 'rgba(0, 0, 0, 0.7)'
        });
        let form = {
          paperId: this.paper.paperId,
          cardId: this.cardId,
          answerList: [],
          testTime: this.paper.paperTime,
        };
        clearTimeout(this.set)
        this.questionsList.forEach(item => {
          var arr = []
          if(Array.isArray(item.isTrue)){
            arr = item.isTrue
          }else{
            arr.push(item.isTrue)
          }
          form.answerList.push({
            "answerId": arr,
            "questionId": item.id
          })
        })
        api.submitPaper(form)
          .then(res => {
            if (res.code === '100') {
              var str = res.data.testScore >= 60 ? '恭喜你通过考试' : '很遗憾你未通过考试'
              loading.close()
              this.$message({
                type: 'info',
                message: '测试得分为' + res.data.testScore + '分，' + str,
                onClose: () => {
                  this.$router.push('/my-course')
                }
              })
            } else {
              loading.close()
              this.$message.error('提交失败')
            }
          })
          .catch(() => {
            loading.close()
            this.$message.error('提交失败')
          })
      },
      getQuestions (e, id, type) {
        let select;
        this.paper.paperQuestionList.forEach(item => {
          if(item.questionType === type){
            this.type = item.questionTypeMsg
          }
        })
        if (this.questionsList.some((item,index) => {select = index; return item.id === id})) {
          this.display = this.questionsList[select]
        } else {
          var number = typeof e === 'string' ? Number(e) : e
          this.getQuestion(id, number)
        }
      },
      //倒计时
      countdown () {
        this.paper.paperTime--
        this.set = setTimeout(() => {
          if (this.paper.paperTime === 0) {
            clearTimeout(this.set)
            this.submit()
            return false
          }
          this.countdown()
        }, 1000)
      },
      getQuestion (id, number) {
        this.loading = true
        api.getQuestion(id)
          .then(res => {
            let json = {
              index: number,
              id: id,
              categoryName: res.data.categoryName,
              questionDescription: res.data.questionDescription,
              answerList: res.data.answerList,
              isTrue: []
            }
            this.loading = false
            this.display = json
            this.questionsList[number - 1] = json
          })
          .catch(() => {
            this.loading = false
          })
      }
    },
    beforeDestroy () {
      clearTimeout(this.set)
    },
    created () {
      this.cardId = this.$store.state.user.userName
      api.getPaper(this.$route.params.id)
        .then(res => {
          if (res.code === '100') {
            let number = 0
            res.data.paperQuestionList.forEach(item => {
              item.str = []
              item.questionIdList.forEach(items => {
                item.str.push(++number)
                this.array.push(items)
              })
            })
            this.paper = res.data
            this.type = res.data.paperQuestionList[0].questionTypeMsg
            let id = res.data.paperQuestionList[0].questionIdList[0]
            this.getQuestion(id, 1)
            this.paper.paperTime = this.paper.paperTime * 60
            this.countdown()
          } else {
            this.$router.back(-1)
            this.$message('考试暂未开放')
          }
        })
    }
  }
</script>

<style scoped>
  .test{
    width: 1200px;
    margin: 30px auto 50px;
  }
  .box-card{
    height: 47px;
    width: 223px;
    font-size: 16px;
    color: #0D253E;
  }
  .box-card span{
    margin-left: 15px;
  }
  .test-top{
    display: flex;
    justify-content: space-between;
    margin: 10px 0;
  }
  .test-top .btn{
    line-height: 49px;
  }
  .test-main{
    display: flex;
    justify-content: space-between;
  }
  .test-main-left{
    background-color: #DEEDFF;
    width: 30%;
  }
  .test-main-left-con{
    margin: 20px;
  }
  .test-main-left h3{
    font-size: 20px;
    line-height: 24px;
    font-weight: lighter;
    margin-bottom: 15px;
  }
  .test-num{
    display: flex;
    flex-wrap: wrap;
  }
  .test-num div{
    width: 26px;
    height: 32px;
    background: #FFFFFF;
    text-align: center;
    line-height: 32px;
    border: 1px solid #979797;
    cursor: pointer;
    margin-left: 2px;
  }
  .test-num div.active {
    color: #fff;
    background: #D31C1C;
  }
  .test-main-right{
    width: 70%;
  }
  .test-main-right-content{
    margin: 20px;
  }
  .test-main-right-content > p{
    border-bottom: 1px solid #D5D5D5;
    padding-bottom: 10px;
    font-size: 16px;
    color: #000000;
    height: 18px;
    line-height: 18px;
  }
  .right-content-header{
    margin-top: 20px;
    font-size: 14px;
    color: #0D253E;
  }
  .right-content-main > p{
    font-size: 14px;
    color: #0D253E;
    font-weight: 700;
  }
  .right-content-main .question-info {
    margin: 20px 0;
    line-height: 24px;
  }
  .right-content-main .question-info p:first-child {
    float: left;
  }
  .right-content-main .question-info p + p {
    margin-left: 2em;
  }
  .question-answer{
    margin: 20px 0;
    font-size: 14px;
    color: #000000;
  }
</style>
