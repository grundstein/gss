import log from '@magic/log'

import { lib } from '@grundstein/commons'

const { formatLog, getFileEncoding, getRandomId, respond, sendFile } = lib

export const handler = store => async (req, res) => {
  // assign random id to make this call traceable in logs.
  req.id = await getRandomId()

  req.headers['x-forwarded-for'] = req.id

  const startTime = log.hrtime()

  let { url } = req
  if (url.endsWith('/')) {
    url = `${url}index.html`
  }

  if (store) {
    const file = store.get(url)

    if (file) {
      sendFile(req, res, file)
      formatLog(req, res, startTime, 'static')
      return
    }
  }

  respond(res, { body: '404 - not found.', code: 404 })

  formatLog(req, res, startTime, 404)
}
