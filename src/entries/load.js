
import createCache from './cache'

const cache = createCache()

/**
 * Return all entries. If ids is provided return all entries matching __id.
 * @param {String | Array<String>} ids Optional.
 */
export async function load (ids) {
  if (!cache.isValid()) {
    await cache.load()
  }

  const entries = cache.get()
  const entriesIds = [].concat(ids).filter(Boolean)

  if (entriesIds.length) {
    return entries.filter(({ data: { __id } }) => entriesIds.includes(__id))
  }

  return entries
}
