import React from 'react'
import { compile } from '../plugins/compile'

export default React.forwardRef(function Content (fwdProps, ref) {
  const { content, excerpt, renderers, data, prefix, raw, component, ...componentProps } = fwdProps
  const { renders: renderPlugins } = compile()

  let resolvedComponent
  for (const render of renderPlugins) {
    resolvedComponent = render({ data, content, excerpt, renderers, prefix })
    if (resolvedComponent) break
  }

  const { props, type } = resolvedComponent || {}
  const Component = component || type
  // TODO: if not resolved component should throw an error?
  return resolvedComponent ? <Component ref={ref} {...props} {...componentProps} /> : null
})
