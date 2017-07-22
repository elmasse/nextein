
import http from 'http'
import next from 'next'
import { parse } from 'url'
import route from 'path-match'

import loadEntries, { byFileNameFromServer } from './load-entries'

export default class Server {
  constructor ({ dir = '.', dev = true }) {
    this.app = next({ dev })
  }

  async readEntries () {
    const entries = await loadEntries()
    const kv = entries
      .map((entry) => {
        const { data } = entry
        const { url } = data
        return [url, entry]
      })

    this.entriesMap = new Map(kv)
  }

  entriesAsJSON () {
    const { entriesMap } = this
    return JSON.stringify(entriesMap.entries())
  }

  handleRequest = (req, res) => {
    const { entriesMap, app } = this
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl

    const matchEntry = route()('/_load_entry/:path')
    const entryParam = matchEntry(pathname)

    if (pathname === '/_load_entries') {
      res.writeHead(200, {'Content-Type': 'application/json'})
      return res.end(this.entriesAsJSON())
    }

    if (entryParam) {
      const path = entryParam.path

      if (path) {
        const e = byFileNameFromServer(path)

        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(e))
      }
    }

    if (entriesMap.has(pathname)) {
      const entry = entriesMap.get(pathname)
      const page = entry.data.page || `post`
      return app.render(req, res, `/${page}`, { _entry: entry.data._entry })
    }

    app.handleRequest(req, res, parsedUrl)
  }

  async start (port, hostname) {
    await this.readEntries()
    await this.app.prepare()
    this.http = http.createServer(this.handleRequest)
    await new Promise((resolve, reject) => {
      // This code catches EADDRINUSE error if the port is already in use
      this.http.on('error', reject)
      this.http.on('listening', () => resolve())
      this.http.listen(port, hostname)
    })
  }
}
