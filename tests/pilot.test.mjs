import test from 'node:test'
import assert from 'node:assert/strict'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { buildCatalog, isKnown, normalizeProgress, migratePreferences, nextMilestone } from '../docs/.vitepress/theme/content-tools.mjs'
import { loadSourcePages } from '../scripts/content.mjs'
import { checkContent } from '../scripts/check-content.mjs'
import { createLibraryServer } from '../scripts/serve.mjs'

const root = fileURLToPath(new URL('../', import.meta.url))
const actual = await loadSourcePages(resolve(root, 'fixtures/demo'))
const catalog = buildCatalog(actual)
const ban = 'kal-02-banethil', shadow = 'kal-01-shadowglen'

test('fixture chapters and glossary use independent disclosure boundaries', () => {
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
  const temporarilyAbsent = migratePreferences(saved, null, changed.filter(c => c.chapterId !== shadow))
  assert.equal(migratePreferences(temporarilyAbsent, null, changed).progress[shadow], 'diranias-request')
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

test('all authored pages, milestone references and Markdown links are valid', async () => {
  const data = await checkContent(resolve(root, '.library/docs'))
  assert.equal(data.chapters.length, 2)
  assert.deepEqual(data.chapters.map(p => p.chapterId), [shadow, ban])
})

test('prebuilt reading server serves both chapters, fonts, 404s and rejects traversal', async t => {
  const server = createLibraryServer(resolve(root, '.library/docs/.vitepress/dist'))
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => server.close(resolve)))
  const base = 'http://127.0.0.1:' + server.address().port
  for (const path of ['/', '/chronicle/shadowglen.html', '/glossary/emerald-dream.html']) assert.equal((await fetch(base + path)).status, 200)
  const font = await fetch(base + '/fonts/reader.woff')
  assert.equal(font.status, 200); assert.equal(font.headers.get('content-type'), 'font/woff')
  assert.equal((await fetch(base + '/no-such-page.html')).status, 404)
  assert.equal((await fetch(base + '/%2e%2e%2f%2e%2e%2fpackage.json')).status, 403)
})


test('in-page progress offers one stable next milestone, respects gates and stops at the end', () => {
  const chapter = catalog.chapters.find(c => c.chapterId === ban)
  const progress = { ...normalizeProgress({}, catalog.chapters), [shadow]: 'diranias-request' }
  const entry = catalog.pages.find(p => p.title === 'Oben Rageclaw')
  assert.equal(isKnown(entry, progress, catalog.chapters), false)
  assert.equal(nextMilestone(chapter, progress).id, 'met-oben')
  progress[ban] = nextMilestone(chapter, progress).id
  assert.equal(isKnown(entry, progress, catalog.chapters), true)
  assert.equal(isKnown({ requires: { [ban]: 'charm-examined' } }, progress, catalog.chapters), false)
  assert.equal(progress[shadow], 'diranias-request')
  assert.equal(nextMilestone(chapter, progress).id, 'charm-examined')
  progress[ban] = nextMilestone(chapter, progress).id
  assert.equal(nextMilestone(chapter, progress), null)
  assert.equal(nextMilestone({ chapterId: 'one-step', milestones: [{ id: 'start' }] }, {}), null)
  assert.equal(nextMilestone(chapter, { [ban]: 'invalid-saved-id' }).id, 'met-oben')
})
