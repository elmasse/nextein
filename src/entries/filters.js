
export const inCategory = (category, { includeSubCategories = false } = {}) => post => {
  const { data = post } = post // if there is no post.data, we assume we are working with data object
  const { category: postCategory = '' } = data
  const shouldIncludeSub = includeSubCategories || category.endsWith('/*')
  const result = shouldIncludeSub ? postCategory.startsWith(category.replace('/*', '')) : postCategory === category

  return result
}

export const inCategories = (categories = []) => post => {
  return categories.some(category => inCategory(category)(post))
}
