
import fm from 'frontmatter'
import parser from './parser'
import removePosition from 'unist-util-remove-position'

function normalizeDate (value, { path }) {
  if (!value) return

  try {
    return new Date(value)
  } catch (e) {
    console.warn(`Invalid date in frontmatter at: ${path}`)
  }
}

function parseContent (text, options) {
  const instance = parser(options)
  // second text argument avoids positoin information being removed in rehype-raw
  return instance.runSync(instance.parse(text), text)
}

function createOptions (source, raw) {
  const { data: extra = {}, content: text } = fm(raw)
  if (extra.date) extra.date = normalizeDate(extra.date, source)

  return {
    meta: {
      ...source,
      extra: {
        ...source.extra,
        ...extra
      }
    },
    content: text,
    raw
  }
}

/**
 * indexer
 * @param {Object} options
 * @param {Array} options.remark plugins for remark
 * @param {Array} options.rehype plugins for rehype
 * @param {Object} buildOptions
 * @param {Object} action
 * @param {Function} action.create
 */
export async function indexer (options, { load, ...source }, { create }) {
  if (source.mimeType === 'text/markdown') {
    const raw = await load()
    create(createOptions(source, raw, options))
  }
}

/**
 * build
 * @param {Object} options
 * @param {Array} options.remark plugins for remark
 * @param {Array} options.rehype plugins for rehype
 */
export function build (options, posts) {
  return posts.map(post => {
    if (post.data.mimeType === 'text/markdown') {
      post.content = parseContent(post.content, options)
    }
    return post
  })
}

/**
 * cleanup
 * @param {Object} options
 * @param {Boolean} options.raw set to true to keep raw value in post object. Default to false.
 * @param {Boolean} options.position set to true to keep position information in content hast. Default to false.
 * @param {Array} posts
 */
export function cleanup ({ raw = false, position = false }, posts) {
  return posts.map(post => {
    if (post.data.mimeType === 'text/markdown') {
      if (!position) post.content = removePosition(post.content, true /* hard delete */)
      if (!raw) delete post.raw
    }
    return post
  })
}
