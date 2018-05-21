/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load.js in exported client
 */

/* global __NEXT_DATA__ */

const loadEntries = () => {
  const { props } = __NEXT_DATA__
  const { _entries } = (props.pageProps || props)
  return _entries
}

export default loadEntries

export const byFileName = (path, root = 'posts') => {
  return findPostInEntriesCache(path)
}

const findPostInEntriesCache = (path) => {
  const { props } = __NEXT_DATA__
  const { post, _entries } = (props.pageProps || props)

  return (post && post.data._entry === path) ? post : _entries.filter((p) => p.data._entry === path).reduce(v => v)
}
