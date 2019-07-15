import Vue from 'vue'
import VeeValidate from 'vee-validate'
import ko from 'vee-validate/dist/locale/ko'
import './customMessage'
import './validation'

Vue.use(VeeValidate, {
  locale: 'ko',
  dictionary: {
    ko
  }
})
