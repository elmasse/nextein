
export const getDisplayName = (Component) => {
  return Component.displayName || Component.name || 'Unknown'
}

export const entriesMapReducer = (prev, { data }) => {
  const { url, page, _entry } = data
  const query = _entry ? { _entry } : undefined
  return page ? {
    ...prev,
    [url]: { pathname: `/${page}`, query }
  } : prev
}
