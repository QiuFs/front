import axios from 'axios'
import $cookie from './cookie'
import router from '../router/index.js'
import store from '../store/index.js'
import { Message } from 'element-ui'

axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'

// 请求拦截器
axios.interceptors.request.use(function(config) {
  var token = $cookie.getCookie('token')
  if (token) {
    config.headers.token = token
  }
  return config
}, function(error) {
  return Promise.reject(error)
})
// 响应拦截器
axios.interceptors.response.use(function(response) {
  if (response.data.code === '222') {
    $cookie.removeCookie('userName')
    $cookie.removeCookie('token')
    store.commit('setUserInfo')
    router.push('/')
  } else if (response.data.code === 101) {
    Message.error(response.data.msg || '请求失败')
  }
  return response;
}, function(error) {
  Message.error('请求失败')
  return Promise.reject(error);
})
//var beforeUrl = 'http://localhost:8080/sc/'
//var beforeUrl = 'http://cubingsport.cn/sc/'
var beforeUrl = 'http://20.21.107.171:8890/sc/'


// 封装axios请求
export function axiosFun(url, params, method = 'post') {
  return new Promise((resolve, reject) => {
    axios({
      method: method,
      url: beforeUrl + url,
      data: params
    }).then(response => {
      resolve(response.data)
    }).catch((error) => {
      reject(error)
    })
  })
}

// 封装axios的get请求
export function get(url) {
  return new Promise((resolve, reject) => {
    axios.get(beforeUrl + url)
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

// 封装axios的put请求
export function put(url) {
  return new Promise((resolve, reject) => {
    axios.put(beforeUrl + url)
      .then(response => {
        resolve(response.data);
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export function del(url) {
  return new Promise((resolve, reject) => {
    axios.delete(beforeUrl + url)
      .then(response => {
        resolve(response.data)
      })
      .catch((error) => {
        reject(error)
      })
  })
}

export default {
  // 用户登陆
  login (params) {
    return axiosFun('front/login', params)
  },
  //获取通知
  getNotify () {
    return get('front/notify')
  },
  // 查找所有分类
  getType () {
    return get('article/type')
  },
  // 查找分类下文章
  getArticleList ({typeId, schoolId=11, page = 1, num = 10} = {}) {
    return get(`article/type/${schoolId}/${typeId}?page=${page}&num=${num}`)
  },
  // 查看文章详情
  getArticleMsg (articleId) {
    return get(`article/${articleId}`)
  },
  // 获取所有试听课程
  getFreeVideo ({page = 1, num = 10} = {}) {
    return get(`free-video?page=${page}&num=${num}`)
  },
  // 获取上传token
  getToken () {
    return get('video/upToken')
  },
  // 获取卡号关联课程
  getCourseList (cardId) {
    return get(`front/card/course?cardId=${cardId}`)
  },
  // 获取验证码
  send (phone) {
    return axiosFun(`front/card/send?phone=${phone}`)
  },
  // 绑定手机
  bindPhone (params) {
    return axiosFun(`front/card/validate?sessionId=${params.sessionId}&code=${params.code}&cardId=${params.cardId}&phone=${params.phone}`)
  },
  // 解绑手机
  unbindPhone (cardId, phone) {
    return axiosFun(`front/card/unbind?cardId=${cardId}&phone=${phone}`)
  },
  // 重置密码
  resetPass (params) {
    return put(`front/card/reset?cardId=${params.cardId}&pass=${params.pass}&newPass=${params.newPass}`)
  },
  // 找回密码验证
  findPassCheck (params) {
    return axiosFun(`front/card/check-retrieve?cardId=${params.cardId}&phone=${params.phone}`)
  },
  // 找回密码
  findPass (params) {
    return put(`front/card/retrieve?sessionId=${params.sessionId}&code=${params.code}&cardId=${params.cardId}&pass=${params.pass}`)
  },
  // 获取课程关联广告
  getCourseAd (courseId) {
    return get(`ad/${courseId}`)
  },
  // 查询单个课程
  getCourse (courseId) {
    return get(`front/course/${courseId}`)
  },
  // 获取卡号信息
  getCardMessage (cardId) {
    return get(`front/card/${cardId}`)
  },
  // 获取试卷
  getPaper (courseId) {
    return get(`front/paper/${courseId}`)
  },
  // 查找一条试题
  getQuestion (questionId) {
    return get(`front/question/${questionId}`)
  },
  // 提交试卷
  submitPaper (params) {
    return axiosFun('front/paper/commit', params)
  },
  // 获取课程下所有章节
  getChapterList (courseId, cardId) {
    return get(`front/course/${courseId}/${cardId}`)
  },
  // 获取章节详情
  getChapterDetails (chapterId) {
    return get(`front/course/chapter/${chapterId}`)
  },
  // 获取章节测试
  getChapterTest (chapterId) {
    return get(`front/chapter/test/${chapterId}`)
  },
  // 提交章节测试
  submitChapterTest (params) {
    return axiosFun('front/paper/chapter/new/commit', params)
  },
  // 添加章节播放记录
  addChapterPlay (courseId, params) {
    return axiosFun(`front/course/position?courseId=${courseId}`, params)
  },
  // 获取视频节点
  getPoint (videoId) {
    return get(`point/${videoId}`)
  }
}
