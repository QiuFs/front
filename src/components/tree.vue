<template>
  <div :class="{'list': true,'active': model.isFlod}" @click="isFlod">
    <div style="width: 100%;overflow:hidden;">
      <div class="number" v-if="sindex === undefined">{{'第' + (index + 1) + '章'}}</div>
      <div class="name">{{model.chapterName}}</div>
      <div style="height: 72px;" v-if="model.childChapter.length === 0">
        <div class="status">{{model.videoPosition ? model.testActive ? '完成测试' : '未完成测试' : '未完成'}}</div>
        <div class="progress">
          <el-progress style="margin-top: 27px" :text-inside="true" :stroke-width="18" :percentage="model.videoPosition ? model.videoPosition.videoPosition && model.videoPosition.videoTime ? Math.round(model.videoPosition.videoPosition.split('.')[0] / model.videoPosition.videoTime.split('.')[0] * 100) : 0 : 0"></el-progress>
        </div>
        <div class="operate">
          <div class="el-icon-caret-right" @click.stop="getUrl"></div>
        </div>
      </div>
    </div>
    <tree
      class="list"
      v-show="model.isFlod"
      v-for="(sitem, sindex) in model.childChapter"
      :key="sindex"
      :model="sitem"
      :index="index"
      :sindex="sindex">
    </tree>
  </div>
</template>

<script>
export default {
  name: 'tree',
  props: {
    model: Object,
    index: Number,
    sindex: Number
  },
  data () {
    return {
      courseId: ''
    }
  },
  methods: {
    isFlod () {
      this.$set(this.model, 'isFlod', !this.model.isFlod)
    },
    getUrl () {
      var query = {
        courseId: this.courseId,
        index: this.index
      }
      if (this.sindex !== undefined) query.sindex = this.sindex
      this.$router.push({path: '/listen', query: query})
    }
  },
  created () {
    this.courseId = this.$route.params.id
  }
}
</script>

<style scoped>
  .list {
    line-height: 72px;
    color: #333;
    font-size: 18px;
    border-bottom: 1px solid #f8f8f8;
    overflow: hidden;
  }
  .list.active .number {
    background: #fff;
  }
  .list>div>div, .list>div>div>div {
    float: left;
  }
  .list .number {
    width: 234px;
    text-align: center;
    background: #f2f2f2;
  }
  .list .name {
    width: 319px;
    padding-left: 47px;
  }
  .list .el-icon-caret-right {
    width: 40px;
    height: 40px;
    line-height: 40px;
    color: #fff;
    font-size: 32px;
    border-radius: 50%;
    background: #409eff;
    margin: 16px auto;
    cursor: pointer;
  }
  .list .list {
    padding-left: 234px;
  }
  .list .progress {
    width: 325px;
    padding-left: 25px;
  }
  .list .status, .list .operate {
    width: 125px;
    text-align: center;
  }
</style>
