jest.mock('glob')
jest.mock('fs')
jest.mock('../../../src/entries/process')

import glob from 'glob'
import { readFileSync } from 'fs'
import processEntries from '../../../src/entries/process'

// SUT
import loadEntries, { byFileName } from '../../../src/entries/load'

describe('loadEntries', () => {
  test('exports loadEntries fn as default', () => {
    expect(loadEntries).toBeDefined()
  })
})

describe('from Server', () => {
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
