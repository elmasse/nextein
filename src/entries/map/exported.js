/* global __NEXT_DATA__, fetch */

import { jsonFileEntriesMap } from '../../utils'

const PREFIX = process.env.PUBLIC_URL

// entriesMap = entries => object
export default async (entries = []) => {
  const { props } = __NEXT_DATA__
  let { _entriesMap } = (props.pageProps || props)

  if (!_entriesMap) {
    _entriesMap = await (await fetch(`${PREFIX}/${jsonFileEntriesMap()}`)).json()
    __NEXT_DATA__.props.pageProps._entriesMap = _entriesMap
  }
  return _entriesMap
}
