/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load.js in exported client
 */

/* global __NEXT_DATA__, fetch */

// TODO read prefix from config

import { jsonFileFromEntry } from './utils'
import createCache from './cache'

const cache = createCache()
const fetching = createCache()

const shouldFetch = async (_entries) => {
  return fetching.get() || fetching.set(Promise.all(_entries.map(async (entry) => (await fetch(`/${jsonFileFromEntry(entry)}`)).json())))
}

const loadEntries = async () => {
  const { props } = __NEXT_DATA__
  const { _entries } = (props.pageProps || props)
  let entries = cache.get()

  if (!entries) {
    console.log('cache.miss')
    entries = await shouldFetch(_entries)
    cache.set(entries)
  }
  console.log(cache.get())
  return entries
}

export default loadEntries

export const byFileName = path => {
  const entries = cache.get()
  return (entries && entries.find(post => post.data._entry === path)) || findPostInEntriesCache(path)
}

const findPostInEntriesCache = async path => {
  const { props } = __NEXT_DATA__
  const { post } = (props.pageProps || props)

  let entry = (post && post.data._entry === path) ? post : undefined

  if (!entry) {
    entry = (await fetch(`/${jsonFileFromEntry(path)}`)).json()
  }

  return entry
}
