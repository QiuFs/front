<template>
  <div>
    <el-row>
      <video-player
        id='my-video'
        class="video-player-box video"
        ref="videoPlayer"
        :options="playerOptions"
        :playsinline="true"
        customEventName="customstatechangedeventname">
      </video-player>
    </el-row>
  </div>
</template>
<script>
  import api from '@/api/api'
  import 'video.js/dist/video-js.css'
  import { videoPlayer } from 'vue-video-player'
  export default {
    components: {
      videoPlayer
    },
    data() {
      return {
        courseDictoryList: [],
        userId: '',
        courseId: '',
        year: '',
        chapterMessage: '',
        activeName: '',
        videoDom: '',
        schedule: '',
        playerOptions: {
          language: 'zh-CN',
          playbackRates: [0.7, 1.0, 1.5, 2.0],
          sources: [],
          height: 495,
          width: 600
        }
      }
    },
    created() {
      this.playerOptions.sources = [
        {
          type: "video/mp4",
          src: this.$route.query.url
        }
      ]
    }
  }
</script>
<style type="text/css" media="screen">
  .video-js .vjs-big-play-button{
    top: 50%;
    left: 50%;
    margin: -.75em 0 0 -1.5em;
  }
</style>
<style scoped>
  .video{
    width: 600px;
    height: 495px;
    margin: 15px auto;
    background-color: #666;
  }
</style>
