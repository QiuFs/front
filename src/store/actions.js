import api from '@/api/api.js'
export default {
  setUserInfo ({commit, state}, fun) {
    api.getCardMessage(state.user.userName)
      .then(res => {
        if (typeof fun === 'function') fun(res.data)
        commit('setUserInfo', res.data)
      })
  },
  getCourse ({commit, state}, id) {
    api.getCourse(id)
      .then(res => {
        console.log(res.data)
        if (res.code === '100') {
          commit('setCourse', res.data)
        }
      })
  }
}