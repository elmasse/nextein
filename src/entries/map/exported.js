/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE map/index.js in dev client and exported client
 */

/* global __NEXT_DATA__ */

import { jsonFileEntriesMap, prefixed, fetchOnce } from '../../utils'

// entriesMap = entries => object
export default async (entries = []) => {
  const { props } = __NEXT_DATA__
  let { _entriesMap } = (props.pageProps || props)

  if (!_entriesMap) {
    const file = prefixed(`/${jsonFileEntriesMap()}`)
    _entriesMap = await (await fetchOnce(file)).json()
    __NEXT_DATA__.props.pageProps._entriesMap = _entriesMap
  }
  return _entriesMap
}
