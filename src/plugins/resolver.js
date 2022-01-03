
import { resolve } from 'path'
import fs from 'fs'

const INTERNALS = {
  'nextein-plugin-source-fs': resolve(__dirname, 'internals/source-filesystem'),
  'nextein-plugin-markdown': resolve(__dirname, 'internals/markdown'),
  'nextein-plugin-filter-unpublished': resolve(__dirname, 'internals/filter-unpublished'),
  'nextein-plugin-sort-by-date': resolve(__dirname, 'internals/sort-by-date')
}

function isLocal (name) {
  return name.startsWith('.')
}

export function resolvePlugin (name) {
  return INTERNALS[name] || (isLocal(name) ? resolve(process.cwd(), name) : name)
}

export function hasRenderer (resolvedPath) {
  return fs.existsSync(resolve(resolvedPath, 'render.js'))
}
