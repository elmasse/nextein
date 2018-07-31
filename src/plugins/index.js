import { resolve } from 'path'

const INTERNALS = {
  'nextein-plugin-markdown': resolve(__dirname, 'markdown')
}

const isLocal = (name) => name.startsWith('.')

const resolvePlugin = (name) => {
  return INTERNALS[name] || (isLocal(name) ? resolve(process.cwd(), name) : name)
}

const normalizeArray = config => {
  if (Array.isArray(config)) {
    const [name, options] = config
    return { name, options }
  }
  return config
}

const normalizeString = config => typeof config === 'string' ? { name: config } : config

let _config

export const setPlugins = (nexteinPlugins = []) => {
  _config = nexteinPlugins
    .map(normalizeString)
    .map(normalizeArray)
}

let _plugins

export const plugins = () => {
  const nexteinPlugins = _config
  const sources = []
  const transforms = []
  const watchers = []

  if (!_plugins) {
    for (const plugin of nexteinPlugins) {
      const { name, options } = plugin
      const { source, transform, watcher } = require(resolvePlugin(name))
      if (source) {
        const fn = (...args) => source(options, ...args)
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

export const getDefaultPlugins = () => ['nextein-plugin-markdown']
