/* global __NEXT_DATA__ */

export const jsonFileFromEntry = (entry, buildId = __NEXT_DATA__.buildId) => {
  return entry.replace(/\//g, '--').replace('.md', `--${buildId}.json`)
}
