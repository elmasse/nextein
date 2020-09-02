import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

import { metadata, setNextExportPathMap } from './entries'
import { generateExportedFiles } from './export'
import { setPlugins, getDefaultPlugins } from './plugins'

const getDefaultConfig = () => ({
  plugins: getDefaultPlugins()
})

const processConfig = ({ nextein = getDefaultConfig() }) => {
  const { plugins } = (typeof nextein === 'function') ? nextein(getDefaultConfig()) : nextein
  setPlugins(plugins)
}

export const withNextein = (nextConfig = {}) => {
  processConfig(nextConfig)
  const { exportTrailingSlash = true, assetPrefix = process.env.PUBLIC_URL || '' } = nextConfig

  return ({
    ...nextConfig,
    exportTrailingSlash,
    assetPrefix,

    webpack (config, options) {
      config.node = {
        fs: 'empty'
      }

      config.plugins.push(
        new DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
        }),
        new NormalModuleReplacementPlugin(/entries[/\\]load[/\\]index.js/, options.dev ? './dev.js' : './exported.js'),
        new NormalModuleReplacementPlugin(/entries[/\\]metadata[/\\]index.js/, './exported.js'),
        new NormalModuleReplacementPlugin(/entries[/\\]pathmap[/\\]index.js/, './exported.js')
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
