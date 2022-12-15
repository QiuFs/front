<template>
  <div class="bg">
    <div class="pub-width">
      <ul class="breadcrumb">
        <li>
          <router-link to="/my-course">我的课程</router-link>
          <i class="el-icon-arrow-right"></i>
        </li>
        <li>
          <a href="javascript:void(0)" @click="$router.push(`/chapter/${courseId}`)">{{courseName}}</a>
          <i class="el-icon-arrow-right"></i>
        </li>
        <li class="active">
          <span>视频播放</span>
        </li>
      </ul>
      <div class="listen-main">
        <div id="my-video" v-show="activeTab === 0">
          <video-player
            ref="videoPlayer"
            :options="playerOptions"
            :playsinline="true"
            customEventName="customstatechangedeventname"
            @play="onPlayerPlay($event)"
            @pause="onPlayerPause($event)"
            @timeupdate="onPlayerTimeupdate($event)"
            @ended="onPlayerEnded($event)">
          </video-player>
        </div>
        <div class="answer" v-if="displayQuestion.question" v-show="activeTab === 1">
          <div class="submit">
            <el-button @click="submitQuestion">提交</el-button>
          </div>
          <div class="number">
            {{activeQuestion + 1}}({{displayQuestion.question.questionScore}}分)
          </div>
          <div class="question-info">
            <question v-model="displayQuestion" :letter="letter"></question>
            <div class="btn">
              <button @click="nextQuestion">上一题</button>
              <button @click="nextQuestion">下一题</button>
            </div>
          </div>
        </div>
        <ul class="chapter">
          <div class="tab">
            <div v-for="(item, index) in tab" :class="{ 'active': index === activeTab }" :key="index" @click="chooseTab(index)">{{item}}</div>
          </div>
          <li v-for="(item, index) in chapterList" :key="index">
            <h3 :class="{ 'active': index === activeChapter }" @click="chooseChapter(index)">{{item.chapterName}}</h3>
            <div>
              <div
                class="play el-icon-caret-right"
                :class="{ 'active': activeVideo === sindex && index === activeChapter }"
                @click="chooseChapter(index, sindex)"
                v-for="(sitem, sindex) in item.childChapter"
                :key="sindex">
              </div>
            </div>
          </li>
        </ul>
      </div>
      <div class="ad-list">
        <div v-for="item in adList" :key="item.adId">
          <a :href="item.adUrl" target="_blank">
            <img :src="item.adIntroduce" alt="" />
          </a>
        </div>
      </div>
      <div class="el-dialog__wrapper" v-if="pointTestDialog">
        <div class="el-dialog">
          <div class="el-dialog__body">
            <question v-model="pointTest" :letter="letter"></question>
            <div style="text-align: center">
              <el-button style="margin-top: 50px" @click="affirmPointTest">确认</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import api from '@/api/api'
import 'videojs-contrib-hls'
import { videoPlayer } from 'vue-video-player'
import 'video.js/dist/video-js.css'
import question from '@/components/question'
export default {
  components: { videoPlayer, question },
  data() {
    return {
      number: 0,
      letter: 'ABCDEFG',
      courseId: '',
      startPlay: false, // 判断是否播放过
      chapterList: [], // 章节列表
      pointList: [], // 断点测试列表
      pointTest: {}, // 断点测试显示
      cardId: '',
      chapterInfo: {}, // 章节详情
      activeTab: 0, // 侧栏active
      activeVideo: 0, // 一个章节下存在多个小节时active
      activeChapter: 0, // 章节active
      activeQuestion: 0, // 测试active
      playerOptions: {
        language: 'zh-CN',
        sources: [],
        height: 615,
        width: 890
      },
      tab: ['视频', '测验'],
      displayQuestion: {}, // 测验显示题目
      questionList: {}, // 测验题目列表
      pointTestDialog: false,
      adList: [] // 广告列表
    }
  },
  computed: {
    player () {
      return this.$refs.videoPlayer.player
    },
    courseName () {
      return this.$store.state.courseInfo.courseName
    }
  },
  watch: {
    chapterInfo (data) {
      // console.log(data);
      api.getChapterTest(data.chapterId)
        .then(res => {
          if (res.code === '100') {
            res.data.map(item => {
              item.isTrue = []
              item.questionDescription = item.question.questionDescription
              item.categoryName = item.question.categoryName
            })
            this.displayQuestion = res.data[0]
            this.questionList = res.data
          } else {
            this.displayQuestion = []
            this.questionList = []
          }
        })
      if (data.chapterVideo) {
        api.getPoint(data.chapterVideo.videoId)
          .then(res => {
            if (res.code === '100') {
              this.pointList = res.data
            }
          })
        this.playerOptions.sources = [
          {
            type: data.chapterVideo.videoUrl.indexOf('m3u8') === -1 ? 'video/mp4' : 'application/x-mpegURL',
            src: data.chapterVideo.videoUrl
          }
        ]
        if (data.videoPosition) {
          this.beforeTime = data.videoPosition.videoPosition
          setTimeout(() => {
            this.player.currentTime(data.videoPosition.videoPosition)
          }, 50)
        }
      }
    }
  },
  mounted () {
    this.hiddenProperty = 'hidden' in document ? 'hidden' :
        'webkitHidden' in document ? 'webkitHidden' :
        'mozHidden' in document ? 'mozHidden' :
        null
    this.visibilityChangeEvent = this.hiddenProperty.replace(/hidden/i, 'visibilitychange')
    document.addEventListener(this.visibilityChangeEvent, this.onVisibilityChange)
  },
  beforeDestroy () {
    this.addChapterPlay(this.player)
    document.removeEventListener(this.visibilityChangeEvent, this.onVisibilityChange)
  },
  methods: {
    onVisibilityChange () { // 检测当前页面是否显示
      if (!document[this.hiddenProperty]) {
        this.player.play()
      } else {
        this.player.pause()
      }
    },
    onPlayerPlay (e) { // 视频播放
      if (!this.startPlay) this.startPlay = true
    },
    onPlayerPause (e) { // 暂停
      this.addChapterPlay(e)
    },
    playerEnd (fun) { // 判断视频是否已经播放完毕
      var videoPosition = this.chapterInfo.videoPosition
      if (videoPosition.videoPosition && videoPosition.videoTime) {
        if (videoPosition.videoPosition / videoPosition.videoTime !== 1) fun()
      } else {
        fun()
      }
    },
    disabledSeek (e) { // 禁止跳转
      this.playerEnd(() => {
        var beforeTime = this.beforeTime || 0
        if (e.cache_.currentTime - beforeTime >= 2) {
          this.player.currentTime(beforeTime)
        } else {
          this.beforeTime = e.cache_.currentTime
        }
      })
    },
    onPlayerTimeupdate (e) { //判断断点显示
      ++this.number
      if (this.number % 60 === 0) {
        this.addChapterPlay(e)
      }
      if (this.pointList.length !== 0) {
        this.pointList.map((item, index) => {
          if (item.pointTime == parseInt(e.cache_.currentTime) && !this.pointTestDialog) {
            this.player.pause()
            this.pointTest = item
            this.pointList.splice(index, 1)
            this.pointTestDialog = true
            return false
          }
        })
      }
      this.disabledSeek(e)
    },
    onPlayerEnded (e) { // 播放结束
      this.addChapterPlay(e)
      this.playerOptions.controls = true
    },
    addChapterPlay (e) { // 记录进度
      this.playerEnd(() => {
        api.addChapterPlay(this.courseId, {
          cardId: this.cardId,
          videoId: this.chapterInfo.chapterVideo.videoId,
          videoPosition: e.cache_.currentTime,
          videoTime: e.cache_.duration,
          watchEnd: null
        }).then(res => {
          // console.log(res.data)
          this.chapterInfo.videoPosition = res.data
        })
      })
    },
    chooseChapter (index, sindex) { // 选择章节
      if (this.chapterList[index].childChapter.length === 0) {
        if (this.activeChapter !== index) {
          var query = {courseId: this.courseId, index: index}
          this.$router.push({path: '/listen', query: query})
          this.chapterInfoInit(query)
        }
      } else {
        var sidx = sindex ? sindex : 0
        var query = {courseId: this.courseId, index: index, sindex: sidx}
        if (this.activeChapter !== index) {
          this.$router.push({path: '/listen', query: query})
          this.chapterInfoInit(query)
        } else if (sidx !== this.activeVideo) {
          this.$router.push({path: '/listen', query: query})
          this.chapterInfoInit(query)
        }
      }
    },
    chapterInfoInit (query) { // 初始化chapterInfo
      var chapterList = this.chapterList
      this.activeChapter = typeof query.index === 'string' ? Number(query.index) : query.index
      if (query.sindex !== undefined) {
        this.activeVideo = typeof query.sindex === 'string' ? Number(query.sindex) : query.sindex
        this.chapterInfo = chapterList[query.index].childChapter[query.sindex]
      } else {
        this.chapterInfo = chapterList[query.index]
      }
      console.log(query)
    },
    chooseTab (index) { // 切换侧栏
      this.activeTab = index
      if (index) {
        this.player.pause()
      } else {
        this.player.play()
      }
    },
    affirmPointTest () {
      var list = []
      this.pointTest.answerList.map((item, index) => {
        if (item.isTrue) {
          list.push(this.letter[index])
        }
      })
      this.pointTestDialog = false
      this.player.play()
      this.$message(`正确答案为：${list.toString()}`)
    },
    nextQuestion (e) {
      if (e.srcElement.innerText === '下一题' && this.activeQuestion < this.questionList.length - 1) {
        this.activeQuestion++
        this.displayQuestion = this.questionList[this.activeQuestion]
      } else if (e.srcElement.innerText === '上一题' && this.activeQuestion > 0) {
        this.activeQuestion--
        this.displayQuestion = this.questionList[this.activeQuestion]
      }
    },
    submitQuestion () {
      var json = {
        chapterId: this.chapterInfo.chapterId,
        cardId: this.cardId,
        testScore: 0,
        testTime: '0'
      }
      var trueNum = 0
      this.questionList.map(q => {
        if (Array.isArray(q.isTrue) && q.isTrue.length !== 0) {
          var num = []
          var checkNum = 0
          q.answerList.map(a => {
            if (a.isTrue) {
              num.push(a.answerId)
            }
          })
          if (num.length === q.isTrue.length) {
            q.isTrue.map(i => {
              if (num.includes(i)) checkNum++
            })
            if (num.length === checkNum) {
              trueNum++
              // json.testScore += q.question.questionScore
            }
          }
        } else {
          q.answerList.map(a => {
            if (a.answerId === q.isTrue && a.isTrue) {
              trueNum++
              // json.testScore += q.question.questionScore
              return false
            }
          })
        }
      })
      console.log(trueNum)
      console.log(this.questionList.length)
      // var coract = trueNum / this.questionList.length
      // json.testScore= coract.toFixed(1)*100
      json.testScore = Math.ceil((trueNum / this.questionList.length)*100)
      if (trueNum / this.questionList.length >= 0.6) {
        // console.log(json)
        api.submitChapterTest(json)
          .then(res => {
            // console.log(1234)
            console.log(res)
            if (res.code === '100') {
              this.$message.success('您的得分为' + res.data.testScore + '分，恭喜您通过考试')
            }
          })
      } else {
        this.$message.error('很遗憾您未通过考试')
      }
    },
  },
  created () {
    let query = this.$route.query
    // console.log(query)
    if (query.courseId) {
      this.cardId = this.$store.state.user.userName
      this.courseId = query.courseId
      api.getCourseAd(query.courseId)
        .then(res => {
          this.adList = res.data || []
        })
      api.getChapterList(query.courseId, this.cardId)
        .then(res => {
          if (res.code == '100') {
            this.chapterList = res.data
            this.chapterInfoInit(query)
          } else {
            this.$message.error(res.msg || '请求失败')
          }
        })
      this.$store.dispatch('getCourse', query.courseId)
    } else {
      this.$router.back(-1)
    }
  }
}
</script>
<style type="text/css">
  .vjs-big-play-button {
    top: 50% !important;
    left: 50% !important;
    margin: -0.75em 0 0 -1.5em !important;
  }
  .answer .question-answer .el-radio__label {
    font-size: 18px;
  }
  .answer .question-answer .el-radio__inner {
    width: 18px;
    height: 18px;
  }
</style>
<style scoped lang="scss">
  .el-dialog__wrapper {
    background: rgba(0, 0, 0, 0.3);
    z-index: 100;
    .el-dialog {
      width: 600px;
      margin-top: 10%;
    }
  }
  .breadcrumb {
    margin: 20px 0;
  }
  .listen-main {
    overflow: hidden;
    position: relative;
  }
  #my-video, .answer {
    float: left;
  }
  .question-info {
    margin-left: 110px;
  }
  .answer {
    width: 890px;
    height: 562px;
    font-size: 18px;
    overflow-y: auto;
    padding-top: 20px;
    background-color: #fff;
  }
  .answer .submit {
    text-align: right;
    margin-right: 10px;
  }
  .answer .number {
    width: 110px;
    line-height: 40px;
    text-align: center;
    color: #ffa012;
    float: left;
  }
  .answer .btn {
    margin: 40px 0 20px;
    text-align: center;
  }
  .answer .btn button {
    border: none;
    outline: none;
    width: 220px;
    height: 60px;
    line-height: 60px;
    color: #fff;
    border-radius: 18px;
    background-color: #409eff;
    cursor: pointer;
  }
  .answer .btn button:first-child {
    margin-right: 79px;
  }
  .chapter {
    width: 300px;
    height: 615px;
    overflow-y: auto;
    float: right;
    background-color: #fff;
  }
  .chapter .tab {
    overflow: hidden;
  }
  .chapter .tab div {
    width: 50%;
    height: 60px;
    line-height: 60px;
    text-align: center;
    float: left;
    cursor: pointer;
    border-bottom: 4px solid #fff;
  }
  .chapter .tab div.active {
    color: #1d6ad2;
    border-color: #1d6ad2;
  }
  .chapter li {
    padding: 0 20px;
    line-height: 40px;
    cursor: pointer;
  }
  .chapter li h3.active {
    color: #1d6ad2;
  }
  .chapter li .play {
    width: 20px;
    height: 20px;
    line-height: 20px;
    text-align: center;
    color: #409EFF;
    border-radius: 50%;
    border: 1px solid #409EFF;
    transition: all .3s linear;
    margin-right: 5px;
  }
  .chapter li .play.active {
    color: #fff;
    background-color: #409EFF;
  }
  .chapter li .play:hover {
    color: #fff;
    background-color: #4491E1;
  }
  .ad-list {
    margin: 20px 0;
  }
</style>
