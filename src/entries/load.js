import plugins from '../plugins'

let _ENTRIES

const loadEntries = async () => {
  _ENTRIES = []
  const { sources, transforms } = plugins()
  const posts = []

  for (const source of sources) {
    posts.push(...source())
  }

  if (transforms.length) {
    for (const transform of transforms) {
      _ENTRIES.push(...posts.map(transform))
    }
  } else {
    _ENTRIES = posts
  }

  return _ENTRIES
}

export default loadEntries

export const byFileName = async (path) => {
  return _ENTRIES.filter(post => post.data._entry === path).pop()
}
