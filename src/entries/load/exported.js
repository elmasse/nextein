/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load/index.js in exported client
 */

/* global __NEXT_DATA__ */

import createCache, { fetchOnce } from '../cache'
import { prefixed } from '../prefixed'
import endpoints from '../../endpoints'

const cache = createCache()

async function findPostInEntriesCache (__id) {
  const { props } = __NEXT_DATA__
  const { post } = (props.pageProps || props)

  let entry = (post && post.data.__id === __id) ? post : undefined

  if (!entry) {
    entry = (await fetchOnce(prefixed(`/${endpoints.post(__id)}`))).json()
  }

  return entry
}

async function shouldFetch (ids) {
  return Promise.all(
    ids.map(async (id) => {
      return findPostInEntriesCache(id)
    })
  )
}

async function loadAll () {
  const file = prefixed(`/${endpoints.posts()}`)
  return (await fetchOnce(file)).json()
}

/**
 *
 * @param {Array<String>} ids
 */
export async function load (ids) {
  const entriesIds = [].concat(ids).filter(Boolean)

  if (!entriesIds.length) {
    await cache.set(await loadAll())
  }

  let entries = cache.get() || []

  const cacheEntries = entries.map(e => e.data.__id)
  const update = entriesIds.filter(__id => !cacheEntries.includes(__id))

  if (update.length) {
    entries = cache.set([...entries, ...(await shouldFetch(update))])
  }

  if (entriesIds.length) {
    return entries.filter(({ data: { __id } }) => entriesIds.includes(__id))
  }

  return entries
}
