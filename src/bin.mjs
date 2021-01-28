#!/usr/bin/env node

import cli from '@magic/cli'

import run from './index.mjs'

const {
  GSS_DIR = '/var/www/html',
  GSS_HOST = '0.0.0.0',
  GSS_PORT = 2350,
  GSS_CERT_DIR = '/home/grundstein/ca',
  GSS_PROXY_FILE = '/home/grundstein/proxies',
  GSS_CORS_ORIGIN = false,
  GSS_CORS_HEADERS = 'Origin, X-Requested-With, Content-Type, Accept',
} = process.env

const opts = {
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
    ['--dir', '-d'],
    ['--host', '-n'],
    ['--port', '-p'],
    ['--proxy-file'],
    ['--cors-origin', '--cors', '-c'],
    ['--cors-headers'],
  ],
  default: {
    '--dir': GSS_DIR,
    '--host': GSS_HOST,
    '--port': GSS_PORT,
    '--cert-dir': GSS_CERT_DIR,
    '--proxy-file': GSS_PROXY_FILE,
    '--cors-origin': GSS_CORS_ORIGIN,
    '--cors-headers': GSS_CORS_HEADERS,
  },
  single: ['--dir', '--host', '--port', '--cors-origin', '--cors-headers', '--proxy-file'],
  help: {
    name: 'gss: grundstein static server',
    header: 'serves static files from disk via streams.',
    options: {
      '--dir': 'root for static file directory',
      '--host': 'hostname to listen to',
      '--port': 'port to listen to',
      '--proxy-file': 'file with a list of proxies, split on newlines',
      '--cors-origin': 'value of the Access-Control-Allow-Origin http header',
      '--cors-headers': 'value of the Access-Controll-Allow-Headers http header',
    },
    example: `
# serve host separated files in ./public/ for host "localhost":
gms

# serve files using an absolute path, custom host, port, and proxies.
gms --dir /var/www/html --host grundstein.it --port 2323 --proxies example.org example.com
`,
  },
}

const { args } = cli(opts)

run(args)
