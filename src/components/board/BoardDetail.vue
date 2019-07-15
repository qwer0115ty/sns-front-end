<template>
    <v-content v-if="board != null">
        <v-layout>
            <v-flex xs12 sm4 offset-sm4>
              <board :board="board" @likeChanged="changeLikeStatus($event)" @deleteBoard="deleteBoard()"/>
            </v-flex>
        </v-layout>
    </v-content>
</template>

<script>
import Board from '@/components/common/board/Board'

export default {
  data () {
    return {
      board: null
    }
  },
  components: {
    Board
  },
  created () {
    this.$http.get('/api/board/' + this.$route.params.seq)
      .then(({ data }) => {
        this.board = data
      }, err => {
        console.error(err)
        this.$router.push('/')
      })
  },
  methods: {
    deleteBoard () {
      this.$router.push({ name: 'user/main', params: { seq: `${this.board.user.seq}` } })
    },
    changeLikeStatus ({data: { boardLikeCount, meLikedBoard }}) {
      this.board.boardLikeCount = boardLikeCount
      this.board.isMeLikedBoard = meLikedBoard
    }
  }
}
</script>

<style scoped>
</style>
