import Vue from 'vue'
const name = 'router-event-'
const eventBus = new Vue()
Vue.prototype.$reload = {
  onPush (f) {
    eventBus.$on(name + 'push', f)
  },
  push (to) {
    eventBus.$emit(name + 'push', to)
  },
  onReload (f) {
    eventBus.$on(name + 'reload', f)
  },
  reload () {
    eventBus.$emit(name + 'reload')
  }
}
