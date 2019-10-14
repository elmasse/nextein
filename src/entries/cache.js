/* global fetch */

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

const _fetchCache = {}

export const fetchOnce = async (path) => {
  if (!_fetchCache[path]) {
    _fetchCache[path] = fetch(path)
  }
  const res = await _fetchCache[path]
  return res.clone()
}
