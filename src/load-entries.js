
const isServer = typeof window === 'undefined'

import glob from 'glob'
import { readFileSync } from 'fs'
import { resolve, basename, extname } from 'path'
import fm from 'frontmatter'


export default async (path) => {
  return await ( isServer ? fromServer(path) : fromClient(path) )
}  

const fromServer = async (path) => {

   const paths =  glob.sync(`${path}**/*.md`, { root: process.cwd()})
   
   return paths
    .map((p) => (readFileSync(p, 'utf-8') ))
    .map(fm)
    .map((value, idx) => {
      const { data } = value
      return {
        ...value,
        data: {
          ...data,
          _entry: paths[idx],
          url: createEntryURL({ path: paths[idx], ...data })
        }
      }
    })
}

const fromClient = async ( path ) => {
  const resp = await fetch('./_load_entries')
  return await resp.json()
}

export const byFileName = async (path) => {
  return isServer ? byFileNameFromServer(path) : byFileNameFromClient(path)
}

export const byFileNameFromServer = (path) => {
  return fm(readFileSync(resolve(process.cwd(), path), 'utf-8'))
}

const byFileNameFromClient = async(path) => {
  const resp = await fetch(`./_load_entry/${path}`)
  return await resp.json()
}

const createEntryURL = ({ slug, category, path }) => {
  let url = slug
  if (!slug) {
    const name = basename(path, extname(path))
    url = `/${category}/${name}`
  }

  return url 
}