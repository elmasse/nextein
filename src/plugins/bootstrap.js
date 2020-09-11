
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

emitter.on('entries.update', () => processEntries())

async function upsertEntries () {
  const { sources = [], builders = [] } = compile()

  async function build (buildOptions) {
    for (const build of builders) {
      await build(buildOptions, {
        create: createOptions => {
          const entry = createEntry(createOptions)
          entries.set(entry.data.__id, entry)

          if (bootstraped) emitter.emit('entries.update')
        }
      })
    }
  }

  function remove (removeOptions) {
    const __id = createId(removeOptions.filePath)
    entries.delete(__id)

    if (bootstraped) emitter.emit('entries.update')
  }

  for (const source of sources) {
    await source({ build, remove })
  }
}

async function processEntries () {
  const { transformers = [], cleaners = [], filters = [] } = compile()

  posts = JSON.parse(JSON.stringify(Array.from(entries.values()))) // deep clone

  for (const transform of transformers) {
    posts = await transform(posts)
  }

  for (const cleanup of cleaners) {
    posts = await cleanup(posts)
  }

  for (const filter of filters) {
    posts = await filter(posts)
  }

  if (bootstraped) emitter.emit('update')
}

/**
 *
 */
export async function run () {
  await upsertEntries()
  await processEntries()

  bootstraped = true

  return posts
}
