import store from '@/store'

function hasAnyRole (role) {
  let user = store.getters.getUser
  return user != null && user.userAuthorities.some(authority => authority === role)
}

export default {
  OnlyNoneUser (to, from, next) {
    if (store.getters.getUser != null) {
      next('/')
    } else {
      next()
    }
  },
  User (to, from, next) {
    if (!hasAnyRole('ROLE_USER')) {
      next('/')
    } else {
      next()
    }
  },
  hasAnyRole (role) {
    return hasAnyRole(role)
  },
  isMine (userSeq) {
    let user = store.getters.getUser
    return user != null && user.seq === userSeq
  }
}
