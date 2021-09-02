import { is, tryCatch } from '@magic/test'

import { handler } from '../src/handler.mjs'

export default [
  { fn: tryCatch(handler), expect: is.error, info: 'calling the handler without arguments errors' },
  { fn: () => handler({}), expect: is.fn, info: 'calling the handler returns a function' },
]
