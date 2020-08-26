
export function pathMap () {
  return JSON.parse(process.env.___NEXTEIN_EXPORT_PATH_MAP || '{}')
}

export function setNextExportPathMap (exportPathMap) {
  process.env.___NEXTEIN_EXPORT_PATH_MAP = JSON.stringify(exportPathMap)
}
