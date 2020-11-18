
/* global EventSource */

import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import { load, metadata } from '../entries'
import { resetFetchCache } from '../entries/cache'
import endpoints from '../endpoints'

export { inCategory } from '../entries/filters'

export const sortByDate = (a, b) => {
  const aTime = new Date(a.data.date).getTime()
  const bTime = new Date(b.data.date).getTime()
  return bTime - aTime
}

async function filterPosts (metadata, filter, query) {
  const ids = filter
    ? metadata
      .map(data => ({ data }))
      .filter((...filterArgs) => filter(...filterArgs, query))
      .map(({ data: { __id } }) => __id)
    : undefined
  return (filter && !ids.length) ? [] : load(ids)
}

function samePosts (posts = [], prev = []) {
  const postsIds = posts.map(p => p.data.__id)
  const prevIds = prev.map(p => p.data.__id)
  return postsIds.every(id => prevIds.includes(id))
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

        const { __id } = query
        const [post] = __id ? await load(__id) : []

        return {
          ...wrapped,
          posts: Array.from(new Set([...posts, ...(wrapped.posts || [])].filter(Boolean))),
          post,
          __id,
          __initialQuery: query
        }
      }

      static getDerivedStateFromProps (props, state) {
        if (!samePosts(props.posts, state.posts)) {
          return {
            posts: props.posts
          }
        }

        if (props.post && (!state.post || props.post.data.__id !== state.post.data.__id)) {
          return {
            post: props.post
          }
        }

        return null
      }

      state = {}

      listenToEventSource () {
        if (process.env.NODE_ENV === 'development') {
          if (this.evtSource) {
            this.evtSource.close()
          }

          this.evtSource = new EventSource(endpoints.entriesHMR())
          const { __initialQuery, __id } = this.props

          this.evtSource.onmessage = async (event) => {
            if (event.data === '\uD83D\uDC93') {
              return
            }
            const currentIds = this.props.posts.map(p => p.data.__id)
            const updated = JSON.parse(event.data)

            if (currentIds.includes(updated) || updated === __id) {
              resetFetchCache()
              const _metadata = await metadata()
              const posts = await filterPosts(_metadata, filter, __initialQuery)
              const [post] = __id ? await load(__id) : []

              this.setState({
                posts,
                post
              })
            }
          }
        }
      }

      componentDidMount () {
        this.listenToEventSource()
      }

      componentDidUpdate () {
        this.listenToEventSource()
      }

      componentWillUnmount () {
        if (this.evtSource) {
          this.evtSource.close()
        }
      }

      render () {
        const { posts, post } = this.state
        return <WrappedComponent {...this.props} posts={posts} post={post} />
      }
    },
    WrappedComponent, { getInitialProps: true })
}

const withPosts = withPostsFilterBy()

export default withPosts
