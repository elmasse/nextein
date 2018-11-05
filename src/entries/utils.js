export const jsonFileFromEntry = (entry) => {
  return entry.replace(/\//g, '--').replace('.md', '.json')
}
