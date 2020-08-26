
import glob from 'glob'
import { promisify } from 'util'
import { readFile, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, normalize } from 'path'
import mime from 'mime'

const asyncGlob = promisify(glob)
const asyncReadFile = promisify(readFile)

const DEFAULT_IGNORES = [
  '**/.DS_Store',
  '**/.gitignore',
  '**/.npmignore',
  '**/.babelrc',
  '**/yarn.lock',
  '**/package-lock.json',
  '**/node_modules'
]

const DATE_IN_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/
const DATE_MATCH_INDEX = 1
const NAME_MATCH_INDEX = 2

/**
 * Create a buildOptions
 * @param {*} filePath
 * @param {*} basePath
 */
function buildOptions (filePath, basePath) {
  const fileName = basename(filePath, extname(filePath))
  const match = fileName.match(DATE_IN_FILE_REGEX)
  const { birthtime } = statSync(filePath)

  const path = relative(resolve(process.cwd(), basePath), dirname(filePath))
  const name = (match) ? match[NAME_MATCH_INDEX] : fileName
  const created = (match) ? new Date(match[DATE_MATCH_INDEX]) : birthtime

  return {
    filePath,
    path,
    name,
    mimeType: mime.getType(filePath),
    created,
    async load () {
      return asyncReadFile(filePath, { encoding: 'utf-8' })
    }
  }
}

/**
 * Source Plugin to read files from File System
 * @param {Object} options
 * @param {String} options.path
 * @param {String} options.includes
 * @param {Array<String>} options.ignore
 * @param {Object} action
 * @param {function(buildOptions)} action.build
 */
export async function source ({ path, ignore = [], includes = '**/*.*' } = {}, { build }) {
  const files = (await asyncGlob(normalize(`${path}/${includes}`), {
    root: process.cwd(),
    absolute: true,
    ignore: [
      ...DEFAULT_IGNORES,
      ...ignore
    ]
  }))
    .map(normalize)

  for (const filePath of files) {
    await build(buildOptions(filePath, path))
  }
}
