import { lib, log } from '@grundstein/commons'

import { defaults } from './defaults.mjs'
import { handler } from './handler.mjs'

export const run = async (config = {}) => {
  try {
    const args = {
      ...defaults,
      startTime: log.hrtime(),
      proxies: await lib.getProxies(config),
      etag: await lib.etags(config.dir),
      ...config,
    }

    const worker = handler(args)

    await lib.createServer(args, worker)
  } catch (e) {
    log.error(e)
    process.exit(1)
  }
}

export default run
