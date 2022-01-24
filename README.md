## @grundstein/gss

**g**rundstein **s**tatic (file) **s**erver

serves a local directory from disk.

### WIP. NOT FULLY AUTOMATED, TESTED AND BENCHMARKED YET!

### features:

#### big files get sent as streams
video and audio files get sent as streams

#### serves compressed files
if .gz files exist. no runtime-compression.

#### client caching
cache control headers cache client files.
if public/etags.csv exists,
which [@grundstein/prepare-static-files](https://github.com/grundstein/prepare-static-files) generates,
the contents of this file will be used as cache.

#### fast
server (re)starts in ~15 ms.
responses take 0.1 - 0.5 ms before sending the first bits back.
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

#### 0.0.4
* update dependencies
* use log.server.request instead of formatLog
* use lib.sendStream and lib.response instead of importing those functions directly
* use lib.etags instead of local function

#### 0.0.5
* update dependencies
* @magic/mime-types now supports ply files

#### 0.0.6
update dependencies

#### 0.0.7
update dependencies

#### 0.0.8
* update dependencies
* handler does not error if called without arguments, uses defaults instead.
* added defaults file and using it everywhere

#### 0.0.9
add proxies = [] to defaults

#### 0.0.10
fix typo

#### 0.0.11
readd path404 argument destructuring

#### 0.0.12
update dependencies

#### 0.0.13 - unreleased
...
