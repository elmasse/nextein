/* global __NEXT_DATA__ */
import glob from 'glob'
import { readFileSync, statSync } from 'fs'
import { resolve, basename, extname, relative, dirname, sep } from 'path'
import fm from 'frontmatter'
import fetch from 'unfetch'

const isServer = typeof window === 'undefined'

export default async (path = 'posts') => {
  return (isServer ? fromServer(path) : fromClient(path))
}

const fromServer = async (entriesPath) => {
  const paths = glob.sync(`${entriesPath}/**/*.md`, { root: process.cwd() })

  return paths
    .map(path => readFileSync(path, 'utf-8'))
    .map(fm)
    .map(addEntry(paths))
    .map(addCategory(entriesPath))
    .map(addUrl)
    .map(addDate)
    .filter(({data}) => data.published !== false)
}

const fromClient = async (path) => {
  // in safari the popstate event is fired when user press back and
  // causes the getInitialProps to be called in the SSR version
  // This will pickup the current props and return it as a workaround
  // https://github.com/zeit/next.js/issues/2360
  if (__NEXT_DATA__.nextExport) {
    return __NEXT_DATA__.props.posts
  }
  const resp = await fetch('/_load_entries')
  return resp.json()
}

export const byFileName = async (path) => {
  return isServer ? byFileNameFromServer(path) : byFileNameFromClient(path)
}

const byFileNameFromServer = (path) => {
  return fm(readFileSync(resolve(process.cwd(), path), 'utf-8'))
}

const byFileNameFromClient = async(path) => {
  // in safari the popstate event is fired when user press back and
  // causes the getInitialProps to be called in the SSR version
  // This will pickup the current props and return it as a workaround
  // https://github.com/zeit/next.js/issues/2360
  if (__NEXT_DATA__.nextExport) {
    return __NEXT_DATA__.props.post
  }
  const resp = await fetch(`/_load_entry/${path}`)
  return resp.json()
}

const addEntry = (paths) => (value, idx) => {
  const { data } = value
  return { ...value, data: { ...data, _entry: paths[idx] } }
}

const addCategory = (entriesPath) => (value, idx) => {
  const { data } = value
  return { ...value, data: { ...data, category: createEntryCategory({ entriesPath, ...data }) } }
}

const addUrl = (value, idx) => {
  const { data } = value
  return { ...value, data: { ...data, url: createEntryURL({ ...data }) } }
}

const addDate = (value, idx) => {
  const { data } = value
  return { ...value, data: { ...data, date: createEntryDate({ ...data }) } }
}

const extractName = (path) => basename(path, extname(path))

const createEntryURL = ({ slug, category, _entry, page = 'post' }) => {
  let url = slug
  if (!slug) {
    const name = extractName(_entry)
    url = `/${category ? `${category}/` : ''}${name}`
  }

  return page ? url : undefined
}

const createEntryDate = ({ _entry, date }) => {
  const name = extractName(_entry)
  const DATE_IN_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/
  const match = name.match(DATE_IN_FILE_REGEX)

  return (date ? new Date(date) : (match) ? new Date(match[1]) : fileCreationDate(_entry)).toJSON()
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

  return relative(root, dirname(post)).replace(sep, categorySeparator)
}
