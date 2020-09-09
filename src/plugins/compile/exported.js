/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE config/index.js in dev and exported client
 */

import { plugins } from '../config'

export async function compile () {
  const renderPlugins = (await plugins()).filter(p => p.renderer)
  const renders = []

  for (const plugin of renderPlugins) {
    const { name, options } = plugin

    const render = require('nextein-cache/plugins-cache')[name]

    if (render) {
      renders.push((...args) => render(options, ...args))
    }
  }

  return renders
}
