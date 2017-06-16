
import React, { Component } from 'react'

// import remark from 'remark'
// import reactRenderer from 'remark-react'
// import select from 'unist-util-select'

import loadEntries from '../load-entries'
// import Excerpt from './excerpt'

// const excerpt = (selector = 'paragraph:first-child') => (tree) => {
//   tree.children = select(tree, selector)
//   return tree
// }

// const toReact = ({ data, content }, idx) => {
//   return {
//     data,
//     content: remark()
//       .use(excerpt)
//       .use(reactRenderer, { prefix: `key-${idx}-` })
//       .processSync(content).contents
//   }
// }

export const inCategory = (category) => (m) => {
  return category ? (m.data.category == category) : true
}


export default (WrappedComponent) => {

  return class extends Component {
    static async getInitialProps(...args) {
      
      const wrappedInitial = WrappedComponent.getInitialProps 
      const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
      const posts = await loadEntries()

      return {
        ...wrapped,
        posts
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}