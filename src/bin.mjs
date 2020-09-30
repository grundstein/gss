#!/usr/bin/env node

import cli from '@magic/cli'

import run from './index.mjs'

const opts = {
  options: [
    ['--help', '-help', 'help', '--h', '-h'],
    ['--dir', '-d'],
    ['--host', '-n'],
    ['--port', '-p'],
    ['--cors-origin', '--cors', '-c'],
    ['--cors-headers'],
  ],
  default: {
    '--dir': 'public',
    '--host': '127.0.0.1',
    '--port': 2350,
    '--cors-origin': false,
    '--cors-headers': 'Origin, X-Requested-With, Content-Type, Accept',
  },
  single: ['--dir', '--host', '--port', '--cors-origin', '--cors-headers'],
  help: {
    name: 'gms: grundstein magic server',
    header: 'serves static pages from memory.',
    options: {
      '--dir': 'root for both api and static directories',
      '--host': 'hostname to listen to, default 127.0.0.1',
      '--port': 'port, default 2350',
      '--cors-origin': 'value of the Access-Control-Allow-Origin http head',
      '--cors-headers': 'value of the Access-Controll-Allow-Headers http head',
    },
    example: `
# serve files in ./api:
gms

# serve files using an absolute path, custom host and port.
gms --dir /api --host grundstein.it --port 2323
`,
  },
}

const { args } = cli(opts)

run(args)
