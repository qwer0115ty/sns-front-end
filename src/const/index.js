import Vue from 'vue'
export const BACK_END_HOST = location.origin === 'http://localhost:8082' ? 'http://localhost:8081' : location.origin
export const TOKEN_ITEM_NAME = 'sns_ac'
export const REFRESH_TOKEN_ITEM_NAME = 'sns_rf'
export const USER_ITEM_NAME = 'sns_us'
export const USER_STORAGE_ITEMS = {
  'access_token': TOKEN_ITEM_NAME,
  'refresh_token': REFRESH_TOKEN_ITEM_NAME,
  'user': USER_ITEM_NAME
}
export const RESOURCE_PATH = 'https://hy-sns1906.s3.ap-northeast-2.amazonaws.com/res/'
Vue.prototype.$resPath = RESOURCE_PATH
