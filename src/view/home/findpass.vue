<template>
  <div class="container">
    <el-form :model="verificationForm" ref="verificationForm" label-width="100px">
      <el-form-item
        label="账号"
        prop="cardId"
        :rules="[
          { required: true, message: '请输入账号', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '不允许输入特殊符号', trigger: ['blur', 'change'] }
        ]">
        <el-input :disabled="findpassForm.sessionId !== undefined" v-model="verificationForm.cardId" placeholder="请输入账号"></el-input>
      </el-form-item>
      <el-form-item
        label="手机号码"
        prop="phone"
        :rules="[
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: /^1[3|4|5|7|8|9]\d{9}$/, message: '请输入正确的手机号码', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="verificationForm.phone" placeholder="请输入手机号码">
          <el-button
            slot="append"
            @click="submitVerificationForm('verificationForm')">
            {{time ? time + ' (s)' : '获取验证码'}}
          </el-button>
        </el-input>
      </el-form-item>

    </el-form>
    <el-form :model="findpassForm" ref="findpassForm" label-width="100px">
      <el-form-item
        label="验证码"
        prop="code"
        :rules="[
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { pattern: /^[A-Za-z0-9\u4e00-\u9fa5]+$/, message: '请输入正确的验证码', trigger: ['blur', 'change'] }
        ]">
        <el-input v-model="findpassForm.code" placeholder="请输入验证码"></el-input>
      </el-form-item>
      <el-form-item
        label="新密码"
        prop="pass"
        :rules="[
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S*$/, message: '密码中不能包含空格', trigger: ['blur', 'change'] }
        ]">
        <el-input type="password" v-model="findpassForm.pass" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button :loading="btnLoading" @click="submitFindpassForm('findpassForm')">提交</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from '@/api/api'
export default {
  data () {
    return {
      time: '',
      btnLoading: false,
      verificationForm: {},
      findpassForm: {}
    }
  },
  beforeDestroy () {
    clearInterval(this.set)
  },
  methods: {
    countdown () { // 倒计时
      this.time = 60
      this.set = setInterval(() => {
        if (this.time === 0) {
          clearInterval(this.set)
          return false
        }
        this.time = --this.time
      }, 1000)
    },
    submitVerificationForm (formName) {
      if (!this.time) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            api.findPassCheck(this.verificationForm)
              .then(res => {
                if (res.code === '100') {
                  this.countdown()
                  this.findpassForm = {
                    sessionId: res.data.sessionId,
                    cardId: this.verificationForm.cardId
                  }
                }
              })
          } else {
            return false
          }
        })
      }
    },
    submitFindpassForm (formName) {
      if (this.findpassForm.sessionId) {
        this.$refs[formName].validate((valid) => {
          if (valid) {
            this.btnLoading = true
            api.findPass(this.findpassForm)
              .then(res => {
                this.btnLoading = false
                if (res.code === '100') {
                  this.$message.success('找回密码成功， 稍后返回')
                  this.$router.push('/')
                }
              }).catch(() => {
                this.btnLoading = false
              })
          } else {
            return false
          }
        })
      } else {
        this.$message('请先获取验证码')
      }
    }
  }
}
</script>

<style lang="scss" scoped>
  .container {
    width: 800px;
    margin: 0 auto;
    padding-top: 20px;
    .el-form {
      width: 400px;
      margin: 0 auto;
    }
    .el-form:first-child {
      margin-top: 150px;
    }
  }
</style>
