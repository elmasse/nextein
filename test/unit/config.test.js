jest.mock('../../src/entries/metadata')

import { metadata } from '../../src/entries/metadata'
import nexteinConfig from '../../src/config'

describe('config', () => {
  test('exports nexteinConfig fn as default', () => {
    expect(nexteinConfig).toBeDefined()
  })
})
