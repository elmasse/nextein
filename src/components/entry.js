import React, { Component } from 'react'
import remark from 'remark'
import reactRenderer from 'remark-react'

import { byFileName } from '../load-entries'

const toReact = ({ data, content }) => {

  return  remark()
     .use(reactRenderer, {prefix: `entry-`})
     .processSync(content).contents  
}

export const Content = ({ data, content }) => {
  return (
    <div>
      { toReact({ data, content }) }
    </div>
  )
}

export default (WrappedComponent) => {

  return class extends Component {
    static async getInitialProps({ query }) {
      //TODO check WrappedComponent getInitialProps
      const { _entry } = query
      const entry = await byFileName(_entry)

      return {
        entry
      }
    }

    render() {
      const { props } = this

      return <WrappedComponent {...props} />;
    }
  }
}