
import http from 'http'
import next from 'next'
import endpoints from './endpoints'
import router, { route } from './router'
import { load, metadata, pathMap } from './entries'

export default async function start (serverOptions, port, hostname) {
  const app = next(serverOptions)
  const handler = app.getRequestHandler()

  const srv = http.createServer(router({ port, hostname, defaultHandler: handler }))

  // Define routes

  route(`/${endpoints.post(':id')}`, async (req, res, { id }) => {
    const [result] = await load(id)
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(`/${endpoints.posts()}`, async (req, res) => {
    const result = await load()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(`/${endpoints.metadata()}`, async (req, res) => {
    const result = await metadata()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  route(`/${endpoints.pathMap()}`, async (req, res) => {
    const result = await pathMap()
    res.writeHead(200, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify(result))
  })

  await new Promise((resolve, reject) => {
    // This code catches EADDRINUSE error if the port is already in use
    srv.on('error', reject)
    srv.on('listening', () => resolve())
    srv.listen(port, hostname)
  })

  await app.prepare()
}
