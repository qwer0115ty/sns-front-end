<template>
  <v-content>
    <v-layout v-if="boardsType != null && boards != null">
        <v-flex xs12 sm4 offset-sm4 v-if="boards.length > 0">
          <board v-for="board in boards" :key="board.seq" :board="board" @likeChanged="changeLikeStatus($event)"
            @deleteBoard="$reload.reload()"/>
        </v-flex>
        <v-flex xs12 sm4 offset-sm4 v-else>
          <v-card class="mb40 ml-2 mr-2">
            <v-layout row wrap>
              <span class="empty-box">{{emptyMsg}}</span>
            </v-layout>
          </v-card>
        </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import Board from '@/components/common/board/Board'

export default {
  data () {
    return {
      page: null,
      boards: null,
      totalPages: null,
      getBoardsUri: null,
      emptyMsg: null
    }
  },
  components: {
    Board
  },
  created () {
    this.boardsType = this.$route.meta.boardsType
    if (this.boardsType === 'all') {
      this.getBoardsUri = '/api/boards'
      this.emptyMsg = '등록된 게시물이 없습니다.'
    } else if (this.boardsType === 'like') {
      this.getBoardsUri = '/api/my/like/boards'
      this.emptyMsg = '아직 좋아요한 게시물이 없습니다.'
    } else if (this.boardsType === 'follow') {
      this.getBoardsUri = '/api/my/follow/user/boards'
      this.emptyMsg = '아직 팔로우한 회원이 없습니다.'
    }

    this.page = 1
    this.getPage(this.page)
    window.addEventListener('scroll', this.handleScroll)
  },
  destroyed () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    changeLikeStatus ({boardSeq, data: { meLikedBoard, boardLikeCount }}) {
      for (let board of this.boards) {
        if (board.seq === boardSeq) {
          if (this.boardsType === 'like') {
            this.$reload.reload()
          } else {
            board.isMeLikedBoard = meLikedBoard
            board.boardLikeCount = boardLikeCount
          }
          break
        }
      }
    },
    handleScroll () {
      let nowScrollHeight = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      if (nowScrollHeight + window.innerHeight === document.documentElement.offsetHeight) {
        if (this.page < this.totalPages) {
          this.getPage(++this.page)
        }
      }
    },
    getPage (page) {
      this.$http.get(`${this.getBoardsUri}?page=${page}`)
        .then(({data: { content, totalPages }}) => {
          this.boards = this.boards === null || page === 1 ? content : this.boards.concat(content)
          this.totalPages = totalPages
        }, err => {
          console.error(err)
        })
    }
  }
}
</script>
