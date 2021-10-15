
import { createHash } from 'crypto'
import { compile } from 'path-to-regexp'

const DEFAULT_PERMALINK = '/:category?/:name'
const PERMALINK_CATEGORIES = ':category(.*)'

export function formatUrl (data) {
  const { date, permalink = DEFAULT_PERMALINK } = data
  const toUrl = compile(permalink.replace(':category', PERMALINK_CATEGORIES))
  return toUrl({ ...data, date: JSON.stringify(date).replace(/T.*Z/, '') }, { encode: v => encodeURI(v) })
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
 * @param {String} rawEntry.meta.createdOn entry creation date. Optional.
 * @param {String} rawEntry.meta.path entry path (relative to folder where it was read from). Optional.
 * @param {Object} rawEntry.meta.extra entry extra data. Usually from frontmatter content. It can override other meta options. Optional.
 * @param {String} rawEntry.raw entry raw content.
 * @param {Any} rawEntry.content entry processed content.
 */
export function createEntry ({ meta, raw, content }) {
  const { filePath, mimeType, name, path, createdOn, date, extra } = meta
  const data = {
    __id: createId(filePath),
    mimeType,
    page: 'post',
    name,
    category: path || undefined,
    date: date || JSON.parse(createdOn || JSON.stringify(new Date())),
    ...extra
  }

  return {
    data: {
      ...data,
      year: String(new Date(data.date).getFullYear()),
      month: String(new Date(data.date).getMonth() + 1).padStart(2, '0'),
      day: String(new Date(data.date).getDate()).padStart(2, '0'),
      url: data.page ? formatUrl(data) : undefined
    },
    content,
    raw
  }
}
