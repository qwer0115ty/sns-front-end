import store from '@/store'
import { BACK_END_HOST } from '@/const'
import AuthService from '@/service/auth/AuthService'

export default {
  gooleAuthPop (success, fail) {
    let url = `${BACK_END_HOST}/api/login/google`
    window.open(url, 'popGoogleAuth', 'width=500, height=650, top=100, left=100, fullscreen=no, menubar=no, status=no, toolbar=no, titlebar=yes, location=no, scrollbar=no')

    let evtFunc = e => {
      if (e.origin === BACK_END_HOST && (e.data.login_failure != null || e.data.login_success != null)) {
        let result = Object.getOwnPropertyNames(e.data)[0]
        let data = e.data[result]

        if (result === 'login_success') {
          AuthService.signinSetData(data)
          AuthService.signin()
          success()
        } else {
          localStorage.setItem('gu', data.gu)
          store.commit('setGoogleUser', JSON.parse(data.gu))
          fail()
        }
        removeEventListener('message', evtFunc)
      }
    }

    addEventListener('message', evtFunc)
  }
}
