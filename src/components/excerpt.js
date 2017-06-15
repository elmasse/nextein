
import React from 'react'
import Link from 'next/link'

export default ({ data, content }) => {
  const { title, page = 'post', url, _entry } = data
  return (
    <div>
      <h1>{title}</h1>
      {content}
     {/*<Link prefetch href={{ page, query: { _entry }}} as={url}><a>Read More</a></Link>*/}
     <a href={url}>Read More</a>
    </div>
  )
}
