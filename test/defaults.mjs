import { is } from '@magic/test'

import { defaults } from '../src/defaults.mjs'

const expected = {
  dir: '/var/www/html',
  host: '0.0.0.0',
  port: 2350,
  certDir: '/home/grundstein/ca',
  proxyFile: '/home/grundstein/proxies',
  corsOrigin: '*',
  corsHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  immutableFileTypes: ['glb', 'mp4', 'webm', 'mp3'],
  cache: false,
  etag: false,
}

export default [
  { fn: is.deep.equal(expected, defaults), info: 'defaults.mjs exports have changed.' },
]
