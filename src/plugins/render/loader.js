
const { resolve } = require('path')
/**
 * loads a generated file that allows us to require all render plugin in react.
 *
 * results in a file that looks like:
 *
 * ```js
 * module.exports = {
 *   "some-plugin": require('some-plugin').render,
 *   "some-other-plugin": require('some-other-plugin').render
 * }
 * ```
 */
module.exports = function () {
  const { plugins = [] } = this.getOptions()

  return `module.exports = {
    "__PLUGINS__": ${JSON.stringify(plugins)},
    ${plugins
      .filter(p => p.renderer)
      .map(({ resolved, name }) => `"${name}": require(${JSON.stringify(resolve(resolved, 'render'))}).render`)
      .join(',\n')
    }
  }`
}
