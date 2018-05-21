/* global __NEXT_DATA__ */

// entriesMap = entries => object
export default (entries = []) => {
  const { props } = __NEXT_DATA__
  const { _entriesMap } = (props.pageProps || props)
  return _entriesMap
}
