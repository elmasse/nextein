jest.mock('../../../src/entries')
import React from 'react'

import { load, metadata } from '../../../src/entries/'
import withPosts, { withPostsFilterBy, inCategory } from '../../../src/components/posts'

describe('withPosts', () => {
  test('exports HOC withPosts as default', () => {
    expect(withPosts).toBeDefined()
  })

  test('withPosts displayName wraps Component diplayName', () => {
    const Component = withPosts(
      class Wrapped extends React.Component {
        static displayName = 'Wrapped'
      }
    )

    expect(Component.displayName).toEqual('WithPosts(Wrapped)')
  })

  test('withPosts hoists non react statics', () => {
    const Component = withPosts(
      class Wrapped extends React.Component {
        static value = 'value'
      }
    )

    expect(Component.value).toEqual('value')
  })

  test('withPosts should add `posts` property to getInitialProps', async () => {
    const expected = [{ data: {__id: 1}, content: `` }]
    const Component = withPosts(({ posts }) => (<div>There are {posts.length} posts</div>))

    load.mockReturnValueOnce(expected)
    metadata.mockReturnValueOnce(expected.map(({data}) => data))

    const actual = await Component.getInitialProps({})

    expect(actual.posts).toBeDefined()
    expect(actual.posts).toEqual(expect.arrayContaining(expected))
  })
})

test('withPosts composes getInitialProps non react statics', async () => {
  const wrappedProps = { value: 1 }
  const getInitialProps = jest.fn().mockReturnValueOnce(wrappedProps)
  const expected = [{ data: {}, content: `` }]
  
  load.mockReturnValueOnce(expected)
  metadata.mockReturnValueOnce(expected.map(({data}) => data))

  const Component = withPosts(
    class Wrapped extends React.Component {
      static getInitialProps = getInitialProps

      render () {
        const { posts } = this.props
        return ((<div>There are {posts.length} posts</div>))
      }
    }
  )
  const actual = await Component.getInitialProps({})

  expect(actual.value).toBeDefined()
  expect(actual.value).toEqual(1)
  expect(actual.posts).toBeDefined()
  expect(actual.posts).toEqual(expect.arrayContaining(expected))
})

describe('withPostsFilterBy', () => {
  test('exports HOC withPosts as default', () => {
    expect(withPostsFilterBy).toBeDefined()
  })

  test('withPostsFilterBy displayName wraps Component diplayName', () => {
    const Component = withPostsFilterBy(a => a)(
      class Wrapped extends React.Component {
        static displayName = 'Wrapped'
      }
    )

    expect(Component.displayName).toEqual('WithPostsFilterBy(Wrapped)')
  })

  test('withPostsFilterBy hoists non react statics', () => {
    const Component = withPostsFilterBy(a => a)(
      class Wrapped extends React.Component {
        static value = 'value'
      }
    )

    expect(Component.value).toEqual('value')
  })

  test('withPostsFilterBy should add `posts` property to getInitialProps', async () => {
    const expected = [{ data: { category: 'test'}, content: `` }]
    const all = [...expected, { data: { category: 'no-test'}, content: '' }]
    const Component = withPostsFilterBy(inCategory('test'))(({ posts }) => (<div>There are {posts.length} posts</div>))
    
    load.mockReturnValueOnce(all)
    metadata.mockReturnValueOnce(all.map(({data}) => data))

    const actual = await Component.getInitialProps({})

    expect(actual.posts).toBeDefined()
    expect(actual.posts).toEqual(expect.arrayContaining(expected))
  })
  
  test('withPostsFilterBy should add `posts` to exisiting posts if chained. ', async () => {
    const expectedOne = [{ data: { category: 'test-1'}, content: `` }] 
    const expectedTwo = [{ data: { category: 'test-2'}, content: `` }]
    const expected = [...expectedTwo, ...expectedOne]
    const all = [...expected, { data: { category: 'no-test'}, content: '' }]
    
    const Component = withPostsFilterBy(inCategory('test-1'))(
      withPostsFilterBy(inCategory('test-2'))(
        ({ posts }) => (<div>There are {posts.length} posts</div>)
      ))

    load.mockReturnValue(all)
    metadata.mockReturnValue(all.map(({data}) => data))

    const actual = await Component.getInitialProps({})

    expect(actual.posts).toBeDefined()
    expect(actual.posts).toEqual(expect.arrayContaining(expected))
  }) 

  test('withPostsFilterBy should add `posts` to exisiting posts if chained and they should be unique. ', async () => {
    const expectedOne = [{ data: { category: 'test-1', flag: true }, content: `` }]
    const expectedTwo = [{ data: { category: 'test-2', flag: true }, content: `` }]
    const expected = [...expectedTwo, ...expectedOne]
    const all = [...expected, { data: { category: 'no-test'}, content: '' }]

    const Component = withPostsFilterBy(post => post.data.flag)(
      withPostsFilterBy(inCategory('test-2'))(
        ({ posts }) => (<div>There are {posts.length} posts</div>)
      ))

    load.mockReturnValue(all)
    metadata.mockReturnValue(all.map(({data}) => data))

    const actual = await Component.getInitialProps({})

    expect(actual.posts).toBeDefined()
    expect(actual.posts).toEqual(expect.arrayContaining(expected))
  }) 
})

describe('inCategory', () => {
  test('exports inCategory filter function', () => {
    expect(inCategory).toBeDefined()
  })

  test('inCategory filters posts within the given category', async () => {
    const expectedCategory = 'test'
    const post = { data: { category: expectedCategory} }
    const data = [{ data: { category: 'foo'}, content: `` }, post]
    const expected = [post]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters posts within the given category/subcategory', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: `${expectedCategory}/sub`} }
    const data = [postOne, postTwo]
    const expected = [postOne]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters posts with includeSubCategories: true ', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: `${expectedCategory}/sub`} }
    const data = [{ data: { category: 'no-show'}, content: `` }, postOne, postTwo]
    const expected = [postOne, postTwo]

    const actual = data.filter(inCategory(expectedCategory, {includeSubCategories: true}))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})
