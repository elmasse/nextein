import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

import loadEntries from './entries/load'
import { setNextExportPathMap } from './entries/map'
import { createJSONEntries } from './entries/create'
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
      const { dev } = options
      config.node = {
        fs: 'empty'
      }

      config.plugins.push(
        new DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
        })
      )

      if (dev) {
        config.plugins.push(
          new NormalModuleReplacementPlugin(/entries[/\\]load[/\\]index.js/, './client.js'),
          new NormalModuleReplacementPlugin(/entries[/\\]map[/\\]index.js/, './exported.js')
        )
      } else {
        config.plugins.push(
          new NormalModuleReplacementPlugin(/entries[/\\]load[/\\]index.js/, './exported.js'),
          new NormalModuleReplacementPlugin(/entries[/\\]map[/\\]index.js/, './exported.js')
        )
      }

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
      const entries = await loadEntries()
      const map = entries
        // .concat({ data: { url: '/', page: 'index' } })
        .reduce((prev, { data }) => {
          const { url, page, _entry } = data
          const query = _entry ? { _entry } : undefined
          return page ? {
            ...prev,
            [url]: { page: `/${page}`, query }
          } : prev
        }, {})

      // Get all used pages from entries
      const entriesPages = Array.from(new Set(entries.map(({ data: { page } }) => `/${page}`)))

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
      await createJSONEntries(entries, options)

      return {
        ...nextExportPathMap
      }
    }
  })
}

export default withNextein
