
import { createHash } from 'crypto'
import { compile } from 'path-to-regexp'

const DEFAULT_PERMALINK = '/:category?/:name'
const PERMALINK_CATEGORIES = ':category(.*)'

function formatUrl (data) {
  const { page, date, permalink = DEFAULT_PERMALINK } = data
  const toUrl = compile(permalink.replace(':category', PERMALINK_CATEGORIES))
  const url = toUrl({ ...data, date: date.replace(/T.*Z/, '') }, { encode: v => encodeURI(v) })

  return page ? url : undefined
}

/**
 *
 * @param {Object} rawEntry
 */
export function createEntry ({ meta, raw, content }) {
  const data = {
    __id: createHash('md5').update(meta.filePath).digest('hex'),
    page: 'post',
    name: meta.name,
    category: meta.path || undefined,
    date: JSON.stringify(meta.created),
    ...meta.extra
  }

  return {
    data: {
      ...data,
      year: new Date(data.created).getFullYear(),
      month: new Date(data.created).getMonth() + 1,
      url: formatUrl(data)
    },
    content,
    raw
  }
}
