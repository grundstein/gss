## @grundstein/gss

### WIP. NOT IN PRODUCTION, TESTED AND/OR BENCHMARKED YET!

## gss: grundstein static (file) server

### features:

#### static file serving

serves a local directory (process.cwd() + 'public' is the default)

#### small files get served from memory

caches small files in memory

#### big files get sent as streams

never caches big files, instead sends them directly from disk, as streams.

#### installation
```bash
npm i @grundstein/gss
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
