import { mapFields } from 'vee-validate'

export default (...names) => {
  let obj = {}
  names.forEach(name => {
    obj[name + 'Flags'] = name
  })
  return mapFields(obj)
}
