
import http from 'http'
import next from 'next'
import { serverEndpoints } from './endpoints'
import router, { route } from './router'
import { createEventStream } from './event-stream'
import { load, metadata, pathMap } from './entries'
import { subscribe, plugins } from './plugins'

export default async function start (serverOptions, port, hostname) {
  const app = next(serverOptions)
  const handler = app.getRequestHandler()

  const srv = http.createServer(router({ port, hostname, defaultHandler: handler }))

  // Define routes
  route(serverEndpoints.post(':id'), async (req, res, { id }) => {
    const [result] = await load(id)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(serverEndpoints.posts(), async (req, res) => {
    const result = await load()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(serverEndpoints.metadata(), async (req, res) => {
    const result = await metadata()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(serverEndpoints.pathMap(), async (req, res) => {
    const result = await pathMap()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(serverEndpoints.pluginsManifest(), (req, res) => {
    const result = plugins()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  if (serverOptions.dev) {
    const eventStream = createEventStream()

    subscribe(() => {
      eventStream.publish({ data: 'update' })
    })

    route(serverEndpoints.entriesHMR(), eventStream.handler)
  }

  await new Promise((resolve, reject) => {
    // This code catches EADDRINUSE error if the port is already in use
    srv.on('error', reject)
    srv.on('listening', () => resolve())
    srv.listen(port, hostname)
  })

  await app.prepare()
}
