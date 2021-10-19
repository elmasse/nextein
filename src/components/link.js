
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
    const map = await pathMap()
    this.setState({ map })
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
      href = url
    }

    const entry = map[href]

    if (entry) {
      const { page: pathname, ...rest } = entry
      as = href
      href = { pathname, ...rest }
    }

    return (<Link {...{ ...rest, href: prefixed(href), as: prefixed(as) }} />)
  }
}

export default NexteinLink
