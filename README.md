## @grundstein/gss

## gss: grundstein static (file) server

### features:

#### static files
serves a local directory (process.cwd() + 'public' is the default)

#### big files get sent as streams
video and audio files get sent as streams

#### serves compressed files
if .gz files exist in the public directory, those will be served.

#### client caching
caches client files using a built-in etag generator and cache.
if public/etags.csv exists, which [@grundstein/prepare-static-files](https://github.com/grundstein/prepare-static-files) generates,
the contents of this file will be used as cache.

#### installation
```bash
npm i -g @grundstein/gss
```

#### usage
```bash
// show full help
gss --help

// serve the ./public directory
gss

// serve specific directory
gss --dir local/directory/path

// serve on specific host and port
gss --host grundstein.it --port 2323
```
