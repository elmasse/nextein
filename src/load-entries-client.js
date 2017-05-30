
const rootModuleRelativePath = require('./root-module')
const relativeResolve = rootModuleRelativePath(require)

module.exports = () => {
  const req = require.context(relativeResolve('posts/'), true, /^\.\/.*\.md$/)
  return req
    .keys()
    .map(req)    
}
