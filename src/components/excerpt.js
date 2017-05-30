
import React from 'react'

export default ({ data, content }) => {
  return (
    <div>
      <h1>{data.title}</h1>
      {content}
      <a>Read More</a>
    </div>
  )
}