
import { resolvePlugin, hasRenderer } from './resolver'

function normalizeString (config) {
  return typeof config === 'string' ? { name: config, options: {} } : config
}

function normalizeArray (config) {
  if (Array.isArray(config)) {
    const [name, options = {}] = config
    return { name, options }
  }
  return config
}

function normalizeObject (config) {
  // At this point we already processed String and Array config. Assuming object.
  return {
    id: config.id || config.name,
    options: config.options || {},
    ...config
  }
}

function checkForOldMarkdownPlugin (config) {
  const { name, options = {} } = config
  if (name === 'nextein-plugin-markdown') {
    const { entriesDir, extension } = options

    if (entriesDir || extension) {
      console.warn('"entriesDir" and "exentension" configs have been removed from markdown plugin.')
      console.warn('Add a "nextein-plugin-source-fs" configuration instead.')
    }
  }
  return config
}

function resolveSimplifiedNames (config) {
  let { name } = config

  if (!name.startsWith('.') && !name.startsWith('@') && !name.startsWith('nextein-plugin-')) {
    name = `nextein-plugin-${name}`
  }

  return {
    ...config,
    name
  }
}

function createPlugin (options) {
  const resolved = resolvePlugin(options.name)
  const renderer = hasRenderer(resolved)
  return {
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
    .map(normalizeObject)
    .map(checkForOldMarkdownPlugin)
    .map(resolveSimplifiedNames)
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
  'nextein-plugin-markdown',
  'nextein-plugin-filter-unpublished'
]
