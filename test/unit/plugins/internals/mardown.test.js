
import { indexer, build } from  '../../../../src//plugins/internals/markdown'

const content = [
  '',
  'Text.'    
].join('\n')

const raw = [
  '---',
  'page: PAGE',
  'title: TITLE',
  '---',
  '',
  'Text.'    
].join('\n')

async function load () {
  return raw
}

describe('mardown::indexer', () => {

  test('default options', async () => {
    const options = {}
    const source = {
      mimeType: 'text/markdown'
    }

    expect.assertions(3);

    await indexer(options, { load, ...source }, { 
      create: function (entry) {
        expect(entry).toHaveProperty('meta')
        expect(entry).toHaveProperty('content')
        expect(entry).toHaveProperty('raw')
      }
    })
  })
})


describe('mardown::build', () => {

  test('default options', async () => {
    const options = {}
    const post = {
      data: { mimeType: 'text/markdown' },
      content,
      raw
    }

    const result = await build(options, [post])
    expect(result).toMatchSnapshot()
  })
})
