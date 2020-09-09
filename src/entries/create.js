
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

export function createId (path) {
  return createHash('md5').update(path).digest('hex')
}

/**
 * Create a new Entry Object.
 * @param {Object} rawEntry
 * @param {Object} rawEntry.meta
 * @param {String} rawEntry.meta.filePath absolute path to the entry.
 * @param {String} rawEntry.meta.mimeType file mimeType.
 * @param {String} rawEntry.meta.nane file name (without extension).
 * @param {String} rawEntry.meta.createdOn entry creation date
 * @param {String} rawEntry.meta.path entry path (relative to folder where it was read from). Optional.
 * @param {Object} rawEntry.meta.extra entry extra data. Usually from frontmatter content. It can override other meta options. Optional.
 * @param {String} rawEntry.raw entry raw content.
 * @param {Any} rawEntry.content entry processed content.
 */
export function createEntry ({ meta, raw, content }) {
  const data = {
    __id: createId(meta.filePath),
    mimeType: meta.mimeType,
    page: 'post',
    name: meta.name,
    category: meta.path || undefined,
    date: JSON.parse(meta.createdOn),
    ...meta.extra
  }

  return {
    data: {
      ...data,
      year: String(new Date(data.date).getFullYear()),
      month: String(new Date(data.date).getMonth() + 1).padStart(2, '0'),
      day: String(new Date(data.date).getDate()).padStart(2, '0'),
      url: formatUrl(data)
    },
    content,
    raw
  }
}
