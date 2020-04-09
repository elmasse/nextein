/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load/index.js in exported client
 */

/* global __NEXT_DATA__ */

// TODO read prefix from config

import { jsonFileFromEntry, jsonFileEntries } from '../json-entry'
import createCache, { fetchOnce } from '../cache'
import { prefixed } from '../prefixed'

const cache = createCache()

const shouldFetch = async (_entries) => {
  return Promise.all(
    _entries.map(async ({ data: { _entry } }) => {
      const file = prefixed(`/${jsonFileFromEntry(_entry)}`)
      return (await fetchOnce(file)).json()
    })
  )
}

const loadEntries = async () => {
  // let { _entries } = __NEXT_DATA__.props.pageProps
  // if (!_entries) {
  const file = prefixed(`/${jsonFileEntries()}`)
  const _entries = await (await fetchOnce(file)).json()
  //   __NEXT_DATA__.props.pageProps._entries = _entries
  // }
  return _entries
}

export default loadEntries

export const byEntriesList = async list => {
  let entries = cache.get() || []

  const cacheEntries = entries.map(e => e.data._entry)
  const update = list.filter(post => !cacheEntries.includes(post.data._entry))

  if (update.length) {
    entries = cache.set([...entries, ...(await shouldFetch(update))])
  }

  const _entries = list.map(i => i.data._entry)

  const res = entries.filter(e => _entries.includes(e.data._entry))
  return res
}

export const byFileName = path => {
  const entries = cache.get()
  return (entries && entries.find(post => post.data._entry === path)) || findPostInEntriesCache(path)
}

const findPostInEntriesCache = async path => {
  const { props } = __NEXT_DATA__
  const { post } = (props.pageProps || props)

  let entry = (post && post.data._entry === path) ? post : undefined

  if (!entry) {
    entry = (await fetchOnce(prefixed(`/${jsonFileFromEntry(path)}`))).json()
  }

  return entry
}
