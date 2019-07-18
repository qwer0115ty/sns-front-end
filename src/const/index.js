export const BACK_END_HOST = location.origin === 'http://localhost:8080' ? 'http://localhost:8081' : location.origin
export const TOKEN_ITEM_NAME = 'sns_ac'
export const REFRESH_TOKEN_ITEM_NAME = 'sns_rf'
export const USER_ITEM_NAME = 'sns_us'
export const USER_STORAGE_ITEMS = {
  'access_token': TOKEN_ITEM_NAME,
  'refresh_token': REFRESH_TOKEN_ITEM_NAME,
  'user': USER_ITEM_NAME
}
