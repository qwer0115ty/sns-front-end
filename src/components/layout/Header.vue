<template>
  <header>
    <v-toolbar style="background-color: white;" fixed app>
      <v-tooltip bottom v-if="user == null">
        <template v-slot:activator="{ on }">
          <a class="sign-btn hidden-sm-and-down" style="left: 1.5rem;" v-on="on" @click="auth()">
            로그인
          </a>
        </template>
        <span>Google 계정으로 로그인</span>
      </v-tooltip>
      <span style="color: #000; left: 4.7rem; position: absolute; cursor: default;" class="hidden-sm-and-down" v-if="user == null"> | </span>
      <v-tooltip bottom v-if="user == null">
        <template v-slot:activator="{ on }">
          <a class="sign-btn hidden-sm-and-down" style="left: 5.7rem;" v-on="on" @click="auth()">
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
      <v-toolbar-items class="hidden-sm-and-up"
        ref="unsignBtn"
        style="position: absolute; right: 1rem;">
        <icon-btn
          v-if="user == null"
          icon-name="person"
          @click="isSignNavShow = !isSignNavShow"/>
      </v-toolbar-items>
      <transition name="fade">
        <v-layout
          ref="mobileSignLayout"
          align-center justify-center row fill-height v-if="user == null && isSignNavShow == true"
          style="position: absolute; top: 5rem; right: 0.5rem;">
          <v-flex mb-1>
            <v-card id="mobile-sign-nav">
              <v-card-title class="pt-2 pb-2 caption">Google 계정으로 로그인 / 회원가입</v-card-title>
              <v-divider/>
              <v-card-actions>
                <img
                  class="g-sign-btn"
                  @click="auth()"
                  src="https://hy-sns1906.s3.ap-northeast-2.amazonaws.com/res/btn_google_signin_light_normal_web.png">
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </transition>
      <v-toolbar-items style="position: absolute; right: 1rem;"
        ref="mobileMyBtn"
        @click="isMyNavShow = !isMyNavShow"
        @mouseover="enterNav()"
        @mouseleave="mouseleave()">
        <icon-btn v-if="user != null" icon-name="person"/>
      </v-toolbar-items>
      <transition name="fade">
        <v-layout
          ref="mobileMyLayout"
          align-center justify-center row fill-height v-if="user != null && isMyNavShow == true"
          style="position: absolute; top: 10.5rem; right: 0.5rem;">
          <v-flex mb-1 @mouseenter="enterNav()" @mouseleave="mouseleave()">
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
      {{snackbarMsg}}
      <v-btn
        color="pink"
        flat
        @click="snackbar = false"
      >
        Close
      </v-btn>
    </v-snackbar>
    <v-btn
      v-if="$route.name != 'board/form' && $route.name != 'board/detail/form' && $route.name != 'signup'"
      dark
      fab
      right
      style="position: fixed; bottom:40px; z-index: 1;"
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
import SnackBarBus from '@/service/HeaderSnackBarBus'
import IconBtn from '@/components/common/IconBtn'
import { setTimeout, clearTimeout } from 'timers'

export default {
  data () {
    return {
      drawer: false,
      snackbar: false,
      snackbarMsg: null,
      timeout: 3000,
      top: true,
      isMyNavShow: false,
      navTimeout: null,
      isSignNavShow: false
    }
  },
  components: {
    IconBtn
  },
  created () {
    SnackBarBus.onSnackBar(content => {
      this.snackbarMsg = content
      this.snackbar = true
    })
  },
  methods: {
    auth () {
      GooleAuthService.gooleAuthPop(_ => {
        this.isMyNavShow = false
        this.isSignNavShow = false
        this.snackbarMsg = `${this.user.name}님, 반갑습니다.`
        this.snackbar = true
      }, _ => {
        this.isMyNavShow = false
        this.isSignNavShow = false
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
      }, 1000)
    },
    enterNav () {
      this.isMyNavShow = true
      clearTimeout(this.navTiimeout)
    },
    mobileSignNavClick (e) {
      if (this.user != null || (!this.$refs.unsignBtn.contains(e.target) &&
        !this.$refs.mobileSignLayout.contains(e.target))) {
        this.isSignNavShow = false
      }
    }
  },
  computed: {
    user () {
      return this.$store.getters.getUser
    }
  },
  watch: {
    isSignNavShow (value) {
      if (value) {
        window.addEventListener('click', this.mobileSignNavClick)
      } else {
        window.removeEventListener('click', this.mobileSignNavClick)
      }
    }
  },
  destroyed () {
    console.log('destroyed')
    window.removeEventListener('click', this.mobileClick)
    window.removeEventListener('click', this.mobileMyNavClick)
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
.g-sign-btn {
  transition: background-image 1s;
  background-image: URL('https://hy-sns1906.s3.ap-northeast-2.amazonaws.com/res/btn_google_signin_light_normal_web.png');
}

.g-sign-btn:hover {
  cursor: pointer;
  background-image: URL('https://hy-sns1906.s3.ap-northeast-2.amazonaws.com/res/btn_google_signin_light_focus_web.png');
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .2s;
}

.fade-enter, .fade-leave-to {
  opacity: 0;
}
</style>
