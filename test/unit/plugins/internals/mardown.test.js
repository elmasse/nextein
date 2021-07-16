
import { build } from  '../../../../src//plugins/internals/markdown'

async function load () {
  return [
    '---',
    'page: PAGE',
    'title: TITLE',
    '---',
    '',
    'Text.'    
  ].join('\n')
}

describe('mardown::build', () => {

  test('default options', async () => {
    const options = {}
    const source = {
      mimeType: 'text/markdown'
    }

    expect.assertions(4);

    await build(options, { load, ...source }, { 
      create: function (entry) {
        expect(entry).toHaveProperty('meta')
        expect(entry).toHaveProperty('content')
        expect(entry).toHaveProperty('content.position')
        expect(entry).toHaveProperty('raw')
      }
    })
  })
})
