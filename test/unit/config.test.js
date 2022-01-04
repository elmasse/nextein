
jest.mock('../../src/plugins/worker')
import nexteinConfig from '../../src/config'

describe('config', () => {
  test('exports nexteinConfig fn as default', () => {
    expect(nexteinConfig).toBeDefined()
  })
})

// describe('exportPathMap', () => {
//   const defaultPathMap = { '/': { page: '/' } }
//   const { exportPathMap } = nexteinConfig()

//   test('generates index by default ', async () => {
//     metadata.mockReturnValueOnce([])

//     expect(exportPathMap).toBeDefined()
//     const result = await exportPathMap(defaultPathMap, { dev: true })

//     expect(result).toBeDefined()
//     expect(metadata).toBeCalled()
//     expect(result).toHaveProperty('/')
//   })

//   test('generates post entry with default page', async () => {
//     metadata.mockReturnValueOnce([{ url: '/test', page: 'post' }])

//     expect(exportPathMap).toBeDefined()
//     const result = await exportPathMap(defaultPathMap, { dev: true })

//     expect(result).toBeDefined()
//     expect(metadata).toBeCalled()
//     expect(result).toHaveProperty('/')
//     expect(result).toHaveProperty('/test', { page: '/post' })
//   })

//   test('generates post entry with given page', async () => {
//     metadata.mockReturnValueOnce([{ url: '/test', page: 'test' }])

//     expect(exportPathMap).toBeDefined()
//     const result = await exportPathMap(defaultPathMap, { dev: true })

//     expect(result).toBeDefined()
//     expect(metadata).toBeCalled()
//     expect(result).toHaveProperty('/')
//     expect(result).toHaveProperty('/test', { page: '/test' })
//   })

//   test('does not generates post entry if page is false', async () => {
//     metadata.mockReturnValueOnce([{ url: '/test', page: false }])

//     expect(exportPathMap).toBeDefined()
//     const result = await exportPathMap(defaultPathMap, { dev: true })

//     expect(result).toBeDefined()
//     expect(metadata).toBeCalled()
//     expect(result).toHaveProperty('/')
//     expect(result).not.toHaveProperty('/test', { page: '/test' })
//   })
// })
