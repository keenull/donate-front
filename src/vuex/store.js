import Vue from 'vue'
import Vuex from 'vuex'
import { setCookie, getCookie, delCookie } from '../utils/util'

Vue.use(Vuex)
// 登录验证
export default new Vuex.Store({
  state: {
    user: sessionStorage.getItem('userInfo'),
    token: getCookie('token'),
    scope: getCookie('scope'),
    refreshToken: getCookie('refreshToken'),
    tokenType: getCookie('tokenType')
  },
  mutations: {
    // 登录
    login (state, user) {
      setCookie('token', user.access_token, user.expires_in)
      setCookie('scope', user.scope, user.expires_in)
      setCookie('refreshToken', user.refresh_token, user.expires_in)
      setCookie('tokenType', user.token_type, user.expires_in)
      state.token = getCookie('token')
      state.scope = getCookie('scope')
      state.refreshToken = getCookie('refreshToken')
      state.tokenType = getCookie('tokenType')
    },
    setLoginUser (state, user) {
      state.user = user
      sessionStorage.setItem('userInfo', JSON.stringify(user))
    },
    // 退出
    logout (state) {
      sessionStorage.removeItem('userInfo')
      delCookie('token')
      delCookie('scope')
      delCookie('refreshToken')
      delCookie('tokenType')
    }
  }
})
