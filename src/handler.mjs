import path from 'path'

import { fs, lib, log } from '@grundstein/commons'

import mimeTypes from '@magic/mime-types'

const { formatLog, getHostname, respond, sendStream } = lib

export const handler =
  ({ dir, corsOrigin, corsHeaders, proxies, immutableFiletypes = [], path404 = false, etag }) =>
  async (req, res) => {
    const time = log.hrtime()

    let code = 404

    let hostname = ''
    if (proxies.length) {
      hostname = getHostname(req)

      if (!proxies.includes(hostname)) {
        respond(req, res, { body: '403 - Invalid Hostname.', code: 403 })
        return
      }
    }

    let { url } = req
    if (url.includes('?')) {
      url = url.split('?')[0]
    }
    if (url.endsWith('/')) {
      url = path.join(url, 'index.html')
    } else {
      const extname = path.extname(url)
      if (!extname) {
        url += '/'
        respond(req, res, { code: 302, headers: { Location: url } })
        return
      }
    }

    let fullFilePath = path.join(dir, hostname, url)

    const zipFilePath = `${fullFilePath}.gz`

    let stat

    try {
      const clientAcceptedEncodings = req.headers['accept-encoding']
      if (!clientAcceptedEncodings?.includes('gzip')) {
        // this error gets swallowed
        throw new Error('no encryption accepted.')
      }

      stat = await fs.stat(zipFilePath)
      fullFilePath += '.gz'
      code = 200
    } catch (_) {
      try {
        stat = await fs.stat(fullFilePath)
      } catch (e) {
        if (path404) {
          code = 404

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
          respond(req, res, { body: '500 - Unknown error.', code: 500 })
          return
        }
      }
    }

    if (stat) {
      const mimeExtension = path.extname(url).substr(1)
      const headers = {}

      if (fullFilePath.endsWith('.gz')) {
        headers['Content-Encoding'] = 'gzip'
      }

      const file = {
        size: stat.size,
        mime: mimeTypes[mimeExtension],
        path: fullFilePath,
      }

      if (corsOrigin) {
        let val = '*'
        if (corsOrigin !== '*') {
          const forwardedFor = req.headers['x-forwarded-for']
          if (forwardedFor && corsOrigin.includes(forwardedFor)) {
            val = forwardedFor
          }
        }

        headers['Access-Control-Allow-Origin'] = val
        headers['Access-Control-Allow-Headers'] = corsHeaders
      }

      let maxAge = 600 // default: cache 10 minutes
      let immutable = ''

      const isImmutable = immutableFiletypes.some(f => file.path.includes(`.${f}`))

      if (isImmutable) {
        maxAge = 60 * 60 * 24 * 365 // one year
        immutable = `, immutable`
      }

      headers['Cache-Control'] = `public, max-age=${maxAge}${immutable}`

      /*
       * the etag function creates an internal, in-memory cache of the etags.
       */
      headers.etag = etag({ file: fullFilePath, stat })

      /*
       * bail early if we have a client cache match
       */
      if (headers.etag === req.headers['if-none-match']) {
        respond(req, res, { code: 304, headers, body: '' })
        formatLog(req, res, { time, type: 'cached' })
        return
      }

      sendStream(req, res, { file, headers, code })
      formatLog(req, res, { time, type: 'static' })
      return
    }

    respond(req, res, { body: '404 - not found.', code: 404 })
    formatLog(req, res, { time, type: '404' })
  }
