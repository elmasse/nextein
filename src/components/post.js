import React, { Component } from 'react'

import unified from 'unified'
import markdown from 'remark-parse'
import remark2rehype from 'remark-rehype'
import reactRenderer from 'rehype-react'
import raw from 'rehype-raw'
import select from 'unist-util-select'

import { byFileName } from '../entries/load'

const extractExcerpt = (selector = ':root > paragraph:first-child') => (tree) => {
  tree.children = select(tree, selector)
  return tree
}

const toReact = ({ content, excerpt, renderers, prefix = `entry-` }) => (
  unified()
    .use(markdown)
    .use(remark2rehype, { allowDangerousHTML: true })
    .use(raw)
    .use(excerpt && extractExcerpt)
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
