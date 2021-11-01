
export const inCategory = (category, { includeSubCategories = false } = {}) => post => {
  const { data } = post
  const { category: postCategory = '' } = data
  const shouldIncludeSub = includeSubCategories || category.endsWith('/*')
  const result = shouldIncludeSub ? postCategory.startsWith(category.replace('/*', '')) : postCategory === category

  return result
}

export const inCategories = (categories = []) => post => {
  return categories.some(category => inCategory(category)(post))
}
