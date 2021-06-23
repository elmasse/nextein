
import path from 'path'
import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

import { processPathMap } from './entries'
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
      if (!nextConfig.webpack5 && !(nextConfig.future && nextConfig.future.webpack5)) {
        // webpack4 only
        config.node = {
          fs: 'empty'
        }
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
      let nextExportPathMapFn = map => map
      if (typeof nextConfig.exportPathMap === 'function') {
        nextExportPathMapFn = nextConfig.exportPathMap
      }

      const nextExportPathMap = await processPathMap(nextExportPathMapFn, defaultPathMap, options)
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
