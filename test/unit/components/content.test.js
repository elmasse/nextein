import ContentDefault, { Content } from '../../../src/components/content'

describe('Content', () => {
  test('exports Content as default Component', () => {
    expect(ContentDefault).toBeDefined()
  })

  test('named exports Content as Component', () => {
    expect(Content).toBeDefined()
  })
})
