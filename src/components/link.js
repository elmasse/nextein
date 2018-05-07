import React, { Component } from 'react'
import Link from 'next/link'

class NexteinLink extends Comment {
  render() {
    const { data, children, content, raw, ...rest } = this.props // content & raw are not used but required to remove them from rest
    let { href, as } = rest
    if (data) {
      const { page = 'post', _entry, url } = data
      href = { pathname: `/${page}`, query: { _entry } }
      as = url
    }
  
    return <Link {...{...rest, href, as}} >{children}</Link>
  }
}

export default NexteinLink
