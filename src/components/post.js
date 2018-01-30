import React, { Component } from 'react'

import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import reactRenderer from 'rehype-react'
import raw from 'rehype-raw'
import select from 'unist-util-select'

import { byFileName } from '../entries/load'
import { getDisplayName } from './utils'

const extractExcerpt = (excerpt) => {
  if (!excerpt) {
    return
  }

  const selector = (typeof excerpt === 'string') ? excerpt : ':root > paragraph:first-child'

  return () => /* attacher */ (tree) => {
    /* transformer */
    tree.children = select(tree, selector)
    return tree
  }
}

const toReact = ({ content, excerpt, renderers, prefix = `entry-` }) => (
  unified()
    .use(markdown)
    .use(extractExcerpt(excerpt))
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(raw)
    .use(reactRenderer, {
      createElement: React.createElement,
      prefix,
      components: renderers
    })
    .processSync(content).contents
)

export const Content = (props) => {
  const { content, excerpt, renderers, data, prefix, ...componentProps } = props
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

export default (WrappedComponent) => {
  const displayName = getDisplayName(WrappedComponent)

  return class extends Component {
    static displayName = `WithPost(${displayName})`

    static async getInitialProps (...args) {
      const wrappedInitial = WrappedComponent.getInitialProps
      const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
      const [ { query = {} } ] = args
      const { _entry } = query
      const post = _entry ? await byFileName(_entry) : undefined

      return {
        ...wrapped,
        post
      }
    }

    render () {
      const { props } = this

      return <WrappedComponent {...props} />
    }
  }
}
