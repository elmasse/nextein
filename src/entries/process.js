
import { readFileSync, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, sep } from 'path'
import fm from 'frontmatter'
import pathToRegEx from 'path-to-regexp'

import parser from './parser'

export default (paths, entriesPath) => {
  return paths
    .map(path => readFileSync(path, 'utf-8'))
    .map(fm)
    .map(addPage)
    .map(addEntry(paths))
    .map(addName)
    .map(addCategory(entriesPath))
    .map(addDate)
    .map(addUrl)
    .map(addParsedContent)
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

const addParsedContent = value => {
  const { content: mdContent } = value
  delete value.content
  return {
    ...value,
    content: parser.runSync(parser.parse(mdContent)),
    raw: mdContent
  }
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
