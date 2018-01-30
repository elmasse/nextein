jest.mock('../../../src/entries/load')
import React from 'react'

import loadEntries from '../../../src/entries/load'
import withPosts, { withPostsFilterBy, inCategory, entries } from '../../../src/components/posts'

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
    const expected = [{ data: {}, content: `` }]
    const Component = withPosts(({ posts }) => (<div>There are {posts.length} posts</div>))

    loadEntries.mockReturnValueOnce(expected)
    const actual = await Component.getInitialProps()

    expect(actual.posts).toBeDefined()
    expect(actual.posts).toEqual(expect.arrayContaining(expected))
  })
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

describe('entries', () => {
  test('exports entries function', () => {
    expect(entries).toBeDefined()
  })
})
