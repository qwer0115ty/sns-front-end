<template>
  <v-content>
    <v-progress-circular
    v-if="boards == null && getPageProgress"
    style="display: block; margin: 10px auto 100px;" indeterminate color="grey"/>
    <v-layout v-if="boardsType != null && boards != null">
      <v-flex xs12 sm4 offset-sm4 v-if="boards.length > 0">
        <board v-for="board in boards" :key="board.seq" :board="board" @likeChanged="changeLikeStatus($event)"
          @deleteBoard="$reload.reload()"/>
        <div style="height: 60px;" v-if="! getPageProgress"></div>
        <v-progress-circular
          v-else
          style="display: block; margin: 0 auto 30px;" indeterminate color="grey"/>
      </v-flex>
      <v-flex xs12 sm4 offset-sm4 v-else>
        <v-card class="mb40 ml-2 mr-2">
          <v-layout row wrap>
            <span class="empty-box">{{emptyMsg}}</span>
          </v-layout>
        </v-card>
      </v-flex>
      <v-fade-transition>
        <v-btn
          v-if="nowScrollHeight > 0"
          dark
          fab
          right
          :style="`position: fixed; bottom:${isBottom ? 120 : 200}px; z-index: 1;`"
          color="orange"
          @click="toTop()"
        >
          <v-icon x-large>expand_less</v-icon>
        </v-btn>
      </v-fade-transition>
      <v-fade-transition>
        <v-btn
          v-if="! isBottom"
          dark
          fab
          right
          style="position: fixed; bottom:120px; z-index: 1;"
          color="orange"
          @click="toBottom()"
        >
          <v-icon x-large>expand_more</v-icon>
        </v-btn>
      </v-fade-transition>
    </v-layout>
  </v-content>
</template>

<script>
import Board from '@/components/common/board/Board'
import { setTimeout } from 'timers'

export default {
  data () {
    return {
      page: null,
      boards: null,
      totalPages: null,
      getBoardsUri: null,
      emptyMsg: null,
      getPageProgress: false,
      nowScrollHeight: 0
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
  computed: {
    isBottom () {
      return !this.getPageProgress && this.page === this.totalPages && this.getIsBottom()
    },
    user () {
      let user = this.$store.getters.getUser
      console.log('change')
      if (this.boardsType !== 'all' && user == null) {
        this.goMain()
      }
      return user
    }
  },
  methods: {
    goMain () {
      this.$router.push('/')
    },
    toTop () {
      window.scrollTo(0, 0)
    },
    toBottom () {
      window.scrollTo(0, document.documentElement.offsetHeight)
    },
    getIsBottom () {
      return Math.round(this.nowScrollHeight + window.innerHeight) + (this.page / 3) >= document.documentElement.offsetHeight
    },
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
      this.nowScrollHeight = Math.max(window.pageYOffset, document.documentElement.scrollTop, document.body.scrollTop)
      if (this.getIsBottom()) {
        if (this.page < this.totalPages) {
          this.getPage(++this.page)
        }
      }
    },
    getPage (page) {
      this.getPageProgress = true
      setTimeout(_ => {
        this.$http.get(`${this.getBoardsUri}?page=${page}`)
          .then(({data: { content, totalPages }}) => {
            this.boards = this.boards === null || page === 1 ? content : this.boards.concat(content)
            this.totalPages = totalPages
          }, err => {
            console.error(err)
          }).then(_ => {
            this.getPageProgress = false
          })
      }, 500)
    }
  }
}
</script>
