import path from 'node:path'
import { constants } from '@grundstein/commons'

const { HTTP2_HEADER_ORIGIN, HTTP2_HEADER_CONTENT_TYPE, HTTP2_HEADER_ACCEPT } = constants

export const defaults = {
  dir: '/var/www/html',
  host: '0.0.0.0',
  port: 2350,
  certDir: '/home/grundstein/ca',
  proxyFile: '/home/grundstein/proxies',
  corsOrigin: '*',
  corsHeaders: `${HTTP2_HEADER_ORIGIN}, x-requested-with, ${HTTP2_HEADER_CONTENT_TYPE}, ${HTTP2_HEADER_ACCEPT}`,
  immutableFiletypes: ['glb', 'mp4', 'webm', 'mp3'],
  cache: false,
  etag: false,
  proxies: [],
  certDir: path.join(
    process.cwd(),
    'node_modules',
    '@grundstein',
    'commons',
    'src',
    'certificates',
  ),
}
