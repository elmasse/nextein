
export const inCategory = (category, { includeSubCategories = false } = {}) => (post) => {
  const { data } = post
  const { category: postCategory = '' } = data
  const result = includeSubCategories ? postCategory.startsWith(category) : postCategory === category

  return result
}
