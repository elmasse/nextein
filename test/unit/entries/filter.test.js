
import { inCategory, inCategories } from '../../../src/entries/filters'

describe('inCategory', () => {
  test('exports inCategory filter function', () => {
    expect(inCategory).toBeDefined()
  })

  test('inCategory filters posts by the given category', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: 'foo'} }
    const postThree = { data: { category: `${expectedCategory}ish`} }
    const data = [postOne, postTwo, postThree]
    const expected = [postOne]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters metadata by the given category', async () => {
    const expectedCategory = 'test'
    const dataOne = { category: expectedCategory}
    const dataTwo = { category: 'foo'}
    const dataThree = { category: `${expectedCategory}ish`}
    const data = [dataOne, dataTwo, dataThree]
    const expected = [dataOne]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters posts within the given category', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: `${expectedCategory}/sub`} }
    const postThree = { data: { category: `${expectedCategory}ish`} }
    const data = [postOne, postTwo, postThree]
    const expected = [postOne]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters metadata within the given category', async () => {
    const expectedCategory = 'test'
    const dataOne = { category: expectedCategory}
    const dataTwo = { category: `${expectedCategory}/sub`}
    const dataThree = { category: `${expectedCategory}ish`}
    const data = [dataOne, dataTwo, dataThree]
    const expected = [dataOne]

    const actual = data.filter(inCategory(expectedCategory))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters posts with includeSubCategories: true ', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: `${expectedCategory}/sub`} }
    const postThree = { data: { category: `${expectedCategory}ish`} }
    const postFour = { data: { category: 'no-show'} }
    const data = [postOne, postTwo, postThree, postFour]
    const expected = [postOne, postTwo]

    const actual = data.filter(inCategory(expectedCategory, {includeSubCategories: true}))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters metadata with includeSubCategories: true ', async () => {
    const expectedCategory = 'test'
    const dataOne = { category: expectedCategory}
    const dataTwo = { category: `${expectedCategory}/sub`}
    const dataThree = { category: `${expectedCategory}ish`}
    const dataFour = { category: 'no-show'}
    const data = [dataOne, dataTwo, dataThree, dataFour]
    const expected = [dataOne, dataTwo]

    const actual = data.filter(inCategory(expectedCategory, {includeSubCategories: true}))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters posts with using *', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: `${expectedCategory}/sub`} }
    const postThree = { data: { category: `${expectedCategory}ish`} }
    const postFour = { data: { category: 'no-show'} }
    const data = [postOne, postTwo, postThree, postFour]
    const expected = [postOne, postTwo]

    const actual = data.filter(inCategory(`${expectedCategory}/*`))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategory filters metadata with using *', async () => {
    const expectedCategory = 'test'
    const dataOne = { category: expectedCategory}
    const dataTwo = { category: `${expectedCategory}/sub`}
    const dataThree = { category: `${expectedCategory}ish`}
    const dataFour = { category: 'no-show'}
    const data = [dataOne, dataTwo, dataThree, dataFour]
    const expected = [dataOne, dataTwo]

    const actual = data.filter(inCategory(`${expectedCategory}/*`))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})

describe('inCategories', () => {
  test('exports inCategory filter function', () => {
    expect(inCategories).toBeDefined()
  })

  test('inCategories filters posts by the given category', async () => {
    const expectedCategory = 'test'
    const postOne = { data: { category: expectedCategory} }
    const postTwo = { data: { category: 'foo'} }
    const postThree = { data: { category: `${expectedCategory}ish`} }
    const data = [postOne, postTwo, postThree]
    const expected = [postOne]

    const actual = data.filter(inCategories([expectedCategory]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategories filters metadata by the given category', async () => {
    const expectedCategory = 'test'
    const dataOne = { category: expectedCategory}
    const dataTwo = { category: 'foo'}
    const dataThree = { category: `${expectedCategory}ish`}
    const data = [dataOne, dataTwo, dataThree]
    const expected = [dataOne]

    const actual = data.filter(inCategories([expectedCategory]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategories filters posts within the given categories', async () => {
    const expectedCategoryOne = 'test1'
    const expectedCategoryTwo = 'test2'
    const postOne = { data: { category: expectedCategoryOne} }
    const postTwo = { data: { category: expectedCategoryTwo } }
    const postThree = { data: { category: `${expectedCategoryOne}ish`} }
    const data = [postOne, postTwo, postThree]
    const expected = [postOne, postTwo]

    const actual = data.filter(inCategories([expectedCategoryOne, expectedCategoryTwo]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategories filters metadata within the given categories', async () => {
    const expectedCategoryOne = 'test1'
    const expectedCategoryTwo = 'test2'
    const dataOne = { category: expectedCategoryOne}
    const dataTwo = { category: expectedCategoryTwo }
    const dataThree = { category: `${expectedCategoryOne}ish`}
    const data = [dataOne, dataTwo, dataThree]
    const expected = [dataOne, dataTwo]

    const actual = data.filter(inCategories([expectedCategoryOne, expectedCategoryTwo]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategories filters posts with using *', async () => {
    const expectedCategoryOne = 'test1'
    const expectedCategoryTwo = 'test2'
    const postOne = { data: { category: expectedCategoryOne} }
    const postTwo = { data: { category: expectedCategoryTwo } }
    const postThree = { data: { category: `${expectedCategoryOne}/sub`} }
    const postFour = { data: { category: `${expectedCategoryOne}ish`} }
    const postFive = { data: { category: `${expectedCategoryTwo}/sub`} }
    const data = [postOne, postTwo, postThree, postFour, postFive]
    const expected = [postOne, postTwo, postThree]

    const actual = data.filter(inCategories([`${expectedCategoryOne}/*`, expectedCategoryTwo]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })

  test('inCategories filters metadata with using *', async () => {
    const expectedCategoryOne = 'test1'
    const expectedCategoryTwo = 'test2'
    const dataOne = { category: expectedCategoryOne}
    const dataTwo = { category: expectedCategoryTwo }
    const dataThree = { category: `${expectedCategoryOne}/sub`}
    const dataFour = { category: `${expectedCategoryOne}ish`}
    const dataFive = { category: `${expectedCategoryTwo}/sub`}
    const data = [dataOne, dataTwo, dataThree, dataFour, dataFive]
    const expected = [dataOne, dataTwo, dataThree]

    const actual = data.filter(inCategories([`${expectedCategoryOne}/*`, expectedCategoryTwo]))

    expect(actual).toEqual(expect.arrayContaining(expected))
  })
})
