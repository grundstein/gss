#!/usr/bin/env node

import cli from '@magic/cli'

import run from './index.mjs'

const opts = {
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
    ['--dir', '-d'],
    ['--host', '--hostname', '-n'],
    ['--port', '-p'],
    ['--proxies', '--proxy'],
    ['--cors-origin', '--cors', '-c'],
    ['--cors-headers'],
  ],
  default: {
    '--dir': 'public',
    '--host': '127.0.0.1',
    '--port': 2350,
    '--proxies': [],
    '--cors-origin': false,
    '--cors-headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
  single: ['--dir', '--host', '--port', '--cors-origin', '--cors-headers'],
  help: {
    name: 'gss: grundstein static server',
    header: 'serves static files from disk via streams.',
    options: {
      '--dir': 'root for static file directory',
      '--host': 'hostname to listen to',
      '--port': 'port to listen to',
      '--proxies': 'hostnames to proxy to directory',
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
