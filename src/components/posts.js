
/* global EventSource */

import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import { load, metadata, pathMap } from '../entries'
import endpoints from '../endpoints'

export { inCategory } from '../entries/filters'

export const sortByDate = (a, b) => {
  const aTime = new Date(a.data.date).getTime()
  const bTime = new Date(b.data.date).getTime()
  return bTime - aTime
}

async function filterPosts(metadata, filter, query) {
  const ids = filter
    ? metadata
      .map(data => ({ data }))
      .filter((...filterArgs) => filter(...filterArgs, query))
      .map(({ data: { __id } }) => __id)
    : undefined
  return (filter && !ids.length) ? [] : await load(ids)
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
        const [{ query }] = args       
 
        const posts = await filterPosts(_metadata, filter, query)

        return {
          ...wrapped,
          posts: Array.from(new Set([...posts, ...(wrapped.posts || [])].filter(Boolean))),
          __initialQuery: query,
          __pathMap: pathMap(),
          __metadata: _metadata
        }
      }

      componentDidMount () {
        if (process.env.NODE_ENV === 'development') {
          this.evtSource = new EventSource(endpoints.entriesHMR())
          const { __metadata, __initialQuery } = this.props
          this.evtSource.onmessage = async (event) => {
            if (event.data === '\uD83D\uDC93') {
              return
            }  
      
            const posts = await filterPosts(__metadata, filter, __initialQuery)

            this.setState({ posts })
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
