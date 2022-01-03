import { byDate } from '../../../src/entries/sorters'

describe('byDate', () => {
  test('exports byDate sorter function', () => {
    expect(byDate).toBeDefined()
  })

  test('sort posts by date', () => {
    const postOne = { data: { date: new Date('2021/01/15') }}
    const postTwo = { data: { date: new Date('2021/01/14') }}
    const postThree = { data: { date: new Date('2021/01/17') }}
    
    const data = [postOne, postTwo, postThree]
    const expected = [postThree, postOne, postTwo]

    const actual = [...data].sort(byDate)

    expect(actual).toEqual(expected)
  })

  test('sort metadata by date', () => {
    const dataOne = { date: new Date('2021/01/15') }
    const dataTwo = { date: new Date('2021/01/14') }
    const dataThree = { date: new Date('2021/01/17') }
    
    const data = [dataOne, dataTwo, dataThree]
    const expected = [dataThree, dataOne, dataTwo]

    const actual = [...data].sort(byDate)

    expect(actual).toEqual(expected)
  })
})

