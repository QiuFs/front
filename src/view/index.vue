<template>
  <div>
  <div class="login">
    <div class="title" v-if="!user">用户登录</div>
    <div class="login-form">
      <el-form
        v-if="!user"
        :model="loginForm"
        :rules="rules"
        ref="loginForm"
        label-width="150px"
        class="login-form">
        <el-form-item label="temp" prop="userName">
          <span slot="label">账 号：</span>
          <el-input type="text" v-model="loginForm.userName" auto-complete="off"></el-input>
        </el-form-item>
        <el-form-item label="temp" prop="password">
          <span slot="label">密 码：</span>
          <el-input type="password" v-model="loginForm.password"></el-input>
        </el-form-item>
        <div class="findpass">
          <router-link to="/findpass">忘记密码</router-link>
        </div>
        <el-form-item style="text-align: center">
          <el-button :loading="btnLoading" @click="submitForm('loginForm')">登 录</el-button>
        </el-form-item>
      </el-form>
    </div>
    <img src="@/assets/imgs/banner.png" alt="banner" class="banner" />
  </div>
  <div class="flow">
    <!--<img src="@/assets/imgs/flow.png" alt="学习流程" />-->
  </div>
  </div>
</template>

<script>
import api from '@/api/api'
import $cookie from '@/api/cookie'
export default {
  data () {
    return {
      btnLoading: false,
      formLabelAlign: {
        name: '',
        region: '',
        type: ''
      },
      listenCourse:[],
      noticeList:[],
      questionList: [],
      loginForm: {
        userName: '',
        password: '',
        loginType: 2
      },
      rules: {
        userName: [
          {required: true, message: '账号不能为空', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '密码不能为空', trigger: 'blur'}
        ]
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.user
    }
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.btnLoading = true
          api.login(this.loginForm)
            .then(res => {
              this.btnLoading = false
              if (res.code === '100') {
                $cookie.setCookie('userName', this.loginForm.userName)
                $cookie.setCookie('token', res.token.id)
                this.$store.commit('setUser')
                this.$router.push({path: '/continue'})
              } else {
                this.$message.error(res.msg)
              }
            })
            .catch(() => {
              this.btnLoading = false
              this.$message.error('网络错误')
            })
        } else {
          return false;
        }
      })
    }
  },
  created () {
  }
}
</script>

<style lang="scss">
  .login-form {
    width: 450px;
    margin-top: 25px;
    text-align: center;
    .el-form-item__label {
      color: #ffffff;
    }
  }
</style>

<style scoped lang="scss">
  .login {
    height: 270px;
    background: linear-gradient(to left, #accb9c 30%, #3d5f7a);
    padding: 100px 54px 0;
    position: relative;
    .title {
      color: #fff;
      font-size: 26px;
      font-weight: bold;
      margin-left: 25px;
    }
    .title::after {
      display: inline-block;
      content: '';
      width: 350px;
      height: 3px;
      margin-left: 5px;
      background: #fff;
      vertical-align: text-bottom;
    }
    .findpass {
      text-align: right;
    }
    .banner {
      width: 430px;
      position: absolute;
      right: 75px;
      top: 98px;
    }
  }
  .flow {
    height: 276px;
    padding: 83px 115px 0;
    img {
      width: 695px;
    }
  }
</style>
