import Vue from 'vue'
import Vuex from 'vuex'
import { TOKEN_ITEM_NAME } from '@/const'
import jwtDecode from 'jwt-decode'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: null,
    gu: null
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },
    setGoogleUser (state, gu) {
      state.gu = gu
    },
    signout (state) {
      state.user = null
      state.gu = null
    }
  },
  getters: {
    getUser: state => {
      if (state.user == null && localStorage[TOKEN_ITEM_NAME] != null) {
        let user = jwtDecode(localStorage.getItem(TOKEN_ITEM_NAME)).user
        this.a.commit('setUser', user)
      }
      return state.user
    },
    getGu: state => {
      if (state.gu == null && localStorage.gu != null && localStorage.gu !== undefined) {
        let gu = JSON.parse(localStorage.gu)
        this.a.commit('setGoogleUser', gu)
      }
      return state.gu
    }
  }
})
