// jest.mock('glob')
jest.mock('../../../src/plugins')

// import glob from 'glob'
import plugins from '../../../src/plugins'

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

    plugins.mockReturnValueOnce({
      sources: [() => posts],
      transforms: []
    })

    const actual = await loadEntries()

    expect(actual).toEqual(expect.arrayContaining(posts))
  })
})
