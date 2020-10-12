
import { metadata, load } from './entries'

export async function createStaticPathsFilteredBy (filter) {
  const _meta = (await metadata()).map(data => ({ data }))
  const _filtered = filter ? _meta.filter(filter) : _meta

  return ({
    paths: _filtered
      .map(({ data }) => ({
        params: { ...data }
      })),
    fallback: false
  })
}

export async function createStaticPaths () {
  return createStaticPathsFilteredBy()
}

export async function createStaticProps ({ params }) {
  const _meta = await metadata()
  const [found] = _meta.filter(data => {
    for (const [k, v] of Object.entries(params)) {
      if (data[k] && data[k] === v) return true
    }
  })
  const [post] = found ? await load(found.__id) : [null]
  return ({
    props: {
      post
    }
  })
}
