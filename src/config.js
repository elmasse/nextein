
import path from 'path'
import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

import { metadata, setNextExportPathMap } from './entries'
import { generateExportedFiles } from './export'
import { processPlugins, getDefaultPlugins } from './plugins'
import { compile } from './plugins/compile'

const getDefaultConfig = () => ({
  plugins: getDefaultPlugins()
})

const processConfig = ({ nextein = {} }) => {
  const defaultConfig = getDefaultConfig()
  const { plugins } = (typeof nextein === 'function')
    ? nextein(defaultConfig)
    : {
      ...nextein,
      ...defaultConfig,
      plugins: [
        ...defaultConfig.plugins,
        ...(nextein.plugins || [])
      ]
    }

  return {
    plugins: processPlugins(plugins)
  }
}

export const withNextein = (nextConfig = {}) => {
  const { trailingSlash = true, assetPrefix = process.env.PUBLIC_URL || '' } = nextConfig
  const nexteinConfig = processConfig(nextConfig)
  const { configs } = compile()

  let config = {
    ...nextConfig,
    trailingSlash,
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
        new NormalModuleReplacementPlugin(/entries[/\\]pathmap[/\\]index.js/, './exported.js'),
        new NormalModuleReplacementPlugin(/plugins[/\\]compile[/\\]index.js/, './exported.js')
      )

      config.module = {
        ...config.module,
        // Avoid warning from webpack when require has an expression.
        // Which is the case for requiring plugins dynamically.
        exprContextCritical: false
      }

      config.module.rules = [
        {
          test: /\.js$/,
          include: path.dirname(require.resolve('nextein/dist/plugins/render')),
          use: [
            options.defaultLoaders.babel,
            {
              loader: 'nextein/dist/plugins/render/loader',
              options: {
                plugins: nexteinConfig.plugins
              }
            }
          ]
        },
        ...config.module.rules
      ]

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },

    async exportPathMap (defaultPathMap, options) {
      const entries = await metadata()
      const map = entries
        .reduce((prev, { url, page, __id }) => {
          return page ? {
            ...prev,
            [url]: { page: `/${page}`, query: __id ? { __id } : undefined }
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
  }

  for (const configPlugin of configs) {
    config = configPlugin(config)
  }

  return config
}

export default withNextein
