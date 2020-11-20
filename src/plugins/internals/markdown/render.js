
import React from 'react'
import unified from 'unified'
import rehype from 'rehype-parse'
import stringify from 'rehype-stringify'
import reactRenderer from 'rehype-react'
import { select } from 'unist-util-select'

const DEFAULT_EXCERPT = ':root > element[tagName=p]'

const extractExcerpt = (options) => (excerpt) => {
  const selector = (typeof excerpt === 'string') ? excerpt : (options.excerpt || DEFAULT_EXCERPT)
  return () => /* attacher */ (tree) => {
    /* transformer */
    if (excerpt) {
      return select(selector, tree)
    }
    return tree
  }
}

/**
 * render
 * @param {Object} options
 * @param {String} options.excerpt Default excerpt selector to be used in Content when excerpt is set to true.
 * It must be a valid `unist-util-select` selector. Default to ':root > element[tagName=p]' (first paragraph).
 * @param {Object} contentConfig
 */
export function render (options, { data, content, excerpt, renderers, components, prefix = 'entry-' }) {
  if (data.mimeType === 'text/markdown') {
    const hast = JSON.parse(JSON.stringify(content))
    const p = unified()
      .use(rehype)
      .use(extractExcerpt(options)(excerpt))
      .use(stringify)
      .use(reactRenderer, {
        createElement: React.createElement,
        prefix,
        components: components || renderers
      })

    return p.stringify(p.runSync(hast))
  }
}
