/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE load/index.js in dev client
 */

import fetch from 'unfetch'

import { prefixed } from '../prefixed'
import endpoints from '../../endpoints'

/**
 * Return all entries. If ids is provided return all entries matching __id.
 * @param {String | Array<String>} ids Optional.
 */
export async function load (ids) {
  const file = prefixed(`/${endpoints.posts()}`)
  const entries = await (await fetch(file)).json()
  const entriesIds = [].concat(ids).filter(Boolean)

  if (entriesIds.length) {
    return entries.filter(({ data: { __id } }) => entriesIds.includes(__id))
  }

  return entries
}
