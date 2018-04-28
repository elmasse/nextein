import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import unified from 'unified'
import rehype from 'rehype-parse'
import stringify from 'rehype-stringify'
import reactRenderer from 'rehype-react'
import select from 'unist-util-select'

import { byFileName } from '../entries/load'
import { getDisplayName } from './utils'

const extractExcerpt = (excerpt) => {
  if (!excerpt) {
    return
  }

  const selector = (typeof excerpt === 'string') ? excerpt : ':root > p:first-child'

  return () => /* attacher */ (tree) => {
    /* transformer */
    tree.children = select(tree, selector)
    return tree
  }
}

const toReact = ({ content, excerpt, renderers, prefix = `entry-` }) => {
  const p = unified()
    .use(rehype)
    .use(extractExcerpt(excerpt))
    .use(stringify)
    .use(reactRenderer, {
      createElement: React.createElement,
      prefix,
      components: renderers
    })

  return p.stringify(content)
}

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

  return hoistNonReactStatics(
    class extends Component {
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
    },
    WrappedComponent, { 'getInitialProps': true })
}
