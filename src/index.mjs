import { lib, log } from '@grundstein/commons'

import { handler } from './handler.mjs'
import { etags } from './etags.mjs'

const { createServer, getProxies } = lib

export const run = async (config = {}) => {
  try {
    const args = {
      startTime: log.hrtime(),
      proxies: await getProxies(config),
      etag: await etags(config.dir),
      ...config,
    }

    const worker = handler(args)

    await createServer(args, worker)
  } catch (e) {
    log.error(e)
    process.exit(1)
  }
}

export default run
