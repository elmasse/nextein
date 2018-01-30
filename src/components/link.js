import React from 'react'
import Link from 'next/link'

const NexteinLink = (props) => {
  const { data, children, content, ...rest } = props
  let { href, as } = rest
  if (data) {
    const { page = 'post', _entry, url } = data
    href = { pathname: `/${page}`, query: { _entry } }
    as = url
  }

  return <Link {...{...rest, href, as}} >{children}</Link>
}

export default NexteinLink
