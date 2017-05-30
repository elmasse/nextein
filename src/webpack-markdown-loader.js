
const fm = require('frontmatter')

module.exports = function (content) {
   
  const cb = this.async()
  const value = fm(content, { safeLoad: true})
  
  value.data._mdPath = this.currentRequest

  cb(null, 'module.exports = ' + JSON.stringify(value) )
}