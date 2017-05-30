const glob = require('glob')
const { readFileSync } = require('fs')
const { resolve } = require('path')
const fm = require('frontmatter')

module.exports = () => {
   const paths = glob.sync('posts/*.md', { root: resolve(__dirname, '..')})
   
   return paths
    .map((p) => (readFileSync(p, 'utf-8') ))
    .map(fm)
    .map((value, idx) => {
      value.data._mdPath = paths[idx]
      return value
    })
}