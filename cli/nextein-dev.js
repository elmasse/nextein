#!/usr/bin/env node

const { resolve } = require('path')
const arg = require('next/dist/compiled/arg/index.js')
const { existsSync } = require('fs')
const { Server } = require('../server')
const { printAndExit } = require('next/dist/server/lib/utils')
const { startedDevelopmentServer } = require('next/dist/build/output')

const nexteinDev = (argv) => {
  const args = arg(
    {
      // Types
      '--help': Boolean,
      '--port': Number,
      '--hostname': String,

      // Aliases
      '-h': '--help',
      '-p': '--port',
      '-H': '--hostname',
    },
    { argv }
  )

  if (args['--help']) {
    // tslint:disable-next-line
    console.log(`
      Description
        Starts the application in development mode (hot-code reloading, error
        reporting, etc)

      Usage
        $ next dev <dir> -p <port number>

      <dir> represents the directory of the Next.js application.
      If no directory is provided, the current directory will be used.

      Options
        --port, -p      A port number on which to start the application
        --hostname, -H  Hostname on which to start the application
        --help, -h      Displays this message
    `)
    process.exit(0)
  }

  const dir = resolve(args._[0] || '.')

  // Check if pages dir exists and warn if not
  if (!existsSync(dir)) {
    printAndExit(`> No such directory exists as the project root: ${dir}`)
  }

  const port = args['--port'] || 3000
  const appUrl = `http://${args['--hostname'] || 'localhost'}:${port}`

  startedDevelopmentServer(appUrl)

  const srv = new Server({ dir, dev: true, isNextDevCommand: true })
  srv.start(port, args['--hostname'])
    .catch((err) => {
      if (err.code === 'EADDRINUSE') {
        let errorMessage = `Port ${port} is already in use.`
        const pkgAppPath = require('next/dist/compiled/find-up').sync(
          'package.json',
          {
            cwd: dir,
          }
        )
        const appPackage = require(pkgAppPath)
        if (appPackage.scripts) {
          const nextScript = Object.entries(appPackage.scripts).find(
            (scriptLine) => scriptLine[1] === 'next'
          )
          if (nextScript) {
            errorMessage += `\nUse \`npm run ${nextScript[0]} -- -p <some other port>\`.`
          }
        }
        // tslint:disable-next-line
        console.error(errorMessage)
      } else {
        // tslint:disable-next-line
        console.error(err)
      }
      process.nextTick(() => process.exit(1))
    })
}

module.exports = { nexteinDev }
