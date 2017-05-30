import React, { Component } from 'react'
import remark from 'remark'
import reactRenderer from 'remark-react'
import select from 'unist-util-select'

import Excerpt from './excerpt'

const isServer = typeof window === 'undefined'
const loadPosts = isServer ?
  require('../load-entries') :
  require('../load-entries-client')


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
  return category && m.data.category == category
}

const load = ({ category }) => {
  return loadPosts()
    .filter(inCategory(category))
    .map(toReact)
}



export default class Posts extends Component {

  constructor(props) {
    super(props);
    const { category } = props

    this.state = {
      posts: []
    }
  }

  componentWillMount() {
    const { category } = this.props
    this.setState({ posts: load({ category }) })
  }

  render() {
    const { category } = this.props
    const { posts } = this.state

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

}