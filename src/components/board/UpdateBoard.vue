<template>
  <v-content>
    <v-layout align-center justify-center row fill-height>
      <v-flex xs12 sm6 offset-sm3 ma-2>
        <form enctype="multipart/form-data" @submit.prevent="updateBoard(board)">
          <v-card v-if="board != null && board.boardFile != null">
            <v-card-title primary-title>
              <h1 class="ml-3 w300">수정하기</h1>
              <v-btn absolute right flat id="photo-btn" @click="select()">사진 변경</v-btn>
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
                <img-with-loader
                  id="orgImg"
                  v-show="! dataURI"
                  :src="board.boardFile.awsS3File.fullPath"
                  @click="select()"
                  class="preview"
                />
                <input id="fileInput" type="file" @change="processFile($event)" accept="image/*">
                <label id="imgPreviewLabel" for="fileInput"/>
              </v-flex>
              <v-flex xs12 pt-1 pl-3 pr-3 sm9>
                <v-textarea name="content"
                  v-model="board.content"
                  v-validate="'required'"
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
              <v-btn type="submit" flat color="cyan">수정완료</v-btn>
            </v-card-actions>
            <alert-bar ref="alertBar"/>
          </v-card>
        </form>
      </v-flex>
    </v-layout>
  </v-content>
</template>

<script>
import AlertBar from '@/components/common/AlertBar'
import ImgWithLoader from '@/components/common/ImgWithLoader'
import PreAuth from '@/service/auth/PreAuthorizeService'
import GooleAuthService from '@/service/auth/GooleAuthService'
import Util from '@/util/CustomUtil'
import flags from '@/util/VeeFlags'

export default {
  components: {
    AlertBar,
    ImgWithLoader
  },
  data () {
    return {
      board: null,
      dataURI: null
    }
  },
  created () {
    this.$http.get('/api/board/' + this.$route.params.seq)
      .then(({ data }) => {
        if (!PreAuth.isMine(data.user.seq)) {
          this.$router.push({ path: '/' })
        } else {
          this.board = data
        }
      }, err => {
        console.error(err)
      })
  },
  methods: {
    select () {
      document.getElementById('imgPreviewLabel').click()
    },
    setImgPreview (file) {
      let reader = new FileReader()
      reader.readAsDataURL(file)
      let tempImage = new Image()
      reader.onload = _ => {
        tempImage.src = reader.result
      }
      let shiftX = 0
      let shiftY = 0
      let orgshort = 0
      let $this = this
      tempImage.onload = function () {
        if (this.width > this.height) {
          orgshort = this.height
          shiftX = (this.width - this.height) / 2
        } else {
          orgshort = this.width
          shiftY = (this.height - this.width) / 2
        }
        let canvas = document.createElement('canvas')
        let canvasContext = canvas.getContext('2d')
        canvas.width = orgshort
        canvas.height = orgshort
        canvasContext.drawImage(this, shiftX, shiftY, orgshort, orgshort, 0, 0, orgshort, orgshort)
        $this.dataURI = canvas.toDataURL('image/png')
      }
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
          this.setImgPreview(evtFile)
          this.board.file = evtFile
        }
      }
    },
    error (msg) {
      this.$refs.alertBar.error(msg)
    },
    updateBoard (board) {
      if (this.contentFlags.valid === false) {
        this.error('내용을 입력하세요.')
      } else if (this.$store.getters.getUser == null) {
        GooleAuthService.gooleAuthPop(_ => {
          this.putApi(board)
        }, _ => {
          this.$router.push({ name: 'signup' })
        })
      } else {
        this.putApi(board)
      }
    },
    putApi (board) {
      let formData = new FormData()
      formData.append('file', board.file)
      formData.append('data', board.content)
      this.$http.post('/api/board/' + this.$route.params.seq + '/form', formData).then(result => {
        this.$router.push({ name: 'board/detail', params: { seq: this.board.seq } })
      }, err => {
        console.error(err)
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

  #previewImg, #orgImg {
    width: 150px;
    resize: both;
    cursor: pointer;
    display: block;
    margin: 0 auto;
  }
  @media all and (max-width: 1200px){
    #previewImg, #orgImg {
      width: 100%;
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
