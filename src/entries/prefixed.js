
export const prefixed = (path) => {
  const prefix = ensureNoEndSlash(process.env.PUBLIC_URL)
  if (!prefix || typeof path !== 'string' || /^https?:\/\//.test(path)) return path
  return `${prefix}${path}`
}

const ensureNoEndSlash = (path) => {
  if (!path || typeof path !== 'string') return path
  if (path.endsWith('/')) return path.substr(path, path.length - 1)
  return path
}
