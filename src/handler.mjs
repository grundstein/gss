import path from 'path'

import { fs, lib, log } from '@grundstein/commons'

import mimeTypes from '@magic/mime-types'

const { formatLog, getRandomId, respond, sendFile } = lib

export const handler = dir => async (req, res) => {
  // assign random id to make this call traceable in logs.
  req.id = await getRandomId()

  req.headers['x-forwarded-for'] = req.id

  const startTime = log.hrtime()

  let { url } = req
  if (url.endsWith('/')) {
    url = path.join(url, 'index.html')
  }
  const fullFilePath = path.join(dir, url)

  const exists = await fs.exists(fullFilePath)

  if (exists) {
    const buffer = await fs.readFile(fullFilePath)

    const mimeExtension = path.extname(fullFilePath).substr(1)

    const file = {
      buffer,
      mime: mimeTypes[mimeExtension],
    }

    if (file) {
      sendFile(req, res, { file })
      formatLog(req, res, startTime, 'static')
      return
    }
  }

  respond(req, res, { body: '404 - not found.', code: 404 })

  formatLog(req, res, startTime, 404)
}
