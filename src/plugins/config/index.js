
import { resolvePlugin, hasRenderer } from '../resolver'

const normalizeArray = config => {
  if (Array.isArray(config)) {
    const [name, options] = config
    return { name, options }
  }
  return config
}

const normalizeString = config => typeof config === 'string' ? { name: config } : config

function createPlugin (options) {
  const resolved = resolvePlugin(options.name)
  const renderer = hasRenderer(resolved)
  return {
    ...options,
    resolved,
    renderer
  }
}

export function processPlugins (nexteinPlugins = []) {
  const config = nexteinPlugins
    .map(normalizeString)
    .map(normalizeArray)
    .map(createPlugin)
    // TODO flat duplicated entries

  process.env.__NEXTEIN_PLUGIN_CFG = JSON.stringify(config)

  return config
}

export function plugins () {
  return JSON.parse(process.env.__NEXTEIN_PLUGIN_CFG || '{}')
}

// TODO
export const getDefaultPlugins = () => [
  ['nextein-plugin-source-fs', { path: 'posts' }],
  ['nextein-plugin-build-remark', {}]
]
