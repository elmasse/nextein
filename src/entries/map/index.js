
import { entriesMapReducer } from './reducer'

const getExportPathMap = () => {
  return JSON.parse(process.env.___NEXTEIN_EXPORT_PATH_MAP || '{}')
}

// entriesMap = entries => object
export default (entries = []) => {
  return {
    ...getExportPathMap(),
    ...entries.reduce(entriesMapReducer, {})
  }
}

export const setNextExportPathMap = (exportPathMap) => {
  process.env.___NEXTEIN_EXPORT_PATH_MAP = JSON.stringify(exportPathMap).replace(/:{"page"/ig, ':{"pathname"')
}
