
import chokidar from 'chokidar'
import { readFile as readFileFS } from 'fs'
import { promisify } from 'util'
import { resolve } from 'path'

const readFile = promisify(readFileFS)

// We use a CACHE FILE since getStaticPaths runs either in a Worker or a ChildProcess.
// A memoru cache is completely useless in those cases and I honestly ran out of ideas on how to solve this.
export const CACHE_FILE_PATH = resolve(process.cwd(), '.next', 'nextein_ipc.cache')

export default () => {
  const watcher = chokidar.watch([CACHE_FILE_PATH])
  let cache
  let isValid

  async function build (path = CACHE_FILE_PATH) {
    const raw = await readFile(path, { encoding: 'utf-8' })
    try {
      cache = JSON.parse(raw)
      isValid = true
    } catch (error) {
      // When changing a file too quickly readFile sometimes reports an empty file.
      // so if raw has value then log the error. Swallow when raw is empty
      if (raw) console.error(error)
    }
  }

  watcher.on('change', build)

  return {
    load: async () => build(),
    set: (entries) => {
      cache = entries
      isValid = true
      return entries
    },
    get: () => cache,
    isValid: () => isValid,
    invalidate: () => { isValid = false }
  }
}
