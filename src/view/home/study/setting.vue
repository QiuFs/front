<template>
  <div class="setting">
    <div class="top">
      <div :class="{'active': tabActive === 1}" @click="tabClick(1)">绑定手机</div>
      <div :class="{'active': tabActive === 2}" @click="tabClick(2)">修改密码</div>
    </div>
    <div class="main" v-show="tabActive === 1">
      <div style="margin-bottom: 20px" v-if="userInfo.phone">当前绑定的手机：{{userInfo.phone}}</div>
      <el-form :model="bindPhoneForm" :rules="bindPhoneRules" ref="bindPhoneForm" label-width="100px">
        <el-form-item label="手机号码" prop="phone">
          <el-input v-model="bindPhoneForm.phone">
            <el-button slot="append" @click="send">{{time ? time + ' (s)' : '获取验证码'}}</el-button>
          </el-input>
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="bindPhoneForm.code"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="bindBtnLoading" type="primary" @click="submitBindPhoneForm('bindPhoneForm')">绑定</el-button>
          <el-button v-if="userInfo.phone" type="warning" @click="unbind">解除绑定</el-button>
        </el-form-item>
      </el-form>
    </div>
    <div class="main" v-show="tabActive === 2">
      <el-form :model="resetForm" :rules="resetRules" ref="resetForm" label-width="100px">
        <el-form-item label="原始密码" prop="pass">
          <el-input type="password" v-model="resetForm.pass"></el-input>
        </el-form-item>
        <el-form-item label="新密码" prop="newPass">
          <el-input type="password" v-model="resetForm.newPass"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button :loading="resetBtnLoading" type="primary" @click="submitResetForm('resetForm')">重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
const reg = /^1[3|4|5|7|8|9]\d{9}$/
import api from '@/api/api.js'
export default {
  data () {
    const validate = (rule, value, callback) => {
      if (value === this.resetForm.pass) {
        callback(new Error('原始密码和新密码不能相同'))
      } else {
        callback()
      }
    };
    return {
      tabActive: 1,
      time: '',
      bindBtnLoading: false, // 绑定buttonLoading
      resetBtnLoading: false, // 重置buttonLoading
      bindPhoneForm: {},
      resetForm: {},
      bindPhoneRules: {
        phone: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { pattern: reg, message: '手机号码不正确', trigger: 'change' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' }
        ]
      },
      resetRules: {
        pass: [
          { required: true, message: '请输入原始密码', trigger: 'blur' },
        ],
        newPass: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { pattern: /^\S*$/, message: '密码中不能包含空格', trigger: 'change' },
          { validator: validate, trigger: 'blur' }
        ]
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo
    }
  },
  beforeDestroy () {
    clearInterval(this.set)
  },
  methods: {
    tabClick (tabActive) {
      this.tabActive = tabActive
    },
    send () { // 获取验证码
      if (reg.test(this.bindPhoneForm.phone)) {
        if (!this.time) {
          api.send(this.bindPhoneForm.phone)
            .then(res => {
              if (res.code === '100') {
                this.bindPhoneForm.sessionId = res.data.sessionId
                this.countdown()
              }
            })
        }
      } else {
        this.$message.error('手机号码不正确')
      }
    },
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
    unbind () { // 解除绑定
      api.unbindPhone(this.userInfo.cardId, this.userInfo.phone)
        .then(res => {
          if (res.code === '100') {
            var userInfo = { ...this.userInfo }
            userInfo.phone = null
            this.$store.commit('setUserInfo', userInfo)
          }
        })
    },
    submitBindPhoneForm (formName) { // 绑定表单提交
      if (!this.bindPhoneForm.sessionId) {
        this.$message('请先获取验证码')
        return false
      }
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$confirm('如果该账号绑定过手机，此操作会覆盖原先手机', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            this.bindBtnLoading = true
            api.bindPhone({...this.bindPhoneForm, cardId: this.userInfo.cardId})
              .then(res => {
                this.bindBtnLoading = false
                if (res.code === '100') {
                  this.$message.success('绑定成功')
                  this.$store.commit('setUserInfo', res.data)
                }
              }).catch(() => {
                this.bindBtnLoading = false
              })
          }).catch(() => {
            this.$message('已取消操作')
          })
        } else {
          return false
        }
      })
    },
    submitResetForm (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          api.resetPass({...this.resetForm, cardId: this.userInfo.cardId})
            .then(res => {
              if (res.code === '100') {
                this.$message.success('设置密码成功')
                this.resetForm = {}
              } else {
                this.$message.error(res.msg)
              }
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
  .setting {
    height: 500px;
    padding: 16px;
    border: 1px solid #eee;
    background: #fff;
    .top {
      height: 54px;
      line-height: 54px;
      border-bottom: 1px solid #eee;
      div {
        display: inline-block;
        width: 98px;
        height: 33px;
        line-height: 33px;
        text-align: center;
        margin-right: 15px;
        cursor: pointer;
        border: 1px solid #eee;
      }
      div.active {
        color: #fff;
        border-color: #1D6AD2;
        background: #1D6AD2;
      }
    }
    .main {
      padding: 20px;
      .el-input {
        width: 300px;
      }
    }
  }
</style>
