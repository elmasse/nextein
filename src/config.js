
import loadEntries from './load-entries'

export default () => {
  // TODO

}

export const webpack = (config) => {
  config.node = {
    fs: 'empty'
  }
  return config;
}


export const exportPathMap = async () => {
  const entries = await loadEntries()

  const map = entries
    .reduce((prev, { data }) => { 
      const { url, page = 'post', _entry } = data
      const query = { _entry }
      return {
        ...prev,
        [url]: { page: `/${page}`, query }
      }
    }, {})

    return {
      '/': { page: '/'},
      ...map
    }

}
