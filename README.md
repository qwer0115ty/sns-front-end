개인 프로젝트 - 사진 공유 sns
=====
# 1. 개요
- ## 개발 기간
  2019년 6월 ~ 2019년 7월 (5주)
- ## 개발 목적
  소셜 계정으로 로그인하여 사용할 수 있고 인스타그램과 비슷한 ui를 가진 sns 개발
- ## 특징
  Google 계정으로 회원가입 및 로그인<br>
  사진 업로드 기능<br>
  게시물 좋아요 기능<br>
  사용자 팔로우 기능<br>
  내가 좋아요한 글 모아보기 기능<br>
  내가 팔로우하는 사용자들의 게시글 모아보기 기능<br>
  프로필 사진 관리 기능<br>
- ## 사용 기술
  Java8, Javascript(ES6), HTML5/CSS3<br>
  SpringBoot, Vue.js, MySQL, JPA(Hibernate), Querydsl<br>
  OAuth2 JWT, google oauth client<br>
  AWS(RDS, S3, Elastic Beanstalk)
- ## 배포 URL
  [배포 URL](http://sns1906.ap-northeast-2.elasticbeanstalk.com)(크롬 브라우저 권장)
- ## 실행 영상
    [유튜브 주소](https://youtu.be/voAc9psuix0)

# 2. 프론트엔드 프로젝트
- ## dependencies
```
    "axios": "^0.19.0",
    "vee-validate": "^2.2.11",
    "vue": "^2.5.2",
    "vue-router": "^3.0.1",
    "vuetify": "^1.5.16",
    "vuex": "^3.1.1"
```
- ## 디렉토리 구조
```
src
│  App.vue
│  main.js
│      
├─components
│  ├─board
│  │      BoardDetail.vue
│  │      Boards.vue
│  │      CreateBoard.vue
│  │      UpdateBoard.vue
│  │      
│  ├─common
│  │  │  AlertBar.vue
│  │  │  Dialog.vue
│  │  │  IconBtn.vue
│  │  │  ImgWithLoader.vue
│  │  │  
│  │  └─board
│  │          Board.vue
│  │          PopMenu.vue
│  │          
│  ├─layout
│  │      Article.vue
│  │      Header.vue
│  │      
│  ├─my
│  │      MyPage.vue
│  │      ProfileUpdateDialog.vue
│  │      
│  └─signup
│          Signup.vue
│          
├─config
│  │  index.js
│  │  
│  ├─axios
│  │      index.js
│  │      
│  ├─validate
│  │  │  index.js
│  │  │  
│  │  ├─customMessage
│  │  │      index.js
│  │  │      
│  │  └─validation
│  │          index.js
│  │          
│  └─vuetify
│          index.js
│          
├─const
│      index.js
│      
├─router
│  │  index.js
│  │  
│  ├─board
│  │      index.js
│  │      
│  ├─config
│  │      index.js
│  │      
│  ├─main
│  │      index.js
│  │      
│  ├─my
│  │      index.js
│  │      
│  ├─signup
│  │      index.js
│  │      
│  └─user
│          index.js
│          
├─service
│  │  HeaderSnackBarBus.js
│  │  
│  └─auth
│          AuthService.js
│          GooleAuthService.js
│          PreAuthorizeService.js
│          
├─store
│      index.js
│      
└─util
        CustomUtil.js
        VeeFlags.js

static
│  
└─css
        font.css
        style.css
```

# 3. [백엔드 프로젝트](https://github.com/qwer0115ty/sns-back-end)