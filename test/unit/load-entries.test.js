jest.mock('glob')
jest.mock('fs')
jest.mock('frontmatter')

import loadEntries, { byFileName } from '../../src/load-entries'
import glob from 'glob'
import { readFileSync, statSync } from 'fs'
import fm from 'frontmatter'

describe('loadEntries', () => {
  test('exports loadEntries fn as default', () => {
    expect(loadEntries).toBeDefined()
  })
})

describe('loadEntries called from Server', () => {

  test('retrieves an array of posts', async () => {
    const expectedPage = 'post'
    const expectedCategory = 'category'
    const expectedEntry = 'posts/test.md'
    const expectedContent = 'text'
    const expectedUrl = `/${expectedCategory}/test`
    const expectedDate = new Date()
    const expectedFileContent = `
        ---
        page: ${expectedPage}
        category: ${expectedCategory}
        ---
        ${expectedContent}
        `

    glob.sync.mockReturnValueOnce([
      'posts/test.md'
    ])

    readFileSync.mockReturnValueOnce(expectedFileContent)

    fm.mockReturnValueOnce({
      data: {
        page: expectedPage,
        category: expectedCategory
      },
      content: expectedContent
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await loadEntries()

    expect(actual).toEqual(expect.any(Array))
    expect(actual).toEqual(expect.arrayContaining([
      {
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expectedContent
      }
    ]))

  })

})

describe('byFileName', () => {
  test('retrieves a single post', async () => {
    const expectedPage = 'post'
    const expectedCategory = 'category'
    const expectedEntry = 'posts/test.md'
    const expectedContent = 'text'
    const expectedUrl = `/${expectedCategory}/test`
    const expectedDate = new Date()
    const expectedFileContent = `
        ---
        page: ${expectedPage}
        category: ${expectedCategory}
        ---
        ${expectedContent}
        `

    readFileSync.mockReturnValueOnce(expectedFileContent)

    fm.mockReturnValueOnce({
      data: {
        page: expectedPage,
        category: expectedCategory
      },
      content: expectedContent
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await byFileName(expectedEntry)

    expect(actual).toEqual(expect.objectContaining({
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expectedContent
      }
    ))
  })
})

