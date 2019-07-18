<template>
  <header>
    <v-toolbar style="background-color: white;" fixed app>
      <v-tooltip bottom v-if="user == null">
        <template v-slot:activator="{ on }">
          <a class="sign-btn" style="left: 1.5rem;" v-on="on" @click="auth()">
            로그인
          </a>
        </template>
        <span>Google 계정으로 로그인</span>
      </v-tooltip>
      <span style="color: #000; left: 4.7rem; position: absolute; cursor: default;" v-if="user == null"> | </span>
      <v-tooltip bottom v-if="user == null">
        <template v-slot:activator="{ on }">
          <a class="sign-btn" style="left: 5.7rem;" v-on="on" @click="auth()">
            회원가입
          </a>
        </template>
        <span>Google 계정으로 회원가입</span>
      </v-tooltip>
      <v-img
        class="pointer"
        style="display:block; margin: 0 auto;"
        max-width="160px"
        src="https://hy-sns1906.s3.ap-northeast-2.amazonaws.com/res/logo.png"
        @click="$reload.push('/')"/>
      <v-toolbar-items style="position: absolute; right: 1rem;" @mouseover="isMyNavShow = true" @mouseleave="mouseleave()">
        <icon-btn v-if="user != null" icon-name="person" @click="$reload.push({name: 'user/main', params: {seq: user.seq}})"/>
      </v-toolbar-items>
      <transition name="fade">
        <v-layout
          align-center justify-center row fill-height v-if="user != null && isMyNavShow == true"
          style="position: absolute; top: 10.5rem; right: 0.5rem;">
          <v-flex mb-1 @mouseenter="enterNav()" @mouseleave="isMyNavShow = false">
            <v-card>
              <v-card-title>{{user.name}}</v-card-title>
              <v-divider/>
              <v-card-actions class="pb-0">
                <v-btn flat block @click="$reload.push({name: 'my/board/like'})">
                  <v-icon small class="mr-2">favorite</v-icon>
                  좋아요한 게시물 보기
                </v-btn>
              </v-card-actions>
              <v-card-actions class="pb-0">
                <v-btn flat block @click="$reload.push({name: 'my/board/follow'})">
                  <v-icon small class="mr-2">people</v-icon>
                  팔로우 유저 게시물 보기
                </v-btn>
              </v-card-actions>
              <v-card-actions>
                <v-btn flat block @click="$reload.push({name: 'user/main', params: {seq: user.seq}})">
                  <v-icon small class="mr-2">person</v-icon>
                  마이페이지로 이동
                </v-btn>
              </v-card-actions>
              <v-divider/>
              <v-card-actions>
                <v-btn flat block @click="signout()">
                  <v-icon small class="mr-2">power_settings_new</v-icon>
                  로그아웃
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </transition>
    </v-toolbar>
    <v-snackbar
      v-model="snackbar"
      :timeout="timeout"
      :top="top"
      v-if="user != null"
    >
      {{user.name}}님, 반갑습니다.
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-btn
      v-if="$route.name != 'board/form' && $route.name != 'board/detail/form'"
      dark
      fab
      right
      style="position: fixed; bottom:40px; z-index: 200;"
      color="pink"
      @click="$router.push({name: 'board/form'})"
    >
      <v-icon>add_photo_alternate</v-icon>
    </v-btn>
  </header>
</template>

<script>
import GooleAuthService from '@/service/auth/GooleAuthService'
import AuthService from '@/service/auth/AuthService'
import IconBtn from '@/components/common/IconBtn'
import { setTimeout, clearTimeout } from 'timers'

export default {
  data () {
    return {
      drawer: false,
      snackbar: false,
      timeout: 5000,
      top: true,
      isMyNavShow: false,
      navTimeout: null
    }
  },
  components: {
    IconBtn
  },
  methods: {
    auth () {
      GooleAuthService.gooleAuthPop(_ => {
        this.snackbar = true
      }, _ => {
        this.$router.push({ name: 'signup' })
      })
    },
    signout () {
      AuthService.signout()
    },
    tip (msg) {
      this.$refs.tip.tip(msg)
    },
    mouseleave () {
      this.navTiimeout = setTimeout(_ => {
        this.isMyNavShow = false
      }, 100)
    },
    enterNav () {
      clearTimeout(this.navTiimeout)
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  }
}
</script>

<style scoped>
.menu-block {
  display: inline-block;
}

.sign-btn {
  color: black;
  position: absolute;
}

.sign-btn:hover {
  color: gray;
  box-shadow: 100px;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}
.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
