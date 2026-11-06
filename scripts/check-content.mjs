import { fileURLToPath } from 'node:url'
import { resolve, dirname } from 'node:path'
import { access } from 'node:fs/promises'
import { loadSourcePages } from './content.mjs'
import { buildCatalog } from '../docs/.vitepress/theme/content-tools.mjs'

export async function checkContent(project) {
  const docs = resolve(project, 'docs')
  const pages = await loadSourcePages(docs)
  const catalog = buildCatalog(pages)
  for (const page of pages) for (const [, raw] of page.src.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    if (/^(?:https?:|mailto:|#)/.test(raw)) continue
    const href = raw.split(/[?#]/)[0]
    if (!href) continue
    if (href.endsWith('.md')) {
      const target = href.startsWith('/') ? resolve(docs, '.' + href) : resolve(dirname(page.file), href)
      try { await access(target) } catch { throw new Error(`${page.url}: link does not exist: ${href}`) }
    } else if (href.startsWith('/') && (/\.html$/.test(href) || href.endsWith('/')) && !catalog.pages.some(p => p.url === href)) throw new Error(`${page.url}: page link does not exist: ${href}`)
  }
  return catalog
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try { const c = await checkContent(fileURLToPath(new URL('../', import.meta.url))); console.log(`Content checked: ${c.pages.length} Markdown pages, ${c.chapters.length} chapters. Navigation, milestone references and Markdown links are valid.`) }
  catch (error) { console.error('Content check failed: ' + error.message); process.exitCode = 1 }
}
