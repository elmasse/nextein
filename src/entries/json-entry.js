/* global __NEXT_DATA__ */

export const jsonFileFromEntry = (entry, buildId = __NEXT_DATA__.buildId) => {
  return entry.replace(/\//g, '--').replace('.md', `--${buildId}.json`)
}

export const jsonFileEntriesMap = (buildId = __NEXT_DATA__.buildId) => {
  return `entries--map--${buildId}.json`
}

export const jsonFileEntries = (buildId = __NEXT_DATA__.buildId) => {
  return `entries--${buildId}.json`
}
