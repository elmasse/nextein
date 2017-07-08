
const isServer = typeof window === 'undefined'

import glob from 'glob'
import { readFileSync, statSync } from 'fs'
import { resolve, basename, extname } from 'path'
import fm from 'frontmatter'
import fetch from 'unfetch'

export default async (path = 'posts/') => {
  return await ( isServer ? fromServer(path) : fromClient(path) )
}

const fromServer = async (path) => {
   const paths = glob.sync(`${path}**/*.md`, { root: process.cwd()})
   return paths
    .map(path => readFileSync(path, 'utf-8'))
    .map(fm)
    .map((value, idx) => {
      const { data } = value
      const path = paths[idx] 
      return {
        ...value,
        data: {
          ...data,
          _entry: path,
          url: createEntryURL({ path, ...data }),
          date: createEntryDate({ path, ...data }).toJSON()
        }
      }
    })
    .filter(({data}) => data.published !== false )
}

export const byFileName = async (path) => {
  return isServer ? byFileNameFromServer(path) : byFileNameFromClient(path)
}

export const byFileNameFromServer = (path) => {
  return fm(readFileSync(resolve(process.cwd(), path), 'utf-8'))
}

const fromClient = async ( path ) => {
  // in safari the popstate event is fired when user press back and
  // causes the getInitialProps to be called in the SSR version
  // This will pickup the current props and return it as a workaround
  // https://github.com/zeit/next.js/issues/2360
  if (__NEXT_DATA__.nextExport) {
    return __NEXT_DATA__.props.posts
  }
  const resp = await fetch('./_load_entries')
  return await resp.json()
}

const byFileNameFromClient = async(path) => {
  // in safari the popstate event is fired when user press back and
  // causes the getInitialProps to be called in the SSR version
  // This will pickup the current props and return it as a workaround
  // https://github.com/zeit/next.js/issues/2360
  if (__NEXT_DATA__.nextExport) {
    return __NEXT_DATA__.props.post
  }
  const resp = await fetch(`./_load_entry/${path}`)
  return await resp.json()
}

const extractName = (path) =>  basename(path, extname(path))

const createEntryURL = ({ slug, category, path, page = 'post' }) => {
  let url = slug
  if (!slug) {
    const name = extractName(path)
    url = `/${category ? `${category}/` : '' }${name}`
  }

  return page ? url : undefined
}

const createEntryDate = ({ path, date }) => {
  const name = extractName(path)
  const DATE_IN_FILE_REGEX = /^(\d{4}-\d{2}-\d{2})-(.+)$/
  const match = name.match(DATE_IN_FILE_REGEX)

  return date ? new Date(date) : (match) ? new Date(match[1]) : fileCreationDate(path)
}

const fileCreationDate = (path) => {
  const { birthtime } = statSync(path)
  return birthtime
}
