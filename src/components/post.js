import React, { Component } from 'react'

import remark from 'remark'
import reactRenderer from 'remark-react'
import select from 'unist-util-select'

import { byFileName } from '../load-entries'

const extractExcerpt = (selector = 'paragraph:first-child') => (tree) => {
  tree.children = select(tree, selector)
  return tree
}

const toReact = ({ content, excerpt, renderers }) => (
  remark()
    .use(excerpt && extractExcerpt)
    .use(reactRenderer, {
      prefix: `entry-`,
      remarkReactComponents: renderers
    })
    .processSync(content).contents
)

export const Content = (props) => {
  const { content, excerpt, renderers, data, ...componentProps } = props
  const cmp = toReact({ content, excerpt, renderers })
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
