
import { metadata } from '../metadata'

let __devArgs = []

export async function pathMap () {
  if (process.env.___NEXTEIN_EXPORT_PATH_MAP) {
    return JSON.parse(process.env.___NEXTEIN_EXPORT_PATH_MAP)
  }
  return processPathMap(...__devArgs)
}

export async function processPathMap (exportPathMapFn, defaultPathMap, options) {
  __devArgs = [exportPathMapFn, defaultPathMap, options]
  const entries = await metadata()
  const map = entries
    .reduce((prev, { url, page, __id }) => {
      return page ? {
        ...prev,
        [url]: { page: `/${page}`, query: __id ? { __id } : undefined }
      } : prev
    }, {})

  // Get all used pages from entries
  const entriesPages = Array.from(new Set(entries.map(({ page }) => `/${page}`)))

  const nextExportPathMap = {
    ...(
      // Remove from defaultPathMap pages used for entries
      Object.keys(defaultPathMap)
        .filter(k => k !== '/index')
        .filter(k => !entriesPages.includes(defaultPathMap[k].page))
        .reduce((obj, key) => ({ ...obj, [key]: defaultPathMap[key] }), {})
    ),
    ...map
  }
  const exportPathMap = exportPathMapFn(nextExportPathMap, options)

  if (!options.dev) {
    process.env.___NEXTEIN_EXPORT_PATH_MAP = JSON.stringify(exportPathMap)
  }

  return exportPathMap
}
