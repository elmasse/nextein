
import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import loadEntries, { byEntriesList } from '../entries/load'
import entriesMap from '../entries/map'
export const entries = loadEntries

export const inCategory = (category, { includeSubCategories = false } = {}) => (post) => {
  const { data } = post
  const { category: postCategory = '' } = data
  const result = includeSubCategories ? postCategory.startsWith(category) : postCategory === category

  return result
}

export const sortByDate = (a, b) => {
  const aTime = new Date(a.data.date).getTime()
  const bTime = new Date(b.data.date).getTime()
  return bTime - aTime
}

export const withPostsFilterBy = (filter) => (WrappedComponent) => {
  const displayName = getDisplayName(WrappedComponent)
  const postfix = filter ? 'FilterBy' : ''

  return hoistNonReactStatics(
    class extends Component {
      static displayName = `WithPosts${postfix}(${displayName})`

      static async getInitialProps (...args) {
        const wrappedInitial = WrappedComponent.getInitialProps
        const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
        const _entries = await loadEntries()
        const posts = await byEntriesList(filter ? _entries.filter(filter) : _entries)

        return {
          ...wrapped,
          posts: Array.from(new Set([...posts, ...(wrapped.posts || [])].filter(Boolean))),
          // _entries: _entries,
          _entriesMap: await entriesMap(_entries)
        }
      }

      render () {
        return <WrappedComponent {...this.props} />
      }
    },
    WrappedComponent, { getInitialProps: true })
}

const withPosts = withPostsFilterBy()

export default withPosts
