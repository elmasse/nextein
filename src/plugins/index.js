import config from 'next/config'

const INTERNALS = {
  'nextein-plugin-markdown': './markdown'
}
export default () => {
  const { serverRuntimeConfig: { nexteinPlugins } } = config()
  const sources = []
  const transforms = []
  for (const plugin of nexteinPlugins) {
    const [name, options] = plugin
    const { source, transform } = require(INTERNALS[name] || name)
    source && sources.push((...args) => source(options, ...args))
    transform && transforms.push((...args) => transform(options, ...args))
  }

  return {
    sources,
    transforms
  }
}
