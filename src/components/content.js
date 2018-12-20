import React, { Component } from 'react'
import unified from 'unified'
import rehype from 'rehype-parse'
import stringify from 'rehype-stringify'
import reactRenderer from 'rehype-react'
import { select } from 'unist-util-select'

const extractExcerpt = (excerpt) => {
  const selector = (typeof excerpt === 'string') ? excerpt : ':root > element[tagName=p]:first-child'

  return () => /* attacher */ (tree) => {
    /* transformer */
    if (excerpt) {
      return select(selector, tree)
    }
    return tree
  }
}

const toReact = ({ content, excerpt, renderers, prefix = `entry-` }) => {
  const hast = JSON.parse(JSON.stringify(content))
  const p = unified()
    .use(rehype)
    .use(extractExcerpt(excerpt))
    .use(stringify)
    .use(reactRenderer, {
      createElement: React.createElement,
      prefix,
      components: renderers
    })

  return p.stringify(p.runSync(hast))
}

export default class Content extends Component {
  render (props) {
    const { content, excerpt, renderers, data, prefix, raw, ...componentProps } = props
    const cmp = toReact({ content, excerpt, renderers, prefix })
    const { props: cmpProps } = cmp

    return {
      ...cmp,
      props: {
        ...cmpProps,
        ...componentProps
      }
    }
  }
}
