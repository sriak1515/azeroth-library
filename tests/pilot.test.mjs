import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile, mkdir, writeFile, mkdtemp, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { tmpdir } from 'node:os'
import { buildCatalog, isKnown, normalizeProgress, migratePreferences } from '../docs/.vitepress/theme/content-tools.mjs'
import { loadSourcePages } from '../scripts/content.mjs'
import { checkContent } from '../scripts/check-content.mjs'
import { createPage } from '../scripts/new-page.mjs'
import { createLibraryServer } from '../scripts/serve.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const actual = await loadSourcePages(resolve(root, 'docs'))
const catalog = buildCatalog(actual)
const ban = 'kal-02-banethil', shadow = 'kal-01-shadowglen'

test('real chapters and glossary use independent disclosure boundaries', () => {
  const chapter = catalog.pages.find(p => p.chapterId === ban)
  const at = progress => chapter.parts.filter(p => isKnown(p, progress, catalog.chapters)).map(p => p.text).join(' ')
  const initial = normalizeProgress({}, catalog.chapters)
  assert.doesNotMatch(at(initial), /Oben|charm|kill his body/i)
  const shadowOnly = { ...initial, [shadow]: 'diranias-request' }
  assert.doesNotMatch(at(shadowOnly), /Oben|charm|kill his body/i)
  assert.equal(isKnown(catalog.pages.find(p => p.title === 'Iverron'), shadowOnly, catalog.chapters), true)
  assert.equal(isKnown(catalog.pages.find(p => p.title === 'Oben Rageclaw'), shadowOnly, catalog.chapters), false)
  assert.match(at({ ...initial, [ban]: 'met-oben' }), /Oben Rageclaw/)
  assert.doesNotMatch(at({ ...initial, [ban]: 'met-oben' }), /kill his body/)
  assert.match(at({ ...initial, [ban]: 'charm-examined' }), /kill his body/)
  assert.doesNotMatch(at({ ...initial, [ban]: 'charm-examined' }), /His situation becomes clearer/)
})

test('legacy preferences migrate, stable milestone IDs survive insertion and invalid IDs fail closed', () => {
  const migrated = migratePreferences(null, { stage: 2, theme: 'stone', size: 24 }, catalog.chapters)
  assert.equal(migrated.progress[ban], 'charm-examined')
  assert.equal(migrated.progress[shadow], 'arrival')
  assert.equal(migrated.theme, 'stone'); assert.equal(migrated.size, 24)
  const changed = structuredClone(catalog.chapters)
  changed.find(c => c.chapterId === ban).milestones.splice(1, 0, { id: 'a-new-earlier-step', title: 'New step' })
  const saved = { progress: { [ban]: 'met-oben', [shadow]: 'diranias-request' }, size: 21 }
  const restored = migratePreferences(saved, null, changed)
  assert.equal(restored.progress[ban], 'met-oben')
  assert.equal(restored.progress[shadow], 'diranias-request')
  assert.equal(isKnown({ requires: { [ban]: 'charm-examined' } }, restored.progress, changed), false)
  assert.equal(normalizeProgress({ [ban]: 'deleted-or-corrupt' }, changed)[ban], 'barrow-entrance')
  assert.equal(isKnown({ requires: { [ban]: 'nonexistent' } }, restored.progress, changed), false)
})

test('author mistakes are rejected with useful errors', () => {
  const duplicate = structuredClone(actual)
  duplicate.find(p => p.frontmatter.chapterId === shadow).frontmatter.chapterId = ban
  assert.throws(() => buildCatalog(duplicate), /different chapterId/)
  const missing = structuredClone(actual)
  delete missing.find(p => p.frontmatter.chapterId === shadow).frontmatter.chapterId
  assert.throws(() => buildCatalog(missing), /unique chapterId/)
  const unknown = structuredClone(actual)
  unknown.find(p => p.frontmatter.entryTitle === 'Oben Rageclaw').frontmatter.requires[ban] = 'typo'
  assert.throws(() => buildCatalog(unknown), /unknown milestone/)
})

test('new-page workflow discovers chapters and glossary pages without template-code edits, and never overwrites files', async t => {
  const project = await mkdtemp(resolve(tmpdir(), 'azeroth-authoring-'))
  t.after(() => rm(project, { recursive: true, force: true }))
  await mkdir(resolve(project, 'docs/chronicle'), { recursive: true })
  for (const page of actual.filter(p => p.frontmatter.layout === 'lore')) {
    const file = page.frontmatter.chapterId === ban ? 'index.md' : 'chronicle/shadowglen.md'
    await writeFile(resolve(project, 'docs', file), page.src)
  }
  const file = await createPage({ project, type: 'chapter', title: 'A third chapter', slug: 'third-chapter' })
  const entry = await createPage({ project, type: 'glossary', title: 'A new name', slug: 'new-name' })
  const data = buildCatalog(await loadSourcePages(resolve(project, 'docs')))
  assert.equal(data.chapters.length, 3)
  assert.equal(data.chapters[2].title, 'A third chapter')
  assert.equal(data.chapters[2].order, 3)
  assert.equal(data.chapters[2].url, '/chronicle/third-chapter.html')
  assert.equal(data.chapters[2].milestones[0].id, 'start')
  assert.equal(data.pages.find(p => p.title === 'A new name').layout, 'glossary')
  const before = await readFile(file, 'utf8')
  await assert.rejects(createPage({ project, type: 'chapter', title: 'Different', slug: 'third-chapter' }), /already exists/)
  assert.equal(await readFile(file, 'utf8'), before)
  assert.ok(await readFile(entry, 'utf8'))
})

test('all authored pages, milestone references and Markdown links are valid', async () => {
  const data = await checkContent(root)
  assert.equal(data.chapters.length, 2)
  assert.deepEqual(data.chapters.map(p => p.chapterId), [shadow, ban])
})

test('prebuilt reading server serves both chapters, fonts, 404s and rejects traversal', async t => {
  const server = createLibraryServer(resolve(root, 'docs/.vitepress/dist'))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const base = 'http://127.0.0.1:' + server.address().port
  for (const path of ['/', '/chronicle/shadowglen.html', '/glossary/emerald-dream.html']) assert.equal((await fetch(base + path)).status, 200)
  const font = await fetch(base + '/fonts/reader.woff')
  assert.equal(font.status, 200); assert.equal(font.headers.get('content-type'), 'font/woff')
  assert.equal((await fetch(base + '/no-such-page.html')).status, 404)
  assert.equal((await fetch(base + '/%2e%2e%2f%2e%2e%2fpackage.json')).status, 403)
})
