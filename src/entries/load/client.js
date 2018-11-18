/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load/index.js in dev client
 */

import { sep } from 'path'
import fetch from 'unfetch'
import createCache from '../cache'

const cache = createCache()

const loadEntries = async () => {
  const resp = await fetch('/_load_entries')
  const entries = await resp.json()
  cache.set(entries)

  return cache.get().map(e => ({ data: e.data }))
}

export default loadEntries

export const byEntriesList = async list => {
  const entries = cache.get()
  const req = list.map(p => p.data._entry)

  return entries.filter(e => req.includes(e.data._entry))
}

export const byFileName = async path => {
  const resp = await fetch(`/_load_entry/${path.replace(sep, '/')}`)
  return resp.json()
}
