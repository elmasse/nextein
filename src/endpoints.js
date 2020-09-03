/* global __NEXT_DATA__ */

const BUILD_ID = typeof __NEXT_DATA__ !== 'undefined' ? __NEXT_DATA__.buildId : 'development'

function prefixPath (prefix, path) {
  if (!prefix || typeof path !== 'string' || /^https?:\/\//.test(path)) return path
  return `${prefix}${path}`
}

function ensureNoEndSlash (path) {
  if (!path || typeof path !== 'string') return path
  if (path.endsWith('/')) return path.substr(path, path.length - 1)
  return path
}

function posts (buildId = BUILD_ID) {
  return `posts--${buildId}.json`
}

function post (__id, buildId = BUILD_ID) {
  return `post--${__id}--${buildId}.json`
}

function metadata (buildId = BUILD_ID) {
  return `metadata--${buildId}.json`
}

function pathMap (buildId = BUILD_ID) {
  return `pathmap--${buildId}.json`
}

function entriesHMR () {
  return '__nextein-entries-hmr'
}

function prefixedEndpoints (prefix) {
  const withPrefix = (fn) => (...args) => prefixPath(prefix, fn(...args))
  return {
    posts: withPrefix(posts),
    post: withPrefix(post),
    metadata: withPrefix(metadata),
    pathMap: withPrefix(pathMap),
    entriesHMR: withPrefix(entriesHMR)
  }
}

export default {
  ...prefixedEndpoints(ensureNoEndSlash(process.env.PUBLIC_URL))
}

export const serverEndpoints = {
  ...prefixedEndpoints('/')
}

export function prefixed (path) {
  return prefixPath(ensureNoEndSlash(process.env.PUBLIC_URL), path)
}
