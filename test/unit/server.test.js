jest.mock('next')
jest.mock('../../src/entries/load')

import next from 'next'
import { byEntriesList } from '../../src/entries/load'

// SUT
import Server from '../../src/server'

const postWithURL = { data: { url: '/post-one'}, content: '' }
const postWithoutURL = { data: { }, content: '' }

describe('server', () => {
  test('exports Server class as default', () => {
    expect(Server).toBeDefined()
  })
})

describe('server instance mode: dev', () => {
  next.mockReturnValueOnce({
    nextConfig: {
      exportPathMap: () => ({})
    }
  })

  const server = new Server({dev: true})

  test('readEntries generates entriesMap', async () => {
    const posts = [postWithoutURL, postWithURL]

    byEntriesList.mockReturnValueOnce(posts)

    await server.readEntries()

    expect(server.entriesMap.size).toBe(posts.length)
  })


})
