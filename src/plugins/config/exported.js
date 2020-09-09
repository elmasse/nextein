/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE config/index.js in dev and exported client
 */

import { fetchOnce } from '../../entries/cache'
import endpoints from '../../endpoints'

export async function plugins () {
  return (await fetchOnce(endpoints.pluginsManifest())).json()
}
