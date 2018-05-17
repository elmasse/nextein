
import loadEntries from './entries/load'
import Uglify from 'uglifyjs-webpack-plugin'
import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'

export default (nextConfig = {}) => ({
  ...nextConfig,
  assetPrefix: nextConfig.assetPrefix || process.env.PUBLIC_URL,
  webpack (config, options) {
    const { dev } = options
    config.node = {
      fs: 'empty'
    }

    config.plugins = config.plugins.filter(plugin => {
      return plugin.constructor.name !== 'UglifyJsPlugin'
    })

    config.plugins.push(
      new DefinePlugin({
        'process.env.PUBLIC_URL': JSON.stringify(process.env.PUBLIC_URL || '')
      })
    )

    if (dev) {
      config.plugins.push(
        new NormalModuleReplacementPlugin(/\/entries\/load.js/, './load-client.js')
      )
    } else {
      config.plugins.push(
        new NormalModuleReplacementPlugin(/\/entries\/load.js/, './load-exported.js'),
        new Uglify({
          parallel: true,
          sourceMap: true
        })
      )
    }

    if (typeof nextConfig.webpack === 'function') {
      return nextConfig.webpack(config, options)
    }

    return config
  },

  async exportPathMap () {
    const entries = await loadEntries()
    const map = entries
      .concat({ data: { url: '/', page: 'index' } })
      .reduce((prev, { data }) => {
        const { url, page, _entry } = data
        const query = _entry ? { _entry } : undefined
        return page ? {
          ...prev,
          [url]: { page: `/${page}`, query }
        } : prev
      }, {})

    if (typeof nextConfig.exportPathMap === 'function') {
      return {
        ...map,
        ...(await nextConfig.exportPathMap())
      }
    }

    return map
  }
})
