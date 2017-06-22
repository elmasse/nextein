
import React, { Component } from 'react'

import loadEntries from '../load-entries'


export const inCategory = (category) => (m) => {
  return category ? (m.data.category == category) : true
}


export default (WrappedComponent) => {

  return class extends Component {
    static async getInitialProps(...args) {
      
      const wrappedInitial = WrappedComponent.getInitialProps 
      const wrapped = wrappedInitial ? await wrappedInitial(...args) : {}
      const posts = await loadEntries()

      return {
        ...wrapped,
        posts
      }
    }

    render() {
      return <WrappedComponent {...this.props} />;
    }
  }
}