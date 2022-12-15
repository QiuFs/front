<template>
    <div class="main">
      <div>
        <p style="color: #a40000;">
          通知：{{notify}}
        </p>
      </div>
      <div>
        <label class="prompt">温馨提示：</label>
        <div>
        </div>
      </div>
    </div>
</template>

<script>
import { METHODS } from "http";
import api from '@/api/api'
export default {
  data () {
    return {
      notify: ""
    }
  },
  methods: {
    getnotify() {
      console.log(this.$store.state.user)
      api.getNotify().then(res => {
        console.log(res)
        this.notify = res.data.notify
      })
    }
  },
  created () {
    this.getnotify();
  }
}


</script>

<style scoped>
  .main > div{
    margin-bottom: 30px;
    font-size: 14px;
    color: #16192F;
    line-height: 24px;
  }
  .prompt{
    display: block;
    padding-bottom: 20px;
  }
</style>
