import Vue from 'vue'
import Vuex from 'vuex'
import mutations from './mutations.js'
import actions from './actions.js'
Vue.use(Vuex)
const state = {
  userInfo: {}, //用户详情
  user: null, //保存cardId
  courseInfo: {}
}
export default new Vuex.Store({
  state,
  mutations,
  actions
})
