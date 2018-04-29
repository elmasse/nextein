jest.mock('../../../src/entries/load')
jest.mock('unified', () => {
  function mockedUnified () { return new impl() }
  mockedUnified.stringify = jest.fn()
  mockedUnified.runSync = jest.fn()
  mockedUnified.use = jest.fn(function () { return this })
  class impl {
    use = mockedUnified.use
    stringify = mockedUnified.stringify
    runSync = mockedUnified.runSync
  }

  return mockedUnified
})

import React from 'react'
import renderer from 'react-test-renderer'
import h from 'hastscript'

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

  test('withPosts composes getInitialProps non react statics', async () => {
    const wrappedProps = { value: 1 }
    const getInitialProps = jest.fn().mockReturnValueOnce(wrappedProps)
    const expected = { data: {}, content: `` }
    const expectedFileName = 'fake'
    
    byFileName.mockReturnValueOnce(expected)

    const Component = withPost(
      class Wrapped extends React.Component {
        static getInitialProps = getInitialProps
  
        render () {
          return (<div>Test</div>)
        }
      }
    )
      
    const actual = await Component.getInitialProps({query: {_entry: expectedFileName}})

    expect(actual.value).toBeDefined()
    expect(actual.value).toEqual(1)

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
    const expectedText = `lorem ipsum`
    const expectedContent = h('root', [ h('p', expectedText) ])

    unified.stringify.mockReturnValueOnce(<p>{expectedText}</p>)

    const comp = renderer.create(<Content content={expectedContent} />)

    expect(unified.runSync).toHaveBeenCalledWith(expectedContent)
    expect(unified.stringify).toHaveBeenCalled()

    expect(comp.toJSON()).toMatchSnapshot()
  })
})
