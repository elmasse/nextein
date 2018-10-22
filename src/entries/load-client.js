/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load.js in dev client
 */

import { sep } from 'path'
import fetch from 'unfetch'

const loadEntries = async () => {
  const resp = await fetch('/_load_entries')
  return resp.json()
}

export default loadEntries

export const byFileName = async path => {
  const resp = await fetch(`/_load_entry/${path.replace(sep, '/')}`)
  return resp.json()
}
