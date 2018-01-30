jest.mock('glob')
jest.mock('fs')
jest.mock('unfetch')
jest.mock('../../../src/entries/env')
jest.mock('../../../src/entries/process')

import glob from 'glob'
import { readFileSync } from 'fs'
import fetch from 'unfetch'
import { isServer } from '../../../src/entries/env'
import processEntries from '../../../src/entries/process'

// SUT
import loadEntries, { byFileName } from '../../../src/entries/load'

describe('loadEntries', () => {
  test('exports loadEntries fn as default', () => {
    expect(loadEntries).toBeDefined()
  })
})

describe('from Server', () => {
  beforeEach(() => {
    isServer.mockReturnValue(true)
  })

  afterEach(() => {
    isServer.mockRestore()
  })

  test('loadEntries retrieves an array of posts reading from Server', async () => {
    const files = ['posts/test.md']
    const posts = [{ data: {}, content: '' }]

    glob.sync.mockReturnValueOnce(files)

    processEntries.mockReturnValueOnce(posts)

    const actual = await loadEntries()

    expect(actual).toEqual(expect.arrayContaining(posts))
  })

  test('byFileName retrieves a post reading from Server', async () => {
    const files = ['posts/test.md']
    const post = { data: {}, content: '' }
    const posts = [post]

    glob.sync.mockReturnValueOnce(files)

    processEntries.mockReturnValueOnce(posts)

    const actual = await byFileName('posts/test.md')

    expect(actual).toEqual(expect.objectContaining(post))
  })
})

describe('from Client', () => {
  beforeEach(() => {
    isServer.mockReturnValue(false)
    global.__NEXT_DATA__ = {}
  })

  afterEach(() => {
    isServer.mockRestore()
  })

  test('loadEntries retrieves an array of posts fetching from Server', async () => {
    const posts = [{ data: {}, content: '' }]

    fetch.mockReturnValueOnce(Promise.resolve({ json: () => posts }))

    processEntries.mockReturnValueOnce(posts)

    const actual = await loadEntries()

    expect(actual).toEqual(expect.arrayContaining(posts))
    expect(fetch).toHaveBeenCalledWith('/_load_entries')
  })

  test('byFileName retrieves a post fetching from Server', async () => {
    const post = { data: {}, content: '' }
    const posts = [post]
    const path = 'post/test.md'

    fetch.mockReturnValueOnce(Promise.resolve({ json: () => post }))

    processEntries.mockReturnValueOnce(posts)

    const actual = await byFileName(path)

    expect(actual).toEqual(expect.objectContaining(post))
    expect(fetch).toHaveBeenCalledWith(`/_load_entry/${path}`)
  })
})
