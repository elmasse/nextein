
import { resolve } from 'path'
import { promisify } from 'util'
import { writeFile as fsWriteFile, mkdirSync, rmdirSync } from 'fs'

import { load, pathMap, metadata } from './entries'
import { plugins } from './plugins/config'
import { files } from './endpoints'

const writeFile = promisify(fsWriteFile)

export async function generateExportedFiles ({ dev, outDir, buildId }) {
  if (!dev) {
    console.log('Creating entries...')
    const entries = await load()

    await writeFile(resolve(outDir, files.metadata(buildId)), JSON.stringify(await metadata()))
    await writeFile(resolve(outDir, files.pathMap(buildId)), JSON.stringify(await pathMap()))
    await writeFile(resolve(outDir, files.posts(buildId)), JSON.stringify(entries))
    await writeFile(resolve(outDir, files.pluginsManifest(buildId)), JSON.stringify(plugins()))

    return Promise.all(entries.map(async (entry) => {
      const name = files.post(entry.data.__id, buildId)
      console.log(`> ${name}`)
      await writeFile(resolve(outDir, name), JSON.stringify(entry))
    }))
  }
}

export async function generateCache ({ plugins = [] }) {
  const cache = resolve(process.cwd(), '.nextein', 'cache')
  try {
    rmdirSync(cache, { recursive: true })
  } catch (err) {
    // ignore
  }

  mkdirSync(cache, { recursive: true })
  await writeFile(resolve(cache, 'plugins-cache.js'), `
    module.exports = {
      ${plugins
        .filter(p => p.renderer)
        .map(({ resolved, name }) => `"${name}": require("${resolved}/render").render`)
        .join(',')
      }
    }
  `)
}
