
import pathMatch from 'path-match'

const routeMatcher = pathMatch()
const all = []

export default function router ({ port = 3000, hostname = 'localhost', defaultHandler }) {
  return async function handleRequest (req, res) {
    const parsedUrl = new URL(req.url, `http://${hostname}:${port}/`)
    const { pathname } = parsedUrl

    for (const { match, handler } of all) {
      const params = match(pathname)
      if (params) {
        return handler(req, res, params)
      }
    }
    return defaultHandler(req, res)
  }
}

export function route (path, handler) {
  all.push({
    match: routeMatcher(path),
    handler
  })
}
