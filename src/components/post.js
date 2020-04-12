import React, { Component } from 'react'
import hoistNonReactStatics from 'hoist-non-react-statics'
import getDisplayName from 'react-display-name'

import loadEntries, { byFileName } from '../entries/load'
import entriesMap from '../entries/map'

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
        const { _entry } = query
        const post = _entry ? await byFileName(_entry) : undefined
        const _entries = await loadEntries()

        return {
          ...wrapped,
          post,
          _entriesMap: await entriesMap(_entries)
        }
      }

      render () {
        const { props } = this

        return <WrappedComponent {...props} />
      }
    },
    WrappedComponent, { getInitialProps: true })
}
