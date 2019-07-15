import Vue from 'vue'
import Router from 'vue-router'
import './config'

Vue.use(Router)

let routerDirs = [
  './main',
  './signup',
  './board',
  './my',
  './user'
]
let routers = []

routerDirs.forEach(dir => {
  routers = routers.concat(require(`${dir}`).default)
})

export default new Router({
  routes: routers,
  mode: 'history',
  scrollBehavior (to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    } else {
      return { x: 0, y: 0 }
    }
  }
})
