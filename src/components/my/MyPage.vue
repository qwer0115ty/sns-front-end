<template>
    <v-content>
        <v-layout align-center justify-center row fill-height>
            <v-flex xs12 sm4 ma-2>
                <v-card class="mb10 ml-2 mr-2">
                    <v-card-text v-if="user != null">
                        <v-list>
                            <v-list-tile avatar>
                                <v-list-tile-avatar class="mr-2">
                                  <v-avatar>
                                    <img class="profile-background"
                                      :src="profileImg != null ? profileImg :
                                      `${$resPath}baseline_account_circle_white_48dp.png`">
                                  </v-avatar>
                                </v-list-tile-avatar>
                                <v-list-tile-content>
                                    <v-list-tile-title v-if="user.name != null">
                                      <span class="title">
                                        {{user.name}}
                                      </span>
                                    </v-list-tile-title>
                                    <v-btn small flat absolute color="blue" class="follow-btn"
                                      v-if="me == null || (me.seq != user.seq && user.isMeFollowing == false)"
                                      @click="setFollow()">
                                        팔로우 하기
                                    </v-btn>
                                    <v-btn small flat absolute color="blue" class="follow-btn"
                                      v-else-if="user.isMeFollowing == true"
                                      @click="setFollow()">
                                        팔로우 취소
                                    </v-btn>
                                    <v-list-tile-title class="pt-1 body-2">
                                      <span>게시물</span>
                                      <span class="pl-1">
                                        {{boardsCount == null ? 0 : boardsCount}}
                                      </span>
                                      <span class="pl-3">팔로잉</span>
                                      <span class="pl-1">
                                        {{user.followingCount}}
                                      </span>
                                      <span class="pl-3">팔로우</span>
                                      <span class="pl-1">
                                        {{user.followerCount}}
                                      </span>
                                    </v-list-tile-title>
                                </v-list-tile-content>
                            </v-list-tile>
                            <v-list-tile style="height: 2rem;" v-if="me != null && me.seq === user.seq">
                              <v-list-tile-content style="padding-left: 4.2rem;">
                                <v-btn small outline absolute color="#b3b3b3" class="pl-4 pr-4"
                                  style="width: 15rem; top: 0.5rem; border-radius: 5px;" @click="isOpenDialog = true">
                                  프로필 사진 변경
                                </v-btn>
                                <profile-update :key="dialogKey" :isOpen="isOpenDialog" @close="isOpenDialog = false" :profileImg="profileImg"/>
                              </v-list-tile-content>
                            </v-list-tile>
                        </v-list>
                    </v-card-text>
                    <v-divider/>
                    <v-card>
                        <v-container grid-list-sm fluid>
                            <v-layout row wrap v-if="boards != null && boards.length > 0">
                                <v-flex v-for="board in boards" :key="board.seq" xs4 d-flex class="pointer"
                                  @click="$router.push({name: 'board/detail', params: {seq: `${board.seq}`}})">
                                    <v-card flat tile class="d-flex">
                                        <thumbnail :src="board.boardFile.awsS3File.fullPath"/>
                                    </v-card>
                                </v-flex>
                            </v-layout>
                            <v-layout row wrap v-else>
                              <span class="empty-box">등록된 게시물이 없습니다.</span>
                            </v-layout>
                        </v-container>
                    </v-card>
                </v-card>
                <v-card class="mb40 ml-2 mr-2" v-if="page < totalPages">
                  <v-btn block color="white" @click="getPage(++page)">
                    더보기
                  </v-btn>
                </v-card>
            </v-flex>
        </v-layout>
    </v-content>
</template>

<script>
import Thumbnail from '@/components/common/ImgWithLoader'
import GooleAuthService from '@/service/auth/GooleAuthService'
import ProfileUpdate from '@/components/my/ProfileUpdateDialog'

export default {
  components: {
    Thumbnail,
    ProfileUpdate
  },
  data () {
    return {
      boards: null,
      user: null,
      boardsCount: null,
      totalPages: null,
      profileImg: null,
      isOpenDialog: false,
      dialogKey: 0
    }
  },
  computed: {
    me () {
      return this.$store.getters.getUser
    }
  },
  watch: {
    isOpenDialog (value) {
      if (value === false) {
        this.dialogKey++
      }
    }
  },
  methods: {
    setFollow () {
      if (this.me != null) {
        this.$http.put(`/api/my/follow/user/${this.$route.params.seq}`)
          .then(result => {
            this.getUser()
          }, err => {
            console.error(err)
          })
      } else {
        GooleAuthService.gooleAuthPop(_ => {
          this.getUser()
        }, _ => {
          this.$router.push({ name: 'signup' })
        })
      }
    },
    getUser () {
      this.$http.get(`/api/user/${this.$route.params.seq}`)
        .then(({ data }) => {
          if (data === '') {
            this.$router.push('/')
          } else {
            if (data.userProfile != null && data.userProfile.awsS3File != null) {
              this.profileImg = data.userProfile.awsS3File.fullPath
            }
            this.user = data
          }
        }, err => {
          console.error(err)
        })
    },
    getPage (page) {
      this.$http.get(`/api/user/${this.$route.params.seq}/boards?page=${page}`)
        .then(({data: { content, totalPages, totalElements }}) => {
          this.boards = this.boards === null || page === 1 ? content : this.boards.concat(content)
          this.totalPages = totalPages
          this.boardsCount = totalElements
        }, err => {
          console.error(err)
        })
    }
  },
  created () {
    this.getUser()
    this.page = 1
    this.getPage(this.page)
  }
}
</script>

<style scoped>
  .follow-btn {
    bottom: 2rem;
    left: 10.5rem;
  }
</style>
