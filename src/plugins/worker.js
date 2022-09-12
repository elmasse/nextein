import { writeFile as writeFileFS, mkdir as mkdirFS } from 'fs'
import { dirname } from 'path'
import { promisify } from 'util'

import { Worker, isMainThread, parentPort } from 'worker_threads'

import { CACHE_FILE_PATH } from '../entries/cache'
import { run, subscribe } from './bootstrap'

const writeFile = promisify(writeFileFS)
const mkdir = promisify(mkdirFS)

async function updateTmpFile (data) {
  try {
    await mkdir(dirname(CACHE_FILE_PATH), { recursive: true })
    await writeFile(CACHE_FILE_PATH, JSON.stringify(data), { encoding: 'utf-8', flag: 'w+' })
  } catch (error) {
    console.error('Error writing cache.', error)
  }
}

if (isMainThread) {
  let worker

  module.exports.runProcessWorker = function () {
    worker = new Worker(__filename)
    worker.on('message', updateTmpFile)
    worker.on('error', console.log)
    worker.on('exit', (code) => {
      if (code !== 0) {
        console.log(`Worker stopped with exit code ${code}`)
      }
    })
  }
} else {
  // run code
  subscribe(data => parentPort.postMessage(data))
  run().then(data => parentPort.postMessage(data))
}
