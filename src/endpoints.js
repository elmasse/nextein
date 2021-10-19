
function prefixPath (prefix, path) {
  if (!prefix || typeof path !== 'string' || /^https?:\/\//.test(path)) return path
  return `${prefix}${path}`
}

function ensureNoEndSlash (path) {
  if (!path || typeof path !== 'string') return path
  if (path.endsWith('/')) return path.substr(path, path.length - 1)
  return path
}

export function prefixed (path) {
  return prefixPath(ensureNoEndSlash(process.env.PUBLIC_URL), path)
}
