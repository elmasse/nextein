import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import unified from 'unified'
import rehype from 'rehype-parse'
import stringify from 'rehype-stringify'
import reactRenderer from 'rehype-react'
import select from 'unist-util-select'

import loadEntries, { byFileName } from '../entries/load'
import entriesMap from '../entries/map'
import { getDisplayName } from './utils'

const extractExcerpt = (excerpt) => {
  const selector = (typeof excerpt === 'string') ? excerpt : ':root > element[tagName=p]:first-child'

  return () => /* attacher */ (tree) => {
    /* transformer */
    if (excerpt) {
      tree.children = select(tree, selector)
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

export const Content = (props) => {
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
        const _entries = await loadEntries()

        return {
          ...wrapped,
          post,
          _entries: _entries,
          _entriesMap: await entriesMap(_entries)
        }
      }

      render () {
        const { props } = this

        return <WrappedComponent {...props} />
      }
    },
    WrappedComponent, { 'getInitialProps': true })
}
