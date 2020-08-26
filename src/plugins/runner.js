
import { getPluginsConfig, resolvePlugin } from './config'
import { createEntry } from '../entries'

let _plugins

const plugins = () => {
  if (!_plugins) {
    const nexteinPlugins = getPluginsConfig()
    const sources = []
    const builders = []
    const transformers = []
    const filters = []

    for (const plugin of nexteinPlugins) {
      const { name, options } = plugin
      const { source, build, transform, filter } = require(resolvePlugin(name))
      if (source) {
        sources.push((...args) => source(options, ...args))
      }
      if (build) {
        builders.push((...args) => build(options, ...args))
      }
      if (transform) {
        transformers.push((...args) => transform(options, ...args))
      }
      if (filter) {
        filters.push((...args) => filter(options, ...args))
      }
    }

    _plugins = {
      sources,
      builders,
      transformers,
      filters
    }
  }

  return _plugins
}

/**
 *
 */
export const run = async () => {
  const { sources = [], builders = [], transformers = [], filters = [] } = plugins()
  let posts = []

  for (const source of sources) {
    await source({
      async build (buildOptions) {
        for (const build of builders) {
          await build(buildOptions, { create: createOptions => posts.push(createEntry(createOptions)) })
        }
      }
    })
  }

  for (const transform of transformers) {
    posts = await transform(posts)
  }

  for (const filter of filters) {
    posts = await filter(posts)
  }

  return posts
}
