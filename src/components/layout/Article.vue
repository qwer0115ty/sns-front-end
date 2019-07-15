<template>
  <article>
    <router-view :key="key"/>
  </article>
</template>

<script>
export default {
  data () {
    return {
      code: 0
    }
  },
  created () {
    this.$reload.onPush(to => {
      window.scrollTo(0, 0)
      this.$router.push(to)
      this.code++
    })
    this.$reload.onReload(_ => {
      this.code++
    })
  },
  computed: {
    key () {
      return this.$route.fullPath + this.code
    }
  }
}
</script>
