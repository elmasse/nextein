/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE map/index.js in dev client and exported client
 */

import { jsonFileEntriesMap } from '../json-entry'
import { fetchOnce } from '../cache'
import { prefixed } from '../prefixed'

// entriesMap = entries => object
export default async (/* entries = [] */) => {
  const file = prefixed(`/${jsonFileEntriesMap()}`)
  const _entriesMap = await (await fetchOnce(file)).json()
  return _entriesMap
}
