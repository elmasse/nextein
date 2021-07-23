
import { createEntry, createId } from '../../../src/entries/create'

describe('createEntry', () => {
  const filePath = '/path/to/file'
  const createdOn = '2020-02-02T20:20:20Z'
  const meta = {
    filePath,
    name: 'file',
    mimeType: 'mime/type',
    createdOn: JSON.stringify(createdOn)
  }
  const content =  ''
  const raw = ''
  const expectedDataDefault = {
    __id: createId(filePath),
    mimeType: meta.mimeType,
    page: 'post',
    name: meta.name,      
    date: JSON.parse(meta.createdOn),
    day: '02',
    month: '02',
    year: '2020',
    category: undefined,
    url: `/${meta.name}`
  }

  test('create default', () => {
    const evaluated = { meta, content, raw }
    const expectedData = {
      ...expectedDataDefault
    }
    const result = createEntry(evaluated)

    expect(result).toEqual({ data: expectedData, content, raw })
  })

  test('create with date in extra', () => {
    const date = new Date('2010-10-10T20:20:00Z')
    const evaluated = { meta: { ...meta, extra: { date } }, content, raw }
    const expectedData = {
      ...expectedDataDefault,
      date,
      day: '10',
      month: '10',
      year: '2010',
    }
    const result = createEntry(evaluated)

    expect(result).toEqual({ data: expectedData, content, raw })
  })

  test('create with page: "page" in extra', () => {
    const page = 'page'
    const evaluated = { meta: { ...meta, extra: { page } }, content, raw }
    const expectedData = {
      ...expectedDataDefault,
      page
    }
    const result = createEntry(evaluated)

    expect(result).toEqual({ data: expectedData, content, raw })
  })  
})
