jest.mock('glob')
jest.mock('fs')
jest.mock('unfetch')

import fetch from 'unfetch'

// SUT
import loadEntries, { byFileName } from '../../../src/entries/load-client'

describe('from Client', () => {
  beforeEach(() => {
    global.__NEXT_DATA__ = {}
  })

  test('loadEntries retrieves an array of posts fetching from Server', async () => {
    const posts = [{ data: {} }]

    fetch.mockReturnValueOnce(Promise.resolve({ json: () => posts }))

    const actual = await loadEntries()

    expect(actual).toEqual(expect.arrayContaining(posts))
    expect(fetch).toHaveBeenCalledWith('/_load_entries')
  })

  test('byFileName retrieves a post fetching from Server', async () => {
    const post = { data: {}, content: '' }
    const posts = [post]
    const path = 'post/test.md'

    fetch.mockReturnValueOnce(Promise.resolve({ json: () => post }))

    const actual = await byFileName(path)

    expect(actual).toEqual(expect.objectContaining(post))
    expect(fetch).toHaveBeenCalledWith(`/_load_entry/${path}`)
  })
})
