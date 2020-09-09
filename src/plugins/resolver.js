
import { resolve } from 'path'
import fs from 'fs'

const INTERNALS = {
  'nextein-plugin-source-fs': resolve(__dirname, 'internals/source-filesystem'),
  'nextein-plugin-build-remark': resolve(__dirname, 'internals/build-remark')
}

const isLocal = (name) => name.startsWith('.')

export function resolvePlugin (name) {
  return INTERNALS[name] || (isLocal(name) ? resolve(process.cwd(), name) : name)
}

export function hasRenderer (resolvedPath) {
  return fs.existsSync(resolve(resolvedPath, 'render.js'))
}
