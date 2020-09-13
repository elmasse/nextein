
import { resolve } from 'path'
import fs from 'fs'

const INTERNALS = {
  'nextein-plugin-source-fs': resolve(__dirname, 'internals/source-filesystem'),
  'nextein-plugin-build-remark': resolve(__dirname, 'internals/build-remark'),
  'nextein-plugin-filter-unpublished': resolve(__dirname, 'internals/filter-unpublished')
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
