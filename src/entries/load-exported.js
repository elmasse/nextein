/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load.js in exported client
 */

/* global __NEXT_DATA__, fetch */

// TODO read prefix from config

import { jsonFileFromEntry, jsonFileEntries } from './utils'
import createCache from './cache'
import { prefixed } from '../components/utils'

const cache = createCache()

const shouldFetch = async (_entries) => {
  return Promise.all(_entries.map(async ({ data: { _entry } }) => (await fetch(prefixed(`/${jsonFileFromEntry(_entry)}`))).json()))
}

const loadEntries = async () => {
  let { _entries } = __NEXT_DATA__.props.pageProps
  if (!_entries) {
    _entries = await (await fetch(prefixed(`/${jsonFileEntries()}`))).json()
    __NEXT_DATA__.props.pageProps._entries = _entries
  }
  return _entries
}

export default loadEntries

export const byEntriesList = async list => {
  let entries = cache.get()

  if (!entries) {
    entries = await shouldFetch(list)
    cache.set(entries)
  } else {
    const _entries = entries.map(e => e.data._entry)
    const update = []
    for (const post of list) {
      if (!_entries.includes(post.data._entry)) {
        update.push(post)
      }
    }

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
    entry = (await fetch(prefixed(`/${jsonFileFromEntry(path)}`))).json()
  }

  return entry
}
