<template>
  <v-alert :type="type" :value="isShow" transition="fade-transition">
    {{message}}
  </v-alert>
</template>

<script>
import { setTimeout } from 'timers'

export default {
  data () {
    return {
      type: null,
      message: null,
      isShow: false
    }
  },
  methods: {
    error (msg) {
      this.type = 'error'
      this.isShow = true
      this.message = msg
      setTimeout(_ => {
        this.isShow = false
      }, 3000)
    }
  }
}
</script>
