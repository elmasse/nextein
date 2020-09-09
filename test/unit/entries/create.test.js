
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

  test('create default', () => {
    const evaluated = { meta, content, raw }
    const expectedData = {
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
    const result = createEntry(evaluated)

    expect(result).toEqual({ data: expectedData, content, raw })

  })
})
