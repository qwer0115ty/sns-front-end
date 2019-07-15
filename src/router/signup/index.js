import Signup from '@/components/signup/Signup'
import PreAuth from '@/service/auth/PreAuthorizeService'

export default [{
  path: '/signup',
  name: 'signup',
  component: Signup,
  beforeEnter: PreAuth.OnlyNoneUser
}]
