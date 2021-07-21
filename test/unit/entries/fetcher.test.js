
jest.mock('../../../src/entries/load')
jest.mock('../../../src/entries/metadata')

import { expect, test } from '@jest/globals'
import fetcher from '../../../src/entries/fetcher'
import { inCategory } from '../../../src/entries/filters'

import { load } from '../../../src/entries/load'
import { metadata } from '../../../src/entries/metadata'

describe('fetcher', () => {
  test('exports fetcher as default', () => {
    expect(fetcher).toBeDefined()
  })
})

describe('fetcher()', () => {
  beforeEach(() => {
    load.mockReset()
  })

  test('fetcher() returns object with static helpers', () => {
    const actual = fetcher()
    expect(actual).toHaveProperty('getData')
    expect(actual).toHaveProperty('getPosts')
    expect(actual).toHaveProperty('getPost')
  })

  test('getData() should return all entries metadata', async () => {
    const { getData } = fetcher()
    const expected = [{ __id: 1}, { __id: 2}]

    metadata.mockReturnValueOnce(expected)    

    const actual = await getData()
    expect(actual).toEqual(expected)
  })

  test('getPosts() should return all entries', async () => {
    const { getPosts } = fetcher()
    const expected = [{ data: { __id: 1}, content: ''}]

    metadata.mockReturnValueOnce(expected.map(({ data }) => data))
    load.mockReturnValueOnce(expected)

    const actual = await getPosts()
    expect(actual).toEqual(expected)
  })
})

describe('fetcher(filter)', () => {
  const expectedCategory = 'test'
  const filter = inCategory(expectedCategory)

  beforeEach(() => {
    load.mockReset()
  })

  test('fetcher(filter) returns object with static helpers', () => {
    const actual = fetcher(filter)
    expect(actual).toHaveProperty('getData')
    expect(actual).toHaveProperty('getPosts')
    expect(actual).toHaveProperty('getPost')
  })

  test('getData() should return all entries metadata by the given filter', async () => {
    const { getData } = fetcher(filter)
    const expected = [{ __id: 1, category: expectedCategory}]
    const meta = [...expected, , { __id: 2}]

    metadata.mockReturnValueOnce(meta)

    const actual = await getData()
    expect(actual).toEqual(expected)
  })

  test('getData() should return [] if no entries metadata match the given filter', async () => {
    const { getData } = fetcher(filter)
    const expected = []
    const meta = [...expected, , { __id: 2}]

    metadata.mockReturnValueOnce(meta)

    const actual = await getData()
    expect(actual).toEqual(expected)
  })

  test('getPosts() should return all entries by the given filter', async () => {
    const { getPosts } = fetcher(filter)
    const expected = [{ data: { __id: 1, category: expectedCategory }, content: ''}]
    const all = [...expected, { data: { __id: 2 }, content: ''}]

    metadata.mockReturnValueOnce(all.map(({ data }) => data))
    load.mockReturnValueOnce(expected)

    const actual = await getPosts()
    expect(actual).toEqual(expected)
  })

  test('getPosts() should return [] if no entries match the given filter', async () => {
    const { getPosts } = fetcher(filter)
    const expected = []
    const all = [...expected, { data: { __id: 2 }, content: ''}]

    metadata.mockReturnValueOnce(all.map(({ data }) => data))
    expect(load).not.toBeCalled()

    const actual = await getPosts()
    expect(actual).toEqual(expected)
  })
})
