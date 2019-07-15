import { Validator } from 'vee-validate'
import http from 'axios'

Validator.extend('uniqueName', {
  getMessage: _ => '중복된 이름입니다.',
  validate: value => {
    return new Promise(resolve => {
      http.get(`/api/user/validation/name?name=${value}`)
        .then(({ data: result }) => {
          resolve(result)
        }, err => {
          console.error(err)
        })
    })
  }
})
