## @grundstein/gss

## gss: grundstein static (file) server

### features:

#### static files
serves a local directory from disk.

#### big files get sent as streams
video and audio files get sent as streams

#### serves compressed files
if .gz files exist in the public directory.

#### client caching
cache control headers cache client files.
if public/etags.csv exists,
which [@grundstein/prepare-static-files](https://github.com/grundstein/prepare-static-files) generates,
the contents of this file will be used as cache.

#### fast
server starts in 5 - 10 milliseconds,
response for a 100kb file takes 0.1 - 0.5 milliseconds.
load does not change this numbers until the hard disc bandwith limits are reached.

#### installation
```bash
npm i -g @grundstein/gss
```

#### usage
```bash
// show full help
gss --help

// serve the ./public directory
gss --dir public

// serve specific directory
gss --dir local/directory/path

// serve on specific host and port
gss --host grundstein.it --port 2323
```

### changelog

#### v0.0.1
first release

#### v0.0.2
* fix error if 404.html.gz does not exist, serve 404.html instead.
* update dependencies

#### 0.0.3
* add "--cache no" cli argument to prevent cache-control headers from being sent.

#### 0.0.4 - unreleased
...
