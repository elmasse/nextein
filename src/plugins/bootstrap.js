
import EventEmitter from 'events'

import { createEntry, createId } from '../entries/create'
import { compile } from './compile'

const emitter = new EventEmitter()
const entries = new Map()
let bootstraped = false

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

  let posts = Array.from(entries.values())

  for (const transform of transformers) {
    posts = await transform(posts)
  }

  for (const cleanup of cleaners) {
    posts = await cleanup(posts)
  }

  for (const filter of filters) {
    posts = await filter(posts)
  }

  entries.clear()

  posts.map(post => {
    entries.set(post.data.__id, post)
  })

  if (bootstraped) emitter.emit('update')
}

/**
 *
 */
export async function run () {
  await upsertEntries()
  await processEntries()

  bootstraped = true

  return Array.from(entries.values())
}
