/* global __NEXT_DATA__ */
import { sep } from 'path'
import fetch from 'unfetch'

export default async (path = 'posts') => {
  return fromClient(path)
}

const fromClient = async (path) => {
  // in safari the popstate event is fired when user press back and
  // causes the getInitialProps to be called in the SSR version
  // This will pickup the current props and return it as a workaround
  // https://github.com/zeit/next.js/issues/2360
  if (__NEXT_DATA__.nextExport) {
    const { props } = __NEXT_DATA__
    const { posts } = (props.pageProps || props)
    return posts
  }
  const resp = await fetch('/_load_entries')
  return resp.json()
}

export const byFileName = async (path, root = 'posts') => {
  return byFileNameFromClient(path)
}

const byFileNameFromClient = async (path) => {
  // this is used to make next.js Link to work on exported sites.
  if (__NEXT_DATA__.nextExport) {
    return findPostFromNextCache(path)
  }
  const resp = await fetch(`/_load_entry/${path.replace(sep, '/')}`)
  return resp.json()
}

const findPostFromNextCache = (path) => {
  const { props } = __NEXT_DATA__
  const { post, posts } = (props.pageProps || props)

  return (post && post.data._entry === path) ? post : posts.filter((p) => p.data._entry === path).reduce(v => v)
}
