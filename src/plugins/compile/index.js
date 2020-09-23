
import { plugins } from '../config'

export function compile () {
  const configs = []
  const sources = []
  const builders = []
  const transformers = []
  const cleaners = []
  const filters = []
  const sorters = []
  const renders = []

  for (const plugin of plugins()) {
    const { resolved, options = {}, renderer } = plugin
    const { config, source, build, transform, cleanup, filter, sort } = require(resolved)

    if (config) {
      configs.push((...args) => config(options, ...args))
    }
    if (source) {
      sources.push((...args) => source(options, ...args))
    }
    if (build) {
      builders.push((...args) => build(options, ...args))
    }
    if (transform) {
      transformers.push((...args) => transform(options, ...args))
    }
    if (cleanup) {
      cleaners.push((...args) => cleanup(options, ...args))
    }
    if (filter) {
      filters.push((...args) => filter(options, ...args))
    }
    if (sort) {
      sorters.push((...args) => sort(options, ...args))
    }
    if (renderer) {
      const { render } = require(`${resolved}/render`)
      if (render) {
        renders.push((...args) => render(options, ...args))
      }
    }
  }

  return {
    configs,
    sources,
    builders,
    transformers,
    cleaners,
    filters,
    sorters,
    renders
  }
}
