import test from 'node:test'
import assert from 'node:assert/strict'
import { cp, mkdir, mkdtemp, readFile, readdir, writeFile, rm } from 'node:fs/promises'
import { resolve } from 'node:path'
import { tmpdir } from 'node:os'
import { stageContent, projectRoot } from '../scripts/stage.mjs'
import { checkContent } from '../scripts/check-content.mjs'

test('external folder with spaces stays unchanged; no fixtures, stale pages or silent fallback', async t => {
  const temp = await mkdtemp(resolve(tmpdir(), 'azeroth external '))
  t.after(() => rm(temp, { recursive: true, force: true }))
  const project = resolve(temp, 'Viewer with spaces'), source = resolve(temp, 'My Campaign')
  await mkdir(project); await mkdir(resolve(source, 'chapters'), { recursive: true }); await mkdir(resolve(source, 'glossary'))
  await cp(resolve(projectRoot, 'docs'), resolve(project, 'docs'), { recursive: true })
  const chapter = '---\ntitle: External chapter\nlayout: lore\nchapterId: external-first\norder: 1\nmilestones:\n  - id: arrival\n    title: Arrived\n  - id: discovery\n    title: Found the token\n---\n\n## Arrival\n\nExternal prose.\n\n<StoryGate milestone="discovery">\n\n## A discovery\n\n[A token](../glossary/token.md)\n\n</StoryGate>\n'
  const entry = '---\ntitle: Something found\nentryTitle: Silver token\nlayout: glossary\nrequires:\n  external-first: discovery\n---\n\nAn external discovery.\n'
  await writeFile(resolve(source, 'chapters/first.md'), chapter)
  await writeFile(resolve(source, 'glossary/token.md'), entry)
  // Relative setting resolves from the viewer, not the current working directory.
  await writeFile(resolve(project, 'content-folder.txt'), '../My Campaign\r\n')
  const staged = await stageContent(project)
  assert.equal(staged.demo, false)
  let catalog = await checkContent(staged.docs)
  assert.deepEqual(catalog.chapters.map(c => c.chapterId), ['external-first'])
  assert.deepEqual(catalog.pages.filter(p => p.layout === 'glossary').map(p => p.title), ['Silver token'])
  assert.equal(await readFile(resolve(source, 'chapters/first.md'), 'utf8'), chapter)
  assert.equal(await readFile(resolve(source, 'glossary/token.md'), 'utf8'), entry)
  assert.deepEqual((await readdir(source)).sort(), ['chapters', 'glossary'])
  await rm(resolve(source, 'glossary/token.md'))
  await writeFile(resolve(source, 'chapters/first.md'), chapter.replace('[A token](../glossary/token.md)', 'A token'))
  catalog = await checkContent((await stageContent(project)).docs)
  assert.equal(catalog.pages.some(p => p.layout === 'glossary'), false)
  await writeFile(resolve(project, 'content-folder.txt'), resolve(temp, 'Missing Campaign'))
  await assert.rejects(stageContent(project), /Content folder is missing.*Missing Campaign.*no demo fallback/s)
  await writeFile(resolve(project, 'content-folder.txt'), '   ')
  await assert.rejects(stageContent(project), /one folder path/)
  await writeFile(resolve(project, 'content-folder.txt'), source)
  await writeFile(resolve(source, 'progress.md'), 'Reserved')
  await assert.rejects(stageContent(project), /supplied by the viewer/)
})
