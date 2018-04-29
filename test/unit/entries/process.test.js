jest.mock('fs')
jest.mock('frontmatter')

import processEntries from '../../../src/entries/process'
import { readFileSync, statSync } from 'fs'
import fm from 'frontmatter'

describe('processEntries ', () => {
  test('exports processEntries fn as default', () => {
    expect(processEntries).toBeDefined()
  })

  test('retrieves an array of posts with default values', async () => {
    const expectedPage = 'post'
    const expectedCategory = undefined
    const expectedName = 'test'
    const expectedEntry = `posts/${expectedName}.md`
    const expectedContent = 'text'
    const expectedUrl = `/${expectedName}`
    const expectedDate = new Date()
    const expectedFileContent = `
        ---
        ---
        ${expectedContent}
        `

    readFileSync.mockReturnValueOnce(expectedFileContent)

    fm.mockReturnValueOnce({
      data: {
      },
      content: expectedContent
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await processEntries([expectedEntry], 'posts')

    expect(actual).toEqual(expect.any(Array))
    expect(actual).toMatchObject([
      {
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          name: expectedName,
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expect.objectContaining({
          type: 'root',
          position: expect.anything(),
          data: expect.anything(),
          children: expect.arrayContaining([{
            type: 'element',
            tagName: 'p',
            properties: expect.anything(),
            position: expect.anything(),
            children: expect.arrayContaining([{
              value: expectedContent,
              type: 'text',
              position: expect.anything()
            }])
          }])
        })
      }
    ])
  })
})

describe('frontmatter: permalink', () => {
  test('default permalink', async () => {
    const expectedPage = 'post'
    const expectedCategory = 'category'
    const expectedName = 'test'
    const expectedEntry = `posts/${expectedName}.md`
    const expectedUrl = `/${expectedCategory}/${expectedName}`
    const expectedDate = new Date()

    fm.mockReturnValueOnce({
      data: {
        category: expectedCategory
      }
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await processEntries([expectedEntry], 'posts')

    expect(actual).toEqual(expect.arrayContaining([
      {
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          name: expectedName,
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expect.anything()
      }
    ]))
  })

  test('permalink /:category/:name.html', async () => {
    const permalink = '/:category/:name.html'
    const expectedPage = 'post'
    const expectedCategory = 'category'
    const expectedName = 'test'
    const expectedEntry = `posts/${expectedName}.md`
    const expectedUrl = `/${expectedCategory}/${expectedName}.html`
    const expectedDate = new Date()

    fm.mockReturnValueOnce({
      data: {
        category: expectedCategory,
        permalink
      }
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await processEntries([expectedEntry], 'posts')

    expect(actual).toEqual(expect.arrayContaining([
      {
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          name: expectedName,
          permalink,
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expect.anything()
      }
    ]))
  })

  test('permalink /:date/:name.html', async () => {
    const permalink = '/:date/:name.html'
    const expectedPage = 'post'
    const expectedCategory = 'category'
    const expectedName = 'test'
    const expectedEntry = `posts/${expectedName}.md`
    const dateStr = '2017-05-01'
    const expectedUrl = `/${dateStr}/${expectedName}.html`
    const expectedDate = new Date(dateStr)

    fm.mockReturnValueOnce({
      data: {
        category: expectedCategory,
        permalink,
        date: expectedDate
      }
    })

    statSync.mockReturnValueOnce({
      birthtime: expectedDate
    })

    const actual = await processEntries([expectedEntry], 'posts')

    expect(actual).toEqual(expect.arrayContaining([
      {
        data: {
          page: expectedPage,
          category: expectedCategory,
          date: expectedDate.toJSON(),
          name: expectedName,
          permalink,
          url: expectedUrl,
          _entry: expectedEntry
        },
        content: expect.anything()
      }
    ]))
  })
})
