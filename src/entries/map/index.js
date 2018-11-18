
import { entriesMapReducer } from './reducer'

let nextExportPathMap = {}

// entriesMap = entries => object
export default (entries = []) => {
  return {
    '/': { pathname: '/index' },
    ...entries.reduce(entriesMapReducer, {}),
    ...nextExportPathMap
  }
}

export const setNextExportPathMap = (exportPathMap) => {
  nextExportPathMap = JSON.parse(JSON.stringify(exportPathMap).replace(/:{"page"/ig, ':{"pathname"'))
}
