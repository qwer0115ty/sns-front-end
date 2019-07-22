<template>
    <v-card class="mb40 ml-2 mr-2">
        <v-card-title primary-title>
            <v-avatar size="30" class="pb-2 mr-2 pointer" style="position:absolute;"
              @click="$router.push({ name:'user/main', params: { seq: board.user.seq }})">
              <img class="profile-background"
                :src="profileImg != null ? profileImg : $resPath + 'baseline_account_circle_white_48dp.png'">
              </v-avatar>
            <router-link class="pb-1 subheading none-text-deco font-weight-bold" style="margin-left: 3rem;"
              :to="{ name:'user/main', params: { seq: board.user.seq }}">
              {{board.user.name}}
            </router-link>
            <v-btn icon right class="pb-1 more-btn p-absolute" @click="popupMenu(true)" v-if="isPopMenuAccessable">
                <v-icon>more_vert</v-icon>
                <pop-menu v-on:close="popupMenu(false)" @deleteBoard="$emit('deleteBoard', $event)" :isShow="isPopMenu" :board="board" :isAdmin="isAdmin"/>
            </v-btn>
        </v-card-title>
        <v-layout>
            <img-with-loader id="boardImg" :src="board.boardFile.awsS3File.fullPath"/>
        </v-layout>
        <v-flex pa-3>
            <icon-btn class="like-btn" :icon-name="likeStatus" @click="setLike()"/>
            <p class="font-weight-black text-xs-left mb-1 noto-sans">좋아요 {{board.boardLikeCount}}개</p>
            <div class="text-xs-left">
                <router-link class="font-weight-black noto-sans none-text-deco" :to="{ name:'user/main', params: { seq: board.user.seq }}">{{board.user.name}}</router-link>
                <p class="pr-1 text-xs-left caption content">
                    {{board.content}}
                </p>
            </div>
        </v-flex>
    </v-card>
</template>

<script>
import PopMenu from '@/components/common/board/PopMenu'
import IconBtn from '@/components/common/IconBtn'
import ImgWithLoader from '@/components/common/ImgWithLoader'
import GooleAuthService from '@/service/auth/GooleAuthService'
import PreAuth from '@/service/auth/PreAuthorizeService'

export default {
  props: ['board'],
  components: {
    PopMenu,
    IconBtn,
    ImgWithLoader
  },
  data () {
    return {
      isPopMenu: false
    }
  },
  methods: {
    popupMenu (flag) {
      this.isPopMenu = flag
    },
    setLike () {
      if (this.me != null) {
        this.setLikeApi()
      } else {
        GooleAuthService.gooleAuthPop(_ => {
          this.setLikeApi()
        }, _ => {
          this.$router.push({ name: 'signup' })
        })
      }
    },
    setLikeApi () {
      this.$http.post('/api/board/' + this.board.seq + '/like').then(result => {
        this.$emit('likeChanged', {
          boardSeq: this.board.seq,
          data: result.data
        })
      }, err => {
        console.error(err)
      })
    }
  },
  computed: {
    me () {
      return this.$store.getters.getUser
    },
    likeStatus () {
      return this.board.isMeLikedBoard ? 'favorite' : 'favorite_border'
    },
    isPopMenuAccessable () {
      if (this.$route.name === 'board/detail') {
        return this.me != null && (this.me.seq === this.board.user.seq || this.board.user.isMeFollowing || this.isAdmin)
      } else {
        return true
      }
    },
    isAdmin () {
      return PreAuth.hasAnyRole('ROLE_ADMIN')
    },
    profileImg () {
      let img = null
      if (this.board.user.userProfile != null && this.board.user.userProfile.awsS3File != null) {
        img = this.board.user.userProfile.awsS3File.fullPath
      }
      return img
    }
  }
}
</script>

<style scoped>
#boardImg {
    width: 100%;
    resize: both;
    display: block;
}

.like-btn {
  margin: 0 0 5px 0;
}

.more-btn {
    position: absolute;
    top: 0.8rem;
}

.none-text-deco {
  text-decoration: none;
}

.content {
  display: contents;
  word-break: break-all;
}
</style>
