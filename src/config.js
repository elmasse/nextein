
import { resolve } from 'path'
import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

import { metadata, setNextExportPathMap } from './entries'
import { generateExportedFiles, generatePluginCache } from './export'
import { processPlugins, getDefaultPlugins } from './plugins'

const getDefaultConfig = () => ({
  plugins: getDefaultPlugins()
})

const processConfig = ({ nextein = getDefaultConfig() }) => {
  const { plugins } = (typeof nextein === 'function') ? nextein(getDefaultConfig()) : nextein

  return {
    plugins: processPlugins(plugins)
  }
}

export const withNextein = (nextConfig = {}) => {
  const { exportTrailingSlash = true, assetPrefix = process.env.PUBLIC_URL || '' } = nextConfig
  const nexteinConfig = processConfig(nextConfig)
  generatePluginCache(nexteinConfig)

  return ({
    ...nextConfig,
    exportTrailingSlash,
    assetPrefix,

    webpack (config, options) {
      config.node = {
        fs: 'empty'
      }
      if (!options.isServer) {
        const _entry = config.entry
        config.entry = async function () {
          const original = await _entry()
          return {
            ...original,
            // 'nextein-plugins': resolve(process.cwd(), '.cache', 'plugins-cache.js'),
            'nextein-plugins': resolve('.nextein', 'cache', 'plugins-cache.js')
          }
        }
      }

      config.plugins.push(
        new DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
        }),
        new NormalModuleReplacementPlugin(/entries[/\\]load[/\\]index.js/, options.dev ? './dev.js' : './exported.js'),
        new NormalModuleReplacementPlugin(/entries[/\\]metadata[/\\]index.js/, './exported.js'),
        new NormalModuleReplacementPlugin(/entries[/\\]pathmap[/\\]index.js/, './exported.js'),
        new NormalModuleReplacementPlugin(/plugins[/\\]config[/\\]index.js/, './exported.js'),
        new NormalModuleReplacementPlugin(/plugins[/\\]compile[/\\]index.js/, './exported.js')
      )

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      config.module = {
        ...config.module,
        // Avoid warning from webpack when require has an expression.
        // Which is the case for requiring plugins dynamically.
        exprContextCritical: false
      }

      config.resolve = {
        ...config.resolve,
        alias: {
          ...config.resolve.alias,
          // 'nextein-cache': resolve(process.cwd(), '.cache')
          'nextein-cache': resolve(process.cwd(), '.nextein', 'cache')
        }
      }

      return config
    },

    async exportPathMap (defaultPathMap, options) {
      const entries = await metadata()
      const map = entries
        .reduce((prev, { url, page, __id }) => {
          const query = __id ? { __id } : undefined
          return page ? {
            ...prev,
            [url]: { page: `/${page}`, query }
          } : prev
        }, {})

      // Get all used pages from entries
      const entriesPages = Array.from(new Set(entries.map(({ page }) => `/${page}`)))

      let nextExportPathMap = {
        ...(
          // Remove from defaultPathMap pages used for entries
          Object.keys(defaultPathMap)
            .filter(k => k !== '/index')
            .filter(k => !entriesPages.includes(defaultPathMap[k].page))
            .reduce((obj, key) => ({ ...obj, [key]: defaultPathMap[key] }), {})
        ),
        ...map
      }

      if (typeof nextConfig.exportPathMap === 'function') {
        nextExportPathMap = await nextConfig.exportPathMap(nextExportPathMap, options)
      }
      await setNextExportPathMap(nextExportPathMap)
      await generateExportedFiles(options)

      return {
        ...nextExportPathMap
      }
    }
  })
}

export default withNextein
