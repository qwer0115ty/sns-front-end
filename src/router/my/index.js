import PreAuth from '@/service/auth/PreAuthorizeService'
import Boards from '@/components/board/Boards'

export default [{
  name: 'my/board/like',
  path: '/my/board/like',
  component: Boards,
  meta: {
    boardsType: 'like'
  },
  beforeEnter: PreAuth.User
},
{
  name: 'my/board/follow',
  path: '/my/board/follow',
  component: Boards,
  meta: {
    boardsType: 'follow'
  },
  beforeEnter: PreAuth.User
}]
