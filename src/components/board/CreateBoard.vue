<template>
  <v-content>
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm6 offset-sm3 ma-2>
        <form enctype="multipart/form-data" @submit.prevent="writeBoard(board)">
          <v-card>
            <v-card-title primary-title>
              <h1 class="ml-3 w300">공유하기</h1>
              <v-btn absolute right flat id="photo-btn" @click="select()">사진 선택</v-btn>
            </v-card-title>
            <v-divider/>
            <v-layout ma-3 wrap>
              <v-flex xs12 pa-1 sm3>
                <img-with-loader
                  id="previewImg"
                  v-show="dataURI"
                  :src="dataURI"
                  @click="select()"
                />
                <div id="imgPreviewDiv" v-show="! dataURI" ma-3 :class="dataURI ? 'has-img-preview' : 'none-img-preview'" @click="select()">
                  <v-icon id="innerIcon" dark x-large>insert_photo</v-icon>
                </div>
                <input id="fileInput" type="file" @change="processFile($event)" accept="image/*">
                <label id="imgPreviewLabel" for="fileInput"/>
              </v-flex>
              <v-flex xs12 pt-1 pl-3 pr-3 sm9>
                <v-textarea name="content"
                  v-model="board.content"
                  v-validate="'required|max:300'"
                  clearable
                  counter
                  :error="contentFlags.touched && contentFlags.valid == false"
                  :success="contentFlags.valid == true"
                  placeholder="내용을 입력하세요."
                  auto-grow
                ></v-textarea>
              </v-flex>
            </v-layout>
            <v-card-actions>
              <v-btn :loading="isInsertProgress" :disabled="isInsertProgress"
                type="submit" flat color="cyan">등록하기</v-btn>
            </v-card-actions>
            <alert-bar ref="alertBar"/>
          </v-card>
        </form>
      </v-flex>
    </v-layout>
    <confirm ref="confirm"/>
  </v-content>
</template>

<script>
import AlertBar from '@/components/common/AlertBar'
import ImgWithLoader from '@/components/common/ImgWithLoader'
import GooleAuthService from '@/service/auth/GooleAuthService'
import Util from '@/util/CustomUtil'
import flags from '@/util/VeeFlags'
import SnackBarBus from '@/service/HeaderSnackBarBus'
import Confirm from '@/components/common/Dialog'

export default {
  components: {
    AlertBar,
    ImgWithLoader,
    Confirm
  },
  data () {
    return {
      board: {
        content: null,
        file: null
      },
      dataURI: null,
      isInsertProgress: false
    }
  },
  methods: {
    select () {
      document.getElementById('imgPreviewLabel').click()
    },
    failToSelectImg () {
      document.getElementById('fileInput').value = ''
      this.board.file = null
      this.dataURI = null
    },
    processFile ({target: { files }}) {
      if (files.length > 0) {
        let evtFile = files[0]
        if (!evtFile.type.match('image.*')) {
          this.error('이미지 형식의 파일만 업로드 가능합니다.')
          this.failToSelectImg()
        } else if (Util.bytesToMb(evtFile.size) > 20) {
          this.error('20MB 이하의 파일만 업로드 가능합니다.')
          this.failToSelectImg()
        } else {
          Util.setImgPreview(evtFile).then(data => {
            this.dataURI = data
          })
          this.board.file = evtFile
        }
      }
    },
    error (msg) {
      this.$refs.alertBar.error(msg)
    },
    writeBoard (board) {
      if (this.contentFlags.valid === false) {
        this.error(this.errors.first('content'))
      } else if (board.file == null) {
        this.error('사진을 선택하세요.')
      } else if (this.$store.getters.getUser == null) {
        GooleAuthService.gooleAuthPop(_ => {
          this.postApi(board)
        }, _ => {
          this.$router.push({ name: 'signup' })
        })
      } else {
        this.$refs.confirm.confirm({
          title: '게시글 등록',
          body: '작성한 게시글을 등록하시겠습니까?'
        }).then(_ => {
          this.postApi(board)
        }, _ => {
        })
      }
    },
    postApi (board) {
      this.isInsertProgress = true
      let formData = new FormData()
      formData.append('file', board.file)
      formData.append('data', board.content)
      this.$http.post('/api/board', formData).then(result => {
        this.$router.push({ name: 'main' })
        SnackBarBus.snackBar('게시글 등록이 완료되었습니다.')
      }, err => {
        console.error(err)
      }).then(_ => {
        this.isInsertProgress = false
      })
    }
  },
  computed: flags('content')
}
</script>

<style scoped>
  .has-img-preview {
    display: block;
  }

  .none-img-preview {
    display: table;
  }

  #imgPreviewDiv {
    width: 150px;
    height: 150px;
    background-color: lightgray;
    margin: 0 auto;
    color: white;
  }

  #inner {
    display: table;
    width: 100%;
    height: 100%;
  }

  #innerIcon {
    display: table-cell;
    vertical-align: middle;
    opacity: 0.5;
    text-align: center;
  }

  #imgPreviewDiv:hover {
    cursor: pointer;
  }

  #imgPreviewDiv:hover > #innerIcon {
    opacity: 1;
  }

  #photo-btn {
    margin-top: -0.25rem;
  }

  #previewImg {
    width: 150px;
    resize: both;
    cursor: pointer;
    display: block;
    margin: 0 auto;
  }
  @media all and (max-width: 1200px){
    #previewImg {
      width: 100%;
    }

    #imgPreviewDiv {
      display: none;
    }

    #imgPreviewDiv #innerIcon {
      display: none;
    }
  }

  #fileInput {
    position: absolute;
    opacity: 0;
    overflow: hidden;
    width: 1px;
    height: 1px;
  }
</style>
