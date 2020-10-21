import { lib, log } from '@grundstein/commons'

import { handler } from './handler.mjs'

const { createServer, getProxies } = lib

export const run = async (config = {}) => {
  try {
    config.startTime = log.hrtime()

    config.proxies = await getProxies(config)

    const worker = await handler(config)

    await createServer(config, worker)
  } catch (e) {
    log.error(e)
    process.exit(1)
  }
}

export default run
