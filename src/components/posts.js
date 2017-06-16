
import React, { Component } from 'react'
import remark from 'remark'
import reactRenderer from 'remark-react'
import select from 'unist-util-select'

import loadEntries from '../load-entries'
import Excerpt from './excerpt'

const excerpt = (selector = 'paragraph:first-child') => (tree) => {
  tree.children = select(tree, selector)
  return tree
}

const toReact = ({ data, content }, idx) => {
  return {
    data,
    content: remark()
      .use(excerpt)
      .use(reactRenderer, { prefix: `key-${idx}-` })
      .processSync(content).contents
  }
}

const inCategory = (category) => (m) => {
  return category ? (m.data.category == category) : true
}

const load = ({ entries, category }) => {
  return entries
    .filter(inCategory(category))
    .map(toReact)
}

export const Entries = ({ category, entries }) => {
  const posts = load({ category, entries })

  return (
    <div>
      <div style={{ padding: 5, fontSize: 12, fontWeight: 100 }}>
        {posts.length} {posts.length == 1 ? 'entry' : 'entries'} found in category: <strong>{category}</strong>
        {
          posts.map((post, index) => <Excerpt key={`post-${index}`} {...post} />)
        }
      </div>
    </div>
  )
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
      // const { entries } = this.state
      return <WrappedComponent {...this.props} />;
    }
  }
}