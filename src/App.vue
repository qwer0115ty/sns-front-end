<template>
  <v-app id="app">
    <Header/>
    <Article/>
  </v-app>
</template>

<script>
import Header from './components/layout/Header'
import Article from './components/layout/Article'

export default {
  name: 'App',
  components: {
    Header,
    Article
  }
}
</script>

<style>
@import '@../../../static/css/style';

#app {
  font-family: 'NanumBarunGothic', sans-serif;
  margin-top: 30px;
}

/* #app {
  font-family: 'NanumBarunGothic', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
} */
</style>
