
import { resolve } from 'path'

const INTERNALS = {
  'nextein-plugin-source-fs': resolve(__dirname, 'source-filesystem'),
  'nextein-plugin-build-remark': resolve(__dirname, 'build-remark')
}

const isLocal = (name) => name.startsWith('.')

export const resolvePlugin = (name) => {
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

export const getPluginsConfig = () => {
  return JSON.parse(process.env.__NEXTEIN_PLUGIN_CFG, '{}')
}

export const setPlugins = (nexteinPlugins = [], distDir) => {
  const config = nexteinPlugins
    .map(normalizeString)
    .map(normalizeArray)
    // TODO flat duplicated entries
  process.env.__NEXTEIN_PLUGIN_CFG = JSON.stringify(config)
}

// TODO
export const getDefaultPlugins = () => [
  ['nextein-plugin-source-fs', { path: 'posts' }],
  ['nextein-plugin-build-remark', {}]
]
