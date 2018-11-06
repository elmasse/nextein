
import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'

import loadEntries, { byEntriesList } from '../entries/load'
import entriesMap from '../entries/map'
import { getDisplayName } from './utils'

export const entries = loadEntries

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
          posts,
          _entries: _entries,
          _entriesMap: entriesMap(_entries)
        }
      }

      render () {
        return <WrappedComponent {...this.props} />
      }
    },
    WrappedComponent, { 'getInitialProps': true })
}

const withPosts = withPostsFilterBy()

export default withPosts
