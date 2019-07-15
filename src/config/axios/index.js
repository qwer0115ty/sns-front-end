import Vue from 'vue'
import axios from 'axios'
import router from '@/router'
import store from '@/store'
import { TOKEN_ITEM_NAME } from '@/const'
import AuthService from '@/service/auth/AuthService'
Vue.prototype.$http = axios

axios.interceptors.request.use(request => {
  if (store.getters.getUser != null) {
    request.headers.authorization = `Bearer ${localStorage.getItem(TOKEN_ITEM_NAME)}`
  }
  return request
}, error => Promise.reject(error)
)

axios.interceptors.response.use(response => {
  return response
}, error => {
  if (error.response.status === 401 && error.response.data.error_description === 'token expire') {
    console.log('token expire')
    AuthService.signout()
    router.go({
      path: '/',
      force: true
    })
  }
  return Promise.reject(error)
})
