
/* global EventSource */

import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import { load, metadata, pathMap } from '../entries'
import endpoints from '../endpoints'

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
        const _metadata = await metadata()
        const ids = filter
          ? _metadata
            .map(data => ({ data }))
            .filter(filter)
            .map(({ data: { __id } }) => __id)
          : undefined
        const posts = await load(ids)

        return {
          ...wrapped,
          filter,
          posts: Array.from(new Set([...posts, ...(wrapped.posts || [])].filter(Boolean))),
          __pathMap: pathMap(),
          __metadata: _metadata
        }
      }

      componentDidMount () {
        if (typeof window !== 'undefined') {
          this.evtSource = new EventSource(endpoints.entriesHMR())
          const { filter, __metadata } = this.props
          this.evtSource.onmessage = async (evnt) => {
            const ids = filter
              ? __metadata
                .map(data => ({ data }))
                .filter(filter)
                .map(({ data: { __id } }) => __id)
              : undefined

            this.setState({ posts: await load(ids) })
          }
        }
      }

      componentWillUnmount () {
        if (this.evtSource) {
          this.evtSource.close()
        }
      }

      render () {
        return <WrappedComponent {...this.props} {...this.state} />
      }
    },
    WrappedComponent, { getInitialProps: true })
}

const withPosts = withPostsFilterBy()

export default withPosts
