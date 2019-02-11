import plugins from '../../plugins'
import createCache from '../cache'

const cache = createCache()

const loadCache = async () => {
  const { sources, transforms = [] } = plugins()
  let posts = []

  for (const source of sources) {
    posts.push(...await source())
  }

  for (const transform of transforms) {
    posts = await transform(posts)
  }

  cache.set(posts)
}

const loadEntries = async () => {
  if (cache.isValid()) {
    return cache.get()
  }

  await loadCache()

  return cache.get().map(e => ({ data: e.data }))
}

export default loadEntries

export const byEntriesList = async list => {
  if (!cache.isValid()) await loadCache()

  const entries = cache.get()

  if (!list) return entries

  const req = list.map(p => p.data._entry)

  return entries.filter(e => req.includes(e.data._entry))
}

export const byFileName = async (path) => {
  if (!cache.isValid()) await loadCache()

  return cache.get().find(post => post.data._entry === path)
}

export const invalidateCache = () => cache.invalidate()
