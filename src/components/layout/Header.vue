<template>
  <header>
    <v-toolbar color="#0C4C8A" dark fixed app>
      <v-layout justify-space-around>
        <v-flex shrink absolute>
          <v-expand-x-transition>
            <div v-show="expand" style="white-space: nowrap;">
              <div v-if="user == null" class="menu-block">
                <icon-btn icon-name="person_add" @click="auth()"/>
                <icon-btn icon-name="lock_open" @click="auth()"/>
              </div>
              <icon-btn icon-name="power_settings_new" v-else @click="signout()"/>
              <icon-btn icon-name="view_list" @click="$reload.push({ path: '/' })"/>
              <div v-if="user != null" class="menu-block">
                <icon-btn icon-name="person" @click="$reload.push({name: 'user/main', params: { seq: `${user.seq}` }})"/>
                <icon-btn icon-name="people" @click="$reload.push({ name: 'my/board/follow' })"/>
                <icon-btn icon-name="favorite" @click="$reload.push({ name: 'my/board/like' })"/>
                <icon-btn icon-name="add_photo_alternate" @click="$reload.push({ name: 'board/form' })"/>
              </div>
            </div>
          </v-expand-x-transition>
        </v-flex>
      </v-layout>

      <v-toolbar-side-icon @click.stop="expand = !expand"></v-toolbar-side-icon>
    </v-toolbar>
  </header>
</template>

<script>
import GooleAuthService from '@/service/auth/GooleAuthService'
import AuthService from '@/service/auth/AuthService'
import IconBtn from '@/components/common/IconBtn'

export default {
  data () {
    return {
      expand: false
    }
  },
  components: {
    IconBtn
  },
  // props: {
  //   source: String
  // },
  methods: {
    auth () {
      GooleAuthService.gooleAuthPop(_ => {
      }, _ => {
        this.$router.push({ name: 'signup' })
      })
    },
    signout () {
      AuthService.signout()
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
</style>
