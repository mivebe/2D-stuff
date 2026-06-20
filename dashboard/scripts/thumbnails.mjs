// screenshots each built project into public/thumbnails/<id>.jpg for the cards.
// run after build:projects so public/projects/<id>/ exists. serves public/ over
// a tiny static server and drives a headless Chrome via puppeteer-core.
import { createServer } from 'node:http'
import { readFile, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { dirname, resolve, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import puppeteer from 'puppeteer-core'
import { projects } from '../src/projects.js'

const dashboardRoot = dirname(dirname(fileURLToPath(import.meta.url)))
const publicDir = resolve(dashboardRoot, 'public')
const thumbsDir = resolve(publicDir, 'thumbnails')

const MIME = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.mjs': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.mp3': 'audio/mpeg',
  '.wav': 'audio/wav',
  '.frag': 'text/plain',
  '.vert': 'text/plain',
  '.map': 'application/json',
}

// chrome path: CHROME_PATH env, else common macOS/linux locations
const chromePath =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find(
    (p) => existsSync(p),
  )

if (!chromePath) {
  console.error('No Chrome found. Set CHROME_PATH to a Chrome/Chromium executable.')
  process.exit(1)
}

const server = createServer(async (req, res) => {
  try {
    const urlPath = decodeURIComponent(req.url.split('?')[0])
    let filePath = join(publicDir, urlPath)
    if (urlPath.endsWith('/')) filePath = join(filePath, 'index.html')
    const body = await readFile(filePath)
    res.writeHead(200, { 'Content-Type': MIME[extname(filePath)] || 'application/octet-stream' })
    res.end(body)
  } catch {
    res.writeHead(404)
    res.end('not found')
  }
})

await new Promise((r) => server.listen(0, r))
const port = server.address().port

await mkdir(thumbsDir, { recursive: true })

const browser = await puppeteer.launch({
  executablePath: chromePath,
  headless: 'new',
  args: ['--no-sandbox', '--use-gl=swiftshader', '--enable-unsafe-swiftshader'],
})

const only = process.argv.slice(2)
const selected = only.length ? projects.filter((p) => only.includes(p.id)) : projects

for (const project of selected) {
  const dir = resolve(publicDir, 'projects', project.id)
  if (!existsSync(dir)) {
    console.error(`skip ${project.id}: not built`)
    continue
  }
  const page = await browser.newPage()
  await page.setViewport({ width: 800, height: 500 })
  try {
    await page.goto(`http://localhost:${port}/projects/${project.id}/index.html`, {
      waitUntil: 'load',
      timeout: 30000,
    })
    await new Promise((r) => setTimeout(r, project.thumbWait ?? 3800))
    await page.screenshot({ path: resolve(thumbsDir, `${project.id}.jpg`), quality: 80, type: 'jpeg' })
    console.log(`ok  ${project.id}`)
  } catch (err) {
    console.error(`fail ${project.id}: ${err.message}`)
  } finally {
    await page.close()
  }
}

await browser.close()
server.close()
console.log('done.')
