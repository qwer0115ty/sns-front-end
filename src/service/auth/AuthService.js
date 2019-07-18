import store from '@/store'
import router from '@/router'
import { USER_STORAGE_ITEMS } from '@/const'

export default {
  signout () {
    for (let key in USER_STORAGE_ITEMS) {
      localStorage.removeItem(USER_STORAGE_ITEMS[key])
    }
    store.commit('signout')
    router.push('/')
  }
}
