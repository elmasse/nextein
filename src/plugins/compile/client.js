/**
 * THIS FILE IS LOADED BY WEBPACK TO REPLACE compile/index.js in client
 */

export function compile () {
  const renderPluginModule = require('nextein/dist/plugins/render')
  const renderPlugins = renderPluginModule.__PLUGINS__
  const renders = []

  for (const plugin of renderPlugins) {
    const { name, options } = plugin

    const render = renderPluginModule[name]

    if (render) {
      renders.push((...args) => render(options, ...args))
    }
  }

  return {
    renders
  }
}
