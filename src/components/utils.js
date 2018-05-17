
export const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Unknown'
}

export const entriesMapReducer = (prev, { data }) => {
  const { url, page, _entry } = data
  const query = _entry ? { _entry } : undefined
  return page ? {
    ...prev,
    [url]: { pathname: `/${page}`, query }
  } : prev
}

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
