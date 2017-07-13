
jest.mock('../../src/load-entries')
import loadEntries from '../../src/load-entries'
import nexteinConfig, { exportPathMap } from '../../src/config'

describe('config', () => {
  test('exports nexteinConfig fn as default', () => {
    expect(nexteinConfig).toBeDefined()
  })
})

describe('exportPathMap', () => {
  test('generates index by default ', async () => {
    loadEntries.mockReturnValueOnce([])

    expect(exportPathMap).toBeDefined()
    const result = await exportPathMap()

    expect(result).toBeDefined()
    expect(loadEntries).toBeCalled()
    expect(result).toHaveProperty('/')
  })

  test('generates post entry with default page', async () => {
    loadEntries.mockReturnValueOnce([
      { data: { url: '/test' } }
    ])

    expect(exportPathMap).toBeDefined()
    const result = await exportPathMap()

    expect(result).toBeDefined()
    expect(loadEntries).toBeCalled()
    expect(result).toHaveProperty('/')
    expect(result).toHaveProperty('/test', { page: '/post' })
  })

  test('generates post entry with given page', async () => {
    loadEntries.mockReturnValueOnce([
      { data: { url: '/test',  page: 'test' } }
    ])

    expect(exportPathMap).toBeDefined()
    const result = await exportPathMap()

    expect(result).toBeDefined()
    expect(loadEntries).toBeCalled()
    expect(result).toHaveProperty('/')
    expect(result).toHaveProperty('/test', { page: '/test' })
  })  
})