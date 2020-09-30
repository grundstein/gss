import http from 'http'

import { log, middleware } from '@grundstein/commons'

import { handler } from './handler.mjs'

export const run = async (config = {}) => {
  const startTime = log.hrtime()

  const {
    dir = 'public',
    host = '127.0.0.1',
    port = 2350,
    corsOrigin = false,
    corsHeaders = 'Origin, X-Requested-With, Content-Type, Accept',
  } = config

  try {
    const server = http.createServer(handler({ dir, corsOrigin, corsHeaders }))

    const clientError = middleware.clientError({ host, port, startTime })
    server.on('clientError', clientError)

    const listener = middleware.listener({ host, port, startTime })
    server.listen(port, host, listener)
  } catch (e) {
    log.error(e)
    process.exit(1)
  }
}

export default run
