jest.mock('../../../src/entries/load')
jest.mock('unified', () => {
  function mockedUnified () { return new impl() }
  mockedUnified.processSync = jest.fn()
  mockedUnified.use = jest.fn(function () { return this })
  class impl {
    use = mockedUnified.use
    processSync = mockedUnified.processSync
  }

  return mockedUnified
})

import React from 'react'
import renderer from 'react-test-renderer'

import unified from 'unified'
import { byFileName } from '../../../src/entries/load'
import withPost, { Content } from '../../../src/components/post'

describe('withPost', () => {
  test('exports HOC withPost as default', () => {
    expect(withPost).toBeDefined()
  })

  test('withPost displayName wraps Component diplayName', () => {
    const Component = withPost(
      class Wrapped extends React.Component {
        static displayName = 'Wrapped'
      }
    )

    expect(Component.displayName).toEqual('WithPost(Wrapped)')
  })

  test('withPost hoist non react statics', () => {
    const Component = withPost(
      class Wrapped extends React.Component {
        static value = 'value'
      }
    )

    expect(Component.value).toEqual('value')
  })

  test('withPosts should add `post` property to getInitialProps', async () => {
    const expected = { data: {}, content: `` }
    const expectedFileName = 'fake'
    const Component = withPost(({ post }) => (<div>Test</div>))

    byFileName.mockReturnValueOnce(expected)
    const actual = await Component.getInitialProps({query: {_entry: expectedFileName}})

    expect(actual.post).toBeDefined()
    expect(actual.post).toEqual(expect.objectContaining(expected))
    expect(byFileName).toHaveBeenCalledWith(expectedFileName)
  })
})

describe('Content', () => {
  test('exports Content', () => {
    expect(Content).toBeDefined()
  })

  test('Content component should render post content', () => {
    const expectedContent = `lorem ipsum`

    unified.processSync.mockReturnValueOnce({contents: (<p>{expectedContent}</p>) })

    const comp = renderer.create(<Content content={expectedContent} />)

    expect(unified.processSync).toHaveBeenCalledWith(expectedContent)
    expect(comp.toJSON()).toMatchSnapshot()
  })
})
