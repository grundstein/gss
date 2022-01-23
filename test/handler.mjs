import { is, tryCatch } from '@magic/test'

import { handler } from '../src/handler.mjs'

export default [
  {
    fn: tryCatch(handler),
    expect: t => !is.error(t),
    info: 'calling the handler without arguments works fine',
  },
  { fn: () => handler({}), expect: is.fn, info: 'calling the handler returns a function' },
]
