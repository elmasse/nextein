
export default () => {
  let cache
  let isValid

  return {
    set: (entries) => {
      cache = entries
      isValid = true
      return entries
    },
    get: () => cache,
    isValid: () => isValid,
    invalidate: () => { isValid = false }
  }
}
