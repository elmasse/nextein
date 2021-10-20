
import path from 'path'
import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

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
      config.plugins.push(
        new DefinePlugin({
          'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
        }),
        new NormalModuleReplacementPlugin(/plugins[/\\]compile[/\\]index.js/, './client.js')
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
    }
  }

  for (const configPlugin of configs) {
    config = configPlugin(config)
  }

  return config
}

export default withNextein
