/* global EventSource */

import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import { load, metadata, pathMap } from '../entries'
import endpoints from '../endpoints'

export { default as Content } from './content'

export default (WrappedComponent) => {
  const displayName = getDisplayName(WrappedComponent)

  return hoistNonReactStatics(
    class extends Component {
      static displayName = `WithPost(${displayName})`

      static async getInitialProps (...args) {
        const wrappedInitial = WrappedComponent.getInitialProps
        const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
        const [{ query = {} }] = args
        const { __id } = query
        const [post] = __id ? await load(__id) : []

        return {
          ...wrapped,
          post,
          __id,
          __pathMap: await pathMap(),
          __metadata: await metadata()
        }
      }

      componentDidMount () {
        if (typeof window !== 'undefined') {
          this.evtSource = new EventSource(endpoints.entriesHMR())
          const { __id } = this.props
          this.evtSource.onmessage = async () => {
            const [post] = __id ? await load(__id) : []
            this.setState({ post })
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
