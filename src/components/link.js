import React, { Component } from 'react'
import Link from 'next/link'

import loadEntries from '../entries/load'
import { entriesMapReducer, prefixed } from './utils'

class NexteinLink extends Component {
  state = {
    href: this.props.href,
    as: this.props.as
  }

  componentWillReceiveProps ({ href, as }) {
    if (this.state.href !== href) {
      this.setState({ href, as })
    }
  }

  async componentDidMount () {
    const all = await loadEntries()
    const map = all.reduce(entriesMapReducer, {})
    const { href } = this.state
    if (href) {
      const entry = map[href]
      if (entry) {
        this.setState({
          href: { pathname: prefixed(entry.pathname), query: entry.query },
          as: href
        })
      }
    }
  }

  render () {
    let { href, as } = this.state
    const { data, children, content, raw, ...rest } = this.props // content & raw are not used but required to remove them from rest

    if (data) {
      const { page = 'post', _entry, url } = data
      href = { pathname: `/${page}`, query: { _entry } }
      as = url
    }

    href = prefixed(href)
    as = prefixed(as)

    return <Link {...{...rest, href, as}} >{children}</Link>
  }
}

export default NexteinLink
