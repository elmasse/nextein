
jest.mock('../../src/load-entries')
import loadEntries from '../../src/load-entries'
import nexteinConfig, { exportPathMap } from '../../src/config'

test('test config', () => {

    expect(nexteinConfig).toBeDefined()
})

test('test config exportPathMap', async () => {

    loadEntries.mockReturnValueOnce([{data:{ url: '/test' }}])

    expect(exportPathMap).toBeDefined()
    const result = await exportPathMap()

    expect(result).toBeDefined()
    expect(loadEntries).toBeCalled()
    expect(result).toHaveProperty('/')
    expect(result).toHaveProperty('/test')
    

})