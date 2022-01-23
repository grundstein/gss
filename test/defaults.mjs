import { is, version } from '@magic/test'

import { defaults } from '../src/defaults.mjs'

const expected = {
  dir: '/var/www/html',
  host: '0.0.0.0',
  port: 2350,
  certDir: '/home/grundstein/ca',
  proxyFile: '/home/grundstein/proxies',
  corsOrigin: '*',
  corsHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  immutableFiletypes: ['glb', 'mp4', 'webm', 'mp3'],
  cache: false,
  etag: false,
  proxies: [],
}

const spec = {
  dir: is.str,
  host: is.str,
  port: is.num,
  certDir: is.str,
  proxyFile: is.str,
  corsOrigin: is.str,
  corsHeaders: is.str,
  immutableFiletypes: is.arr,
  cache: is.bool,
  etag: is.bool,
  proxies: is.arr,
}

export default [
  { fn: is.deep.equal(expected, defaults), info: 'defaults.mjs exports have changed.' },
  ...version(defaults, spec),
]
