
import http from 'http'
import next from 'next'
import { parse } from 'url'
import route from 'path-match'
import { join, relative, sep, resolve } from 'path'
import chokidar from 'chokidar'

import plugins from './plugins'
import loadEntries, { byFileName } from './entries/load'

export default class Server {
  constructor ({ dir = '.', dev = true }) {
    this.app = next({ dev })
    this.dev = dev
  }

  async readEntries () {
    const entries = await loadEntries()
    const kv = entries
      .map((entry, index) => {
        const { data } = entry
        const { url = `@@NOURL-${index}` } = data
        return [url, entry]
      })

    this.entriesMap = new Map(kv)
    this.exportPathMap = await this.app.nextConfig.exportPathMap()
  }

  entriesAsJSON () {
    const { entriesMap } = this
    return JSON.stringify(Array.from(entriesMap.values()))
  }

  /**
   * Freaking issue with babel-eslint or eslint or babel or ... that retrieves an error when using arrow func on class props
   */
  /* eslint-disable no-undef */
  handleRequest = async (req, res) => {
    const { app, exportPathMap } = this
    const parsedUrl = parse(req.url, true)
    const { pathname } = parsedUrl
    const customRoute = exportPathMap[pathname]

    const matchEntry = route()('/_load_entry/:path+')
    const entryParam = matchEntry(pathname)

    if (pathname === '/_load_entries') {
      res.writeHead(200, {'Content-Type': 'application/json'})
      return res.end(this.entriesAsJSON())
    }

    if (entryParam) {
      const path = entryParam.path.join(sep)

      if (path) {
        const e = await byFileName(path)

        res.writeHead(200, {'Content-Type': 'application/json'})
        return res.end(JSON.stringify(e))
      }
    }

    if (customRoute) {
      const { page, query } = customRoute
      return app.render(req, res, page, query)
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
    hotReloader.webpackDevMiddleware.invalidate()
    await this.readEntries()
    hotReloader.webpackDevMiddleware.waitUntilValid(() => {
      const rootDir = join('bundles', 'pages')

      for (const n of new Set([...hotReloader.prevChunkNames])) {
        const route = toRoute(relative(rootDir, n))
        hotReloader.send('reload', route)
      }
      hotReloader.send('reload', '/bundles/pages/')
    })
  }
}

function toRoute (file) {
  const f = sep === '\\' ? file.replace(/\\/g, '/') : file
  return ('/' + f).replace(/(\/index)?\.js$/, '') || '/'
}
