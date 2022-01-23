import { is, version } from '@magic/test'

import * as lib from '../src/index.mjs'

const spec = {
  run: is.fn,
  default: is.fn,
}

export default [
  ...version(lib, spec),
  { fn: is.deep.equal(lib.run, lib.default), info: 'run and default exports are not equal' },
]
