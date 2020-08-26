
import { resolve } from 'path'
import { promisify } from 'util'
import { writeFile as fsWriteFile } from 'fs'

import { load, pathMap, metadata } from './entries'
import endpoints from './endpoints'

const writeFile = promisify(fsWriteFile)

export async function generateExportedFiles ({ dev, outDir, buildId }) {
  if (!dev) {
    console.log('Creating entries...')
    const entries = await load()

    await writeFile(resolve(outDir, endpoints.metadata(buildId)), JSON.stringify(await metadata()))
    await writeFile(resolve(outDir, endpoints.pathMap(buildId)), JSON.stringify(await pathMap()))
    await writeFile(resolve(outDir, endpoints.posts(buildId)), JSON.stringify(entries))

    return Promise.all(entries.map(async (entry) => {
      const name = endpoints.post(entry.data.__id, buildId)
      console.log(`> ${name}`)
      await writeFile(resolve(outDir, name), JSON.stringify(entry))
    }))
  }
}
