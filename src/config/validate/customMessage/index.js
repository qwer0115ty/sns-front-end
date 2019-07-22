import { Validator } from 'vee-validate'
import ko from 'vee-validate/dist/locale/ko'

Validator.localize('ko', Object.assign(ko, {
  custom: {
    name: {
      required: _ => '이름을 입력하세요.',
      min: (name, minValue) => `${minValue}글자 이상으로 입력하세요.`,
      max: (name, maxValue) => `${maxValue}글자 이하로 입력하세요.`
    },
    content: {
      required: _ => '내용을 입력하세요.',
      max: (name, maxValue) => `내용은 ${maxValue}글자 이하로 입력해야 합니다.`
    }
  }
}))
