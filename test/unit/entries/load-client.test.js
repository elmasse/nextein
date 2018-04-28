jest.mock('glob')
jest.mock('fs')
jest.mock('unfetch')
jest.mock('../../../src/entries/process')

import fetch from 'unfetch'
import processEntries from '../../../src/entries/process'

// SUT
import loadEntries, { byFileName } from '../../../src/entries/load-client'

describe('from Client', () => {
  beforeEach(() => {
    global.__NEXT_DATA__ = {}
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
