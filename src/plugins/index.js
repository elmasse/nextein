import { resolve } from 'path'

const INTERNALS = {
  'nextein-plugin-markdown': resolve(__dirname, 'markdown')
}

const isLocal = (name) => name.startsWith('./')

const resolvePlugin = (name) => {
  return INTERNALS[name] || (isLocal(name) ? resolve(process.cwd(), name) : name)
}

let _config

export const setPlugins = (nexteinPlugins) => {
  _config = nexteinPlugins
}

let _plugins

export const plugins = () => {
  const nexteinPlugins = _config
  const sources = []
  const transforms = []
  const watchers = []

  if (!_plugins) {
    for (const plugin of nexteinPlugins) {
      const [name, options] = plugin
      const { source, transform, watcher } = require(resolvePlugin(name))
      if (source) {
        const fn = (...args) => source(options, ...args)
        fn.__name = name
        sources.push(fn)
      }
      if (transform) {
        transforms.push((...args) => transform(options, ...args))
      }
      if (watcher) {
        watchers.push(...([].concat(watcher(options))))
      }
    }

    _plugins = {
      sources,
      transforms,
      watchers
    }
  }

  return _plugins
}

export default plugins
