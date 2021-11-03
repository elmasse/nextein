
import { expect, jest } from '@jest/globals'
import EventEmitter from 'events'

jest.mock('chokidar')
jest.mock('fs')

import { watch } from 'chokidar'
import { statSync } from 'fs'

import { source } from  '../../../../src/plugins/internals/source-filesystem'

describe('source-filesystem::source', () => {

  test('default options', async () => {
    const path = '__test'
    
    watch.mockImplementation(() => {
      const watcher = new EventEmitter()
      setTimeout(() => { 
        watcher.emit('add', `${path}/file.md`)
        statSync.mockReturnValueOnce({ birthtime: new Date() })
        watcher.emit('ready')
      }
      , 300)
      return watcher
    })
    
    expect.assertions(8)

    await source({ path }, { add: options => {
      expect(options).toHaveProperty('filePath')
      expect(options).toHaveProperty('path')
      expect(options).toHaveProperty('name')
      expect(options).toHaveProperty('mimeType')
      expect(options).toHaveProperty('createdOn')
      expect(options).toHaveProperty('extra')
      expect(options).toHaveProperty('load')
    } })
    
    expect(watch).toBeCalled()
  })

  test('fail if not path in options', async () => {
    return expect(source({}, {})).rejects.toThrow('path')
  })

  test('pass data in options', async () => {
    const path = '__test'
    const data = { page: false }

    watch.mockImplementation(() => {
      const watcher = new EventEmitter()
      setTimeout(() => { 
        watcher.emit('add', `${path}/file.md`)
        statSync.mockReturnValueOnce({ birthtime: new Date() })
        watcher.emit('ready')
      }
      , 300)
      return watcher
    })
    
    expect.assertions(8)

    await source({ path, data }, { add: options => {
      expect(options).toHaveProperty('filePath')
      expect(options).toHaveProperty('path')
      expect(options).toHaveProperty('name')
      expect(options).toHaveProperty('mimeType')
      expect(options).toHaveProperty('createdOn')
      expect(options).toHaveProperty('extra',data)
      expect(options).toHaveProperty('load')
    } })
    
    expect(watch).toBeCalled()
  })  
})
