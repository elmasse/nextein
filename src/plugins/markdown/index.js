
import glob from 'glob'
import { promisify } from 'util'
import fm from 'frontmatter'
import { readFileSync, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, sep } from 'path'
import pathToRegEx from 'path-to-regexp'
import removePosition from 'unist-util-remove-position'

import parser from './parser'

export const watcher = ({ entriesDir = ['posts'] } = {}) => {
  return entriesDir
}

/**
 * source
 * @param config {Object}
 * @param config.extension {string}
 * @param config.entriesDir {string[]}
 * @param config.raw {boolean}
 * @oaram config.position {boolean}
 * @param config.remark {string[]}
 * @param config.rehype {string[]}
 */
export const source = async ({ extension = 'md', entriesDir = ['posts'], raw = true, position = false, rehype = [], remark = [] } = {}) => {
  let all = []
  for (const dir of entriesDir) {
    const files = await promisify(glob)(`${dir}/**/*.${extension}`, { root: process.cwd() })
    all.push(
      ...files
        .map(file => readFileSync(file, 'utf-8'))
        .map(fm)
        .map(addEntry(files))
        .map(addPage)
        .map(addName)
        .map(addCategory(dir))
        .map(addDate)
        .map(addUrl)
        .map(parse({ raw, position, remark, rehype }))
    )
  }
  return all
}

export const transform = async (options = {}, posts) => {
  return posts.filter(p => p.data.published !== false)
}

const parse = ({ position, raw, ...options }) => (value) => {
  const { content } = value
  const instance = parser(options)
  const parsed = instance.runSync(instance.parse(content))

  return {
    ...value,
    content: position ? parsed : removePosition(parsed, true),
    raw: raw ? content : undefined
  }
}

const addPage = (value, idx) => {
  const { data } = value
  const { page = 'post' } = data
  return { ...value, data: { ...data, page } }
}

const addEntry = (paths) => (value, idx) => {
  const { data } = value
  return { ...value, data: { ...data, _entry: paths[idx] } }
}

const addName = (value) => {
  const { data } = value
  return { ...value, data: { ...data, name: createEntryName({ ...data }) } }
}

const addCategory = (entriesPath) => (value) => {
  const { data } = value
  return { ...value, data: { ...data, category: createEntryCategory({ entriesPath, ...data }) } }
}

const addUrl = (value) => {
  const { data } = value
  return { ...value, data: { ...data, url: createEntryURL({ ...data }) } }
}

const addDate = (value) => {
  const { data } = value
  return { ...value, data: { ...data, date: createEntryDate({ ...data }) } }
}

const DATE_IN_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/
const DATE_MATCH_INDEX = 1
const NAME_MATCH_INDEX = 2
const DEFAULT_PERMALINK = '/:category?/:name'
const PERMALINK_CATEGORIES = ':category(.*)'

const extractFileName = (path) => basename(path, extname(path))

const createEntryName = ({ _entry }) => {
  const name = extractFileName(_entry)
  const match = name.match(DATE_IN_FILE_REGEX)

  return (match) ? match[NAME_MATCH_INDEX] : name
}

const createEntryURL = (data) => {
  const { page, date, permalink = DEFAULT_PERMALINK } = data
  const toUrl = pathToRegEx.compile(permalink.replace(':category', PERMALINK_CATEGORIES))
  const url = toUrl({ ...data, date: date.replace(/T.*Z/, '') }, { encode: v => encodeURI(v) })

  return page ? url : undefined
}

const createEntryDate = ({ _entry, date }) => {
  const name = extractFileName(_entry)
  const match = name.match(DATE_IN_FILE_REGEX)

  return (date ? new Date(date) : (match) ? new Date(match[DATE_MATCH_INDEX]) : fileCreationDate(_entry)).toJSON()
}

const fileCreationDate = (path) => {
  const { birthtime } = statSync(path)
  return birthtime
}

const createEntryCategory = ({ entriesPath, category, _entry }) => {
  if (category) return category
  const categorySeparator = '/'
  const root = resolve(process.cwd(), entriesPath)
  const post = resolve(process.cwd(), _entry)
  const folderCategory = relative(root, dirname(post)).replace(sep, categorySeparator)
  return folderCategory || undefined
}
