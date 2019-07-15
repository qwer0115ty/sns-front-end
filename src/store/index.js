import Vue from 'vue'
import Vuex from 'vuex'
import { USER_ITEM_NAME } from '@/const'

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
      if (state.user == null && localStorage[USER_ITEM_NAME] != null && localStorage[USER_ITEM_NAME] !== undefined) {
        let user = JSON.parse(localStorage[USER_ITEM_NAME])
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
