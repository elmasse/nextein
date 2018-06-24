
import glob from 'glob'
import fm from 'frontmatter'
import { readFileSync, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, sep } from 'path'
import pathToRegEx from 'path-to-regexp'

import parser from './parser'

export const source = ({ extension = 'md', entriesDir = ['posts'], remark = [], rehype = [] }) => {
  let all = []
  for (const dir of entriesDir) {
    const files = glob.sync(`${dir}/**/*.${extension}`, { root: process.cwd() })
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
        .map(parse({remark, rehype}))
    )
  }
  return all
}

const parse = (options) => (value) => {
  const { content } = value
  const instance = parser(options)
  return {
    ...value,
    content: instance.runSync(instance.parse(content)),
    raw: content
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
  const url = toUrl({ ...data, date: date.replace(/T.*Z/, '') }, { encode: v => v })

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

// export const transform = (options = OPTIONS, post) => {

// }
