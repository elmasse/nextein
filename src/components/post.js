import React, { Component } from 'react'

import remark from 'remark'
import reactRenderer from 'remark-react'
import select from 'unist-util-select'

import { byFileName } from '../load-entries'

const extractExcerpt = (selector = 'paragraph:first-child') => (tree) => {
  tree.children = select(tree, selector)
  return tree
}

const toReact = ({ data, content, excerpt }) => (
  remark()
    .use(excerpt && extractExcerpt)
    .use(reactRenderer, {prefix: `entry-`})
    .processSync(content).contents  
)

export const Content = ({ data, content, excerpt }) => {
  return (
    <div>
      { toReact({ data, content, excerpt }) }
    </div>
  )
}

export default (WrappedComponent) => {

  return class extends Component {
    static async getInitialProps({ query }) {
      //TODO check WrappedComponent getInitialProps
      const { _entry } = query
      const post = await byFileName(_entry)

      return {
        post
      }
    }

    render() {
      const { props } = this

      return <WrappedComponent {...props} />;
    }
  }
}