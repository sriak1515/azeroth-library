import http from 'node:http'
import { createReadStream, existsSync } from 'node:fs'
import { stat } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { resolve, sep, extname } from 'node:path'
import { spawn } from 'node:child_process'

const project = fileURLToPath(new URL('../', import.meta.url))
const defaultRoot = resolve(project, 'docs/.vitepress/dist')
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.json':'application/json; charset=utf-8', '.woff':'font/woff', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.txt':'text/plain; charset=utf-8' }

export function createLibraryServer(root = defaultRoot) {
  return http.createServer(async (req, res) => {
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405); res.end(); return }
    let pathname
    try { pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname) } catch { res.writeHead(400); res.end('Invalid path'); return }
    if (pathname.includes('\0') || pathname.includes('\\')) { res.writeHead(400); res.end('Invalid path'); return }
    let filename = resolve(root, '.' + pathname)
    if (filename !== root && !filename.startsWith(root + sep)) { res.writeHead(403); res.end('Forbidden'); return }
    let status = 200
    try {
      let info = await stat(filename).catch(() => null)
      if (info?.isDirectory()) filename = resolve(filename, 'index.html')
      else if (!info && !extname(filename)) filename += '.html'
      info = await stat(filename).catch(() => null)
      if (!info?.isFile()) { filename = resolve(root, '404.html'); status = 404; info = await stat(filename).catch(() => null) }
      if (!info?.isFile()) { res.writeHead(404); res.end('Page not found'); return }
      res.writeHead(status, { 'Content-Type': mime[extname(filename)] || 'application/octet-stream', 'Content-Length': info.size, 'Cache-Control':'no-cache', 'X-Content-Type-Options':'nosniff' })
      if (req.method === 'HEAD') res.end()
      else createReadStream(filename).on('error', () => res.destroy()).pipe(res)
    } catch { if (!res.headersSent) res.writeHead(500); res.end('Could not read this page') }
  })
}

function openBrowser(url) {
  let child
  if (process.platform === 'win32') child = spawn('cmd.exe', ['/d', '/s', '/c', `start "" "${url}"`], { detached:true, stdio:'ignore', windowsHide:true })
  else child = spawn(process.platform === 'darwin' ? 'open' : 'xdg-open', [url], { detached:true, stdio:'ignore' })
  child.on('error', () => console.log('Open this address in your browser: ' + url))
  child.unref()
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (Number(process.versions.node.split('.')[0]) < 20) { console.error('Please install Node.js 20 or newer.'); process.exit(1) }
  if (!existsSync(resolve(defaultRoot, 'index.html'))) { console.error('The reading build is missing. Run Build-Reading-Version.cmd, or npm ci followed by npm run build.'); process.exit(1) }
  const port = 4174
  const url = `http://127.0.0.1:${port}/`
  const server = createLibraryServer()
  server.on('error', error => { console.error(error.code === 'EADDRINUSE' ? 'Port 4174 is already in use. If Azeroth Library is already open, use its existing window; otherwise close that server and try again.' : error.message); process.exitCode = 1 })
  server.listen(port, '127.0.0.1', () => { console.log(`Azeroth Library is ready at ${url}\nKeep this window open while reading. Press Ctrl+C to stop.`); if (process.argv.includes('--open')) openBrowser(url) })
}
