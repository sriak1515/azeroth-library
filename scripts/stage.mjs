import { cp, mkdir, readdir, readFile, realpath, rm, stat, writeFile } from 'node:fs/promises'
import { resolve, relative, extname, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import { loadSourcePages } from './content.mjs'
import { buildCatalog } from '../docs/.vitepress/theme/content-tools.mjs'

export const projectRoot = fileURLToPath(new URL('../', import.meta.url))
const inside = (parent, child) => child === parent || child.startsWith(parent + sep)
const reserved = new Set(['preferences.md', 'progress.md', 'search.md', 'reference.md', 'glossary/index.md'])
const assets = new Set(['.md', '.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'])

export async function stageContent(project = projectRoot, { demo = false } = {}) {
  const root = await realpath(project)
  const output = resolve(root, '.library')
  // Never follow a replaced staging directory into somebody's source folder.
  try { if (await realpath(output) !== output) throw new Error('Remove the .library symlink before starting.') }
  catch (error) { if (error.code !== 'ENOENT') throw error }
  let setting
  if (!demo) {
    try { setting = (await readFile(resolve(root, 'content-folder.txt'), 'utf8')).replace(/^\uFEFF/, '').trim() }
    catch (error) { if (error.code !== 'ENOENT') throw error }
    if (setting !== undefined && (!setting || /[\r\n]/.test(setting))) throw new Error('content-folder.txt must contain one folder path on one line, without quotes. Remove the file to use the labelled demo.')
  }
  const isDemo = demo || setting === undefined
  const chosen = isDemo ? resolve(root, 'fixtures/demo') : resolve(root, setting)
  let source
  try { source = await realpath(chosen); if (!(await stat(source)).isDirectory()) throw new Error('not a directory') }
  catch { throw new Error(`Content folder is missing or is not a directory: ${chosen}. Fix content-folder.txt; no demo fallback was used.`) }
  if (inside(output, source) || inside(source, output) || inside(resolve(root, 'docs'), source)) throw new Error('Choose a separate content folder outside the viewer source and .library staging directory.')
  if (!isDemo && inside(root, source)) throw new Error('Keep the campaign collection outside the viewer folder so viewer updates cannot overwrite it.')
  const files = []
  async function scan(dir, prefix = '') {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      if (entry.name.startsWith('.')) continue
      const name = prefix + entry.name
      if (entry.isSymbolicLink()) throw new Error(`Content symlinks are unsupported: ${name}. Use regular files and folders.`)
      if (!prefix && ['public', 'node_modules'].includes(entry.name.toLowerCase())) throw new Error(`Reserved content folder: ${name}. Put local images in assets/ instead.`)
      if (entry.isDirectory()) await scan(resolve(dir, entry.name), name + '/')
      else if (assets.has(extname(name).toLowerCase())) {
        if (reserved.has(name.toLowerCase())) throw new Error(`${name} is supplied by the viewer. Rename that content page and update its links.`)
        files.push(name)
      }
    }
  }
  await scan(source)
  const pages = await loadSourcePages(source)
  if (!pages.length) throw new Error(`No Markdown pages found in content folder: ${chosen}`)
  buildCatalog(pages)
  // Only the fixed generated directory is replaced, after source validation.
  await rm(output, { recursive: true, force: true })
  const docs = resolve(output, 'docs')
  await mkdir(docs, { recursive: true })
  await cp(resolve(root, 'docs'), docs, { recursive: true })
  for (const name of files) {
    const target = resolve(docs, name)
    await mkdir(resolve(target, '..'), { recursive: true })
    await cp(resolve(source, name), target)
  }
  await writeFile(resolve(docs, '.vitepress/collection.json'), JSON.stringify({ demo: isDemo }))
  console.log(isDemo ? 'Using DEMO FIXTURES — not your campaign library.' : `Using external collection: ${source}`)
  return { docs, source, demo: isDemo }
}
