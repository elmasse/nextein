/**
 *
 * @param {Object} options
 * @param {String} options.field
 * @param {Array} posts
 */
export function filter ({ field = 'published' }, posts) {
  return posts.filter(p => p.data[field] !== false)
}
