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

  return cache.get().map(e => ({ data: e.data }))
}

export default loadEntries

export const byEntriesList = async list => {
  const entries = cache.get()

  if (!list) return entries

  const req = list.map(p => p.data._entry)

  return entries.filter(e => req.includes(e.data._entry))
}

export const byFileName = async (path) => {
  return cache.get().find(post => post.data._entry === path)
}

export const invalidateCache = () => cache.invalidate()
