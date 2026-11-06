import { mkdir, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { createInterface } from 'node:readline/promises'
import { stdin, stdout } from 'node:process'
import { loadSourcePages } from './content.mjs'

export function slugify(title) { return title.normalize('NFKD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[’']/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') }
export async function createPage({ project, type, title, slug = slugify(title) }) {
  if (!['chapter', 'glossary'].includes(type)) throw new Error('Choose chapter or glossary.')
  if (!title.trim() || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(slug)) throw new Error('Use a title and a filename containing letters, numbers and hyphens.')
  const pages = await loadSourcePages(resolve(project, 'docs'))
  const directory = resolve(project, 'docs', type === 'chapter' ? 'chronicle' : 'glossary')
  const file = resolve(directory, slug + '.md')
  const lines = ['---', 'title: ' + JSON.stringify(title.trim()), 'layout: ' + (type === 'chapter' ? 'lore' : 'glossary')]
  if (type === 'chapter') {
    const id = 'chapter-' + slug
    if (pages.some(p => p.frontmatter.chapterId === id)) throw new Error('That chapter ID already exists. Choose a different filename.')
    const order = Math.max(0, ...pages.filter(p => p.frontmatter.layout === 'lore').map(p => Number(p.frontmatter.order) || 0)) + 1
    lines.push('chapterId: ' + id, 'order: ' + order, 'region: Kalimdor', 'zone: Teldrassil', 'description: A new chapter in your journey.', 'collection: The Kalimdor Chronicle', 'volume: Roots & awakenings', 'volumeNumber: I')
  } else lines.push('group: glossary', 'kind: Idea · Teldrassil', 'description: One sentence explaining this entry.')
  lines.push('---', '', type === 'chapter' ? '## Where we begin' : '## Why it matters here', '', 'Write your text here.', '')
  await mkdir(directory, { recursive: true })
  try { await writeFile(file, lines.join('\n'), { flag: 'wx' }) } catch (error) { if (error.code === 'EEXIST') throw new Error('That file already exists. Nothing was overwritten.'); throw error }
  return file
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const args = process.argv.slice(2)
  const arg = flag => { const index = args.indexOf(flag); return index < 0 ? '' : args[index + 1] || '' }
  const rl = createInterface({ input: stdin, output: stdout })
  try {
    let type = arg('--type')
    if (!type) { const choice = await rl.question('New page: 1 = chapter, 2 = glossary entry [1]: '); type = choice.trim() === '2' ? 'glossary' : 'chapter' }
    const title = arg('--title') || await rl.question('Page title: ')
    if (!title.trim()) throw new Error('Cancelled: no title entered.')
    const suggested = slugify(title)
    const slug = arg('--slug') || (args.length ? suggested : (await rl.question(`Filename without .md [${suggested}]: `)).trim() || suggested)
    const file = await createPage({ project: fileURLToPath(new URL('../', import.meta.url)), type, title, slug })
    console.log(`\nCreated ${file}\nOpen this Markdown file to write your text. It will appear automatically in editing mode.\nFor the reading launcher, run Build-Reading-Version.cmd afterwards.`)
  } catch (error) { console.error(error.message); process.exitCode = 1 } finally { rl.close() }
}
