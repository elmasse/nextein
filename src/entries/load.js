import plugins from '../plugins'
import createCache from './cache'

const cache = createCache()

const loadEntries = async () => {
  if (cache.isValid()) {
    return cache.get()
  }

  const { sources, transforms = [] } = plugins()
  let posts = []

  for (const source of sources) {
    posts.push(...await source())
  }

  for (const transform of transforms) {
    posts = await transform(posts)
  }

  cache.set(posts)

  return cache.get()
}

export default loadEntries

export const byFileName = async (path) => {
  return cache.get().find(post => post.data._entry === path)
}

export const invalidateCache = () => cache.invalidate()
