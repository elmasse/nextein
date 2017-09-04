import React, { Component } from 'react'

import unified from 'unified'
import remarkParse from 'remark-parse'
import reactRenderer from 'remark-react'
import select from 'unist-util-select'

import { byFileName } from '../entries/load'

const extractExcerpt = (selector = ':root > paragraph:first-child') => (tree) => {
  tree.children = select(tree, selector)
  return tree
}

const toReact = ({ content, excerpt, renderers, sanitize = true, prefix = `entry-` }) => (
  unified()
    .use(remarkParse)
    .use(excerpt && extractExcerpt)
    .use(reactRenderer, {
      prefix,
      remarkReactComponents: renderers,
      sanitize
    })
    .processSync(content).contents
)

export const Content = (props) => {
  const { content, excerpt, renderers, data, sanitize, prefix, ...componentProps } = props
  const cmp = toReact({ content, excerpt, renderers, sanitize, prefix })
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
  return class extends Component {
    static async getInitialProps (...args) {
      const wrappedInitial = WrappedComponent.getInitialProps
      const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
      const [ { query } ] = args
      const { _entry } = query
      const post = await byFileName(_entry)

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
