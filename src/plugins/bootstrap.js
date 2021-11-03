
import EventEmitter from 'events'

import { createEntry, createId } from '../entries/create'
import { compile } from './compile'

const emitter = new EventEmitter()
const entries = new Map()
let posts = []
let bootstraped = false

/**
 * subscribe
 * @param {*} fn
 */
export function subscribe (fn) {
  const handler = () => fn(posts)
  emitter.on('update', handler)

  return function unsubscribe () {
    emitter.off('update', handler)
  }
}

export function subscribeEntryChange (fn) {
  emitter.on('entry.change', fn)

  return function unsubscribe () {
    emitter.off('entry.change', fn)
  }
}

emitter.on('entries.update', (__id) => {
  processEntries()
  emitter.emit('entry.change', __id)
})

let indexed = false

async function indexEntries () {
  if (indexed) return
  const { sources = [], indexers = [], prefilters = [] } = compile()

  async function add (options) {
    for (const indexer of indexers) {
      await indexer(options, {
        create: createOptions => {
          const entry = createEntry(createOptions)
          entries.set(entry.data.__id, entry)

          if (bootstraped) emitter.emit('entries.update', entry.data.__id)
        }
      })
    }
  }

  function remove (removeOptions) {
    const __id = createId(removeOptions.filePath)
    entries.delete(__id)

    if (bootstraped) emitter.emit('entries.update', __id)
  }

  for (const source of sources) {
    await source({ add, remove })
  }

  posts = JSON.parse(JSON.stringify(Array.from(entries.values()))) // deep clone

  for (const prefilter of prefilters) {
    posts = prefilter(posts)
  }

  indexed = true
}

async function buildEntries () {
  const { builders = [] } = compile()

  for (const build of builders) {
    posts = await build(posts)
  }
}

async function processEntries () {
  const { transformers = [], cleaners = [], filters = [], sorters = [] } = compile()

  for (const transform of transformers) {
    posts = await transform(posts)
  }

  for (const cleanup of cleaners) {
    posts = await cleanup(posts)
  }

  for (const filter of filters) {
    posts = await filter(posts)
  }

  for (const sort of sorters) {
    posts = await sort(posts)
  }

  if (bootstraped) emitter.emit('update')
}

/**
 *
 */
export async function run () {
  await indexEntries()
  await buildEntries()
  await processEntries()

  bootstraped = true

  return posts
}

export async function runIndexer () {
  await indexEntries()
  return posts
}
