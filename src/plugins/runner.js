
import EventEmitter from 'events'
import { getPluginsConfig, resolvePlugin } from './config'
import { createEntry, createId } from '../entries'

function compile () {
  const nexteinPlugins = getPluginsConfig()
  const sources = []
  const builders = []
  const transformers = []
  const filters = []

  for (const plugin of nexteinPlugins) {
    const { name, options } = plugin
    const { source, build, transform, filter } = require(resolvePlugin(name))
    if (source) {
      sources.push((...args) => source(options, ...args))
    }
    if (build) {
      builders.push((...args) => build(options, ...args))
    }
    if (transform) {
      transformers.push((...args) => transform(options, ...args))
    }
    if (filter) {
      filters.push((...args) => filter(options, ...args))
    }
  }

  return {
    sources,
    builders,
    transformers,
    filters
  }
}

const emitter = new EventEmitter()
const entries = new Map()
let ready = false

/**
 * subscribe
 * @param {*} fn
 */
export function subscribe (fn) {
  const handler = () => fn(Array.from(entries.values()))
  emitter.on('update', handler)

  return function unsubscribe () {
    emitter.off('update', handler)
  }
}

emitter.on('entries.update', () => processEntries())

async function upsertEntries () {
  const { sources = [], builders = [] } = compile()

  async function build (buildOptions) {
    for (const build of builders) {
      await build(buildOptions, {
        create: createOptions => {
          const entry = createEntry(createOptions)
          entries.set(entry.data.__id, entry)

          if (ready) emitter.emit('entries.update')
        }
      })
    }
  }

  function remove (removeOptions) {
    const __id = createId(removeOptions.filePath)
    entries.delete(__id)

    if (ready) emitter.emit('entries.update')
  }

  for (const source of sources) {
    await source({ build, remove })
  }
}

async function processEntries () {
  const { transformers = [], filters = [] } = compile()

  let posts = Array.from(entries.values())

  for (const transform of transformers) {
    posts = await transform(posts)
  }

  for (const filter of filters) {
    posts = await filter(posts)
  }

  entries.clear()

  posts.map(post => {
    entries.set(post.data.__id, post)
  })

  if (ready) emitter.emit('update')
}

/**
 *
 */
export async function run () {
  await upsertEntries()
  await processEntries()

  ready = true

  return Array.from(entries.values())
}
