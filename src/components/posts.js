
import React, { Component } from 'react'

import loadEntries from '../load-entries'

export const inCategory = (category, { includeSubCategories = false } = {}) => (post) => {
  const { data } = post
  const { category: postCategory = '' } = data
  const result = !includeSubCategories ? postCategory === category : postCategory.startsWith(category)

  return category ? result : true
}

export const sortByDate = (a, b) => {
  const aTime = new Date(a.data.date).getTime()
  const bTime = new Date(b.data.date).getTime()
  return bTime - aTime
}

export default (WrappedComponent) => {
  return class extends Component {
    static async getInitialProps (...args) {
      const wrappedInitial = WrappedComponent.getInitialProps
      const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
      const posts = await loadEntries()

      return {
        ...wrapped,
        posts
      }
    }

    render () {
      return <WrappedComponent {...this.props} />
    }
  }
}
