import store from '@/store'
import router from '@/router'
import { USER_STORAGE_ITEMS, TOKEN_ITEM_NAME, REFRESH_TOKEN_ITEM_NAME } from '@/const'
import jwtDecode from 'jwt-decode'
import http from 'axios'

let autoSignoutSec = 30 * 60 * 1000
let tokenExpTimeout = null
let autoSignoutTimeout = null
let userActiveEvtFunc = e => {
  if (autoSignoutTimeout != null) {
    clearTimeout(autoSignoutTimeout)
  }
  signoutTimer()
}

if (store.getters.getUser != null) {
  signin()
}

function signoutTimer () {
  autoSignoutTimeout = setTimeout(_ => {
    signout()
  }, autoSignoutSec)
}

function signinSetData (data) {
  for (let key in USER_STORAGE_ITEMS) {
    localStorage.setItem(USER_STORAGE_ITEMS[key], data[key])
    if (USER_STORAGE_ITEMS[key] === TOKEN_ITEM_NAME) {
      store.commit('setUser', jwtDecode(data[key]).user)
    }
  }
}

function signin () {
  signoutTimer()
  refresh()
  addEventListener('mousemove', userActiveEvtFunc)
  addEventListener('keyup', userActiveEvtFunc)
}

function refresh () {
  let exp = jwtDecode(localStorage.getItem(TOKEN_ITEM_NAME)).exp * 1000
  let expTime = new Date(exp).getTime() - new Date().getTime()
  tokenExpTimeout = setTimeout(_ => {
    console.log('refresh')
    http.post(`/api/user/${store.getters.getUser.seq}/token/refresh`,
      localStorage.getItem(REFRESH_TOKEN_ITEM_NAME)).then(({data}) => {
      signinSetData(data)
      userActiveEvtFunc()
      refresh()
    }, err => {
      console.error(err)
    })
  }, expTime)
}

function signout () {
  removeEventListener('mousemove', userActiveEvtFunc)
  removeEventListener('keyup', userActiveEvtFunc)
  console.log('signout')
  for (let key in USER_STORAGE_ITEMS) {
    localStorage.removeItem(USER_STORAGE_ITEMS[key])
  }
  store.commit('signout')
  clearTimeout(tokenExpTimeout)
  clearTimeout(autoSignoutTimeout)
  router.push('/')
}

function isTokenExpired () {
  let exp = jwtDecode(localStorage.getItem(TOKEN_ITEM_NAME)).exp * 1000
  let expTime = new Date(exp).getTime() - new Date().getTime()
  return expTime <= 0
}

export default {
  signout, signin, signinSetData, isTokenExpired
}
