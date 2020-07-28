
import http from 'http'
import next from 'next'
import url from 'url'
import route from 'path-match'
import { sep, resolve } from 'path'
import chokidar from 'chokidar'

import plugins from './plugins'
import loadEntries, { byFileName, byEntriesList, invalidateCache } from './entries/load'
import { jsonFileEntriesMap } from './entries/json-entry'
import entriesMap from './entries/map'

export class Server {
  constructor ({ dir = '.', dev = true }) {
    this.app = next({ dev })
    this.dev = dev
    this.handle = this.app.getRequestHandler()
  }

  async readEntries () {
    const entries = await byEntriesList(await loadEntries())
    const kv = entries
      .map((entry, index) => {
        const { data } = entry
        const { url = `@@NOURL-${index}` } = data
        return [url, entry]
      })

    this.entriesMap = new Map(kv)
  }

  entriesAsJSON () {
    const { entriesMap } = this
    return JSON.stringify(Array.from(entriesMap.values()))
  }

  handleRequest = async (req, res) => {
    /* eslint-disable node/no-deprecated-api */
    const parsedUrl = url.parse(req.url, true)
    const { pathname } = parsedUrl

    const matchEntry = route()('/_load_entry/:path+')
    const entryParam = matchEntry(pathname)

    if (pathname === '/_load_entries') {
      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(this.entriesAsJSON())
      return
    }

    if (pathname === `/${jsonFileEntriesMap('development')}`) {
      const entries = await loadEntries()

      res.writeHead(200, { 'Content-Type': 'application/json' })
      res.end(JSON.stringify(entriesMap(entries)))
      return
    }

    if (entryParam) {
      const path = entryParam.path.join(sep)

      if (path) {
        const entry = await byFileName(path)

        res.writeHead(200, { 'Content-Type': 'application/json' })
        res.end(JSON.stringify(entry))
        return
      }
    }

    this.handle(req, res, parsedUrl)
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
    this.watchEntries()
  }

  watchEntries () {
    const { dev } = this
    const { watchers } = plugins()

    if (dev && watchers) {
      console.log('watching changes in folders:', watchers)
      chokidar.watch(watchers.map(path => resolve(process.cwd(), path)), { ignoreInitial: true })
        .on('change', this.hotReloadPosts)
        .on('unlink', this.hotReloadPosts)
    }
  }

  hotReloadPosts = async () => {
    const hotReloader = this.app.hotReloader
    if (hotReloader.webpackDevMiddleware) { // old next version
      hotReloader.webpackDevMiddleware.invalidate()
      invalidateCache()
      await this.readEntries()
      hotReloader.webpackDevMiddleware.waitUntilValid(() => {
        hotReloader.send('reloadPage')
      })
    } else {
      invalidateCache()
      await this.readEntries()
      hotReloader.send('reloadPage')
    }
  }
}
