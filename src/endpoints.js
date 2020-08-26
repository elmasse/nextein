/* global __NEXT_DATA__ */

const BUILD_ID = typeof __NEXT_DATA__ !== 'undefined' ? __NEXT_DATA__.buildId : 'development'

export function posts (buildId = BUILD_ID) {
  return `posts--${buildId}.json`
}

export function post (__id, buildId = BUILD_ID) {
  return `post--${__id}--${buildId}.json`
}

export function metadata (buildId = BUILD_ID) {
  return `metadata--${buildId}.json`
}

export function pathMap (buildId = BUILD_ID) {
  return `pathmap--${buildId}.json`
}

export default {
  posts,
  post,
  metadata,
  pathMap
}
