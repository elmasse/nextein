import plugins from '../plugins'

let _ENTRIES

const loadEntries = async () => {
  _ENTRIES = []
  const { sources, transforms = [] } = plugins()
  let posts = []

  for (const source of sources) {
    posts.push(...await source())
  }

  for (const transform of transforms) {
    posts = await transform(posts)
  }

  _ENTRIES = posts

  return _ENTRIES
}

export default loadEntries

export const byFileName = async (path) => {
  return _ENTRIES.filter(post => post.data._entry === path).pop()
}
