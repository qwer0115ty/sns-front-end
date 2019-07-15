import PreAuth from '@/service/auth/PreAuthorizeService'
import GooleAuthService from '@/service/auth/GooleAuthService'

export default [{
  name: 'board/form',
  path: '/board/form',
  component: require('@/components/board/CreateBoard.vue').default,
  beforeEnter: (to, from, next) => {
    if (!PreAuth.hasAnyRole('ROLE_USER')) {
      GooleAuthService.gooleAuthPop(_ => {
        next()
      }, _ => {
        next('/signup')
      })
    } else {
      next()
    }
  }
},
{
  name: 'board/detail',
  path: '/board/:seq',
  component: require('@/components/board/BoardDetail.vue').default
},
{
  name: 'board/detail/form',
  path: '/board/:seq/form',
  component: require('@/components/board/UpdateBoard.vue').default
}]
