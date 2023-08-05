import http2 from 'node:http2'
import path from 'node:path'

import { fs, lib, log } from '@grundstein/commons'
import mimeTypes from '@magic/mime-types'

import { defaults } from './defaults.mjs'

const {
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
  HTTP2_HEADER_PATH,
  HTTP2_HEADER_LOCATION,
  HTTP2_HEADER_STATUS,
  HTTP2_HEADER_CONTENT_ENCODING,
} = http2.constants

export const handler = (args = {}) => {
  const {
    dir = defaults.dir,
    corsOrigin = defaults.corsOrigin,
    corsHeaders = defaults.corsHeaders,
    immutableFiletypes = defaults.immutableFiletypes,
    proxies = defaults.proxies,
    etag = defaults.etag,
    cache = defaults.cache,
    path404,
  } = args

  return async (stream, headers) => {
    const head = {}

    const time = log.hrtime()

    let hostname = ''
    if (proxies.length) {
      hostname = lib.getHostname(headers)

      if (!proxies.includes(hostname)) {
        const options = {
          head: {
            [HTTP2_HEADER_STATUS]: 403,
          },
        }
        lib.respond(stream, headers, { body: '403 - Invalid Hostname.', head })
        return
      }
    }

    let url = headers[HTTP2_HEADER_PATH]
    if (url.includes('?')) {
      url = url.split('?')[0]
    }
    if (url.endsWith('/')) {
      url = path.join(url, 'index.html')
    } else {
      const extname = path.extname(url)
      if (!extname) {
        url += '/'
        lib.respond(stream, headers, { code: 302, head: { [HTTP2_HEADER_LOCATION]: url } })
        return
      }
    }

    let fullFilePath = path.join(dir, hostname, url)

    const zipFilePath = `${fullFilePath}.gz`

    let stat

    try {
      const clientAcceptedEncodings = headers[HTTP2_HEADER_ACCEPT_ENCODING]
      if (!clientAcceptedEncodings?.includes('gzip')) {
        // this error gets swallowed
        throw new Error('no compression accepted.')
      }

      stat = await fs.stat(zipFilePath)
      fullFilePath += '.gz'
      head[HTTP2_HEADER_STATUS] = 200
    } catch (_) {
      try {
        stat = await fs.stat(fullFilePath)
      } catch (e) {
        if (path404) {
          head[HTTP2_HEADER_STATUS] = 404

          /*
           * Find out if a gzipped 404.html file exists, if not load the unzipped variant.
           */
          let maybeGzipped404 = path404
          try {
            stat = await fs.stat(`${maybeGzipped404}.gz`)
            fullFilePath = `${maybeGzipped404}.gz`
          } catch (e) {
            stat = await fs.stat(`${maybeGzipped404}`)
            fullFilePath = maybeGzipped404
          }
        }

        if (!stat && e.code !== 'ENOENT') {
          log.error(e)
          lib.respond(stream, {
            body: '500 - Unknown error.',
            head: { [HTTP2_HEADER_STATUS]: 500 },
          })
          return
        }
      }
    }

    if (stat) {
      const mimeExtension = path.extname(url).substring(1)

      if (fullFilePath.endsWith('.gz')) {
        head[HTTP2_HEADER_CONTENT_ENCODING] = 'gzip'
      }

      const file = {
        size: stat.size,
        mime: mimeTypes[mimeExtension],
        path: fullFilePath,
      }

      if (corsOrigin) {
        let val = '*'
        if (corsOrigin !== '*') {
          const forwardedFor = head['x-forwarded-for']
          if (forwardedFor && corsOrigin.includes(forwardedFor)) {
            val = forwardedFor
          }
        }

        head[HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN] = val
        head['access-control-allow-headers'] = corsHeaders
      }

      if (cache !== 'no') {
        let maxAge = 600 // default: cache 10 minutes
        let immutable = ''

        const isImmutable = immutableFiletypes.some(f => file.path.includes(`.${f}`))

        if (isImmutable) {
          maxAge = 60 * 60 * 24 * 365 // one year
          immutable = `, immutable`
        }

        head['cache-control'] = `public, max-age=${maxAge}${immutable}`
      }

      /*
       * the etag function creates an internal, in-memory cache of the etags.
       */ fs
      head.etag = etag({ file: fullFilePath, stat })

      /*
       * bail early if we have a client cache match,
       * but not if "--cache no" cli arg is used
       */
      if (cache !== 'no' && head.etag === headers['if-none-match']) {
        head[HTTP2_HEADER_STATUS] = 304
        lib.respond(stream, headers, { head, body: '' })
        return
      }

      lib.sendFile(stream, headers, { file, head, time, type: 'static' })
      return
    }

    // log.server.request(stream, headers, { head, time, type: '404' })
    lib.respond(stream, headers, { body: '404 - not found.', head: { [HTTP2_HEADER_STATUS]: 404 } })
  }
}
