
import { metadata } from './metadata'
import { load } from './load'

export { formatUrl } from './create'

export default function fetcher (filter) {
  return {
    getData: async () => getDataFilterBy(filter),
    getPosts: async () => getPostsFilterBy(filter),
    getPost
  }
}

async function dataFilterBy (filter) {
  const _meta = (await metadata()).map(data => ({ data }))
  const _filtered = filter ? _meta.filter(filter) : _meta
  return _filtered.map(({ data }) => data)
}

export async function getDataFilterBy (filter) {
  return dataFilterBy(filter)
}

export async function getData () {
  return getDataFilterBy()
}

export async function getPostsFilterBy (filter) {
  const _filtered = await dataFilterBy(filter)
  const ids = _filtered.map(data => data.__id)
  return (filter && !ids.length) ? [] : load(ids)
}

export async function getPosts () {
  return getPostsFilterBy()
}

export async function getPost (params) {
  const _meta = await metadata()

  const entry = params && _meta.find(data => {
    // first check by __id
    if (params.__id && params.__id === data.__id) return true
    
    for (const [k, v] of Object.entries(params)) {
      if (!data[k] || (
        Array.isArray(v) ?
          (!Array.isArray(data[k]) ? !v.includes(data[k]) : v.some(value => !data[k].includes(value)))
        : data[k] !== v))
        return false
    }
    return true
  })

  const [found] = entry ? await load(entry.__id) : [null]

  return found
}
