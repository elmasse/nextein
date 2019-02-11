
import { entriesMapReducer } from './reducer'

const getExportPathMap = () => {
  return JSON.parse(process.env.___NEXTEIN_EXPORT_PATH_MAP || "{}")
}

// entriesMap = entries => object
export default (entries = []) => {
  return {
    '/': { pathname: '/index' },
    ...entries.reduce(entriesMapReducer, {}),
    ...getExportPathMap()
  }
}

export const setNextExportPathMap = (exportPathMap) => {
  process.env.___NEXTEIN_EXPORT_PATH_MAP = JSON.stringify(exportPathMap).replace(/:{"page"/ig, ':{"pathname"')
}
