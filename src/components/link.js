/* global __NEXT_DATA__ */

import React, { Component } from 'react'
import Link from 'next/link'

import { pathMap } from '../entries'
import { prefixed } from '../endpoints'

class NexteinLink extends Component {
  static getDerivedStateFromProps (state, { href, as }) {
    if (state.href !== href) {
      return { href, as }
    }
    return null
  }

  state = {
    href: this.props.href,
    as: this.props.as
  }

  async componentDidMount () {
    const { props } = __NEXT_DATA__
    let { __pathMap: map } = (props.pageProps || props)

    if (!map) {
      map = await pathMap()
    }
    this.setState({ map })

    const { href } = this.state
    if (href && map) {
      const entry = map[href]

      if (entry) {
        this.setState({
          href: { pathname: entry.page, query: entry.query },
          as: href
        })
      }
    }
  }

  render () {
    let { href, as, map } = this.state
    const { data, content, raw, ...rest } = this.props // content & raw are not used but required to remove them from rest

    if (!map) return null

    if (data) {
      const { page, url } = data

      if (!page) {
        console.warn(`Link Component (from nextein) is trying to render a link to a post (name: ${data.name}) with no page. Link has no effect. Review.`)
        // Do not fail, like an anchor without props, still renders its own children.
        // past this point, meaning a Link to be used as a NextJS Link, it will be up to them on how to handle errors.
        return (<>{this.props.children}</>)
      }

      const { page: pathname, ...rest } = map[url]

      href = { pathname, ...rest }
      as = url
    }

    href = prefixed(href)
    as = prefixed(as)

    return (<Link {...{ ...rest, href, as }} />)
  }
}

export default NexteinLink
