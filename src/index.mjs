import http from 'http'

import { fs, log, middleware } from '@grundstein/commons'

import { handler } from './handler.mjs'

export const run = async (config = {}) => {
  const startTime = log.hrtime()

  const { dir = 'public/static', host = '127.0.0.1', port = 2350 } = config

  try {
    const files = await fs.getFiles(dir)

    const server = http.createServer(handler({ dir, files }))

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
