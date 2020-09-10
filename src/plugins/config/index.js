
import { resolvePlugin, hasRenderer } from '../resolver'

function normalizeString (config) {
  return typeof config === 'string' ? { name: config } : config
}

function normalizeArray (config) {
  if (Array.isArray(config)) {
    const [name, options] = config
    return { name, options }
  }
  return config
}

function checkForOldMarkdownPlugin (config) {
  if (config.name === 'nextein-plugin-markdown') {
    const { remark, rehype, position, raw, ...deprecated } = config.options

    console.log('Configuration options for nextein-plugin-markdown has been moved to "nextein-plugin-build-remark".')

    if (Object.keys(deprecated).length) {
      console.warn(`Check if ${JSON.stringify(deprecated)} from config fits into "nextein-plugin-source-fs"`)
    }

    return {
      name: 'nextein-plugin-build-remark',
      options: {
        remark,
        rehype,
        position,
        raw
      }
    }
  }
  return config
}

function createPlugin (options) {
  const resolved = resolvePlugin(options.name)
  const renderer = hasRenderer(resolved)
  return {
    id: options.name,
    ...options,
    resolved,
    renderer
  }
}

function processDuplicates (prev, curr) {
  return prev.filter(({ id }) => id !== curr.id).concat(curr)
}

export function processPlugins (nexteinPlugins = []) {
  const config = nexteinPlugins
    .map(normalizeString)
    .map(normalizeArray)
    .map(checkForOldMarkdownPlugin)
    .map(createPlugin)
    .reduce(processDuplicates, [])

  process.env.__NEXTEIN_PLUGIN_CFG = JSON.stringify(config)

  return config
}

export function plugins () {
  return JSON.parse(process.env.__NEXTEIN_PLUGIN_CFG || '{}')
}

// TODO
export const getDefaultPlugins = () => [
  ['nextein-plugin-source-fs', { path: 'posts' }],
  'nextein-plugin-build-remark',
  'nextein-plugin-filter-unpublished'
]
