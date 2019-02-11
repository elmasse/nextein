import { NormalModuleReplacementPlugin, DefinePlugin } from 'webpack'
import { promisify } from 'util'
import { writeFile as fsWriteFile } from 'fs'
import { resolve } from 'path'

import loadEntries, { byEntriesList } from './entries/load'
import entriesMap, { setNextExportPathMap } from './entries/map'
import { jsonFileFromEntry, jsonFileEntriesMap, jsonFileEntries } from './utils'
import { setPlugins, getDefaultPlugins } from './plugins'

const writeFile = promisify(fsWriteFile)

const getDefaultConfig = () => ({
  plugins: getDefaultPlugins()
})

const processConfig = ({ nextein = getDefaultConfig() }) => {
  const { plugins } = (typeof nextein === 'function') ? nextein(getDefaultConfig()) : nextein
  setPlugins(plugins)
}

export const withNextein = (nextConfig = {}) => {
  processConfig(nextConfig)

  return ({
    ...nextConfig,

    assetPrefix: nextConfig.assetPrefix || process.env.PUBLIC_URL || '',

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
      let nextExportPathMap
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
        nextExportPathMap = await nextConfig.exportPathMap(defaultPathMap, options)
        await setNextExportPathMap(nextExportPathMap)
      }

      await createJSONEntries(entries, options)

      return {
        ...map,
        ...nextExportPathMap
      }
    }
  })
}

export default withNextein

const createJSONEntries = async (entries, { dev, dir, outDir, distDir, buildId }) => {
  if (!dev) {
    console.log(`Creating entries...`)
    const all = await byEntriesList(entries)

    await writeFile(resolve(outDir, jsonFileEntries(buildId)), JSON.stringify(entries))
    await writeFile(resolve(outDir, jsonFileEntriesMap(buildId)), JSON.stringify(entriesMap(entries)))

    return Promise.all(all.map(async (entry) => {
      const name = jsonFileFromEntry(entry.data._entry, buildId)
      console.log(`> ${name}`)
      await writeFile(resolve(outDir, name), JSON.stringify(entry))
    }))
  }
}
