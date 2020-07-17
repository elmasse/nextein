
import { resolve } from 'path'
import { promisify } from 'util'
import { writeFile as fsWriteFile } from 'fs'

import { jsonFileEntries, jsonFileEntriesMap, jsonFileFromEntry } from './json-entry'
import { byEntriesList } from './load'
import entriesMap from './map'

const writeFile = promisify(fsWriteFile)

export const createJSONEntries = async (entries, { dev, outDir, buildId }) => {
  if (!dev) {
    console.log('Creating entries...')
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
