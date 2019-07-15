<template>
  <div class="text-xs-center" v-if="title != null">
      <v-dialog
      class="radius"
      v-model="dialog"
      width="500"
      persistent
      >
      <v-card>
          <v-card-title
          class="title"
          primary-title
          >
          {{title}}
          </v-card-title>
          <v-divider/>
          <v-card-text>
          {{body}}
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              flat
              @click="ok()"
          >
              확인
          </v-btn>
          <v-btn
              v-if="isAlert == false"
              color="primary"
              flat
              @click="cancel()"
          >
              취소
          </v-btn>
          </v-card-actions>
      </v-card>
      </v-dialog>
  </div>
</template>

<script>
export default {
  props: ['isOpen'],
  data () {
    return {
      dialog: false,
      title: null,
      body: null,
      isAlert: false
    }
  },
  methods: {
    confirm (content) {
      this.dialog = true
      this.title = content.title
      this.body = content.body
      return new Promise((resolve, reject) => {
        this.resolve = resolve
        this.reject = reject
      })
    },
    alert (content) {
      this.isAlert = true
      this.dialog = true
      this.title = content.title
      this.body = content.body
    },
    ok () {
      if (this.isAlert === false) {
        this.resolve()
      }
      this.dialog = false
    },
    cancel () {
      this.reject()
      this.dialog = false
    }
  }
}
</script>
