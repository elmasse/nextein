import React, { useEffect, useState } from 'react'
import { compile } from '../plugins/compile'

export default React.forwardRef(function Content (fwdProps, ref) {
  const { content, excerpt, renderers, data, prefix, raw, component, ...componentProps } = fwdProps

  const [renderPlugins, setRenderPlugins] = useState([])

  useEffect(() => {
    ;(async () => {
      const renders = await compile()
      setRenderPlugins(renders)
    })()
  }, [])

  let resolvedComponent
  for (const render of renderPlugins) {
    resolvedComponent = render({ data, content, excerpt, renderers, prefix })
    if (resolvedComponent) break
  }

  const { props, type } = resolvedComponent || {}
  const Component = component || type

  return resolvedComponent ? <Component ref={ref} {...props} {...componentProps} /> : null
  // const { props, type } = toReact({ content, excerpt, renderers, prefix })
  // const Component = component || type
  // return <Component ref={ref} {...props} {...componentProps} />
})
