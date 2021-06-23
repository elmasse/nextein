
import { readFile } from 'fs/promises'
import { resolve } from 'path'

import { build } from  '../../../../src//plugins/internals/markdown'

async function loadOne () {
  return readFile(resolve(__dirname, './mardown-test-post.md'), { encoding: 'utf8' })
}

describe('mardown::build', () => {

  test('default options', async () => {
    const options = {}
    const source = {
      mimeType: 'text/markdown'
    }

    expect.assertions(4);

    await build(options, { load: loadOne, ...source }, { 
      create: function (entry) {
        expect(entry).toHaveProperty('meta')
        expect(entry).toHaveProperty('content')
        expect(entry).toHaveProperty('content.position')
        expect(entry).toHaveProperty('raw')
      }
    })
  })
})
