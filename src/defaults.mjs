export const defaults = {
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
  proxies: [],
}
