import plugins from '../plugins'

const createCache = (timeWindow) => {
  let cache, timestamp

  return {
    set: (entries) => {
      cache = entries
      timestamp = new Date().getTime()
    },
    get: () => cache,
    timestamp: () => timestamp,
    isValid: () => cache && (timestamp + timeWindow > new Date().getTime())
  }
}

const cache = createCache(1000)

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
  return cache.get().filter(post => post.data._entry === path).pop()
}
