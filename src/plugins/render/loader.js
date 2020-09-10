const loaderUtils = require('loader-utils')

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
  const { plugins = [] } = loaderUtils.getOptions(this)

  return `module.exports = {
    ${plugins
      .filter(p => p.renderer)
      .map(({ resolved, name }) => `"${name}": require("${resolved}/render").render`)
      .join(',\n')
    }
  }`
}
