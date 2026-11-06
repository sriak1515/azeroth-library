import { cp, mkdir, realpath, rm } from 'node:fs/promises'
import { resolve, sep } from 'node:path'
import { spawnSync } from 'node:child_process'
import { stageContent, projectRoot } from './stage.mjs'
import { checkContent } from './check-content.mjs'

// An allowlist and a fresh demo build prevent packaging a local campaign,
// machine configuration, dependency tree, credentials or an earlier real build.
const target = resolve(projectRoot, '.snapshots/Azeroth-Library')
try {
  if (await realpath(resolve(projectRoot, '.snapshots')) !== resolve(projectRoot, '.snapshots')) throw new Error('Remove the .snapshots symlink before packaging.')
} catch (error) { if (error.code !== 'ENOENT') throw error }
await rm(resolve(projectRoot, '.snapshots'), { recursive: true, force: true })
await mkdir(target, { recursive: true })
const excluded = ['docs/.vitepress/cache', 'docs/.vitepress/dist'].map(name => resolve(projectRoot, name))
for (const name of ['package.json', 'package-lock.json', '.gitignore', '.gitattributes', 'docs', 'docs-dev', 'notes', 'tests', 'fixtures', 'scripts', 'LICENSES', 'README.md', 'START_HERE.md', 'content-folder.example.txt', 'Open-Azeroth-Library.cmd', 'Build-Reading-Version.cmd', 'Edit-Azeroth-Library.cmd']) {
  await cp(resolve(projectRoot, name), resolve(target, name), { recursive: true, filter: source => !excluded.some(path => source === path || source.startsWith(path + sep)) })
}
const staged = await stageContent(target, { demo: true })
await checkContent(staged.docs)
const result = spawnSync(process.execPath, [resolve(projectRoot, 'node_modules/vitepress/bin/vitepress.js'), 'build', staged.docs], { cwd: target, stdio: 'inherit' })
if (result.status !== 0) process.exit(result.status || 1)
// Vite may create an empty dependency/cache directory while resolving upward.
await rm(resolve(target, 'node_modules'), { recursive: true, force: true })
// Keep only the distributable built output inside staging.
for (const name of ['.vitepress/theme', '.vitepress/cache', '.vitepress/config.mjs', '.vitepress/collection.json']) await rm(resolve(staged.docs, name), { recursive: true, force: true })
console.log(`Windows snapshot prepared in ${target}\nZIP this Azeroth-Library folder, or download the manual GitHub Actions artifact.`)
