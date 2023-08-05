#!/usr/bin/env node

import http2 from 'node:http2'

import { cli, lib } from '@grundstein/commons'

import { run } from './index.mjs'
import { defaults } from './defaults.mjs'

const {
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN,
  HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS,
} = http2.constants

const prepare = async () => {
  const ENV_FILE = '/home/grundstein/environment.js'

  const env = await lib.addEnv(ENV_FILE)

  const {
    GSS_DIR = defaults.dir,
    GSS_HOST = defaults.host,
    GSS_PORT = defaults.port,
    GSS_CERT_DIR = defaults.certDir,
    GSS_PROXY_FILE = defaults.proxyFile,
    GSS_CORS_ORIGIN = defaults.corsOrigin,
    GSS_CORS_HEADERS = defaults.corsHeaders,
    GSS_IMMUTABLE_FILETYPES = defaults.immutableFiletypes,
  } = env

  const opts = {
    options: [
      ['--help', '-help', 'help', '--h', '-h'],
      ['--dir', '-d'],
      ['--host', '-n'],
      ['--port', '-p'],
      ['--proxy-file'],
      ['--cors-origin', '--cors', '-c'],
      ['--cors-headers'],
      ['--cert-dir'],
      ['--cache'],
      ['--immutable-filetypes'],
    ],
    default: {
      '--dir': GSS_DIR,
      '--host': GSS_HOST,
      '--port': GSS_PORT,
      '--cert-dir': GSS_CERT_DIR,
      '--proxy-file': GSS_PROXY_FILE,
      '--cors-origin': GSS_CORS_ORIGIN,
      '--cors-headers': GSS_CORS_HEADERS,
      '--immutable-filetypes': GSS_IMMUTABLE_FILETYPES,
    },
    single: [
      '--dir',
      '--cert-dir',
      '--host',
      '--port',
      '--cors-origin',
      '--cors-headers',
      '--proxy-file',
      '--cache',
    ],
    help: {
      name: 'gss: grundstein static server',
      header: 'serves static files from disk via streams.',
      options: {
        '--dir': 'root for static file directory',
        '--host': 'hostname to listen to',
        '--port': 'port to listen to',
        '--proxy-file': 'file with a list of proxies, split on newlines',
        '--cors-origin': `value of the ${HTTP2_HEADER_ACCESS_CONTROL_ALLOW_ORIGIN} http header`,
        '--cors-headers': `value of the ${HTTP2_HEADER_ACCESS_CONTROL_ALLOW_HEADERS} http header`,
        '--immutable-filetypes': 'list of extensions that should be served as immutable',
        '--cache': 'set to "no" do not send cache-control headers and do not use statuscode 304.',
      },
      example: `
# serve host separated files in ./public/ for host "localhost":
gss

# serve files using an absolute path, custom host, port, and proxies.
gss --dir /var/www/html --host grundstein.it --port 2323 --proxies example.org example.com

# development
gss --dir ./public --cache no
# note: --cache can be a footgun, hence the required "no" to prevent being ambiguous with the flag.
`,
    },
  }

  const { args } = cli(opts)

  run(args)
}

prepare()
