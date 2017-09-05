
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
    const expectedCategory = ''
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
        content: expectedContent
      }
    ]))

  })

})

// describe('byFileName', () => {
//   test('retrieves a single post', async () => {
//     const expectedPage = 'post'
//     const expectedCategory = 'category'
//     const expectedName = 'test'
//     const expectedEntry = `posts/${expectedName}.md`
//     const expectedContent = 'text'
//     const expectedUrl = `/${expectedCategory}/${expectedName}`
//     const expectedDate = new Date()
//     const expectedFileContent = `
//         ---
//         page: ${expectedPage}
//         category: ${expectedCategory}
//         ---
//         ${expectedContent}
//         `

//     readFileSync.mockReturnValueOnce(expectedFileContent)

//     fm.mockReturnValueOnce({
//       data: {
//         page: expectedPage,
//         category: expectedCategory
//       },
//       content: expectedContent
//     })

//     statSync.mockReturnValueOnce({
//       birthtime: expectedDate
//     })

//     const actual = await byFileName(expectedEntry)

//     expect(actual).toEqual(expect.objectContaining({
//         data: {
//           page: expectedPage,
//           category: expectedCategory,
//           name: expectedName,          
//           date: expectedDate.toJSON(),
//           url: expectedUrl,
//           _entry: expectedEntry
//         },
//         content: expectedContent
//       }
//     ))
//   })

//   test('retrieves a post with date in filename', async () => {
//     const expectedPage = 'post'
//     const expectedCategory = 'category'
//     const expectedName = 'test'
//     const dateStr = '2017-08-23'
//     const expectedDate = new Date(dateStr)
//     const expectedEntry = `posts/${dateStr}-${expectedName}.md`
//     const expectedContent = 'text'
//     const expectedUrl = `/${expectedCategory}/${expectedName}`
    
//     const expectedFileContent = `
//         ---
//         page: ${expectedPage}
//         category: ${expectedCategory}
//         ---
//         ${expectedContent}
//         `

//     readFileSync.mockReturnValueOnce(expectedFileContent)

//     fm.mockReturnValueOnce({
//       data: {
//         page: expectedPage,
//         category: expectedCategory
//       },
//       content: expectedContent
//     })

//     const actual = await byFileName(expectedEntry)

//     expect(actual).toEqual(expect.objectContaining({
//         data: {
//           page: expectedPage,
//           category: expectedCategory,
//           name: expectedName,          
//           date: expectedDate.toJSON(),
//           url: expectedUrl,
//           _entry: expectedEntry
//         },
//         content: expectedContent
//       }
//     ))
//   })  
// })
