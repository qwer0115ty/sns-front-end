import Vue from 'vue'
const name = 'header-snackBar-event-bus'
const eventBus = new Vue()
export default {
  onSnackBar (f) {
    eventBus.$on(name, f)
  },
  snackBar (content) {
    eventBus.$emit(name, content)
  }
}
