import http2 from 'node:http2'

const {
  HTTP2_HEADER_ORIGIN,
  HTTP2_HEADER_CONTENT_TYPE,
  HTTP2_HEADER_ACCEPT,
} = http2.constants


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
}
