
import assert from 'assert'
import chokidar from 'chokidar'
import { promisify } from 'util'
import { readFile, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, normalize, isAbsolute } from 'path'
import mime from 'mime'

const asyncReadFile = promisify(readFile)

const DEFAULT_IGNORES = [
  '**/*.un~',
  '**/.DS_Store',
  '**/.gitignore',
  '**/.npmignore',
  '**/.babelrc',
  '**/yarn.lock',
  '**/bower_components',
  '**/node_modules',
  '**/package-lock.json'
]

const DATE_IN_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/
const DATE_MATCH_INDEX = 1
const NAME_MATCH_INDEX = 2

/**
 * Create a addOptions
 * @param {*} filePath
 * @param {*} basePath
 * @param {Object} data
 */
function addOptions (filePath, basePath, data) {
  const fileName = basename(filePath, extname(filePath))
  const match = fileName.match(DATE_IN_FILE_REGEX)
  const { birthtime } = statSync(filePath)

  const path = relative(basePath, dirname(filePath))
  const name = (match) ? match[NAME_MATCH_INDEX] : fileName
  const createdOn = JSON.stringify((match) ? new Date(match[DATE_MATCH_INDEX]) : birthtime)

  return {
    filePath,
    path,
    name,
    mimeType: mime.getType(filePath),
    createdOn,
    extra: { ...data },
    async load () {
      return asyncReadFile(filePath, { encoding: 'utf-8' })
    }
  }
}

/**
 * Source Plugin to read files from File System
 * @param {Object} options
 * @param {String} options.path path where entries will be loaded.
 * @param {String} options.includes
 * @param {Array<String>} options.ignore
 * @param {Object} data default data added to extra field for each entry.
 * @param {Object} action
 * @param {function(addOptions)} action.add
 * @param {function({ filePath })} action.remove
 */
export async function source ({ path: pathOptions, ignore, includes = '**/*.*', data = {} } = {}, { add, remove }) {
  assert(pathOptions, 'The path is required in source-filesystem plugin configuration.')
  // Make sure path is absolute.
  const path = !isAbsolute(pathOptions) ? resolve(process.cwd(), pathOptions) : pathOptions
  // Use path with includes to create a glob
  const watcher = chokidar.watch(normalize(`${path}/${includes}`), {
    ignored: [
      ...DEFAULT_IGNORES,
      ...(ignore || [])
    ]
  })

  // We'll enqueue the first batch. Then after ready we will process updates one by one.
  let batch = true
  const queue = []

  // add file
  watcher.on('add', async filePath => {
    batch ? queue.push(filePath) : await add(addOptions(filePath, path, data))
  })
  // modify file
  watcher.on('change', async filePath => {
    await add(addOptions(filePath, path, data))
  })
  // remove file
  watcher.on('unlink', async filePath => {
    await remove({ filePath })
  })

  // TODO: do we need to process `addDir`, `unlinkDir`?

  return new Promise((resolve) => {
    watcher.on('ready', async () => {
      for (const filePath of queue) {
        await add(addOptions(filePath, path, data))
      }
      batch = false
      resolve()
    })
  })
}
