import path from 'path'

import { fs, lib, log } from '@grundstein/commons'

import mimeTypes from '@magic/mime-types'

const { formatLog, getRandomId, respond, sendStream } = lib

export const handler = ({ dir, corsOrigin, corsHeaders }) => async (req, res) => {
  const time = log.hrtime()

  // assign random id to make this call traceable in logs.
  req.id = await getRandomId()

  req.headers['x-forwarded-for'] = req.id

  let { url } = req
  if (url.includes('?')) {
    url = url.split('?')[0]
  }
  if (url.endsWith('/')) {
    url = path.join(url, 'index.html')
  }

  const fullFilePath = path.join(dir, url)

  let stat

  try {
    stat = await fs.stat(fullFilePath)
  } catch (e) {
    if (e.code !== 'ENOENT') {
      log.error(e)
    }
  }

  if (stat) {
    const mimeExtension = path.extname(url).substr(1)

    const file = {
      size: stat.size,
      mime: mimeTypes[mimeExtension],
      path: fullFilePath,
    }

    let headers = {}
    if (corsOrigin) {
      headers['Access-Control-Allow-Origin'] = corsOrigin
      headers['Access-Control-Allow-Headers'] = corsHeaders
    }

    sendStream(req, res, { file, headers })
    formatLog(req, res, { time, type: 'static' })
    return
  }

  respond(req, res, { body: '404 - not found.', code: 404 })

  formatLog(req, res, { time, type: '404' })
}
