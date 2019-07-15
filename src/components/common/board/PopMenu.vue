<template>
  <div class="text-xs-center">
      <v-dialog v-model="dialog" width="500">
      <v-card class="radius">
        <v-card-actions v-if="user != null && ! isMine && board.user.isMeFollowing">
          <v-btn block class="font-weight-bold" color="error" flat @click="unFollow()">
            팔로우 취소
          </v-btn>
        </v-card-actions>
        <v-divider v-if="user != null && ! isMine && board.user.isMeFollowing"/>
        <v-card-actions v-if="isMine || isAdmin">
          <v-btn block class="font-weight-bold" color="error" flat @click="deleteBoard()">
            게시물 삭제
          </v-btn>
        </v-card-actions>
        <v-divider v-if="isMine"/>
        <v-card-actions v-if="isMine">
          <v-btn block color="black" flat :to="{name: 'board/detail/form', params: {seq: `${boardSeq}`}}">
            게시물 수정
          </v-btn>
        </v-card-actions>
        <v-divider v-if="$route.name != 'board/detail'"/>
        <v-card-actions v-if="$route.name != 'board/detail'">
          <v-btn block color="black" flat :to="{name: 'board/detail', params: {seq: `${boardSeq}`}}">
            게시물로 이동
          </v-btn>
        </v-card-actions>
        <v-divider/>
        <v-card-actions>
          <v-btn block color="black" flat @click="$emit('close')">
            취소
          </v-btn>
        </v-card-actions>
      </v-card>
      </v-dialog>
      <confirm ref="confirm"/>
  </div>
</template>

<script>
import Confirm from '@/components/common/Dialog'

export default {
  components: {
    Confirm
  },
  props: ['board', 'isShow', 'isAdmin'],
  data () {
    return {
      dialog: false,
      user: null,
      isMine: false,
      boardUserSeq: this.board.user.seq,
      boardSeq: this.board.seq
    }
  },
  watch: {
    isShow () {
      if (this.isShow) {
        this.user = this.$store.getters.getUser
        if (this.user != null) {
          this.isMine = this.user.seq === this.boardUserSeq
        } else {
          this.isMine = false
        }
      }
      this.dialog = this.isShow
    },
    dialog () {
      if (!this.dialog && this.isShow) {
        this.$emit('close')
      }
    }
  },
  methods: {
    deleteBoard () {
      this.$emit('close')
      this.$refs.confirm.confirm({
        title: '게시물 삭제',
        body: '게시물을 삭제하시겠습니까?'
      }).then(_ => {
        if (this.isMine || this.isAdmin) {
          this.$http.delete('/api/board/' + this.boardSeq)
            .then(result => {
              this.$emit('deleteBoard', this.boardSeq)
            }, err => {
              console.error(err)
            })
        }
      }, _ => {
        console.log('cancel')
      })
    },
    unFollow () {
      this.$emit('close')
      this.$refs.confirm.confirm({
        title: '팔로우 취소',
        body: `${this.board.user.name} 사용자를 팔로우 취소하시겠습니까?`
      }).then(_ => {
        this.$http.put(`/api/my/follow/user/${this.board.user.seq}`)
          .then(result => {
            this.$reload.reload()
          }, err => {
            console.error(err)
          })
      }, _ => {
        console.log('cancel')
      })
    }
  }
}
</script>
