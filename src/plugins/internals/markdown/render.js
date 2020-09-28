
import React from 'react'
import unified from 'unified'
import rehype from 'rehype-parse'
import stringify from 'rehype-stringify'
import reactRenderer from 'rehype-react'
import { select } from 'unist-util-select'

const extractExcerpt = (excerpt) => {
  const selector = (typeof excerpt === 'string') ? excerpt : ':root > element[tagName=p]'

  return () => /* attacher */ (tree) => {
    /* transformer */
    if (excerpt) {
      return select(selector, tree)
    }
    return tree
  }
}

export function render (_, { data, content, excerpt, renderers, components, prefix = 'entry-' }) {
  if (data.mimeType === 'text/markdown') {
    const hast = JSON.parse(JSON.stringify(content))
    const p = unified()
      .use(rehype)
      .use(extractExcerpt(excerpt))
      .use(stringify)
      .use(reactRenderer, {
        createElement: React.createElement,
        prefix,
        components: components || renderers
      })

    return p.stringify(p.runSync(hast))
  }
}
