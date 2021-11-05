
import { byDate } from '../../../entries/sorters'

/**
 *
 * @param {Object} options
 * @param {Array} posts
 */
export function sort (_, posts) {
  return posts.sort(byDate)
}
