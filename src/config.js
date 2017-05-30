
const { resolve } = require('path')
const assign = require('object.assign')

module.exports = (nextConfig) => {
  return {
    webpack: (config, { dev }) => {
      console.log('from nextein config', nextConfig)

      config.node = {
        fs: 'empty'
      }

      config.module.rules.push(
        {
          test: /\.md$/,
          use: [
            {
              loader: 'emit-file-loader',
              options: {
                name: 'dist/[path][name].[ext]'
              }
            },
            {
              loader: resolve(__dirname, 'webpack-markdown_loader')
            }
          ]
        }
      )
      return config
    }
  }
  // return assign(nextConfig, {
    
  //   webpack: (config, { dev }) => {
  //     const { webpack } = nextConfig
  //     console.log(nextConfig, webpack)
  //     const _next = webpack ? webpack(config, { dev }) : {}
  //     const { node, config:_nextConfig }  = _next
  //     config.node = assign(node || {} ,{
  //       fs: 'empty'
  //     })

  //     config.rules.push(
  //       _nextConfig? _nextConfig.webpack.rules || [] : [],
  //       {
  //         test: /\.md$/,
  //         use: [
  //           {
  //             loader: 'emit-file-loader',
  //             options: {
  //               name: 'dist/[path][name].[ext]'
  //             }
  //           },
  //           {
  //             loader: resolve(__dirname, 'webpack-markdown_loader')
  //           }
  //         ]
  //       }
  //     )
  //   }
  // })

}