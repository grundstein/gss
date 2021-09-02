import path from 'path'

import { fs } from '@grundstein/commons'

export const getEtagKeyFromFilePath = ({ dir, file }) => {
  if (file.endsWith('.gz')) {
    file = file.substring(0, file.length - 3)
  }

  return file.replace(`${dir}/`, '')
}

export const getEtag =
  ({ dir, cache = {} }) =>
  ({ file, stat }) => {
    const key = getEtagKeyFromFilePath({ dir, file })

    if (!cache[key]) {
      // takes 0.01 ms, refactor later,
      // this one function almost doubles response time
      cache[key] = (stat.size + stat.mtimeMs).toString(36)
    }

    return cache[key]
  }

export const etags = async dir => {
  let cache = {}

  if (dir) {
    const etagFile = path.join(dir, 'etags.csv')

    const exists = await fs.exists(etagFile)

    if (exists) {
      const contents = await fs.readFile(etagFile, 'utf8')

      const lines = contents.split('\n')
      cache = Object.fromEntries(lines.map(line => line.split(',')))
    }
  }

  return getEtag({ dir, cache })
}
