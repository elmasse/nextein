import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import { load, metadata, pathMap } from '../entries'

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
          __pathMap: await pathMap(),
          __metadata: await metadata()
        }
      }

      render () {
        const { props } = this

        return <WrappedComponent {...props} />
      }
    },
    WrappedComponent, { getInitialProps: true })
}
