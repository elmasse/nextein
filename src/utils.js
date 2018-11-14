/* global __NEXT_DATA__ */

export const jsonFileFromEntry = (entry, buildId = __NEXT_DATA__.buildId) => {
  return entry.replace(/\//g, '--').replace('.md', `--${buildId}.json`)
}

export const jsonFileEntriesMap = (buildId = __NEXT_DATA__.buildId) => {
  return `entries--map--${buildId}.json`
}

export const jsonFileEntries = (buildId = __NEXT_DATA__.buildId) => {
  return `entries--${buildId}.json`
}

export const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Unknown'
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
