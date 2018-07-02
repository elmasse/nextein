import config from 'next/config'
import { resolve } from 'path'

const INTERNALS = {
  'nextein-plugin-markdown': resolve(__dirname, 'markdown')
}

const isLocal = (name) => name.startsWith('./')

const resolvePlugin = (name) => {
  return INTERNALS[name] || (isLocal(name) ? resolve(process.cwd(), name) : name)
}

export default () => {
  const { serverRuntimeConfig: { nexteinPlugins } } = config()
  const sources = []
  const transforms = []
  for (const plugin of nexteinPlugins) {
    const [name, options] = plugin
    const { source, transform } = require(resolvePlugin(name))
    if (source) {
      const fn = (...args) => source(options, ...args)
      fn.__name = name
      sources.push(fn)
    }
    if (transform) {
      transforms.push((...args) => transform(options, ...args))
    }
  }

  return {
    sources,
    transforms
  }
}
