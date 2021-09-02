import path from 'path'

import { fs } from '@grundstein/commons'

export const etags = async config => {
  const { dir } = config

  const etagFile = path.join(dir, 'etags.csv')

  const exists = await fs.exists(etagFile)

  if (exists) {
    const etags = await fs.readFile(etagFile, 'utf8')

    const lines = etags.split('\n')
    return Object.fromEntries(lines.map(line => line.split(',')))
  }

  return false
}
