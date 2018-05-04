import glob from 'glob'

import processEntries from './process'

export default async (path = 'posts') => {
  const paths = glob.sync(`${path}/**/*.md`, { root: process.cwd() })

  return processEntries(paths, path)
    .filter(({data}) => data.published !== false)
}

export const byFileName = async (path, root = 'posts') => {
  return processEntries([path], path).pop()
}
