<template>
  <v-content>
    <v-layout align-center justify-center row fill-height v-if="gu != null">
      <v-flex xs12 sm3 offset-sm3 ma-4>
        <form @submit.prevent="signup(name)">
          <v-card class="mb40">
            <v-card-text>
              <v-flex pl-4 pr-4 pb-1>
                <p class="text-xs-center w300 headline signup-title">회원가입</p>
                <p class="text-xs-center mt-3 mb-4">
                  <v-avatar
                    color="grey lighten-4"
                    size="26"
                  >
                    <img v-if="gu.picture != null" :src="gu.picture" alt="avatar">
                  </v-avatar>
                  <span class="pl-2">{{gu.email}}</span>
                </p>
                <v-text-field
                  v-model="name"
                  label="name"
                  name="name"
                  :error="nameFlags.touched && nameFlags.valid == false"
                  :success="nameFlags.valid == true"
                  v-validate="'required|min:3|max:20|uniqueName'"
                ></v-text-field>
                <v-input
                  error
                  class="caption input-error-msg"
                  v-if="name != null && errors.has('name')"
                >{{ errors.first('name') }}</v-input>
              </v-flex>
            </v-card-text>
            <v-card-actions>
              <v-btn
                flat
                type="submit"
                :disabled="! isSubmitable">가입하기</v-btn>
            </v-card-actions>
            <modal ref="modal"/>
          </v-card>
        </form>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import Modal from '@/components/common/Dialog'
import { USER_STORAGE_ITEMS } from '@/const'
import flags from '@/util/VeeFlags'

export default {
  components: {
    Modal
  },
  data () {
    return {
      name: null
    }
  },
  created () {
    if (this.$store.getters.getUser != null) {
      this.$router.push('/')
    }
  },
  methods: {
    signup () {
      if (this.isSubmitable === false) {
        return
      }

      this.$http.post('/api/user', {
        name: this.name,
        sub: this.gu.sub
      }).then(({ data }) => {
        localStorage.removeItem('gu')
        this.$store.commit('setGoogleUser', null)

        for (let key in USER_STORAGE_ITEMS) {
          let name = USER_STORAGE_ITEMS[key]
          if (key === 'user') {
            this.$store.commit('setUser', data[key])
            localStorage.setItem(name, JSON.stringify(data[key]))
          } else {
            localStorage.setItem(name, data[key])
          }
        }
        this.$router.push({ name: 'main' })
      }, err => {
        console.error(err)
        this.$refs.modal.alert({
          title: '회원 가입 실패',
          body: err.response.data.message
        })
      })
    }
  },
  computed: {
    ...flags('name'),
    isSubmitable () {
      return this.nameFlags.valid === true && this.gu !== null && this.gu.sub !== null
    },
    gu () {
      return this.$store.getters.getGu
    }
  }
}
</script>

<style scoped>
  .signup-btn {
      cursor: pointer;
  }
  .signup-title {
    margin: 30px auto;
  }
</style>
