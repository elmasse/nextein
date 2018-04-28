import glob from 'glob'

import processEntries from './process'

export default async (path = 'posts') => {
  return fromServer(path)
}

const fromServer = async (entriesPath) => {
  const paths = glob.sync(`${entriesPath}/**/*.md`, { root: process.cwd() })

  return processEntries(paths, entriesPath)
    .filter(({data}) => data.published !== false)
}

export const byFileName = async (path, root = 'posts') => {
  return byFileNameFromServer(path, root)
}

const byFileNameFromServer = (path, entriesPath) => {
  return processEntries([path], entriesPath).pop()
}
