import path from 'path'

import { fs, is } from '@magic/test'

import { lib } from '@grundstein/commons'

const indexHtmlPath = path.join(process.cwd(), 'public', 'index.html')
const stat = await fs.statSync(indexHtmlPath)
const indexHtmlExpect = (stat.size + stat.mtimeMs).toString(36)

export default [
  {
    fn: async () => {
      const e = await lib.etags('public')
      return e({ file: 'public/index.html', stat })
    },
    expect: indexHtmlExpect,
    info: 'returns a function when called with empty argument',
  },
]
