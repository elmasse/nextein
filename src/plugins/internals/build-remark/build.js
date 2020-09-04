
import fm from 'frontmatter'
import parser from './parser'

function createOptions (source, raw, options) {
  const { data: extra = {}, content: text } = fm(raw)
  const instance = parser(options)
  const content = instance.runSync(instance.parse(text))

  return {
    meta: {
      ...source,
      extra
    },
    content,
    raw
  }
}

/**
 *
 * @param {Object} options
 * @param {Object} buildOptions
 * @param {Object} action
 * @param {Function} action.create
 */
export async function build (options, { load, ...source }, { create }) {
  if (source.mimeType === 'text/markdown') {
    const raw = await load()
    create(createOptions(source, raw, options))
  }
}
