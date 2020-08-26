import { run } from '../../plugins'
import createCache from '../cache'

const cache = createCache()

const loadCache = async () => {
  cache.set(await run())
}

/**
 * Return all entries. If ids is provided return all entries matching __id.
 * @param {String | Array<String>} ids Optional.
 */
export async function load (ids) {
  if (!cache.isValid()) {
    await loadCache()
  }

  const entries = cache.get()
  const entriesIds = [].concat(ids).filter(Boolean)

  if (entriesIds.length) {
    return entries.filter(({ data: { __id } }) => entriesIds.includes(__id))
  }

  return entries
}
