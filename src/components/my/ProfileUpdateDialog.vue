<template>
  <div class="text-xs-center">
      <v-dialog
      class="radius"
      v-model="isOpen"
      width="330"
      persistent
      >
      <v-card>
          <v-card-title
          class="title"
          primary-title
          >
          프로필 사진 변경
          </v-card-title>
          <v-divider/>
          <v-card-text>
            <v-list>
              <v-list-tile avatar>
                  <v-list-tile-avatar class="mr-2">
                    <v-avatar v-if="! dataURI">
                      <img
                        class="profile-background preview pointer"
                        id="orgImg"
                        :src="profileImg != null && !isBackToDefault ? profileImg : `${$resPath}baseline_account_circle_white_48dp.png`"
                        @click="select()"
                      >
                    </v-avatar>
                    <v-avatar v-else>
                      <img-with-loader
                        class="pointer"
                        id="previewImg"
                        v-show="dataURI"
                        :src="dataURI"
                        @click="select()"
                      />
                    </v-avatar>
                    <input id="fileInput" type="file" @change="processFile($event)" accept="image/*">
                    <label id="imgPreviewLabel" for="fileInput"/>
                  </v-list-tile-avatar>
                  <v-list-tile-content>
                    <v-btn block flat class="mt-0 mb-0" @click="select()">
                      파일 선택하기
                    </v-btn>
                    <v-btn block flat class="mt-0 mb-0" v-if="(profileImg != null || dataURI != null) && ! isBackToDefault"
                      @click="backToDefault()">
                      기본 이미지로 변경
                    </v-btn>
                  </v-list-tile-content>
              </v-list-tile>
            </v-list>
          </v-card-text>
          <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn
              color="primary"
              flat
              :loading="isSaveProgress"
              :disabled="isSaveDiabled || isSaveProgress"
              @click="save()"
          >
              저장
          </v-btn>
          <v-btn
              color="primary"
              flat
              :disabled="isSaveProgress"
              @click="close()"
          >
              취소
          </v-btn>
          </v-card-actions>
          <alert-bar ref="alertBar"/>
      </v-card>
      </v-dialog>
      <confirm ref="confirm"/>
  </div>
</template>

<script>
import AlertBar from '@/components/common/AlertBar'
import ImgWithLoader from '@/components/common/ImgWithLoader'
import Confirm from '@/components/common/Dialog'
import Util from '@/util/CustomUtil'
import SnackBarBus from '@/service/HeaderSnackBarBus'

export default {
  props: ['isOpen', 'profileImg'],
  data () {
    return {
      dataURI: null,
      file: null,
      isBackToDefault: false,
      isSaveProgress: false,
      snackbarMsg: '프로필 변경이 완료되었습니다.'
    }
  },
  components: {
    AlertBar,
    ImgWithLoader,
    Confirm
  },
  computed: {
    isSaveDiabled () {
      return (this.profileImg != null && !this.isBackToDefault && this.file == null) ||
        (this.profileImg == null && this.file == null)
    }
  },
  methods: {
    close () {
      this.$emit('close')
    },
    select () {
      document.getElementById('imgPreviewLabel').click()
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
          this.file = evtFile
          this.isBackToDefault = false
        }
      }
    },
    error (msg) {
      this.$refs.alertBar.error(msg)
    },
    failToSelectImg () {
      document.getElementById('fileInput').value = ''
      this.file = null
      this.dataURI = null
    },
    backToDefault () {
      this.$refs.confirm.confirm({
        title: '기본 이미지로 변경',
        body: '기본 이미지로 변경하시겠습니까?'
      }).then(_ => {
        this.isBackToDefault = true
        this.failToSelectImg()
      }, _ => {
      })
    },
    save () {
      this.$refs.confirm.confirm({
        title: '프로필 사진 저장',
        body: '변경 사항을 저장하시겠습니까?'
      }).then(_ => {
        this.isSaveProgress = true
        if (this.file != null) {
          let formData = new FormData()
          formData.append('file', this.file)
          this.$http.post('/api/my/profile/img', formData).then(result => {
            this.$reload.reload()
            SnackBarBus.snackBar(this.snackbarMsg)
          }, err => {
            console.error(err)
          }).then(_ => {
            this.isSaveProgress = false
          })
        } else if (this.isBackToDefault === true) {
          this.$http.delete('/api/my/profile/img').then(result => {
            this.$reload.reload()
            SnackBarBus.snackBar(this.snackbarMsg)
          }, err => {
            console.error(err)
          }).then(_ => {
            this.isSaveProgress = false
          })
        }
      }, _ => {
      })
    }
  }
}
</script>

<style scoped>
  #fileInput {
    position: absolute;
    opacity: 0;
    overflow: hidden;
    width: 1px;
    height: 1px;
  }
</style>
