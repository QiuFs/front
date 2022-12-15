import $cookie from '../api/cookie'
export default {
  setUser (state) {
    if ($cookie.getCookie('userName') && $cookie.getCookie('token')) {
      state.user = {
        userName: $cookie.getCookie('userName'),
        token: $cookie.getCookie('token')
      }
    } else {
      state.user = null
    }
  },
  setUserInfo (state, data) {
    state.userInfo = data
  },
  setCourse (state, data) {
    state.courseInfo = data
  }
}
