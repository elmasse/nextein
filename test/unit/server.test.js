jest.mock('next')
jest.mock('../../src/entries/load')

// SUT
import start from '../../src/server'

describe('start server', () => {
  test('exports start function as default', () => {
    expect(start).toBeDefined()
  })
})
